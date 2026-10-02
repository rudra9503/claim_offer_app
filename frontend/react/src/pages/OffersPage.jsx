import OfferCard from '../components/OfferCard';

function OffersPage({ offers }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-6">
        Offers
      </h1>

      <div className="flex flex-wrap justify-center">
        {offers.map((offer) => (
          <OfferCard key={offer._id} offer={offer} />
        ))}
      </div>
    </div>
  );
}

export default OffersPage;