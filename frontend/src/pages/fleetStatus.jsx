// frontend/src/pages/fleetStatus.jsx
import React, { useEffect, useState } from "react";
import TruckCard from "../components/TruckCard";
import AddTruckModal from "../Modals/AddTruckModal";
import AddDriverModal from "../Modals/AddDriverModal";
import DriverCard from "../components/DriverCard";

function FleetStatus() {
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [loadingTrucks, setLoadingTrucks] = useState(true);
  const [loadingDrivers, setLoadingDrivers] = useState(true);

  const [error, setError] = useState(null);

  // modal state
  const [isAddTruckOpen, setIsAddTruckOpen] = useState(false);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);

  const fetchTrucks = async () => {
    setLoadingTrucks(true);
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
      setLoadingTrucks(false);
    }
  };

  const fetchDrivers = async () => {
    setLoadingDrivers(true);
    try {
      const res = await fetch("/api/drivers");
      if (!res.ok) throw new Error("Failed to load drivers");
      const data = await res.json();
      setDrivers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDrivers(false);
    }
  };

  useEffect(() => {
    fetchTrucks();
    fetchDrivers();
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
    if (truck && truck.id) {
      setTrucks((prev) => [...prev, truck]);
    } else {
      fetchTrucks();
    }
  };

  const handleDriverCreated = (driver) => {
    if (driver && driver.id) {
      setDrivers((prev) => [...prev, driver]);
    } else {
      fetchDrivers();
    }
  };

  const handleDeleteDriver = async (driverId) => {
    if (!window.confirm("Delete this driver?")) return;

    const res = await fetch(`/api/drivers/${driverId}`, { method: "DELETE" });

    // if backend returns 204, res.json() will fail — so don't parse JSON here
    if (!res.ok && res.status !== 204) {
      const body = await res.json().catch(() => ({}));
      alert(body.error || "Failed to delete driver");
      return;
    }

    setDrivers((prev) => prev.filter((d) => d.id !== driverId));
  };

  const truckLookup = Object.fromEntries(
  trucks.map((t) => [
    t.id,
    t.name ? `${t.name} (${t.vin || "no vin"})` : (t.vin ? `VIN ${t.vin}` : `Truck #${t.id}`)
  ])
  );

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

      {/* Error */}
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {/* Layout: Trucks (left) + Drivers (right) */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Trucks */}
        <div className="flex-1">
          {loadingTrucks && <p className="text-gray-600 mb-4">Loading trucks...</p>}

          <div className="flex flex-wrap gap-4">
            {trucks.map((truck) => (
              <TruckCard
                key={truck.id}
                truck={truck}
                onDelete={() => handleDeleteTruck(truck.id)}
              />
            ))}

            {!loadingTrucks && trucks.length === 0 && (
              <p className="text-gray-600">No trucks yet.</p>
            )}
          </div>
        </div>

        {/* Drivers */}
        <div className="w-full lg:w-[420px]">
          <h2 className="text-xl font-bold mb-3">Active Drivers</h2>

          {loadingDrivers && <p className="text-gray-600 mb-4">Loading drivers...</p>}

          <div className="flex flex-wrap gap-4">
            {drivers.map((driver) => (
              <DriverCard
                key={driver.id}
                driver={driver}
                onDelete={handleDeleteDriver}
                truckLookup={truckLookup}
              />
            ))}

            {!loadingDrivers && drivers.length === 0 && (
              <p className="text-gray-600">No drivers yet.</p>
            )}
          </div>
        </div>
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
