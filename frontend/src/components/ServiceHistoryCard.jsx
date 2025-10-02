export default function ServiceHistoryCard() {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-6 w-[300px] h-[200px] ">
      {/* Top Section: Service Type + Cost */}
      <div className="flex justify-between mb-4">
        {/* Service Type */}
        <div>
          <h2 className="text-lg font-bold text-gray-800">Oil Change</h2>
        </div>
        {/* Cost */}
        <div>
          <span className="text-gray-500 text-sm">Cost</span>
          <p className="text-green-600 font-semibold">$120</p>
        </div>
      </div>

      {/* Bottom Section: Tech + Status */}
      <div className="flex justify-between">
        {/* Technician Name */}
        <div>
          <span className="text-gray-500 text-sm">Technician</span>
          <p className="font-medium">Jane Smith</p>
        </div>
        {/* Status */}
        <div>
          <span className="text-gray-500 text-sm">ServiceID Number: </span>
          <p className="font-medium text-blue-600">0000001</p>
        </div>
      </div>
    </div>
  )
}
