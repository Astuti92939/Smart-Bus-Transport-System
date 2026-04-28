const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  universityId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  assignedRoute: { type: String, required: true },
  assignedBus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', default: null },
  status: { type: String, default: 'Active' },
  feesPaid: { type: Number, default: 0 },
  dues: { type: Number, default: 0 },
  walletBalance: { type: Number, default: 5000 }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
