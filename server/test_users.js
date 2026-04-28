require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");
const Student = require("./models/Student");
const Driver = require("./models/Driver");

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const s = await Student.find({}, 'universityId name');
    const d = await Driver.find({}, 'universityId name');
    const a = await Admin.find({}, 'universityId name');
    console.log("Students:", s);
    console.log("Drivers:", d);
    console.log("Admins:", a);
    process.exit(0);
  });
