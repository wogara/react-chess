//@ts-nocheck
// src/components/Navbar.js
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Navbar = ({ userData, onLogout }) => {
  return (
    <nav className="bg-mantle p-4 shadow-lg top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-white text-xl font-bold hover:text-blue-300 transition duration-200"
        >
          Chess Who
        </Link>
        <div className="space-x-4">
          {userData.name ? (
            <>
              <span className="text-white">Hey, {userData.name}</span>
              <button
                onClick={onLogout}
                className="text-white hover:text-blue-300 transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="text-white hover:text-blue-300 transition duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-white hover:text-blue-300 transition duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
