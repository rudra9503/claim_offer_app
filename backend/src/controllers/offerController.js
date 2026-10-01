const mongoose = require('mongoose');
const Offer = require('../models/offer');
require('../models/merchant'); // registers the Merchant model so populate('merchant') works
const getOfferState = require('../utils/offerState');
const AppError = require('../utils/AppError');

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
const getOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find()
      .populate('merchant', 'storeName location')
      .lean();

    res.json(offers.map(addComputedFields));
  } catch (error) {
    next(error);
  }
};

// GET /api/offers/:id
const getOfferById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // A malformed id would crash findById, so treat it as "not found"
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError('Offer not found', 404);
    }

    const offer = await Offer.findById(id)
      .populate('merchant', 'storeName location contact')
      .lean();

    if (!offer) {
      throw new AppError('Offer not found', 404);
    }

    res.json(addComputedFields(offer));
  } catch (error) {
    next(error);
  }
};

module.exports = { getOffers, getOfferById };