import { useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/home'
import FleetStatus from './pages/fleetStatus'
import { AboutUs } from './pages/aboutUs'
import { Layout } from './layout'

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<Layout/>}>
          <Route path='/' element={<Home/>}/>
          <Route path='/fleetStatus' element={<FleetStatus/>}/>
          <Route path='/aboutUs' element={<AboutUs/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
