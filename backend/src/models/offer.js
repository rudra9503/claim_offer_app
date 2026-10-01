 const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
  title: { type: String, required: [true, 'Title is required'], trim: true },
  description: { type: String, trim: true },
  productName: { type: String, required: [true, 'Product name is required'], trim: true },
  image: { type: String }, // image URL
  originalPrice: {
    type: Number,
    required: [true, 'Original price is required'],
    min: [0, 'Original price cannot be negative'],
  },
  offerPrice: {
    type: Number,
    required: [true, 'Offer price is required'],
    min: [0, 'Offer price cannot be negative'],
    validate: {
      validator: function (value) {
        return value <= this.originalPrice;
      },
      message: 'Offer price cannot be greater than original price',
    },
  },
  startDate: { type: Date, required: [true, 'Start date is required'] },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required'],
    validate: {
      validator: function (value) {
        return value > this.startDate;
      },
      message: 'Expiry date must be after start date',
    },
  },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  quantity: { type: Number, min: [0, 'Quantity cannot be negative'] }, // available quantity
  terms: { type: String, trim: true },
});

module.exports = mongoose.model('Offer', offerSchema);