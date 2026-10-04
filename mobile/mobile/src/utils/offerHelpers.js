export function getDiscountPercent(original, offer) {
  return Math.round(((original - offer) / original) * 100);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(dateString) {
  const d = new Date(dateString);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function isExpired(expiryDate) {
  return new Date(expiryDate) < new Date();
}