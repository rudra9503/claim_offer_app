const mongoose = require('mongoose');
const Offer = require('../models/offer');
const Claim = require('../models/claim');
const getOfferState = require('../utils/offerState');
const generateClaimCode = require('../utils/generateClaimCode');
const AppError = require('../utils/AppError');

// Why a claim is not allowed, for each offer state
const notClaimableMessages = {
  Inactive: 'This offer is not active',
  Expired: 'This offer has expired',
  Upcoming: 'This offer has not started yet',
  SoldOut: 'This offer is sold out',
};

// Keeps generating until the code is not already in use
const generateUniqueClaimCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = generateClaimCode();
    exists = await Claim.exists({ claimCode: code });
  }
  return code;
};

// POST /api/offers/:id/claim  (protected)
const claimOffer = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 2. Offer exists
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError('Offer not found', 404);
    }
    const offer = await Offer.findById(id);
    if (!offer) {
      throw new AppError('Offer not found', 404);
    }

    // 3. Offer is currently active and not expired
    const state = getOfferState(offer);
    if (state !== 'Active') {
      throw new AppError(notClaimableMessages[state], 400);
    }

    // 4. Customer has not already claimed it
    const alreadyClaimed = await Claim.exists({
      customer: req.customer._id,
      offer: offer._id,
    });
    if (alreadyClaimed) {
      throw new AppError('You have already claimed this offer', 409);
    }

    // Reserve one unit (only if this offer tracks quantity)
    const tracksQuantity = typeof offer.quantity === 'number';
    if (tracksQuantity) {
      const reserved = await Offer.findOneAndUpdate(
        { _id: offer._id, quantity: { $gt: 0 } },
        { $inc: { quantity: -1 } }
      );
      if (!reserved) {
        throw new AppError('This offer is sold out', 400);
      }
    }

    // 5 + 6. Create the claim with a unique code
    let claim;
    try {
      claim = await Claim.create({
        customer: req.customer._id,
        offer: offer._id,
        claimCode: await generateUniqueClaimCode(),
      });
    } catch (error) {
      // Creation failed, so give the reserved unit back
      if (tracksQuantity) {
        await Offer.updateOne({ _id: offer._id }, { $inc: { quantity: 1 } });
      }
      // Two identical requests at the same moment: the unique index stops the second
      if (error.code === 11000) {
        throw new AppError('You have already claimed this offer', 409);
      }
      throw error;
    }

    res.status(201).json({
      message: 'Offer claimed successfully',
      claim: {
        id: claim._id,
        claimCode: claim.claimCode,
        status: claim.status,
        claimDate: claim.claimDate,
        offer: { id: offer._id, title: offer.title },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { claimOffer };