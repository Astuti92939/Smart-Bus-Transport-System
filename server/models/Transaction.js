const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  txnId: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  universityId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'Success' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
