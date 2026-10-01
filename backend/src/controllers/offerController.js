const mongoose = require('mongoose');
const Offer = require('../models/offer');
require('../models/merchant'); 
const getOfferState = require('../utils/offerState');

// Adds fields that are calculated on the fly (not stored in the database)
const addComputedFields = (offer) => {
  const discountPercentage =
    offer.originalPrice > 0
      ? Math.round(((offer.originalPrice - offer.offerPrice) / offer.originalPrice) * 100)
      : 0;

  return {
    ...offer,
    discountPercentage,
    offerState: getOfferState(offer),
  };
};

// GET /api/offers
const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find()
      .populate('merchant', 'storeName location')
      .lean();

    res.json(offers.map(addComputedFields));
  } catch (error) {
   
    res.status(500).json({ message: 'Failed to fetch offers' });
   
  }
};

// GET /api/offers/:id
const getOfferById = async (req, res) => {
  try {
    const { id } = req.params;

    // A malformed id would crash findById, so treat it as "not found"
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    const offer = await Offer.findById(id)
      .populate('merchant', 'storeName location contact')
      .lean();

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.json(addComputedFields(offer));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch offer' });
  }
};

module.exports = { getOffers, getOfferById };