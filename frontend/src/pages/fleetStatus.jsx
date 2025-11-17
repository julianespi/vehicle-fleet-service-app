// frontend/src/pages/fleetStatus.jsx
import React, { useEffect, useState } from "react";
import TruckCard from "../components/TruckCard";
import AddTruckModal from "../components/AddTruckModal";

function FleetStatus() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // modal state
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchTrucks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/trucks");
      if (!res.ok) throw new Error("Failed to load trucks");
      const data = await res.json();
      setTrucks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  const handleDeleteTruck = async (truckId) => {
    if (!window.confirm("Are you sure you want to delete this truck?")) return;

    try {
      const res = await fetch(`/api/trucks/${truckId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to delete truck");
      }
      setTrucks((prev) => prev.filter((t) => t.id !== truckId));
    } catch (err) {
      alert(`Could not delete truck: ${err.message}`);
    }
  };

  // called by modal when a truck is created
  const handleTruckCreated = (created) => {
    // If backend returns the full truck object, use it; otherwise re-fetch list
    if (created && created.id) {
      // in case created doesn't contain full fields, refresh from server instead:
      // fetchTrucks()
      setTrucks((prev) => [created, ...prev]);
    } else {
      fetchTrucks();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fleet Status</h1>

        <div className="flex items-center gap-3">
          {/* Add Truck button opens modal */}
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Truck
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-600">Loading trucks...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

     <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(600px, 100%), 1fr))' }}
      >
        {trucks.map((truck) => (
          <TruckCard
            key={truck.id}
            truck={truck}
            onDelete={() => handleDeleteTruck(truck.id)}
          />
        ))}

        {!loading && trucks.length === 0 && (
          <p className="text-gray-600">No trucks yet.</p>
        )}
      </div>

      <AddTruckModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreated={handleTruckCreated}
      />
    </div>
  );
}

export default FleetStatus;
