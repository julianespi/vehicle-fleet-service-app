import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ServiceRequest() {
  const location = useLocation()

  const [truckId, setTruckId] = useState('')
  const [serviceType, setServiceType] = useState('Oil Change')
  const [description, setDescription] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  // extra: show truck summary (name / vin / year make model)
  const [truck, setTruck] = useState(null)
  const [truckFromQuery, setTruckFromQuery] = useState(false)

  // Read truckId from ?truckId=... when coming from FleetStatus
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const paramId = params.get('truckId')

    if (paramId) {
      setTruckId(paramId)
      setTruckFromQuery(true)

      // fetch truck details so we can show VIN, etc.
      fetch(`/api/trucks/${paramId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load truck info')
          return res.json()
        })
        .then((data) => setTruck(data))
        .catch((err) => {
          console.error(err)
        })
    }
  }, [location.search])

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
          // HTML date input gives "YYYY-MM-DD"
          preferred_date: preferredDate || null,
        }),
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(errBody.error || 'Failed to submit request')
      }

      await res.json()
      setMessage('Service request submitted successfully!')
      if (!truckFromQuery) setTruckId('') // if came from fleet, keep the truck locked
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

        {/* Truck summary if we loaded it */}
        {truck && (
          <div className="mb-4 p-3 rounded-lg bg-gray-100 text-sm">
            <div className="font-semibold">
              {truck.name || `Truck ${truck.id}`} ({truck.year} {truck.make} {truck.model})
            </div>
            <div>VIN: {truck.vin}</div>
          </div>
        )}

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
              // If we came from a specific truck card, lock the field
              readOnly={truckFromQuery}
            />
            {truckFromQuery && (
              <p className="text-xs text-gray-500 mt-1">
                Truck selected from Fleet Status. To choose a different truck, go back and click "New Service Request" on that truck.
              </p>
            )}
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
