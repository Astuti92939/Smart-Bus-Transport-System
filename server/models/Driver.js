const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  universityId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  assignedBus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', default: null },
  status: { type: String, default: 'On Duty' },
  licenseNumber: { type: String },
  phone: { type: String },
  region: { type: String, default: 'Main Campus' }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
