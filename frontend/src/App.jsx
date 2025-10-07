import { useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import FleetStatus from './pages/fleetStatus'
import AboutUs from './pages/aboutUs'
import ServiceHistory from "./pages/ServiceHistory.jsx"
import ServiceRequest from "./pages/ServiceRequest.jsx"
import ServiceDispute from './pages/ServiceDispute.jsx'
import Technician from './pages/ServiceTechPage.jsx'
import { Layout } from './layout'

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<Layout/>}>
          <Route path='/' element={<Home/>}/>
          <Route path='/fleetStatus' element={<FleetStatus/>}/>
          <Route path='/aboutUs' element={<AboutUs/>}/>
          <Route path="/service-history" element={<ServiceHistory />} />
          <Route path="/service-request" element={<ServiceRequest />} />
          <Route path="/service-dispute" element={<ServiceDispute />} />
          <Route path="/technician" element={<Technician />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
