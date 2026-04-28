const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('./models/Student');
const Admin = require('./models/Admin');
const Driver = require('./models/Driver');
const Bus = require('./models/Bus');
require('dotenv').config();

async function fixPasswords() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Update Admins
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        name: 'System Administrator',
        universityId: 'ADM-01',
        password: hashedPassword,
        email: 'admin@campustransit.edu'
      });
      console.log('Admin ADM-01 created.');
    } else {
      await Admin.updateMany({}, { password: hashedPassword });
      console.log('All Admin passwords updated to "password123".');
    }

    // Update Students
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
       await Student.insertMany([
          { name: 'Alex Johnson', universityId: 'STU-2020-X', password: hashedPassword, assignedRoute: 'R-101', status: 'Active', feesPaid: 1500, dues: 0, walletBalance: 5000 },
          { name: 'Sarah Connor', universityId: 'STU-2021-X', password: hashedPassword, assignedRoute: 'R-202', status: 'Active', feesPaid: 1500, dues: 200, walletBalance: 3200 }
       ]);
       console.log('Demo students created.');
    } else {
       await Student.updateMany({}, { password: hashedPassword });
       console.log('All Student passwords updated to "password123".');
    }

    // Ensure a Driver exists
    const driver = await Driver.findOne({ universityId: 'DRV-01' });
    if (!driver) {
       const bus = await Bus.findOne();
       await Driver.create({
          name: 'Robert Miller',
          universityId: 'DRV-01',
          password: hashedPassword,
          assignedBus: bus ? bus._id : null,
          phone: '+91 91234 56789'
       });
       console.log('Driver DRV-01 created.');
    } else {
       await Driver.updateMany({}, { password: hashedPassword });
       console.log('All Driver passwords updated to "password123".');
    }

    console.log('Database migration complete. Start the server with npm run dev.');
    process.exit(0);
  } catch (err) {
    console.error('Fix error:', err);
    process.exit(1);
  }
}

fixPasswords();
