import { Plane, Globe, ChevronDown, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Flights", href: "/flights/results" },
  { label: "Hotels", href: "/hotels" },
  { label: "Cars", href: "/cars" },
  { label: "Contact us", href: "/contact" },
];

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("auth_token");
  const isLoggedIn = !!token;

  let username = "User";
  if (isLoggedIn) {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const firstName = user?.first_name || "";
      const lastName = user?.last_name || "";
      username = `${firstName} ${lastName}`.trim() || "User";
    } catch {
      username = "User";
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch {
      // proceed with local logout even if API fails
    }
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setDropdownOpen(false);
    navigate("/login");
  };

  const menuItems = [
    { label: "My Profile", path: "/profile" },
    { label: "Update Profile", path: "/profile/update" },
    { label: "Change Password", path: "/profile/change-password" },
    { label: "My Bookings", path: "/bookings" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-xl text-blue-600">
          <Plane className="w-5 h-5" />
          <span>Travel4Pennies</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-blue-600 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button className="hidden md:flex items-center gap-1 text-sm text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
            <Globe className="w-4 h-4" /> USD{" "}
            <ChevronDown className="w-3 h-3" />
          </button>

          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              {/* Trigger */}
              <div
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 text-sm text-gray-700 px-3 py-1.5 rounded-lg border transition select-none"
              >
                <UserCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium">{username}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </div>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-100 rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                  {menuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.path);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-sm px-4 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/register")}
                className="text-sm px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
