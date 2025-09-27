import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl font-bold mb-6">Fleet Manager</h1>
      <p className="text-lg mb-8">Monitor your fleet in real time.</p>

      <Link to="/fleet">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
          Get Started
        </button>
      </Link>
    </div>
  )
}
