// frontend/src/pages/ServiceHistory.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ServiceHistoryCard from "../components/ServiceHistoryCard";
import CheckInOutCard from "../components/CheckInOutCard";

export default function ServiceHistory() {
  const [searchParams] = useSearchParams();
  const truckId = searchParams.get("truckId"); // optional

  const [serviceRequests, setServiceRequests] = useState([]);
  const [trips, setTrips] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);

      try {
        const serviceUrl = truckId
          ? `/api/service-requests?truckId=${truckId}`
          : `/api/service-requests`;

        const tripsUrl = truckId
          ? `/api/checkinout-history?completed=true&truckId=${truckId}`
          : `/api/checkinout-history?completed=true`;

        const [srRes, trRes] = await Promise.all([
          fetch(serviceUrl),
          fetch(tripsUrl),
        ]);

        if (!srRes.ok) throw new Error("Failed to load service requests");
        if (!trRes.ok) throw new Error("Failed to load check-in/out history");

        setServiceRequests((await srRes.json()) || []);
        setTrips((await trRes.json()) || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [truckId]);

  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold">
          {truckId ? `History for Truck ${truckId}` : "Full Fleet History"}
        </h1>

        <Link to="/fleetStatus" className="text-blue-600 hover:underline text-sm">
          ← Back to Fleet
        </Link>
      </div>

      {loading && <p className="text-gray-600">Loading history...</p>}
      {error && !loading && <p className="text-red-600 mb-4">{error}</p>}

      {!loading && !error && (
        <>
          <h2 className="text-2xl font-bold mb-3">Service Requests</h2>
          {serviceRequests.length === 0 ? (
            <p className="text-gray-600 mb-8">No service requests found.</p>
          ) : (
            <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-wrap gap-6 mb-10">
              {serviceRequests.map((req) => (
                <ServiceHistoryCard key={req.id} request={req} />
              ))}
            </div>
          )}

          <h2 className="text-2xl font-bold mb-3">Driver Check Out / Check In</h2>
          {trips.length === 0 ? (
            <p className="text-gray-600">No completed trips yet.</p>
          ) : (
            <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-wrap gap-6">
              {trips.map((t) => (
                <CheckInOutCard key={t.id} trip={t} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
