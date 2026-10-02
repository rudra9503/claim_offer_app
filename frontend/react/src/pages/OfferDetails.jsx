import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiRequest } from "../api";
import { getDiscountPercent, formatDate, isExpired } from "../utils/offerHelpers";

function OfferDetails() {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOffer() {
      try {
        const data = await apiRequest(`/offers/${id}`);
        setOffer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadOffer();
  }, [id]);

  if (loading) return <p className="p-4">Loading offer...</p>;
  if (error) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <p className="text-red-600">{error}</p>
        <Link to="/offers" className="text-blue-600 hover:underline">
          ← Back to offers
        </Link>
      </div>
    );
  }

  const expired = isExpired(offer.expiryDate);
  const soldOut = offer.availableQuantity !== undefined && offer.availableQuantity <= 0;
  const canClaim = !expired && !soldOut;

  return (
    <div className="mx-auto max-w-3xl p-4">
      <Link to="/offers" className="text-blue-600 hover:underline">
        ← Back to offers
      </Link>

      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <img
          src={offer.image}
          alt={offer.title}
          className={`h-56 w-full object-cover sm:h-72 ${expired ? "grayscale" : ""}`}
        />

        <div className="space-y-4 p-4 sm:p-6">
          <div>
            <h2 className="text-2xl font-bold">{offer.title}</h2>
            <p className="text-gray-500">
              {offer.merchant.storeName} · {offer.merchant.location}
            </p>
          </div>

          <div>
            <h3 className="font-semibold">{offer.productName}</h3>
            <p className="text-gray-700">{offer.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-400 line-through">₹{offer.originalPrice}</span>
            <span className="text-2xl font-bold">₹{offer.offerPrice}</span>
            <span className="rounded bg-green-100 px-2 py-0.5 text-sm font-medium text-green-700">
              {getDiscountPercent(offer.originalPrice, offer.offerPrice)}% OFF
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <p>
              <span className="text-gray-500">Starts:</span> {formatDate(offer.startDate)}
            </p>
            <p>
              <span className="text-gray-500">Expires:</span> {formatDate(offer.expiryDate)}
            </p>
            {offer.availableQuantity !== undefined && (
              <p>
                <span className="text-gray-500">Available:</span> {offer.availableQuantity}
              </p>
            )}
          </div>

          {expired && (
            <p className="rounded bg-red-50 p-3 font-medium text-red-700">
              This offer has expired and can no longer be claimed.
            </p>
          )}
          {!expired && soldOut && (
            <p className="rounded bg-yellow-50 p-3 font-medium text-yellow-800">
              This offer is sold out.
            </p>
          )}

          {offer.terms && (
            <div>
              <h3 className="font-semibold">Terms &amp; Conditions</h3>
              <p className="text-sm text-gray-600">{offer.terms}</p>
            </div>
          )}

          <button
            disabled={!canClaim}
            className="w-full rounded bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300"
          >
            {expired ? "Offer Expired" : soldOut ? "Sold Out" : "Claim Offer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OfferDetails;