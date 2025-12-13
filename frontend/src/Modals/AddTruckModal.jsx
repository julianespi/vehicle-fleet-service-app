// frontend/src/components/AddTruckModal.jsx
import React, { useState } from "react";

export default function AddTruckModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [vin, setVin] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setName("");
    setVin("");
    setMake("");
    setModel("");
    setYear("");
    setFormMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose && onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage(null);

    if (!name.trim() || !vin.trim()) {
      setFormMessage({ type: "error", text: "Name and VIN are required." });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/trucks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          vin: vin.trim(),
          make: make.trim() || undefined,
          model: model.trim() || undefined,
          year: year ? Number(year) : undefined,
          status: "Active",
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create truck");
      }

      const created = await res.json();
      setFormMessage({ type: "success", text: "Truck added." });

      // inform parent
      onCreated && onCreated(created);

      // close modal shortly after success
      setTimeout(() => {
        handleClose();
      }, 300);
    } catch (err) {
      setFormMessage({ type: "error", text: err.message || "Error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modal backdrop + centered dialog
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* dialog */}
      <div className="relative bg-white rounded-lg shadow-xl w-[95%] max-w-2xl p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Add Truck</h3>
          <button
            onClick={handleClose}
            aria-label="Close modal"
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {formMessage && (
          <div
            className={`mb-4 p-2 rounded ${
              formMessage.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {formMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Name (e.g., Truck 101)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="VIN"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            required
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            type="number"
          />

          <div className="flex gap-2 md:col-span-2 justify-end mt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting ? "Adding..." : "Add Truck"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
