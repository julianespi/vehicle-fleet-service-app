export default function WorkOrderCard({ order }) {
  const truck = order.truck || {}

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-6 w-[400px]">
      {/* Top Row: Truck + Job Type */}
      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {truck.name ? truck.name : `Truck ID: ${order.truck_id}`}
          </h2>
          <span className="text-blue-600 font-semibold">
            Job: {order.service_type}
          </span>
        </div>
        {/* VIN line */}
        <p className="text-sm text-gray-500 mt-1">
          VIN: {truck.vin || '—'}
        </p>
      </div>

      {/* Vehicle Stats */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Miles</span>
          <span className="font-medium">
            {truck.miles != null ? truck.miles.toLocaleString() : '—'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Fuel</span>
          <span className="font-medium">
            {truck.fuel_percent != null ? `${truck.fuel_percent}%` : '—'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Engine</span>
          <span className="font-medium">{truck.engine_status || '—'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Battery</span>
          <span className="font-medium">{truck.battery_status || '—'}</span>
        </div>
      </div>

      {/* Buttons (for now still just UI) */}
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          Start Job
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          End Job
        </button>
      </div>
    </div>
  )
}
