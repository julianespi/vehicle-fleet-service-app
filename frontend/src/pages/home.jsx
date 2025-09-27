import { Link } from "react-router-dom" 

// src/pages/Home.jsx
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-8">
      <h1 className="text-5xl font-extrabold text-blue-600 mb-6">
        Fleet Manager
      </h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        Monitor your vehicles in real time, track usage, and optimize your fleet with ease.
      </p>
      <Link to="/fleetStatus">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
          Get Started
        </button>
      </Link>
    </div>
  )
}