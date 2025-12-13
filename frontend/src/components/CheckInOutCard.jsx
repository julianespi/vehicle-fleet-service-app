import React from "react";

function fmt(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString();
}

export default function CheckInOutCard({ trip }) {
  const {
    truck_name,
    truck_id,
    driver_name,
    driver_email,
    checked_out_at,
    checked_in_at,
    start_miles,
    end_miles,
  } = trip;

  // You said: only show when BOTH exist
  if (!checked_out_at || !checked_in_at) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 w-[420px]">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {truck_name || `Truck #${truck_id}`}
          </h3>
          <p className="text-sm text-gray-600">
            Driver: <span className="font-semibold">{driver_name || "—"}</span>
            {driver_email ? ` • ${driver_email}` : ""}
          </p>
        </div>

        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Completed
        </span>
      </div>

      <div className="text-sm text-gray-700 space-y-1">
        <div>
          Out: <span className="font-semibold">{fmt(checked_out_at)}</span>
        </div>
        <div>
          In: <span className="font-semibold">{fmt(checked_in_at)}</span>
        </div>
        <div className="text-xs text-gray-500 pt-2">
          Miles: {start_miles ?? "—"} → {end_miles ?? "—"}
        </div>
      </div>
    </div>
  );
}
