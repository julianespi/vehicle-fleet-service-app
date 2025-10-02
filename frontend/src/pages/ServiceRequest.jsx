import React from 'react'

export default function ServiceRequest() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Service Request Form
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
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Service Type
            </label>
            <select
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option>Oil Change</option>
              <option>Tire Rotation</option>
              <option>Brake Inspection</option>
              <option>Engine Check</option>
              <option>Battery Replacement</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Service Description
            </label>
            <textarea
              rows="4"
              placeholder="Describe the issue or service request..."
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Preferred Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Preferred Service Date
            </label>
            <input
              type="date"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
