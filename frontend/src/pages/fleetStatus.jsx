import React from 'react'
import TruckCard from '../components/TruckCard'

function FleetStatus() {

  return (
    <>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Fleet Status</h1>
        <div className='flex flex-wrap items-center gap-2'>
          <TruckCard />
          <TruckCard />
          <TruckCard />
          <TruckCard />
        </div>

        
      </div>
    </>
  )
}

export default FleetStatus
