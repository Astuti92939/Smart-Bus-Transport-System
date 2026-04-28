require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'smart-bus-secret-key-2025';

// Middleware
app.use(cors());
app.use(express.json());

// Auth Middleware
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { 
    serverSelectionTimeoutMS: 30000 
})
  .then(() => {
      console.log('MongoDB connected');
      seedDB();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const Bus = require('./models/Bus');
const Student = require('./models/Student');
const Transaction = require('./models/Transaction');
const Admin = require('./models/Admin');
const Driver = require('./models/Driver');

// Seed initial data if DB is empty
const seedDB = async () => {
    try {
        const busCount = await Bus.countDocuments();
        if (busCount === 0) {
            await Bus.insertMany([
                { id: 1, route: "Route 101", occupancy: 24, speed: 45, status: "Normal", coordinates: { lat: 12.9716, lng: 77.5946 } },
                { id: 2, route: "Route 202", occupancy: 32, speed: 38, status: "Congested", coordinates: { lat: 12.9720, lng: 77.5950 } },
                { id: 3, route: "Route 303", occupancy: 18, speed: 52, status: "Normal", coordinates: { lat: 12.9710, lng: 77.5930 } }
            ]);
            console.log('Buses seeded');
        }

        const hashedPassword = await bcrypt.hash('password123', 10);

        // Ensure demo bus exists
        let demoBus = await Bus.findOne({ id: 1 });
        if (!demoBus) {
            demoBus = await Bus.create({
                id: 1,
                route: 'Route 101 - Campus North',
                occupancy: 24,
                speed: 45,
                status: 'Normal',
                coordinates: { lat: 12.9716, lng: 77.5946 }
            });
            console.log('Demo Bus seeded (Route 101)');
        }

        // Always sync demo Admin (force-update password so it always works)
        await Admin.findOneAndUpdate(
            { universityId: 'ADM-01' },
            { $set: {
                name: 'System Admin',
                universityId: 'ADM-01',
                password: hashedPassword,
                email: 'admin@campustransit.edu'
            }},
            { upsert: true, new: true }
        );
        console.log('Demo Admin (ADM-01) synchronized.');

        // Always sync demo Driver with bus assignment (force-update so assignedBus is never null)
        await Driver.findOneAndUpdate(
            { universityId: 'DRV-01' },
            { $set: {
                name: 'Robert Miller',
                universityId: 'DRV-01',
                password: hashedPassword,
                assignedBus: demoBus._id,
                phone: '+91 91234 56789'
            }},
            { upsert: true, new: true }
        );
        console.log('Demo Driver (DRV-01) synchronized with bus:', demoBus._id);

        // Seed demo student if none exist
        const studentCount = await Student.countDocuments();
        if (studentCount === 0) {
            await Student.create({
                name: 'Alex Johnson',
                universityId: 'STU-2020-X',
                password: hashedPassword,
                assignedRoute: 'Route 101',
                status: 'Active',
                feesPaid: 1500,
                dues: 0,
                walletBalance: 5000
            });
            console.log('Demo student seeded (STU-2020-X)');
        }
    } catch (err) {
        console.error('Seeding error:', err);
    }
};

// ----------------- AUTH ROUTES -----------------
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, universityId, password, role, ...otherData } = req.body;
        
        if (!name || !universityId || !password || !role) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        let Model;
        if (role === 'admin') Model = Admin;
        else if (role === 'student') Model = Student;
        else if (role === 'driver') Model = Driver;
        else return res.status(400).json({ message: 'Invalid role' });

        const existingAdmin = await Admin.findOne({ universityId });
        const existingStudent = await Student.findOne({ universityId });
        const existingDriver = await Driver.findOne({ universityId });
        if (existingAdmin || existingStudent || existingDriver) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Model({
            name,
            universityId,
            password: hashedPassword,
            ...otherData
        });

        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser.universityId, role }, JWT_SECRET, { expiresIn: '24h' });
        
        const userObj = savedUser.toObject();
        delete userObj.password;
        
        res.status(201).json({ token, user: userObj, role });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { universityId, password, role } = req.body;
        let user;
        
        if (role === 'admin') user = await Admin.findOne({ universityId });
        else if (role === 'student') user = await Student.findOne({ universityId }).populate('assignedBus');
        else if (role === 'driver') user = await Driver.findOne({ universityId }).populate('assignedBus');
        else return res.status(400).json({ message: 'Invalid role' });
        
        if (!user) return res.status(404).json({ message: `User not found. Ensure you are registered as a ${role}.` });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.universityId, role }, JWT_SECRET, { expiresIn: '24h' });
        
        // Don't send password back
        const userObj = user.toObject();
        delete userObj.password;
        
        res.json({ token, user: userObj, role });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Current Profile
app.get('/api/auth/me', verifyToken, async (req, res) => {
    try {
        let user;
        if (req.userRole === 'admin') user = await Admin.findOne({ universityId: req.userId });
        else if (req.userRole === 'student') user = await Student.findOne({ universityId: req.userId }).populate('assignedBus');
        else if (req.userRole === 'driver') user = await Driver.findOne({ universityId: req.userId }).populate('assignedBus');
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const userObj = user.toObject();
        delete userObj.password;
        res.json(userObj);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ----------------- BUS ROUTES -----------------
app.get('/api/buses', async (req, res) => {
    try {
        const buses = await Bus.find();
        res.json(buses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/buses', verifyToken, async (req, res) => {
    const bus = new Bus(req.body);
    try {
        const newBus = await bus.save();
        res.status(201).json(newBus);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/buses/:id', verifyToken, async (req, res) => {
    try {
        const updatedBus = await Bus.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.json(updatedBus);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/buses/:id', verifyToken, async (req, res) => {
    try {
        await Bus.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'Bus deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ----------------- STUDENT ROUTES -----------------
app.get('/api/students', verifyToken, async (req, res) => {
    try {
        const students = await Student.find().populate('assignedBus');
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/students', verifyToken, async (req, res) => {
    const { password, ...rest } = req.body;
    const hashedPassword = await bcrypt.hash(password || 'password123', 10);
    const student = new Student({ ...rest, password: hashedPassword });
    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/students/:id', verifyToken, async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const updatedStudent = await Student.findOneAndUpdate(
            { universityId: req.params.id }, req.body, { new: true }
        ).populate('assignedBus');
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Assign bus to student
app.put('/api/students/:id/assign-bus', verifyToken, async (req, res) => {
    try {
        const { busObjectId } = req.body;
        const bus = await Bus.findById(busObjectId);
        if (!bus) return res.status(404).json({ message: 'Bus not found' });
        const updatedStudent = await Student.findOneAndUpdate(
            { universityId: req.params.id },
            { assignedBus: busObjectId, assignedRoute: bus.route },
            { new: true }
        ).populate('assignedBus');
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/students/:id', verifyToken, async (req, res) => {
    try {
        await Student.findOneAndDelete({ universityId: req.params.id });
        res.json({ message: 'Student deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ----------------- DRIVER ROUTES -----------------
app.get('/api/drivers', verifyToken, async (req, res) => {
    try {
        const drivers = await Driver.find().populate('assignedBus');
        res.json(drivers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/drivers', verifyToken, async (req, res) => {
    try {
        if (req.userRole !== 'admin') return res.status(403).json({ message: 'Forbidden' });
        const { password, ...rest } = req.body;
        const hashedPassword = await bcrypt.hash(password || 'password123', 10);
        const driver = new Driver({ ...rest, password: hashedPassword });
        await driver.save();
        res.status(201).json(driver);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/drivers/:id/assign-bus', verifyToken, async (req, res) => {
    try {
        if (req.userRole !== 'admin') return res.status(403).json({ message: 'Forbidden' });
        const { busId } = req.body;
        const updatedDriver = await Driver.findOneAndUpdate(
            { universityId: req.params.id },
            { assignedBus: busId || null },
            { new: true }
        ).populate('assignedBus');
        res.json(updatedDriver);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/drivers/:id', verifyToken, async (req, res) => {
    try {
        await Driver.findOneAndDelete({ universityId: req.params.id });
        res.json({ message: 'Driver removed from system' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ----------------- TRANSACTION ROUTES -----------------
app.get('/api/transactions', verifyToken, async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/transactions', verifyToken, async (req, res) => {
    const txn = new Transaction(req.body);
    try {
        const newTxn = await txn.save();
        res.status(201).json(newTxn);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

