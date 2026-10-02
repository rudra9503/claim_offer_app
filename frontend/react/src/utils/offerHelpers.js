export function getDiscountPercent(original, offer) {
  return Math.round(((original - offer) / original) * 100);
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function isExpired(expiryDate) {
  return new Date(expiryDate) < new Date();
}