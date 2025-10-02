import { Link } from "react-router-dom"

export function Navbar() {
    return (
        <>
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <ul className="flex space-x-6">
        <li>
          <Link 
            to="/" 
            className="hover:text-gray-200 transition"
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/aboutUs" 
            className="hover:text-gray-200 transition"
          >
            About Us
          </Link>
        </li>
        <li>
          <Link 
            to="/fleetStatus" 
            className="hover:text-gray-200 transition"
          >
            Fleet Status
          </Link>
        </li>
      </ul>
    </nav>
        </>
    )
}