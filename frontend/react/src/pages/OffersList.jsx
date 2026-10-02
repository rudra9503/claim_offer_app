import { useState, useEffect } from "react";
import { apiRequest } from "../api";
import OfferCard from "../components/OfferCard";

function OfferList() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOffers() {
      try {
        const data = await apiRequest("/offers");
        setOffers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h2 className="mb-4 text-2xl font-bold">Nearby Offers</h2>

      {loading && <p>Loading offers...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && offers.length === 0 && <p>No offers available.</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <OfferCard key={offer._id} offer={offer} />
        ))}
      </div>
    </div>
  );
}

export default OfferList;