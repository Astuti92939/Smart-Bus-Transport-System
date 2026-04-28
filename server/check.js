require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const d = await require("./models/Driver").find({});
    const s = await require("./models/Student").find({});
    console.log("Drivers:", JSON.stringify(d, null, 2));
    console.log("Students:", JSON.stringify(s, null, 2));
    process.exit(0);
  });
