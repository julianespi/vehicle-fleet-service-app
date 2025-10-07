export default function WorkOrderCard() {
    return (
        <div className="bg-white shadow-md rounded-xl p-6 mb-6 w-[400px]">
            {/* Top Row: Truck ID + Job Type */}
            <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h2 className="text-xl font-bold text-gray-800">Truck ID: 101</h2>
                <span className="text-blue-600 font-semibold">Job: Oil Change</span>
            </div>

            {/* Vehicle Stats */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Miles</span>
                    <span className="font-medium">45,300</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Fuel</span>
                    <span className="font-medium">75%</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Engine</span>
                    <span className="font-medium">Good</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Battery</span>
                    <span className="font-medium">Normal</span>
                </div>
            </div>

            {/* Buttons */}
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