import WorkOrderCard from "../components/WorkOrderCard"

export default function Technician() {
  return (
    <div className="min-h-screen bg-gray-50 p-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Technician Work Orders</h1>

        <WorkOrderCard />
        <WorkOrderCard />
        <WorkOrderCard />
        <WorkOrderCard />

    </div>
  )
}   