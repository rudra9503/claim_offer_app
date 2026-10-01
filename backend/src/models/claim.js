const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  offer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true },
  claimCode: { type: String, required: true, unique: true },
  claimDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Claimed', 'Redeemed'], default: 'Claimed' },
  redeemedDate: { type: Date },
});

// A customer can claim a given offer only once
claimSchema.index({ customer: 1, offer: 1 }, { unique: true });

module.exports = mongoose.model('Claim', claimSchema);