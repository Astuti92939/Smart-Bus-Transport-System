const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing connection to:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('CONNECTED SUCCESSFULLY TO MONGODB');
    process.exit(0);
  })
  .catch(err => {
    console.error('FAILED TO CONNECT TO MONGODB:', err.message);
    process.exit(1);
  });

setTimeout(() => {
  console.error('CONNECTION TIMED OUT AFTER 5 SECONDS');
  process.exit(1);
}, 5000);
