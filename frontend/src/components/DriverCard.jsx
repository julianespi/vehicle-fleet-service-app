// frontend/src/components/DriverCard.jsx
import React from "react";

export default function DriverCard({ driver, onDelete, truckLookup = {} }) {
  const { id, name, email, is_available, current_truck_id } = driver;

  const assignedTruckLabel =
    current_truck_id != null
      ? truckLookup[current_truck_id] || `Truck #${current_truck_id}`
      : null;

  const onRoad = current_truck_id != null; // more accurate than is_available

  return (
    <div className="bg-white rounded-xl shadow-md p-5 w-[360px] border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{name || "Unnamed Driver"}</h3>
          <p className="text-sm text-gray-600">{email || "—"}</p>
        </div>

        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            onRoad ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
          }`}
        >
          {onRoad ? "On Road" : "Available"}
        </span>
      </div>

      <div className="text-sm text-gray-700 mb-3">
        Assigned Truck:{" "}
        <span className="font-semibold">
          {assignedTruckLabel || "—"}
        </span>
      </div>

      <button
        onClick={() => onDelete?.(id)}
        className="w-full px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
      >
        Delete Driver
      </button>
    </div>
  );
}
