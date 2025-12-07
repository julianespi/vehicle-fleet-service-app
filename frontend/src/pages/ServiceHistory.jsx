// frontend/src/pages/ServiceHistory.jsx
import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import ServiceHistoryCard from "../components/ServiceHistoryCard"

export default function ServiceHistory() {
  const [searchParams] = useSearchParams()
  const truckId = searchParams.get("truckId")

  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!truckId) {
      setLoading(false)
      setError("No truck selected. Open History from a truck card.")
      return
    }

    const fetchHistory = async () => {
      setLoading(true)
      setError(null)
      try {
        // 🔴 IMPORTANT: no status=... here
        const res = await fetch(`/api/service-requests?truckId=${truckId}`)
        if (!res.ok) throw new Error("Failed to load service history")
        const data = await res.json()
        setHistory(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [truckId])

  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold">
          Service History for Truck {truckId || "?"}
        </h1>

        <Link
          to="/fleetStatus"
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Fleet
        </Link>
      </div>

      {loading && <p className="text-gray-600">Loading service history...</p>}
      {error && !loading && (
        <p className="text-red-600 mb-4">{error}</p>
      )}

      {!loading && !error && history.length === 0 && (
        <p className="text-gray-600">
          No service requests found for this truck yet.
        </p>
      )}

      <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-wrap gap-6">
        {history.map((req) => (
          <ServiceHistoryCard key={req.id} request={req} />
        ))}
      </div>
    </div>
  )
}
