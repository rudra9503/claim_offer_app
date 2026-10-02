const express = require('express');
const { getOffers, getOfferById } = require('../controllers/offerController');
const { claimOffer } = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getOffers);
router.get('/:id', getOfferById);
router.post('/:id/claim', protect, claimOffer);

module.exports = router;