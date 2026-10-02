const express = require('express');
const { getMyClaims, getClaimByCode, redeemClaim } = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my-claims', protect, getMyClaims);
router.get('/claims/:claimCode', getClaimByCode);
router.post('/claims/:claimCode/redeem', redeemClaim);

module.exports = router;