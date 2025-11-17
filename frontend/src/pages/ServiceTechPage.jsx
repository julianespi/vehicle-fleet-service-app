import { useEffect, useState } from "react"
import WorkOrderCard from "../components/WorkOrderCard"

export default function Technician() {
  const [workOrders, setWorkOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const res = await fetch('/api/service-requests?status=Pending')
        if (!res.ok) throw new Error('Failed to load work orders')
        const data = await res.json()
        setWorkOrders(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkOrders()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Technician Work Orders
      </h1>

      {loading && <p className="text-gray-600">Loading work orders...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!loading && workOrders.length === 0 && !error && (
        <p className="text-gray-600">No pending work orders.</p>
      )}

      <div className="flex flex-wrap gap-6">
        {workOrders.map(order => (
          <WorkOrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}
