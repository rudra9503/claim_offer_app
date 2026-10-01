const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  storeName: { type: String, required: [true, 'Store name is required'], trim: true },
  location: { type: String, required: [true, 'Location is required'], trim: true },
  contact: { type: String, required: [true, 'Contact information is required'], trim: true },
});

module.exports = mongoose.model('Merchant', merchantSchema);