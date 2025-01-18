import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaHome,
  FaTicketAlt,
  FaInfoCircle,
  FaPhoneAlt,
  FaSignInAlt,
  FaUserPlus,
  FaUserCircle,
  FaSignOutAlt,
  FaBars, // Hamburger icon
} from "react-icons/fa";
import logoImage from "../assets/logo.svg";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, username, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false); // State to control the mobile menu
  const [showDropdown, setShowDropdown] = useState(false); // State for user profile dropdown

  // Track window size
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Update window size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout(); // Call logout function from context
    navigate("/login");
  };

  // Toggle mobile menu visibility
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Toggle profile dropdown visibility
  const handleDropdownEnter = () => setShowDropdown(true);
  const handleDropdownLeave = () => setShowDropdown(false);

  return (
    <>
      <nav
        className={`${
          isMobile
            ? "bg-[#e89005] text-white shadow-md sticky top-0 z-50 flex justify-between items-center p-4 flex-wrap py-2"
            : "bg-[#02367b] text-white shadow-md sticky top-0 z-50 flex justify-between items-center p-4 flex-wrap py-2"
        }`}
      >
        <div className="flex items-center">
          <img
            src={logoImage} // Path to your logo image
            alt="Horizon Logo"
            className="w-7 h-7 rounded-full" // Adjust the size as needed
          />
          {/* Show the company name only on larger screens */}
          <h1 className="text-2xl font-serif ml-3 hidden sm:block text-white">
            Horizon
          </h1>
        </div>

        {/* Desktop Links */}
        {!isMobile ? (
          <div className="flex gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 ${
                isActive("/") ? "rounded-xl border-[1px]" : ""
              } p-2`}
            >
              <FaHome className="text-xl" /> Home
            </Link>
            <Link
              to="/booking-dashboard"
              className={`flex items-center gap-2 ${
                isActive("/booking-dashboard") ? "rounded-xl border-[1px]" : ""
              } p-2`}
            >
              <FaTicketAlt className="text-xl" /> Book Tickets
            </Link>
            <Link
              to="/about"
              className={`flex items-center gap-2 ${
                isActive("/about") ? "rounded-xl border-[1px]" : ""
              } p-2`}
            >
              <FaInfoCircle className="text-xl" /> About Us
            </Link>
            <Link
              to="/contact"
              className={`flex items-center gap-2 ${
                isActive("/contact") ? "rounded-xl border-[1px]" : ""
              } p-2`}
            >
              <FaPhoneAlt className="text-xl" /> Reach Us
            </Link>
          </div>
        ) : (
          // Mobile Menu
          <div className="relative">
            <FaBars onClick={toggleMenu} className="text-3xl cursor-pointer" />
          </div>
        )}

        {/* Desktop Login/SignUp or Profile */}
        {!isMobile && (
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className={`flex items-center gap-2 ${
                    isActive("/login") ? "bg-[#d67a03] rounded-md" : ""
                  } p-2`}
                >
                  <FaSignInAlt /> Login
                </Link>
                <Link
                  to="/signup"
                  className={`flex items-center gap-2 ${
                    isActive("/signup") ? "bg-[#d67a03] rounded-md" : ""
                  } p-2`}
                >
                  <FaUserPlus /> Sign Up
                </Link>
              </>
            ) : (
              <div
                className="flex items-center gap-2 p-2 cursor-pointer mr-8"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <span className="text-base font-medium">Hi, {username}</span>
                <FaUserCircle className="text-2xl" />
                {showDropdown && (
                  <div className="absolute top-8 right-6 mt-2 bg-white shadow-md rounded-md z-40">
                    <div
                      className="py-2 px-4 text-gray-800 hover:bg-[#d67a03] hover:text-white cursor-pointer"
                      onClick={() => navigate("/profile")}
                    >
                      <FaUserCircle className="inline-block mr-2" /> Profile
                    </div>
                    <div
                      className="py-2 px-4 text-gray-800 hover:bg-[#d67a03] hover:text-white cursor-pointer"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="inline-block mr-2" /> Logout
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Sidebar */}
      {showMenu && (
        <>
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-40"
            onClick={toggleMenu}
          ></div>
          <div className="fixed top-15 left-0 bg-white p-4 z-50 shadow-lg transform transition-transform duration-300 ease-in-out w-full font-normal text-lg">
            <Link
              to="/"
              className={`flex items-center gap-3 py-2 px-4 text-gray-800 hover:bg-[#d67a03] hover:text-white ${
                isActive("/") ? "bg-[#d67a03] text-white" : ""
              }`}
              onClick={() => setShowMenu(false)}
            >
              <FaHome className="inline-block mr-2" /> Home
            </Link>
            <Link
              to="/booking-dashboard"
              className={`flex items-center gap-3 py-2 px-4 text-gray-800 hover:bg-[#d67a03] hover:text-white ${
                isActive("/booking-dashboard") ? "bg-[#d67a03] text-white" : ""
              }`}
              onClick={() => setShowMenu(false)}
            >
              <FaTicketAlt className="inline-block mr-2" /> Book Tickets
            </Link>
            <Link
              to="/about"
              className={`flex items-center gap-3 py-2 px-4 text-gray-800 hover:bg-[#d67a03] hover:text-white ${
                isActive("/about") ? "bg-[#d67a03] text-white" : ""
              }`}
              onClick={() => setShowMenu(false)}
            >
              <FaInfoCircle className="inline-block mr-2" /> About Us
            </Link>
            <Link
              to="/contact"
              className={`flex items-center gap-3 py-2 px-4 text-gray-800 hover:bg-[#d67a03] hover:text-white ${
                isActive("/contact") ? "bg-[#d67a03] text-white" : ""
              }`}
              onClick={() => setShowMenu(false)}
            >
              <FaPhoneAlt className="inline-block mr-2" /> Contact Us
            </Link>
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className={`flex items-center gap-3 py-2 px-4 text-gray-800 hover:bg-[#d67a03] hover:text-white ${
                    isActive("/login") ? "bg-[#d67a03] text-white" : ""
                  }`}
                  onClick={() => setShowMenu(false)}
                >
                  <FaSignInAlt className="inline-block mr-2" /> Login
                </Link>
                <Link
                  to="/signup"
                  className={`flex items-center gap-3 py-2 px-4 text-gray-800 hover:bg-[#d67a03] hover:text-white ${
                    isActive("/signup") ? "bg-[#d67a03] text-white" : ""
                  }`}
                  onClick={() => setShowMenu(false)}
                >
                  <FaUserPlus className="inline-block mr-2" /> Sign Up
                </Link>
              </>
            ) : (
              <>
                <div
                  className={`py-2 px-4 text-gray-800 hover:bg-[#d67a03] hover:text-white cursor-pointer ${
                    isActive("/profile") ? "bg-[#d67a03] text-white" : ""
                  }`}
                  onClick={() => navigate("/profile")}
                >
                  <FaUserCircle className="inline-block mr-2" /> Profile
                </div>
                <div
                  className="py-2 px-4 text-gray-800 hover:bg-[#d67a03] hover:text-white cursor-pointer"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="inline-block mr-2" /> Logout
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
