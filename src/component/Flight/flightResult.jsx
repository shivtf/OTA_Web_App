import { useState } from "react";
import {
  Plane,
  ArrowLeftRight,
  SlidersHorizontal,
  Wifi,
  Zap,
  Star,
  ChevronRight,
  Info,
  AlertTriangle,
} from "lucide-react";

const flights = [
  {
    id: 1,
    airline: "JetBlue",
    code: "B6",
    flightNo: "B6 709",
    color: "#003876",
    dep: "12:45",
    arr: "16:20",
    depCode: "LAX",
    arrCode: "JFK",
    duration: "5h 35m",
    stops: "Nonstop",
    amenities: ["wifi"],
    seats: "6 seats available",
    rating: 9.3,
    ratingLabel: "Excellent",
    price: 167,
    bestValue: true,
    urgency: null,
  },
  {
    id: 2,
    airline: "Delta",
    code: "DL",
    flightNo: "DL 402",
    color: "#E31837",
    dep: "06:00",
    arr: "09:10",
    depCode: "LAX",
    arrCode: "JFK",
    duration: "5h 10m",
    stops: "Nonstop",
    amenities: ["wifi", "power"],
    seats: null,
    rating: 9.1,
    ratingLabel: "Excellent",
    price: 189,
    bestValue: false,
    urgency: "Only 4 seats left",
    expanded: true,
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
    depCode: "LAX",
    arrCode: "JFK",
    duration: "6h 15m",
    stops: "1 stop · ORD",
    amenities: ["wifi"],
    seats: "8 seats available",
    rating: 8.7,
    ratingLabel: "Very Good",
    price: 212,
    bestValue: false,
    urgency: null,
  },
  {
    id: 4,
    airline: "American",
    code: "AA",
    flightNo: "AA 138",
    color: "#B11116",
    dep: "07:40",
    arr: "16:05",
    depCode: "LAX",
    arrCode: "JFK",
    duration: "8h 25m",
    stops: "1 stop · DFW",
    amenities: [],
    seats: "12 seats available",
    rating: 8.2,
    ratingLabel: "Very Good",
    price: 156,
    bestValue: false,
    urgency: null,
  },
  {
    id: 5,
    airline: "Southwest",
    code: "WN",
    flightNo: "WN 2401",
    color: "#304CB2",
    dep: "10:20",
    arr: "18:45",
    depCode: "LAX",
    arrCode: "JFK",
    duration: "7h 25m",
    stops: "1 stop · MDW",
    amenities: ["wifi"],
    seats: "5 seats available",
    rating: 7.9,
    ratingLabel: "Good",
    price: 189,
    bestValue: false,
    urgency: null,
  },
  {
    id: 6,
    airline: "Alaska",
    code: "AS",
    flightNo: "AS 310",
    color: "#00539B",
    dep: "14:10",
    arr: "22:35",
    depCode: "LAX",
    arrCode: "JFK",
    duration: "5h 25m",
    stops: "Nonstop",
    amenities: ["wifi", "power"],
    seats: "3 seats available",
    rating: 8.9,
    ratingLabel: "Excellent",
    price: 198,
    bestValue: false,
    urgency: "Only 3 seats left",
  },
  {
    id: 7,
    airline: "JetBlue",
    code: "B6",
    flightNo: "B6 915",
    color: "#003876",
    dep: "18:30",
    arr: "02:15",
    depCode: "LAX",
    arrCode: "JFK",
    duration: "6h 45m",
    stops: "Nonstop",
    amenities: ["wifi"],
    seats: "10 seats available",
    rating: 8.5,
    ratingLabel: "Very Good",
    price: 145,
    bestValue: false,
    urgency: null,
  },
];

const SORT_OPTIONS = ["Price", "Depart", "Duration", "Rating"];
const AIRLINES_LIST = [
  "Delta",
  "United",
  "American",
  "JetBlue",
  "Southwest",
  "Alaska",
];

export default function FlightResults() {
  const [activeSort, setActiveSort] = useState("Rating");
  const [maxPrice, setMaxPrice] = useState(420);
  const [stops, setStops] = useState({
    Nonstop: true,
    "1 stop": true,
    "2+ stops": false,
  });
  const [airlines, setAirlines] = useState({
    Delta: true,
    United: false,
    American: false,
    JetBlue: false,
    Southwest: false,
    Alaska: false,
  });
  const [expandedId, setExpandedId] = useState(2);

  const toggleStop = (s) => setStops((p) => ({ ...p, [s]: !p[s] }));
  const toggleAirline = (a) => setAirlines((p) => ({ ...p, [a]: !p[a] }));

  const bestFlight = flights.find((f) => f.bestValue);

  return (
    <div className="min-h-screen bg-[#f1f3f6] font-sans text-gray-900">
      {/* TOP NAV */}
      <nav className="bg-[#0f1923] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            Travel4Pennies
          </div>
          <div className="flex items-center gap-3">
            <button className="text-white/70 text-sm font-medium hover:text-white transition px-3 py-1.5">
              Log in
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">
              Sign up
            </button>
          </div>
        </div>

        {/* SEARCH BAR STRIP */}
        <div className="bg-[#18232f] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-0 h-14">
            <div className="flex items-center gap-2 flex-1 text-white">
              <span className="font-bold text-base">New York</span>
              <span className="text-white/50 text-sm">JFK</span>
              <ArrowLeftRight className="w-4 h-4 text-blue-400 mx-1" />
              <span className="font-bold text-base">Los Angeles</span>
              <span className="text-white/50 text-sm">LAX</span>
              <span className="text-white/30 mx-3">|</span>
              <span className="text-white/70 text-sm">Jun 24 – Jul 1</span>
              <span className="text-white/30 mx-3">|</span>
              <span className="text-white/70 text-sm">1 Adult</span>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition ml-4">
              Modify search <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-5 items-start">
        {/* FILTERS SIDEBAR */}
        <aside className="w-72 shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-28">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base">Filters</h3>
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          </div>

          {/* STOPS */}
          <div className="mb-6">
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
                  className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition">
                  {s}
                </span>
              </label>
            ))}
          </div>

          {/* MAX PRICE */}
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Max Price
            </p>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">$0</span>
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

          {/* AIRLINES */}
          <div className="mb-6">
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
                  className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition">
                  {a}
                </span>
              </label>
            ))}
          </div>

          {/* DEPARTURE TIME */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Departure Time
            </p>
            <div className="grid grid-cols-2 gap-2">
              {["Morning", "Afternoon", "Evening", "Night"].map((t) => (
                <button
                  key={t}
                  className="text-xs border border-gray-200 rounded-lg py-2 px-3 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition font-medium"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RESULTS */}
        <div className="flex-1 min-w-0">
          {/* HEADER ROW */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-bold text-lg">7 flights found</span>
              <span className="text-gray-400 text-sm ml-2">
                · JFK → LAX · Jun 24
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

          {/* BEST VALUE BANNER */}
          {bestFlight && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-blue-500 fill-blue-500" />
              <span className="text-sm text-blue-700 font-medium">
                Best value: {bestFlight.airline} {bestFlight.flightNo} at $
                {bestFlight.price} — nonstop
              </span>
            </div>
          )}

          {/* FLIGHT CARDS */}
          <div className="space-y-3">
            {flights.map((f) => {
              const isExpanded = expandedId === f.id;
              return (
                <div
                  key={f.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="flex items-center gap-4 px-5 py-4">
                    {/* AIRLINE LOGO */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ backgroundColor: f.color }}
                    >
                      {f.code}
                    </div>

                    {/* FLIGHT INFO */}
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

                    {/* AMENITIES + RATING */}
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

                    {/* PRICE + SELECT */}
                    <div className="shrink-0 text-right pl-4 border-l border-gray-100 ml-2">
                      <p className="text-2xl font-extrabold text-gray-900">
                        ${f.price}
                      </p>
                      <p className="text-xs text-gray-400 mb-2">per person</p>
                      <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition w-full justify-center">
                        Select <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : f.id)}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1.5 mx-auto"
                      >
                        <Info className="w-3 h-3" />
                        {isExpanded ? "Hide details" : "Flight details"}
                      </button>
                    </div>
                  </div>

                  {/* EXPANDED DETAILS */}
                  {isExpanded && f.details && (
                    <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
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
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
