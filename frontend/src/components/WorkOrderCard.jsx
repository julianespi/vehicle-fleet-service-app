import { useState } from "react"

export default function WorkOrderCard({ order, onJobCompleted }) {
  const truck = order.truck || {}

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [miles, setMiles] = useState(
    truck.miles !== null && truck.miles !== undefined ? truck.miles : ""
  )
  const [fuelPercent, setFuelPercent] = useState(
    truck.fuel_percent !== null && truck.fuel_percent !== undefined
      ? truck.fuel_percent
      : ""
  )
  const [engineStatus, setEngineStatus] = useState(truck.engine_status || "Good")
  const [batteryStatus, setBatteryStatus] = useState(
    truck.battery_status || "Normal"
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const openModal = () => {
    setError(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    if (!saving) setIsModalOpen(false)
  }

  const handleCompleteJob = async () => {
    try {
      setSaving(true)
      setError(null)

      // 1) Update truck info & set status back to Active
      const patchRes = await fetch(`/api/trucks/${order.truck_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Active",
          miles: miles === "" ? null : Number(miles),
          fuel_percent: fuelPercent === "" ? null : Number(fuelPercent),
          engine_status: engineStatus,
          battery_status: batteryStatus,
        }),
      })

      if (!patchRes.ok) {
        const body = await patchRes.json().catch(() => ({}))
        throw new Error(body.error || "Failed to update truck")
      }

      // 2) Delete the service request (finish job)
      const delRes = await fetch(`/api/service-requests/${order.id}`, {
        method: "DELETE",
      })

      if (!delRes.ok) {
        const body = await delRes.json().catch(() => ({}))
        throw new Error(body.error || "Failed to complete job")
      }

      // 3) Tell parent to remove this card
      if (onJobCompleted) {
        onJobCompleted(order.id)
      }

      setIsModalOpen(false)
    } catch (err) {
      console.error(err)
      setError(err.message || "Something went wrong while completing the job.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {/* Main Card */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6 w-[400px]">
        {/* Top Row: Truck + Job Type */}
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {truck.name ? truck.name : `Truck ID: ${order.truck_id}`}
            </h2>
            <span className="text-blue-600 font-semibold">
              {order.service_type}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            VIN: {truck.vin || "—"} • Status: {truck.status || "—"}
          </p>
        </div>

        {/* Vehicle Stats */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500">Miles</span>
            <span className="font-medium">
              {truck.miles != null ? truck.miles.toLocaleString() : "—"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Fuel</span>
            <span className="font-medium">
              {truck.fuel_percent != null ? `${truck.fuel_percent}%` : "—"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Engine</span>
            <span className="font-medium">{truck.engine_status || "—"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Battery</span>
            <span className="font-medium">{truck.battery_status || "—"}</span>
          </div>
        </div>

        {/* Description + preferred date */}
        {order.description && (
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">Notes: </span>
            {order.description}
          </p>
        )}
        {order.preferred_date && (
          <p className="text-xs text-gray-500 mb-4">
            Preferred date: {order.preferred_date}
          </p>
        )}

        {/* Buttons: ONLY Start Job now */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={openModal}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Start Job
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Complete Job for{" "}
              {truck.name
                ? truck.name
                : `Truck ${truck.id || order.truck_id}`}
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              VIN: {truck.vin || "—"}
            </p>

            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Miles (after service)
                </label>
                <input
                  type="number"
                  value={miles}
                  onChange={(e) => setMiles(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 120000"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Fuel (%) after service
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={fuelPercent}
                  onChange={(e) => setFuelPercent(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="0 - 100"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Engine Status
                </label>
                <input
                  type="text"
                  value={engineStatus}
                  onChange={(e) => setEngineStatus(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Good / Needs Service / etc."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Battery Status
                </label>
                <input
                  type="text"
                  value={batteryStatus}
                  onChange={(e) => setBatteryStatus(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Normal / Low / Replace Soon / etc."
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 mb-3 text-center">{error}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteJob}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save & Complete Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
