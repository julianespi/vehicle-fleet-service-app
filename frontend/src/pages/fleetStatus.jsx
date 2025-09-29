import React from 'react'

function FleetStatus() {

  return (
    <>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Fleet Status</h1>

        {/* Truck Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 ">
          {/* Top row */}
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-xl font-bold">Truck 101</h2>
            <div className="flex gap-6 text-sm">
              <span>Status: <span className="font-medium">Active</span></span>
              <span>Miles: <span className="font-medium">45,300</span></span>
              <span>Fuel: <span className="font-medium">75%</span></span>
              <span>Engine: <span className="font-medium">Good</span></span>
              <span>Battery: <span className="font-medium">Normal</span></span>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Last Driver</span>
                <span className="font-medium">John Doe</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Date Driven</span>
                <span className="font-medium">2025-09-20</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Miles Driven</span>
                <span className="font-medium">150</span>
              </div>
            </div>
            <div className="h-36 w-full flex items-center justify-center">
                <img src="\src\assets\truck1.jpg" alt="truck picture" className="max-h-full max-w-full object-contain rounded-lg" />
            </div>
              {/* Right Column: Action Buttons */}
            <div className="flex flex-col gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Service Request
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Service History
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Service Dispute
              </button>
            </div>
          </div>


        </div>

                {/* Truck Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          {/* Top row */}
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-xl font-bold">Truck 102</h2>
            <div className="flex gap-6 text-sm">
              <span>Status: <span className="font-medium">Active</span></span>
              <span>Miles: <span className="font-medium">45,300</span></span>
              <span>Fuel: <span className="font-medium">75%</span></span>
              <span>Engine: <span className="font-medium">Good</span></span>
              <span>Battery: <span className="font-medium">Normal</span></span>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-center gap-6">
            {/* Left column with text */}
            <div className="flex flex-col gap-2 w-30">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Last Driver</span>
                <span className="font-medium">John Doe</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Date Driven</span>
                <span className="font-medium">2025-09-20</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Miles Driven</span>
                <span className="font-medium">150</span>
              </div>
            </div>

            {/* Right column with centered image */}
            <div className="h-36 w-full flex items-center justify-center">
              <img 
                src="\src\assets\truck2.jpg" 
                alt="truck picture" 
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FleetStatus
