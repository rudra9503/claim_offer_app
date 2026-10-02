import { Link } from "react-router-dom";
import { getDiscountPercent, formatDate, isExpired } from "../utils/offerHelpers";

function OfferCard({ offer }) {
  const expired = isExpired(offer.expiryDate);

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <img
        src={offer.image}
        alt={offer.title}
        className={`h-40 w-full object-cover ${expired ? "grayscale" : ""}`}
      />

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-lg font-semibold">{offer.title}</h3>
        <p className="text-sm text-gray-500">
          {offer.merchant.storeName} · {offer.merchant.location}
        </p>
        <p className="text-sm">{offer.productName}</p>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-gray-400 line-through">₹{offer.originalPrice}</span>
          <span className="text-lg font-bold">₹{offer.offerPrice}</span>
          <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            {getDiscountPercent(offer.originalPrice, offer.offerPrice)}% OFF
          </span>
        </div>

        <p className={`text-sm ${expired ? "font-medium text-red-600" : "text-gray-500"}`}>
          {expired ? "Expired" : `Valid till ${formatDate(offer.expiryDate)}`}
        </p>

        <Link
          to={`/offers/${offer._id}`}
          className="mt-auto block rounded bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
        >
          View Offer
        </Link>
      </div>
    </div>
  );
}

export default OfferCard;