// Returns one of: Inactive, Expired, Upcoming, SoldOut, Active
const getOfferState = (offer) => {
  const now = new Date();

  if (offer.status !== 'Active') return 'Inactive';
  if (offer.expiryDate < now) return 'Expired';
  if (offer.startDate > now) return 'Upcoming';
  if (typeof offer.quantity === 'number' && offer.quantity <= 0) return 'SoldOut';

  return 'Active';
};

module.exports = getOfferState;