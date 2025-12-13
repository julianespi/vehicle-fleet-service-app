// frontend/src/components/TruckCard.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DriverCheckoutModal from "../Modals/DriverCheckoutModal";

export default function TruckCard({ truck, onDelete }) {
  const {
    id,
    name,
    vin,
    make,
    model,
    year,
    status,
    miles,
    fuel_percent,
    engine_status,
    battery_status,
    driver_name,
    last_driver,
  } = truck;

  const [currentStatus, setCurrentStatus] = useState(status || "Unknown");
  const [currentDriverName, setCurrentDriverName] = useState(
    driver_name || last_driver || null
  );
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setCurrentStatus(status || "Unknown");
  }, [status]);

  useEffect(() => {
    setCurrentDriverName(driver_name || last_driver || null);
  }, [driver_name, last_driver]);

  const isActive = currentStatus === "Active";
  const isOnRoad = currentStatus === "On Road";
  const canToggle = isActive || isOnRoad;

  const buttonLabel = isActive
    ? "Driver Check Out"
    : isOnRoad
    ? "Check In"
    : "Unavailable";

  // ----- PATCH HELPERS -----
  const patchTruck = async (payload) => {
    const res = await fetch(`/api/trucks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Failed to update truck");
    }

    return res.json();
  };

  const handleButtonClick = async () => {
    if (!canToggle || updatingStatus) return;

    if (isActive) {
      setIsDriverModalOpen(true);
    } else if (isOnRoad) {
      await handleCheckIn();
    }
  };

  const handleCheckIn = async () => {
    try {
      setUpdatingStatus(true);
      const updated = await patchTruck({ status: "Active" });

      setCurrentStatus(updated.status || "Active");
      setCurrentDriverName(updated.driver_name || updated.last_driver || null);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleConfirmCheckout = async (driverId, driverName) => {
    try {
      setUpdatingStatus(true);
      const updated = await patchTruck({
        status: "On Road",
        driver_id: Number(driverId),
      });

      setCurrentStatus(updated.status || "On Road");
      setCurrentDriverName(
        updated.driver_name || updated.last_driver || driverName
      );
      setIsDriverModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 w-full box-border">
        {/* ----------------- TOP ROW ----------------- */}
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <div>
            <h2 className="text-xl font-bold">{name || `Truck ${id}`}</h2>
            <p className="text-sm text-gray-500">
              {year && make && model
                ? `${year} ${make} ${model}`
                : vin
                ? `VIN: ${vin}`
                : null}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-sm">
              <span className="font-medium">Status: </span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                  currentStatus === "Active"
                    ? "bg-green-100 text-green-800"
                    : currentStatus === "On Road"
                    ? "bg-blue-100 text-blue-800"
                    : currentStatus === "In Shop"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {currentStatus}
              </span>
            </div>

            <div className="text-sm">
              <span className="font-medium">Miles:</span>{" "}
              {miles != null ? miles.toLocaleString() : "—"}
            </div>

            <div className="text-xs text-gray-500">
              <span className="font-medium">Driver:</span>{" "}
              {currentDriverName ||
                (isOnRoad ? "Unknown (refresh)" : "Not assigned")}
            </div>
          </div>
        </div>

        {/* ----------------- BOTTOM ROW ----------------- */}
        <div className="flex justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            <div>VIN: {vin || "—"}</div>
            <div>Fuel: {fuel_percent != null ? `${fuel_percent}%` : "—"}</div>
            <div>Engine: {engine_status || "—"}</div>
            <div>Battery: {battery_status || "—"}</div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            {/* CHECK OUT / CHECK IN BUTTON */}
            <button
              onClick={handleButtonClick}
              disabled={!canToggle || updatingStatus}
              className={`px-4 py-2 rounded-lg text-white transition ${
                canToggle
                  ? "bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {updatingStatus ? "Updating..." : buttonLabel}
            </button>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2">
              <Link to={`/service-request?truckId=${id}`}>
                {/* SERVICE REQUEST BUTTON */}
                <button
                  disabled={isOnRoad || currentStatus === "In Shop"}
                  className={`
                    px-4 py-2 rounded-lg text-white transition
                    ${
                      isOnRoad || currentStatus === "In Shop"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }
                  `}
                  onClick={() => {
                    if (isOnRoad || currentStatus === "In Shop") return;
                    navigate(`/service-request?truckId=${id}`);
                  }}
                >
                  {isOnRoad
                    ? "Unavailable (On Road)"
                    : currentStatus === "In Shop"
                    ? "Already In Shop"
                    : "New Service Request"}
                </button>
              </Link>

              <Link to={`/service-history?truckId=${id}`}>
                <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition">
                  History
                </button>
              </Link>

              <button
                onClick={onDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* -------- DRIVER CHECKOUT MODAL -------- */}
      <DriverCheckoutModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        onConfirm={handleConfirmCheckout}
      />
    </>
  );
}
