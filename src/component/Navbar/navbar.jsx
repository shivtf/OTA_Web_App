import { useNavigate, useLocation } from "react-router-dom";
import { Plane } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: "Home", path: "/" },
    { label: "Flights", path: "/flights" },
    { label: "Hotels", path: "/hotels" },
    { label: "Cars", path: "/cars" },
    { label: "Contact us", path: "/contact" },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-extrabold text-lg text-blue-600"
        >
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Plane className="w-4 h-4 text-white" />
          </div>
          Travel4Pennies
        </button>

        {/* Nav links */}
        <ul className="hidden md:flex items-center gap-6">
          {links.map(({ label, path }) => (
            <li key={label}>
              <button
                onClick={() => navigate(path)}
                className={`text-sm font-medium transition ${
                  location.pathname === path
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 flex items-center gap-1 cursor-pointer hover:text-gray-800 transition">
            🌐 USD ▾
          </span>
          <button className="text-sm font-medium text-gray-600 hover:text-blue-600 transition px-3 py-1.5">
            Log in
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
}
