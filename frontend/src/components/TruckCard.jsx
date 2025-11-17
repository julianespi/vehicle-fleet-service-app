// frontend/src/components/TruckCard.jsx
import { Link } from 'react-router-dom'

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
  } = truck

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full box-border">
      {/* Top row */}
      <div className="flex justify-between items-start border-b pb-4 mb-4">
        <div>
          <h2 className="text-xl font-bold">
            {name || `Truck ${id}`}
          </h2>
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
            <span className="font-medium">Status:</span> {status || 'Unknown'}
          </div>
          <div className="text-sm">
            <span className="font-medium">Miles:</span> {miles != null ? miles.toLocaleString() : '—'}
          </div>
        </div>
      </div>

      {/* Bottom row: buttons */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <div>VIN: {vin || '—'}</div>
          <div>Fuel: {fuel_percent != null ? `${fuel_percent}%` : '—'}</div>
          <div>Engine: {engine_status || '—'}</div>
        </div>

        <div className="flex gap-3">
          <Link to={`/service-request?truckId=${id}`}>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              New Service Request
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
  )
}
