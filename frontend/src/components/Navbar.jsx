import { Link } from "react-router-dom"

export function Navbar() {
    return (
        <>
            <Link to="/">Home</Link>
            <Link to="/fleetStatus">Fleet Status</Link>
            <Link to="/aboutUs">About Us</Link>
        </>
    )
}