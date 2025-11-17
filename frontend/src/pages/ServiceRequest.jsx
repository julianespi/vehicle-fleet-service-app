import React, { useState } from 'react'

export default function ServiceRequest() {
  const [truckId, setTruckId] = useState('')
  const [serviceType, setServiceType] = useState('Oil Change')
  const [description, setDescription] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setIsError(false)

    try {
      const res = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          truck_id: Number(truckId),
          service_type: serviceType,
          description,
          preferred_date: preferredDate || null, // HTML date input gives "YYYY-MM-DD"
        }),
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(errBody.error || 'Failed to submit request')
      }

      await res.json()
      setMessage('Service request submitted successfully!')
      setTruckId('')
      setDescription('')
      setPreferredDate('')
      setServiceType('Oil Change')
    } catch (err) {
      console.error(err)
      setIsError(true)
      setMessage(err.message || 'There was a problem submitting the request.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Service Request Form
        </h1>

        {message && (
          <div
            className={`mb-4 text-sm text-center px-4 py-2 rounded-lg ${
              isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {message}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Truck ID */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Truck ID
            </label>
            <input
              type="number"
              value={truckId}
              onChange={(e) => setTruckId(e.target.value)}
              placeholder="e.g., 101"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Service Type
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option>Oil Change</option>
              <option>Tire Rotation</option>
              <option>Brake Inspection</option>
              <option>Engine Check</option>
              <option>Battery Replacement</option>
              <option>Transmission Service</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Service Description
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue or requested service..."
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Preferred Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Preferred Service Date
            </label>
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
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
