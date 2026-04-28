const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  route: { type: String, required: true },
  occupancy: { type: Number, default: 0 },
  speed: { type: Number, default: 0 },
  status: { type: String, default: "Active" },
  coordinates: {
    lat: { type: Number, default: 12.9716 },
    lng: { type: Number, default: 77.5946 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);
