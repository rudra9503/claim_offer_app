import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";
import { formatDate, isExpired } from "../utils/offerHelpers";

const STATUS_STYLES = {
  Claimed: "bg-blue-100 text-blue-700",
  Redeemed: "bg-green-100 text-green-700",
  Expired: "bg-red-100 text-red-700",
};

function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClaims() {
      try {
        const data = await apiRequest("/my-claims");
        setClaims(data); // ASSUMPTION: response is a plain array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadClaims();
  }, []);

  // A claim that is still "Claimed" but whose offer has expired shows as Expired
  function getStatus(claim) {
    if (claim.status === "Claimed" && claim.offer && isExpired(claim.offer.expiryDate)) {
      return "Expired";
    }
    return claim.status;
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h2 className="mb-4 text-2xl font-bold">My Claims</h2>

      {loading && <p>Loading your claims...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && claims.length === 0 && (
        <p className="text-gray-600">
          You haven't claimed any offers yet.{" "}
          <Link to="/offers" className="text-blue-600 hover:underline">
            Browse offers
          </Link>
        </p>
      )}

      <div className="space-y-3">
        {claims.map((claim) => {
          const status = getStatus(claim);
          return (
            <div
              key={claim._id}
              className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-semibold">{claim.offer?.title}</h3>
                <p className="text-sm text-gray-500">
                  {claim.offer?.merchant?.storeName}
                </p>
                <p className="text-sm text-gray-500">
                  Claimed on {formatDate(claim.claimDate || claim.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded bg-gray-100 px-3 py-1 font-mono text-sm font-bold tracking-wider">
                  {claim.claimCode}
                </span>
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${STATUS_STYLES[status] || "bg-gray-100 text-gray-700"}`}
                >
                  {status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyClaims;