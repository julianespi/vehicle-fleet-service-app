import ServiceHistoryCard from "../components/ServiceHistoryCard"

export default function ServiceHistory() {
  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <h1 className="text-4xl font-bold mb-6">Service History for vehicle 101</h1>
            <div className="bg-gray-100 rounded-lg shadow-md p-6 flex flex-wrap gap-6">
                <ServiceHistoryCard />
                <ServiceHistoryCard />
                <ServiceHistoryCard />
            </div>

    </div>
  )
}
