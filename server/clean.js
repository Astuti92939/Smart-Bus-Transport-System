require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await require("./models/Driver").deleteMany({universityId: /241FA047/i});
    await require("./models/Student").deleteMany({universityId: /241FA047/i});
    console.log("Deleted old test users");
    process.exit(0);
  });
