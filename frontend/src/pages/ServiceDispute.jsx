import { useState } from 'react'

export default function ServiceDispute() {
  const [serviceRequestId, setServiceRequestId] = useState('')
  const [reason, setReason] = useState('')
  const [preferredResolution, setPreferredResolution] = useState('')
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setIsError(false)

    try {
      const res = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_request_id: Number(serviceRequestId),
          reason,
          preferred_resolution: preferredResolution || null,
        }),
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(errBody.error || 'Failed to submit dispute')
      }

      await res.json()
      setMessage('Dispute submitted successfully.')
      setServiceRequestId('')
      setReason('')
      setPreferredResolution('')
    } catch (err) {
      console.error(err)
      setIsError(true)
      setMessage(err.message || 'There was a problem submitting the dispute.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-red-600">
          Service Dispute Form
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
          {/* Service Request ID */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Service Request ID
            </label>
            <input
              type="number"
              value={serviceRequestId}
              onChange={(e) => setServiceRequestId(e.target.value)}
              placeholder="e.g., 1"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Reason for Dispute
            </label>
            <textarea
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you are disputing this service..."
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Preferred Resolution */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Preferred Resolution (optional)
            </label>
            <input
              type="text"
              value={preferredResolution}
              onChange={(e) => setPreferredResolution(e.target.value)}
              placeholder="Refund, rework, discount, etc."
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
            />
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
