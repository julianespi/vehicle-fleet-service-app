export default function ServiceDispute() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-red-600">
          Service Dispute Form
        </h1>

        <form className="space-y-6">
          {/* Truck ID / Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Truck ID / Name
            </label>
            <input
              type="text"
              placeholder="Enter truck ID or name"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Service in Dispute */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Service in Dispute
            </label>
            <input
              type="text"
              placeholder="e.g., Oil Change on 2025-09-20"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Reason for Dispute */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Reason for Dispute
            </label>
            <textarea
              rows="4"
              placeholder="Explain why you are disputing this service..."
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
            ></textarea>
          </div>

          {/* Preferred Resolution */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Preferred Resolution
            </label>
            <select
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
            >
              <option>Refund</option>
              <option>Redo Service</option>
              <option>Credit Toward Future Service</option>
              <option>Other</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition"
            >
              Submit Dispute
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
