const express = require('express');
const { getOffers, getOfferById } = require('../controllers/offerController');

const router = express.Router();

router.get('/', getOffers);
router.get('/:id', getOfferById);

module.exports = router;