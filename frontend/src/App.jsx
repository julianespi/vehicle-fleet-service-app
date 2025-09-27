import { Routes, Route, Link } from "react-router-dom"
import Home from './Home.jsx'
import About from './AboutUs.jsx'
import FleetStatus from './FleetStatus.jsx'

function App() {
  return (
    <Routes>
      {/* Home route includes both Home and About */}
      <Route path="/" element={
        <div>
          <Home />
          <About />
        </div>
      } />

      {/* Fleet route stays separate */}
      <Route path="/fleet" element={<FleetStatus />} />
    </Routes>
  )
}

export default App
