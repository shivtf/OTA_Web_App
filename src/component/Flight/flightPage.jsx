import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  ArrowLeftRight,
  Calendar,
  Users,
  ChevronDown,
  Search,
  SlidersHorizontal,
  Wifi,
  Zap,
  Star,
  ChevronRight,
  Info,
  AlertTriangle,
} from "lucide-react";
import Navbar from "../Navbar/navbar";

const ALL_FLIGHTS = [
  {
    id: 1,
    airline: "JetBlue",
    code: "B6",
    flightNo: "B6 709",
    color: "#003876",
    dep: "12:45",
    arr: "16:20",
    depCode: "JFK",
    arrCode: "LAX",
    duration: "5h 35m",
    stops: "Nonstop",
    amenities: ["wifi"],
    seats: "6 seats available",
    rating: 9.3,
    ratingLabel: "Excellent",
    price: 167,
    bestValue: true,
    urgency: null,
    details: {
      depFull: "12:45 · JFK",
      depAirport: "John F. Kennedy Intl. · Terminal 5",
      arrFull: "16:20 · LAX",
      arrAirport: "Los Angeles Intl. · Terminal 3",
      aircraft: "B6 709 · Airbus A320",
      class: "Economy",
      duration: "5h 35m",
    },
  },
  {
    id: 2,
    airline: "Delta",
    code: "DL",
    flightNo: "DL 402",
    color: "#E31837",
    dep: "06:00",
    arr: "09:10",
    depCode: "JFK",
    arrCode: "LAX",
    duration: "5h 10m",
    stops: "Nonstop",
    amenities: ["wifi", "power"],
    seats: null,
    rating: 9.1,
    ratingLabel: "Excellent",
    price: 189,
    bestValue: false,
    urgency: "Only 4 seats left",
    details: {
      depFull: "06:00 · JFK",
      depAirport: "John F. Kennedy Intl. · Terminal 4",
      arrFull: "09:10 · LAX",
      arrAirport: "Los Angeles Intl. · Terminal B",
      aircraft: "DL 402 · Boeing 737",
      class: "Economy",
      duration: "5h 10m",
    },
  },
  {
    id: 3,
    airline: "United",
    code: "UA",
    flightNo: "UA 521",
    color: "#004687",
    dep: "09:15",
    arr: "14:30",
    depCode: "JFK",
    arrCode: "LAX",
    duration: "6h 15m",
    stops: "1 stop · ORD",
    amenities: ["wifi"],
    seats: "8 seats available",
    rating: 8.7,
    ratingLabel: "Very Good",
    price: 212,
    bestValue: false,
    urgency: null,
    details: {
      depFull: "09:15 · JFK",
      depAirport: "John F. Kennedy Intl. · Terminal 7",
      arrFull: "14:30 · LAX",
      arrAirport: "Los Angeles Intl. · Terminal 7",
      aircraft: "UA 521 · Boeing 757",
      class: "Economy",
      duration: "6h 15m",
    },
  },
  {
    id: 4,
    airline: "American",
    code: "AA",
    flightNo: "AA 138",
    color: "#B11116",
    dep: "07:40",
    arr: "16:05",
    depCode: "JFK",
    arrCode: "LAX",
    duration: "8h 25m",
    stops: "1 stop · DFW",
    amenities: [],
    seats: "12 seats available",
    rating: 8.2,
    ratingLabel: "Very Good",
    price: 156,
    bestValue: false,
    urgency: null,
    details: {
      depFull: "07:40 · JFK",
      depAirport: "John F. Kennedy Intl. · Terminal 8",
      arrFull: "16:05 · LAX",
      arrAirport: "Los Angeles Intl. · Terminal 4",
      aircraft: "AA 138 · Boeing 737",
      class: "Economy",
      duration: "8h 25m",
    },
  },
  {
    id: 5,
    airline: "Southwest",
    code: "WN",
    flightNo: "WN 2401",
    color: "#304CB2",
    dep: "10:20",
    arr: "18:45",
    depCode: "JFK",
    arrCode: "LAX",
    duration: "7h 25m",
    stops: "1 stop · MDW",
    amenities: ["wifi"],
    seats: "5 seats available",
    rating: 7.9,
    ratingLabel: "Good",
    price: 189,
    bestValue: false,
    urgency: null,
    details: {
      depFull: "10:20 · JFK",
      depAirport: "John F. Kennedy Intl. · Terminal 2",
      arrFull: "18:45 · LAX",
      arrAirport: "Los Angeles Intl. · Terminal 1",
      aircraft: "WN 2401 · Boeing 737",
      class: "Economy",
      duration: "7h 25m",
    },
  },
  {
    id: 6,
    airline: "Alaska",
    code: "AS",
    flightNo: "AS 310",
    color: "#00539B",
    dep: "14:10",
    arr: "22:35",
    depCode: "JFK",
    arrCode: "LAX",
    duration: "5h 25m",
    stops: "Nonstop",
    amenities: ["wifi", "power"],
    seats: "3 seats available",
    rating: 8.9,
    ratingLabel: "Excellent",
    price: 198,
    bestValue: false,
    urgency: "Only 3 seats left",
    details: {
      depFull: "14:10 · JFK",
      depAirport: "John F. Kennedy Intl. · Terminal 7",
      arrFull: "22:35 · LAX",
      arrAirport: "Los Angeles Intl. · Terminal 6",
      aircraft: "AS 310 · Boeing 737",
      class: "Economy",
      duration: "5h 25m",
    },
  },
  {
    id: 7,
    airline: "JetBlue",
    code: "B6",
    flightNo: "B6 915",
    color: "#003876",
    dep: "18:30",
    arr: "02:15",
    depCode: "JFK",
    arrCode: "LAX",
    duration: "6h 45m",
    stops: "Nonstop",
    amenities: ["wifi"],
    seats: "10 seats available",
    rating: 8.5,
    ratingLabel: "Very Good",
    price: 145,
    bestValue: false,
    urgency: null,
    details: {
      depFull: "18:30 · JFK",
      depAirport: "John F. Kennedy Intl. · Terminal 5",
      arrFull: "02:15 · LAX",
      arrAirport: "Los Angeles Intl. · Terminal 3",
      aircraft: "B6 915 · Airbus A321",
      class: "Economy",
      duration: "6h 45m",
    },
  },
];

const AIRLINES_LIST = [
  "Delta",
  "United",
  "American",
  "JetBlue",
  "Southwest",
  "Alaska",
];
const SORT_OPTIONS = ["Price", "Depart", "Duration", "Rating"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" },
  }),
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatWeekday = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
};

// ─── Custom Calendar Picker ───────────────────────────────────────────────────
function CalendarPicker({ value, onChange, label, minDate }) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() =>
    value
      ? new Date(value + "T00:00:00").getFullYear()
      : new Date().getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(() =>
    value ? new Date(value + "T00:00:00").getMonth() : new Date().getMonth(),
  );

  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const today = new Date().toISOString().split("T")[0];

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const selectDay = (day) => {
    const d = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (minDate && d < minDate) return;
    onChange(d);
    setOpen(false);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectedDay = value ? new Date(value + "T00:00:00").getDate() : null;
  const isSelectedMonth =
    value &&
    new Date(value + "T00:00:00").getMonth() === viewMonth &&
    new Date(value + "T00:00:00").getFullYear() === viewYear;

  return (
    <div className="relative">
      <label className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1 block">
        {label}
      </label>
      <div
        onClick={() => setOpen(!open)}
        className={`border rounded-xl px-3 py-2.5 flex items-center justify-between cursor-pointer bg-gray-50 transition ${
          open
            ? "border-blue-400 ring-2 ring-blue-100"
            : "border-gray-200 hover:border-blue-400"
        }`}
      >
        <div>
          <div className="font-semibold text-sm text-gray-800">
            {value ? formatDate(value) : "Select date"}
          </div>
          <div className="text-xs text-gray-400">
            {value ? formatWeekday(value) : "—"}
          </div>
        </div>
        <Calendar
          className={`w-4 h-4 transition-colors ${open ? "text-blue-500" : "text-gray-400"}`}
        />
      </div>

      {open && (
        <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[999] p-4 w-72">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-blue-600 transition font-bold text-lg"
            >
              ‹
            </button>
            <span className="font-bold text-sm text-gray-800">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-blue-600 transition font-bold text-lg"
            >
              ›
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-bold text-gray-400 py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isSelected = isSelectedMonth && day === selectedDay;
              const isToday = dateStr === today;
              const isPast = minDate && dateStr < minDate;
              return (
                <button
                  key={day}
                  onClick={() => selectDay(day)}
                  disabled={isPast}
                  className={`h-9 w-9 mx-auto rounded-xl text-sm font-medium transition
                    ${isPast ? "text-gray-300 cursor-not-allowed" : "hover:bg-blue-50 hover:text-blue-600 cursor-pointer"}
                    ${isSelected ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white shadow-md" : ""}
                    ${isToday && !isSelected ? "border-2 border-blue-400 text-blue-600 font-bold" : ""}
                    ${!isSelected && !isToday && !isPast ? "text-gray-700" : ""}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="text-xs text-gray-400 hover:text-red-500 transition font-medium"
            >
              Clear
            </button>
            <button
              onClick={() => {
                onChange(today);
                setViewMonth(new Date().getMonth());
                setViewYear(new Date().getFullYear());
                setOpen(false);
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FlightsPage() {
  // Search state
  const [from, setFrom] = useState("New York (JFK)");
  const [to, setTo] = useState("Los Angeles (LAX)");
  const [depart, setDepart] = useState("2025-05-24");
  const [returnDate, setReturnDate] = useState("2025-05-31");
  const [showReturn, setShowReturn] = useState(false);
  const [returnChecked, setReturnChecked] = useState(false);
  const [searched, setSearched] = useState(true);

  // Travelers state
  const [showTravelers, setShowTravelers] = useState(false);
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [numInfants, setNumInfants] = useState(0);
  const [travelClass, setTravelClass] = useState("Economy");

  // Filter state
  const [activeSort, setActiveSort] = useState("Rating");
  const [maxPrice, setMaxPrice] = useState(420);
  const [stops, setStops] = useState({
    Nonstop: true,
    "1 stop": true,
    "2+ stops": false,
  });
  const [airlines, setAirlines] = useState({
    Delta: true,
    United: true,
    American: true,
    JetBlue: true,
    Southwest: true,
    Alaska: true,
  });
  const [expandedId, setExpandedId] = useState(null);

  const toggleStop = (s) => setStops((p) => ({ ...p, [s]: !p[s] }));
  const toggleAirline = (a) => setAirlines((p) => ({ ...p, [a]: !p[a] }));

  const totalTravelers = numAdults + numChildren + numInfants;

  const handleSearch = () => {
    setShowTravelers(false);
    setSearched(true);
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  // Filter + sort
  const filtered = ALL_FLIGHTS.filter((f) => f.price <= maxPrice)
    .filter((f) => {
      const stopKey =
        f.stops === "Nonstop"
          ? "Nonstop"
          : f.stops.startsWith("1")
            ? "1 stop"
            : "2+ stops";
      return stops[stopKey];
    })
    .filter((f) => airlines[f.airline])
    .sort((a, b) => {
      if (activeSort === "Price") return a.price - b.price;
      if (activeSort === "Rating") return b.rating - a.rating;
      if (activeSort === "Duration") {
        const toMins = (d) => {
          const [h, m] = d.match(/\d+/g);
          return parseInt(h) * 60 + parseInt(m);
        };
        return toMins(a.duration) - toMins(b.duration);
      }
      if (activeSort === "Depart") return a.dep.localeCompare(b.dep);
      return 0;
    });

  const bestFlight = ALL_FLIGHTS.find((f) => f.bestValue);

  return (
    <div className="min-h-screen bg-[#f1f3f6] font-sans text-gray-900">
      <Navbar />

      {/* ── HERO SEARCH SECTION ─────────────────────────────────────── */}
      <section className="relative bg-[#0f1923] pt-8 pb-10">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center 60%",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1923]/80 to-[#0f1923]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="mb-6"
          >
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5" /> Find your flight
            </p>
            <h1 className="text-white text-3xl font-extrabold">
              Search hundreds of airlines — pay less.
            </h1>
          </motion.div>

          {/* SEARCH CARD */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="bg-white rounded-2xl shadow-2xl p-5 overflow-visible"
          >
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-3 items-end mb-4 ${showReturn ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}
            >
              {/* FROM */}
              <div
                className={`relative z-10 ${showReturn ? "lg:col-span-1" : "lg:col-span-1"}`}
              >
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1 block">
                  From
                </label>
                <div className="border border-gray-200 rounded-xl px-3 py-2.5 hover:border-blue-400 transition cursor-pointer bg-gray-50">
                  <div className="font-semibold text-sm text-gray-800">
                    {from}
                  </div>
                  <div className="text-xs text-gray-400">
                    {from.match(/\(([^)]+)\)/)?.[1] || "JFK"}
                  </div>
                </div>
                <button
                  onClick={handleSwap}
                  className="hidden lg:flex absolute -right-4 top-8 z-20 w-7 h-7 rounded-full border border-gray-200 bg-white items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition shadow-sm"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
                </button>
              </div>
              {/* TO */}
              <div
                className={`${showReturn ? "lg:col-span-1" : "lg:col-span-1"}`}
              >
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1 block">
                  To
                </label>
                <div className="border border-gray-200 rounded-xl px-3 py-2.5 hover:border-blue-400 transition cursor-pointer bg-gray-50">
                  <div className="font-semibold text-sm text-gray-800">
                    {to}
                  </div>
                  <div className="text-xs text-gray-400">
                    {to.match(/\(([^)]+)\)/)?.[1] || "LAX"}
                  </div>
                </div>
              </div>
              {/* DEPART */}
              <CalendarPicker
                label="Depart"
                value={depart}
                onChange={setDepart}
                minDate={new Date().toISOString().split("T")[0]}
              />
              {/* RETURN */}
              {showReturn && (
                <CalendarPicker
                  label="Return"
                  value={returnDate}
                  onChange={setReturnDate}
                  minDate={depart || new Date().toISOString().split("T")[0]}
                />
              )}
              {/* TRAVELERS & CLASS */}
              <div className="relative">
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1 block">
                  Travelers & Class
                </label>
                <div
                  onClick={() => setShowTravelers(!showTravelers)}
                  className={`border rounded-xl px-3 py-2.5 flex items-center justify-between cursor-pointer bg-gray-50 transition ${
                    showTravelers
                      ? "border-blue-400 ring-2 ring-blue-100"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-800">
                      {totalTravelers} Traveler{totalTravelers > 1 ? "s" : ""},{" "}
                      {travelClass}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${showTravelers ? "rotate-180" : ""}`}
                  />
                </div>

                {showTravelers && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[999] p-4">
                    {/* Adults */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Adults
                        </p>
                        <p className="text-xs text-gray-400">Age 12+</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setNumAdults(Math.max(1, numAdults - 1))
                          }
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-blue-400 hover:text-blue-600 font-bold text-gray-600 transition"
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold w-4 text-center">
                          {numAdults}
                        </span>
                        <button
                          onClick={() =>
                            setNumAdults(Math.min(9, numAdults + 1))
                          }
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-blue-400 hover:text-blue-600 font-bold text-gray-600 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Children
                        </p>
                        <p className="text-xs text-gray-400">Age 2–11</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setNumChildren(Math.max(0, numChildren - 1))
                          }
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-blue-400 hover:text-blue-600 font-bold text-gray-600 transition"
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold w-4 text-center">
                          {numChildren}
                        </span>
                        <button
                          onClick={() =>
                            setNumChildren(Math.min(9, numChildren + 1))
                          }
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-blue-400 hover:text-blue-600 font-bold text-gray-600 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Infants
                        </p>
                        <p className="text-xs text-gray-400">Under 2</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setNumInfants(Math.max(0, numInfants - 1))
                          }
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-blue-400 hover:text-blue-600 font-bold text-gray-600 transition"
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold w-4 text-center">
                          {numInfants}
                        </span>
                        <button
                          onClick={() =>
                            setNumInfants(Math.min(numAdults, numInfants + 1))
                          }
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-blue-400 hover:text-blue-600 font-bold text-gray-600 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 mb-3" />

                    {/* Class */}
                    <div>
                      <span className="text-sm font-medium text-gray-700 block mb-2">
                        Class
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {["Economy", "Premium", "Business", "First"].map(
                          (c) => (
                            <button
                              key={c}
                              onClick={() => setTravelClass(c)}
                              className={`text-xs py-2 rounded-lg border font-medium transition ${
                                travelClass === c
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600"
                              }`}
                            >
                              {c}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setShowTravelers(false)}
                      className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-xl transition"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-blue-600"
                  checked={returnChecked}
                  onChange={(e) => {
                    setReturnChecked(e.target.checked);
                    setShowReturn(e.target.checked);
                    if (!e.target.checked) setReturnDate("");
                  }}
                />
                Add return trip
              </label>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSearch}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg shadow-blue-600/30"
              >
                <Search className="w-4 h-4" /> Search flights
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── RESULTS SECTION ─────────────────────────────────────────── */}
      <AnimatePresence>
        {searched && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-5 items-start"
          >
            {/* FILTERS SIDEBAR */}
            <aside className="w-64 shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-base">Filters</h3>
                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              </div>

              <div className="mb-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Stops
                </p>
                {["Nonstop", "1 stop", "2+ stops"].map((s) => (
                  <label
                    key={s}
                    className="flex items-center gap-2.5 mb-2.5 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={stops[s]}
                      onChange={() => toggleStop(s)}
                      className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-blue-600 transition">
                      {s}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mb-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Max Price
                </p>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">$0</span>
                  <span className="text-blue-600 font-bold">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min={80}
                  max={600}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="mb-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Airlines
                </p>
                {AIRLINES_LIST.map((a) => (
                  <label
                    key={a}
                    className="flex items-center gap-2.5 mb-2.5 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={airlines[a]}
                      onChange={() => toggleAirline(a)}
                      className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-blue-600 transition">
                      {a}
                    </span>
                  </label>
                ))}
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Departure Time
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {["Morning", "Afternoon", "Evening", "Night"].map((t) => (
                    <button
                      key={t}
                      className="text-xs border border-gray-200 rounded-lg py-2 px-2 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition font-medium"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* FLIGHT LIST */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-bold text-lg">
                    {filtered.length} flights found
                  </span>
                  <span className="text-gray-400 text-sm ml-2">
                    · JFK → LAX · {depart ? formatDate(depart) : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                  {SORT_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSort(s)}
                      className={`text-sm font-medium px-4 py-1.5 rounded-lg transition ${
                        activeSort === s
                          ? "bg-blue-600 text-white shadow"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {bestFlight && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-blue-500 fill-blue-500" />
                  <span className="text-sm text-blue-700 font-medium">
                    Best value: {bestFlight.airline} {bestFlight.flightNo} at $
                    {bestFlight.price} — nonstop
                  </span>
                </div>
              )}

              <div className="space-y-3">
                {filtered.length === 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                    <Plane className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="font-semibold text-gray-500">
                      No flights match your filters.
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting the price or airline filters.
                    </p>
                  </div>
                )}

                {filtered.map((f, idx) => {
                  const isExpanded = expandedId === f.id;
                  return (
                    <motion.div
                      key={f.id}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                      custom={idx * 0.5}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                    >
                      <div className="flex items-center gap-4 px-5 py-4">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                          style={{ backgroundColor: f.color }}
                        >
                          {f.code}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 mb-0.5">
                            {f.airline} · {f.flightNo}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold">{f.dep}</span>
                            <div className="flex items-center gap-1.5 flex-1">
                              <div className="flex-1 border-t border-dashed border-gray-300" />
                              <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-400">
                                  {f.duration}
                                </span>
                                <Plane className="w-3.5 h-3.5 text-gray-400" />
                                <span
                                  className={`text-xs font-semibold ${f.stops === "Nonstop" ? "text-green-600" : "text-orange-500"}`}
                                >
                                  {f.stops}
                                </span>
                              </div>
                              <div className="flex-1 border-t border-dashed border-gray-300" />
                            </div>
                            <span className="text-2xl font-bold">{f.arr}</span>
                            <span className="text-sm font-medium text-gray-500 ml-1">
                              {f.arrCode}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 min-w-[140px]">
                          <div className="flex items-center justify-end gap-2 mb-1">
                            {f.amenities.includes("wifi") && (
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Wifi className="w-3.5 h-3.5" /> Wi-Fi
                              </span>
                            )}
                            {f.amenities.includes("power") && (
                              <span className="flex items-center gap-1 text-xs text-amber-500">
                                <Zap className="w-3.5 h-3.5" /> Power
                              </span>
                            )}
                          </div>
                          {f.urgency ? (
                            <p className="text-xs text-orange-500 flex items-center justify-end gap-1 mb-1">
                              <AlertTriangle className="w-3 h-3" /> {f.urgency}
                            </p>
                          ) : (
                            f.seats && (
                              <p className="text-xs text-gray-400 mb-1">
                                {f.seats}
                              </p>
                            )
                          )}
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                              {f.rating}
                            </span>
                            <span className="text-xs text-gray-500">
                              {f.ratingLabel}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 text-right pl-4 border-l border-gray-100 ml-2">
                          <p className="text-2xl font-extrabold text-gray-900">
                            ${f.price}
                          </p>
                          <p className="text-xs text-gray-400 mb-2">
                            per person
                          </p>
                          <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition w-full justify-center">
                            Select <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setExpandedId(isExpanded ? null : f.id)
                            }
                            className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1.5 mx-auto"
                          >
                            <Info className="w-3 h-3" />
                            {isExpanded ? "Hide details" : "Flight details"}
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && f.details && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="border-t border-gray-100 bg-gray-50 px-5 py-4 overflow-hidden"
                          >
                            <div className="grid grid-cols-3 gap-6 text-sm">
                              <div>
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">
                                  Departure
                                </p>
                                <p className="font-bold text-base">
                                  {f.details.depFull}
                                </p>
                                <p className="text-gray-500 text-xs mt-0.5">
                                  {f.details.depAirport}
                                </p>
                              </div>
                              <div className="text-center flex flex-col items-center justify-center">
                                <p className="text-xs text-gray-400 mb-1">
                                  ⏱ {f.details.duration} · {f.details.class}
                                </p>
                                <div className="flex items-center gap-2 w-full">
                                  <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                                  <div className="flex-1 border-t-2 border-blue-400" />
                                  <Plane className="w-4 h-4 text-blue-500" />
                                  <div className="flex-1 border-t-2 border-blue-400" />
                                  <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                  {f.details.aircraft}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">
                                  Arrival
                                </p>
                                <p className="font-bold text-base">
                                  {f.details.arrFull}
                                </p>
                                <p className="text-gray-500 text-xs mt-0.5">
                                  {f.details.arrAirport}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
