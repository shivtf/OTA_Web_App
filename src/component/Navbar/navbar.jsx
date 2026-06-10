import React from "react";
import {
  Plane,
  Hotel,
  Car,
  Gift,
  Search,
  Globe,
  ChevronDown,
  ArrowLeftRight,
  Calendar,
  Users,
  Shield,
  Tag,
  Zap,
  Headphones,
  CalendarCheck,
  Star,
  Heart,
  ChevronRight,
  Mail,
  CheckCircle,
  Clock,
  CreditCard,
  Lock,
  LifeBuoy,
} from "lucide-react";

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-xl text-blue-600">
          <Plane className="w-5 h-5" />
          <span>Travel4Pennies</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          {["Home", "Flights", "Hotels", "Cars", "Contact us"].map((item) => (
            <a
              key={item}
              href={item}
              className="hover:text-blue-600 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden md:flex items-center gap-1 text-sm text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
            <Globe className="w-4 h-4" /> USD{" "}
            <ChevronDown className="w-3 h-3" />
          </button>
          <button className="text-sm px-4 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
            Log in
          </button>
          <button className="text-sm px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            Sign up
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
