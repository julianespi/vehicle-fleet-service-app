import { useState } from 'react'
import FleetStatus from './fleetStatus.jsx'

function App() {

  return (
    <>
    <div className="p-10">
      <h1 className="text-3xl font-bold">Main App</h1>
      <FleetStatus />
    </div>
    </>
  )
}

export default App
