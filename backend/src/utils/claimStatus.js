// Status shown to the client: Claimed, Redeemed or Expired
const getClaimStatus = (claim, offer) => {
  if (claim.status === 'Redeemed') return 'Redeemed';
  if (offer.expiryDate < new Date()) return 'Expired';
  return 'Claimed';
};

module.exports = getClaimStatus;