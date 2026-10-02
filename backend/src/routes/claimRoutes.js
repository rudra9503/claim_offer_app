const express = require('express');
const { getMyClaims, getClaimByCode } = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my-claims', protect, getMyClaims);
router.get('/claims/:claimCode', getClaimByCode);

module.exports = router;