// frontend/src/pages/fleetStatus.jsx
import React, { useEffect, useState } from "react";
import TruckCard from "../components/TruckCard";
import AddTruckModal from "../Modals/AddTruckModal";
import AddDriverModal from "../Modals/AddDriverModal";

function FleetStatus() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // modal state
  const [isAddTruckOpen, setIsAddTruckOpen] = useState(false);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);

  const fetchTrucks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/trucks");
      if (!res.ok) throw new Error("Failed to load trucks");
      const data = await res.json();
      setTrucks(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load trucks.");
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
      const res = await fetch(`/api/trucks/${truckId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete truck");
      }

      setTrucks((prev) => prev.filter((t) => t.id !== truckId));
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not delete truck.");
    }
  };

  const handleTruckCreated = (truck) => {
    // If backend returns the created truck, we can add it
    if (truck && truck.id) {
      setTrucks((prev) => [...prev, truck]);
    } else {
      // otherwise just refetch
      fetchTrucks();
    }
  };

  const handleDriverCreated = () => {
    // For now we don't need to track drivers here,
    // the checkout modal fetches them directly from the API.
    // This is just a hook if you want a toast/refetch later.
    console.log("Driver created");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Fleet Status</h1>
          <p className="text-sm text-gray-600">
            View trucks, assign drivers, and manage availability.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsAddTruckOpen(true)}
            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
          >
            Add Truck
          </button>

          <button
            onClick={() => setIsAddDriverOpen(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            Add Driver
          </button>
        </div>
      </div>

      {/* Error / loading */}
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </div>
      )}
      {loading && (
        <p className="text-gray-600 mb-4">Loading trucks...</p>
      )}

      {/* Truck list */}
      <div className="flex flex-wrap gap-4">
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

      {/* Modals */}
      <AddTruckModal
        isOpen={isAddTruckOpen}
        onClose={() => setIsAddTruckOpen(false)}
        onCreated={handleTruckCreated}
      />

      <AddDriverModal
        isOpen={isAddDriverOpen}
        onClose={() => setIsAddDriverOpen(false)}
        onCreated={handleDriverCreated}
      />
    </div>
  );
}

export default FleetStatus;
