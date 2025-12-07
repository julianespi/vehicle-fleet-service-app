// frontend/src/components/ServiceHistoryCard.jsx
export default function ServiceHistoryCard({ request }) {
  const {
    id,
    service_type,
    description,
    status,
    created_at,
    truck_id,
  } = request

  const isActive = status === "Pending" || status === "InProgress"

  const formattedDate = created_at
    ? new Date(created_at).toLocaleString()
    : "Unknown"

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-6 w-[300px]">
      {/* Top Section: Service Type + Active/Inactive */}
      <div className="flex justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {service_type}
          </h2>
          <p className="text-xs text-gray-500">
            Req #{id} • Truck {truck_id} • {formattedDate}
          </p>
        </div>

        <div className="text-right">
          <span className="text-gray-500 text-sm block">Status</span>
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
              ${isActive ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}
            `}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-700 line-clamp-3">
          {description}
        </p>
      )}
    </div>
  )
}
