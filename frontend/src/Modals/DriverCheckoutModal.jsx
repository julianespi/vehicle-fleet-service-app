// frontend/src/components/DriverCheckoutModal.jsx
import { useEffect, useState } from "react";

export default function DriverCheckoutModal({ isOpen, onClose, onConfirm }) {
  const [drivers, setDrivers] = useState([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [driversError, setDriversError] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState("");

  // Load available drivers when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchAvailableDrivers = async () => {
      setDriversLoading(true);
      setDriversError("");
      try {
        const res = await fetch("/api/drivers?available=true");
        if (!res.ok) throw new Error("Failed to load drivers");
        const json = await res.json();
        setDrivers(json || []);
      } catch (err) {
        console.error(err);
        setDriversError(err.message || "Could not load drivers.");
      } finally {
        setDriversLoading(false);
      }
    };

    fetchAvailableDrivers();
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDriverId) {
      alert("Please select a driver before checking out.");
      return;
    }

    const chosen = drivers.find((d) => String(d.id) === String(selectedDriverId));
    const driverName = chosen ? chosen.name : "";

    onConfirm(selectedDriverId, driverName);
  };

  const handleClose = () => {
    if (driversLoading) return;
    setSelectedDriverId("");
    setDriversError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Driver Check Out</h3>

        {driversLoading && (
          <p className="text-sm text-gray-500 mb-2">
            Loading available drivers...
          </p>
        )}
        {driversError && (
          <p className="text-sm text-red-600 mb-2">{driversError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select driver */}
          <div>
            <label
              htmlFor="driver"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Driver
            </label>
            <select
              id="driver"
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={driversLoading}
            >
              <option value="">-- Choose a driver --</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {!driversLoading && drivers.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                No available drivers. Add one from the Fleet Status page.
              </p>
            )}
          </div>

          {/* Modal actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              disabled={driversLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={driversLoading}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              Confirm Check Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
