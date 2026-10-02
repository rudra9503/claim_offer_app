function OfferCard({ offer }) {
  return (
    <div className="w-75 border border-gray-200 rounded-lg p-4 m-4 shadow-sm">

      <img
        src={offer.image}
        alt={offer.title}
        className="w-full h-45 object-cover rounded-md"
      />

      <h2 className="text-xl font-semibold mt-3">
        {offer.title}
      </h2>

      <p className="text-gray-600 mt-2">
        {offer.description}
      </p>

      <p className="mt-2">
        <span className="font-semibold">Merchant:</span>{' '}
        {offer.merchant.storeName}
      </p>

      <p className="mt-2">
        <span className="font-semibold">Original Price:</span>{' '}
        ₹{offer.originalPrice}
      </p>

      <p className="mt-1">
        <span className="font-semibold">Offer Price:</span>{' '}
        ₹{offer.offerPrice}
      </p>

      <p className="mt-1 text-green-600 font-semibold">
        Discount: {offer.discountPercentage}%
      </p>

      <p className="mt-1">
        Quantity Left: {offer.quantity}
      </p>

      <p className="mt-1">
        Status: {offer.offerState}
      </p>

      <button className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        View Details
      </button>

    </div>
  );
}

export default OfferCard;