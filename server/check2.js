require("dotenv").config();
const fs = require("fs");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const d = await require("./models/Driver").find({});
    const s = await require("./models/Student").find({});
    fs.writeFileSync("output.json", JSON.stringify({Drivers: d, Students: s}, null, 2), "utf8");
    process.exit(0);
  });
