import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hotel,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Users,
  MapPin,
  Heart,
  ChevronRight,
  Wifi,
  Coffee,
  Waves,
  Dumbbell,
  UtensilsCrossed,
  SlidersHorizontal,
  AlertTriangle,
  Star,
  X,
  Calendar,
  Loader2,
  Building2,
  ParkingCircle,
  ConciergeBell,
  Shirt,
  Sofa,
  PawPrint,
  Sparkles,
  Clock,
  Briefcase,
  BabyIcon,
} from "lucide-react";
import Navbar from "../Navbar/navbar";

// ── Config ────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// ── Amenity map — covers all Duffel amenity types ─────────────────────────
const AMENITY_ICONS = {
  wifi: { icon: Wifi, label: "Wi-Fi" },
  pool: { icon: Waves, label: "Pool" },
  gym: { icon: Dumbbell, label: "Gym" },
  breakfast: { icon: Coffee, label: "Breakfast" },
  restaurant: { icon: UtensilsCrossed, label: "Restaurant" },
  parking: { icon: ParkingCircle, label: "Parking" },
  spa: { icon: Sparkles, label: "Spa" },
  room_service: { icon: ConciergeBell, label: "Room Service" },
  laundry: { icon: Shirt, label: "Laundry" },
  lounge: { icon: Sofa, label: "Lounge" },
  pets_allowed: { icon: PawPrint, label: "Pets Allowed" },
  concierge: { icon: ConciergeBell, label: "Concierge" },
  business_centre: { icon: Briefcase, label: "Business Centre" },
  childcare_service: { icon: BabyIcon, label: "Childcare" },
  "24_hour_front_desk": { icon: Clock, label: "24h Front Desk" },
};

// Amenities shown in the sidebar filter (common ones)
const FILTER_AMENITIES = [
  "wifi",
  "pool",
  "gym",
  "breakfast",
  "restaurant",
  "parking",
  "spa",
];

// ── Helpers ───────────────────────────────────────────────────────────────
function getRatingLabel(score) {
  if (!score) return "No rating";
  if (score >= 9.3) return "Exceptional";
  if (score >= 9.0) return "Excellent";
  if (score >= 8.5) return "Very Good";
  if (score >= 7.5) return "Good";
  return "Fair";
}

function normalizeHotel(h) {
  const amenityKeys = (h.amenities || []).map((a) => a.type);
  const price = h.cheapestRate ? parseFloat(h.cheapestRate.totalAmount) : null;
  const address = h.address
    ? [h.address.line_one, h.address.city_name, h.address.country_code]
        .filter(Boolean)
        .join(", ")
    : "Address not available";
  const city = h.address?.city_name || "";
  const country = h.address?.country_code || "";
  const location = [city, country].filter(Boolean).join(", ");

  return {
    id: h.resultId || h.accommodationsId,
    accommodationsId: h.accommodationsId,
    name: h.name,
    location,
    address,
    rating: h.reviewScore || null,
    ratingLabel: getRatingLabel(h.reviewScore),
    stars: h.starRating || 0,
    price,
    currency: h.cheapestRate?.currency || "USD",
    dueAtProperty: h.cheapestRate?.dueAtAccommodation
      ? parseFloat(h.cheapestRate.dueAtAccommodation)
      : null,
    amenities: amenityKeys,
    amenityObjects: h.amenities || [],
    photos: h.photos || [],
    checkInInfo: h.checkInInfo || null,
    keyCollection: h.keyCollection || null,
    expiresAt: h.expiresAt,
    // No urgency/badge data from API — derive if needed
    urgency: false,
    rooms: null,
    badge: null,
  };
}

const SORT_OPTIONS = ["Price", "Rating", "Stars", "Name"];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: "easeOut" },
  }),
};

// ── Custom Calendar Picker ────────────────────────────────────────────────
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

function CalendarPicker({ value, onChange, minDate, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const parsed = value ? new Date(value + "T00:00:00") : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(
    parsed ? parsed.getFullYear() : today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    parsed ? parsed.getMonth() : today.getMonth(),
  );

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const minD = minDate ? new Date(minDate + "T00:00:00") : today;
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  function select(d) {
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    onChange(iso);
    setOpen(false);
  }
  function goToday() {
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    onChange(iso);
    setOpen(false);
  }
  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  const formatDisplay = (iso) => {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  const dayName = (iso) => {
    if (!iso) return "";
    return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long",
    });
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++)
    cells.push({ day: prevMonthDays - firstDay + 1 + i, other: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, other: false });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, other: true });

  return (
    <div className="relative" ref={ref}>
      <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`relative flex items-center border rounded-xl px-3.5 h-11 bg-white w-full text-left transition
          ${open ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200 hover:border-blue-400"}`}
      >
        <div className="flex-1 pointer-events-none">
          <div className="text-sm font-semibold text-gray-800 leading-tight">
            {value ? (
              formatDisplay(value)
            ) : (
              <span className="text-gray-400 font-normal">Select date</span>
            )}
          </div>
          {value && (
            <div className="text-[11px] text-gray-400">{dayName(value)}</div>
          )}
        </div>
        <Calendar
          className={`w-4 h-4 shrink-0 transition-colors ${open ? "text-blue-500" : "text-gray-400"}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.14 }}
            className="absolute top-full mt-2 left-0 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
            style={{ width: 272 }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-800">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={prevMonth}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 px-3 pt-3 pb-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div
                  key={d}
                  className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide py-1"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px px-3 pb-3">
              {cells.map((cell, i) => {
                if (cell.other)
                  return (
                    <div
                      key={i}
                      className="h-9 flex items-center justify-center text-[13px] text-gray-300"
                    >
                      {cell.day}
                    </div>
                  );
                const cellDate = new Date(viewYear, viewMonth, cell.day);
                const isToday = cellDate.getTime() === today.getTime();
                const isSelected =
                  value &&
                  cell.day === parsed?.getDate() &&
                  viewMonth === parsed?.getMonth() &&
                  viewYear === parsed?.getFullYear();
                const isDisabled = cellDate < minD;
                return (
                  <button
                    key={i}
                    onClick={() => !isDisabled && select(cell.day)}
                    disabled={isDisabled}
                    className={`relative h-9 rounded-lg text-[13px] font-medium transition
                      ${isSelected ? "bg-blue-600 text-white" : ""}
                      ${isToday && !isSelected ? "text-blue-600 font-semibold" : ""}
                      ${!isSelected && !isDisabled ? "hover:bg-blue-50 text-gray-800" : ""}
                      ${isDisabled ? "text-gray-300 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {cell.day}
                    {isToday && !isSelected && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100">
              <button
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="text-xs font-medium text-gray-400 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
              >
                Clear
              </button>
              <button
                onClick={goToday}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-50 transition"
              >
                Today
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────
function StarRow({ count }) {
  return (
    <div className="flex items-center gap-px">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < count ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
    </div>
  );
}

function RatingBadge({ value, label }) {
  if (!value) return null;
  const color =
    value >= 9.3
      ? "bg-emerald-600"
      : value >= 9.0
        ? "bg-blue-600"
        : value >= 8.5
          ? "bg-blue-500"
          : "bg-gray-500";
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span
        className={`${color} text-white text-sm font-bold w-9 h-9 rounded-xl flex items-center justify-center`}
      >
        {value}
      </span>
      <div className="text-right">
        <div className="text-xs font-semibold text-gray-700">{label}</div>
      </div>
    </div>
  );
}

function HotelPhoto({ photos, name }) {
  if (!photos?.length || !photos[0]?.url) {
    return (
      <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center gap-1">
        <Building2 className="w-8 h-8 text-gray-300" />
        <span className="text-[11px] text-gray-400">No photo</span>
      </div>
    );
  }
  return (
    <img
      src={photos[0].url}
      alt={name}
      className="w-full h-full object-cover"
    />
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function HotelsPage() {
  // Search inputs
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [roomCount, setRoomCount] = useState(1);
  const [radius, setRadius] = useState(10);
  const [showGuests, setShowGuests] = useState(false);

  // API state
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // UI filters (client-side on API results)
  const [liked, setLiked] = useState({});
  const [activeSort, setActiveSort] = useState("Rating");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [amenityFilter, setAmenityFilter] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const toggleAmenity = (a) =>
    setAmenityFilter((p) =>
      p.includes(a) ? p.filter((x) => x !== a) : [...p, a],
    );

  // ── Geocode destination to lat/lng if user typed a city ──────────────
  async function resolveCoords() {
    if (latitude && longitude)
      return { lat: parseFloat(latitude), lng: parseFloat(longitude) };
    if (!destination) throw new Error("Enter a destination or coordinates.");
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`,
    );
    const data = await res.json();
    if (!data.length)
      throw new Error(`Could not find coordinates for "${destination}".`);
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }

  // ── Search ────────────────────────────────────────────────────────────
  const handleSearch = useCallback(async () => {
    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setHotels([]);
    try {
      const { lat, lng } = await resolveCoords();
      const payload = {
        latitude: lat,
        longitude: lng,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        rooms: roomCount,
        guests: guestCount,
        radius,
      };
      const res = await fetch(`${BASE_URL}/stays/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Server error ${res.status}`);
      }
      const json = await res.json();
      const raw = json?.data?.hotels || [];
      setHotels(raw.map(normalizeHotel));
      // Auto-set max price slider to highest price in results
      const prices = raw
        .map((h) => parseFloat(h.cheapestRate?.totalAmount || 0))
        .filter(Boolean);
      if (prices.length) setMaxPrice(Math.ceil(Math.max(...prices) * 1.1));
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    checkIn,
    checkOut,
    guestCount,
    roomCount,
    radius,
    destination,
    latitude,
    longitude,
  ]);

  // ── Client-side filter + sort on API results ──────────────────────────
  const filtered = hotels
    .filter((h) => h.price === null || h.price <= maxPrice)
    .filter((h) => !h.rating || h.rating >= minRating)
    .filter((h) => amenityFilter.every((a) => h.amenities.includes(a)))
    .sort((a, b) => {
      if (activeSort === "Price")
        return (a.price ?? Infinity) - (b.price ?? Infinity);
      if (activeSort === "Rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (activeSort === "Stars") return (b.stars ?? 0) - (a.stars ?? 0);
      if (activeSort === "Name") return a.name.localeCompare(b.name);
      return 0;
    });

  const nightCount =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000),
        )
      : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
      <Navbar />

      {/* ── SEARCH BAR ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 shadow-sm mt-16">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="grid grid-cols-[1fr_180px_180px_190px_auto] gap-3 items-end">
            {/* Destination */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Destination
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 h-11 bg-white hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="City, address or hotel name"
                  className="flex-1 text-sm text-gray-800 outline-none placeholder-gray-400 bg-transparent"
                />
              </div>
            </div>

            {/* Check-in */}
            <CalendarPicker
              label="Check-in"
              value={checkIn}
              onChange={(v) => {
                setCheckIn(v);
                if (v && checkOut && v >= checkOut) setCheckOut("");
              }}
              minDate={new Date().toISOString().split("T")[0]}
            />

            {/* Check-out */}
            <CalendarPicker
              label="Check-out"
              value={checkOut}
              onChange={setCheckOut}
              minDate={checkIn || new Date().toISOString().split("T")[0]}
            />

            {/* Guests & Rooms */}
            <div className="relative">
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Guests & rooms
              </label>
              <button
                type="button"
                onClick={() => setShowGuests((p) => !p)}
                className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-3.5 h-11 bg-white hover:border-blue-400 transition text-left"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-800">
                    {guestCount} {guestCount === 1 ? "Guest" : "Guests"},{" "}
                    {roomCount} {roomCount === 1 ? "Room" : "Rooms"}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${showGuests ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {showGuests && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4 space-y-4"
                  >
                    {[
                      {
                        label: "Guests",
                        sub: "Adults & children",
                        val: guestCount,
                        set: setGuestCount,
                        min: 1,
                        max: 16,
                      },
                      {
                        label: "Rooms",
                        sub: "Number of rooms",
                        val: roomCount,
                        set: setRoomCount,
                        min: 1,
                        max: 10,
                      },
                    ].map(({ label, sub, val, set, min, max }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {label}
                          </p>
                          <p className="text-[11px] text-gray-400">{sub}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => set((p) => Math.max(min, p - 1))}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-400 hover:text-blue-600 transition font-bold text-lg leading-none"
                          >
                            −
                          </button>
                          <span className="w-5 text-center text-sm font-semibold text-gray-800">
                            {val}
                          </span>
                          <button
                            onClick={() => set((p) => Math.min(max, p + 1))}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-400 hover:text-blue-600 transition font-bold text-lg leading-none"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setShowGuests(false)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-xl transition"
                    >
                      Done
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search */}
            <div>
              <label className="block text-[11px] font-semibold text-transparent uppercase tracking-wider mb-1.5 select-none">
                &nbsp;
              </label>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSearch}
                disabled={loading}
                className="h-11 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-md shadow-blue-600/20 transition whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Searching…
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" /> Search
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Quick options row */}
          <div className="flex items-center gap-5 mt-3">
            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer select-none">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded accent-blue-600"
              />
              Include breakfast
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-blue-600"
              />
              Free cancellation only
            </label>
            <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Radius
              </span>
              <select
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-700 outline-none hover:border-blue-400 transition cursor-pointer"
              >
                {[2, 5, 10, 20, 50].map((r) => (
                  <option key={r} value={r}>
                    {r} km
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── ERROR BANNER ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-6 pt-4"
          >
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-auto">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RESULTS ─────────────────────────────────────────────────────── */}
      {(hasSearched || loading) && (
        <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6 items-start">
          {/* ── SIDEBAR ───────────────────────────────────────────────── */}
          <aside className="w-56 shrink-0 sticky top-6">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <SlidersHorizontal className="w-4 h-4 text-gray-500" />{" "}
                  Filters
                </div>
                <button
                  onClick={() => {
                    setMaxPrice(2000);
                    setMinRating(0);
                    setAmenityFilter([]);
                  }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Reset
                </button>
              </div>

              <div className="px-4 py-4 space-y-5">
                {/* Max Price */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      Max price total
                    </p>
                    <span className="text-sm font-bold text-blue-600">
                      ${maxPrice}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={maxPrice * 1.1}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="border-t border-gray-100" />

                {/* Min Rating */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      Min rating
                    </p>
                    <span className="text-sm font-bold text-blue-600">
                      {minRating > 0 ? `${minRating}+` : "Any"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={9.5}
                    step={0.5}
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>Any</span>
                    <span>9.5</span>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Amenities */}
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                    Amenities
                  </p>
                  <div className="space-y-2">
                    {FILTER_AMENITIES.map((key) => {
                      const meta = AMENITY_ICONS[key];
                      if (!meta) return null;
                      const { icon: Icon, label } = meta;
                      return (
                        <label
                          key={key}
                          className="flex items-center gap-2.5 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={amenityFilter.includes(key)}
                            onChange={() => toggleAmenity(key)}
                            className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                          />
                          <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition" />
                          <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">
                            {label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ── MAIN ──────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            {!loading && (
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-lg font-bold text-gray-900">
                    {filtered.length} hotel{filtered.length !== 1 ? "s" : ""}{" "}
                    found
                  </span>
                  {checkIn && checkOut && (
                    <span className="text-sm text-gray-400 ml-2">
                      · {formatDate(checkIn)} – {formatDate(checkOut)}
                      {nightCount &&
                        ` · ${nightCount} night${nightCount > 1 ? "s" : ""}`}
                      · {guestCount} {guestCount === 1 ? "guest" : "guests"}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-xl">
                  {SORT_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSort(s)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${activeSort === s ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active filter chips */}
            {(amenityFilter.length > 0 || minRating > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {minRating > 0 && (
                  <span className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-medium">
                    {minRating}+ rating{" "}
                    <button onClick={() => setMinRating(0)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {amenityFilter.map((a) => (
                  <span
                    key={a}
                    className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-medium"
                  >
                    {AMENITY_ICONS[a]?.label || a}
                    <button onClick={() => toggleAmenity(a)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-2xl h-48 flex overflow-hidden animate-pulse"
                  >
                    <div className="w-64 shrink-0 bg-gray-100" />
                    <div className="flex-1 p-5 space-y-3">
                      <div className="h-3 bg-gray-100 rounded w-24" />
                      <div className="h-4 bg-gray-100 rounded w-48" />
                      <div className="h-3 bg-gray-100 rounded w-36" />
                      <div className="flex gap-2 mt-4">
                        {[1, 2, 3].map((j) => (
                          <div
                            key={j}
                            className="h-5 bg-gray-100 rounded-full w-16"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="w-44 p-5 border-l border-gray-100 flex flex-col items-end gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-xl" />
                      <div className="h-7 bg-gray-100 rounded w-24 mt-auto" />
                      <div className="h-8 bg-gray-100 rounded-xl w-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && hasSearched && filtered.length === 0 && !error && (
              <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
                <Hotel className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-semibold text-gray-600">
                  {hotels.length === 0
                    ? "No hotels found in this area"
                    : "No hotels match your filters"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {hotels.length === 0
                    ? "Try expanding the search radius or changing dates."
                    : "Try widening the price range or removing an amenity filter."}
                </p>
              </div>
            )}

            {/* Hotel cards */}
            {!loading && (
              <div className="space-y-3">
                {filtered.map((h, idx) => {
                  const isExpanded = expandedId === h.id;
                  return (
                    <motion.div
                      key={h.id}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                      custom={idx}
                      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-shadow"
                    >
                      <div className="flex h-48">
                        {/* Image */}
                        <div className="relative w-64 shrink-0">
                          <HotelPhoto photos={h.photos} name={h.name} />
                          {h.badge && (
                            <span
                              className={`absolute top-3 left-3 ${h.badgeColor} text-white text-[11px] font-bold px-2.5 py-1 rounded-lg`}
                            >
                              {h.badge}
                            </span>
                          )}
                          <button
                            onClick={() =>
                              setLiked((p) => ({ ...p, [h.id]: !p[h.id] }))
                            }
                            aria-label={
                              liked[h.id] ? "Remove from saved" : "Save hotel"
                            }
                            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition"
                          >
                            <Heart
                              className={`w-4 h-4 ${liked[h.id] ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                            />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 min-w-0 px-5 py-4 gap-4">
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <StarRow count={h.stars} />
                              <h3 className="font-bold text-[15px] text-gray-900 mt-1 leading-snug">
                                {h.name}
                              </h3>
                              <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                <MapPin className="w-3 h-3 shrink-0" />{" "}
                                {h.address}
                              </p>
                              {/* Amenity pills — top 5 */}
                              <div className="flex flex-wrap gap-1.5 mt-3">
                                {h.amenities.slice(0, 5).map((a) => {
                                  const meta = AMENITY_ICONS[a];
                                  if (!meta) return null;
                                  const { icon: Icon, label } = meta;
                                  return (
                                    <span
                                      key={a}
                                      className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full"
                                    >
                                      <Icon className="w-2.5 h-2.5 text-blue-500" />{" "}
                                      {label}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {h.checkInInfo && (
                                <span className="text-[11px] text-gray-400">
                                  Check-in from{" "}
                                  {h.checkInInfo.check_in_after_time}
                                </span>
                              )}
                              <button
                                onClick={() =>
                                  setExpandedId(isExpanded ? null : h.id)
                                }
                                className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
                              >
                                {isExpanded ? "Hide details" : "More details"}
                                <ChevronRight
                                  className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                                />
                              </button>
                            </div>
                          </div>

                          {/* Price & CTA */}
                          <div className="flex flex-col items-end justify-between shrink-0 pl-4 border-l border-gray-100 w-44">
                            <RatingBadge
                              value={h.rating}
                              label={h.ratingLabel}
                            />
                            <div className="text-right">
                              {h.price !== null ? (
                                <>
                                  <div className="flex items-baseline gap-1 justify-end">
                                    <span className="text-2xl font-extrabold text-gray-900">
                                      {h.currency === "USD" ? "$" : h.currency}
                                      {Math.round(h.price)}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-end gap-1.5 mb-1">
                                    <span className="text-[11px] text-gray-400">
                                      total · {nightCount} night
                                      {nightCount > 1 ? "s" : ""}
                                    </span>
                                  </div>
                                  {h.dueAtProperty > 0 && (
                                    <p className="text-[11px] text-amber-600 mb-1">
                                      +${Math.round(h.dueAtProperty)} due at
                                      property
                                    </p>
                                  )}
                                </>
                              ) : (
                                <p className="text-sm text-gray-400 mb-2">
                                  Price unavailable
                                </p>
                              )}
                              <button className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
                                Book now{" "}
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded detail panel */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-gray-100 bg-slate-50 px-5 py-4 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-6">
                              {/* All amenities */}
                              <div>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                  All amenities
                                </p>
                                <div className="space-y-1.5">
                                  {h.amenityObjects.map((a) => {
                                    const meta = AMENITY_ICONS[a.type];
                                    const Icon = meta?.icon || Building2;
                                    return (
                                      <div
                                        key={a.type}
                                        className="flex items-center gap-2 text-sm text-gray-700"
                                      >
                                        <Icon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                        {a.description}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Location & check-in */}
                              <div>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                  Location
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                  {h.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {h.address}
                                </p>
                                {h.checkInInfo && (
                                  <div className="mt-3 space-y-1">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                      Check-in times
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      From {h.checkInInfo.check_in_after_time}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      Check-out by{" "}
                                      {h.checkInInfo.check_out_before_time}
                                    </p>
                                  </div>
                                )}
                                {h.keyCollection?.instructions && (
                                  <p className="text-xs text-gray-400 mt-2 italic">
                                    {h.keyCollection.instructions}
                                  </p>
                                )}
                              </div>

                              {/* Pricing breakdown */}
                              <div>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                  Pricing
                                </p>
                                {h.price !== null ? (
                                  <>
                                    <div className="flex items-baseline gap-2 flex-wrap">
                                      <span className="text-xl font-extrabold text-blue-600">
                                        {h.currency === "USD"
                                          ? "$"
                                          : h.currency}
                                        {Math.round(h.price)}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      Total for {nightCount} night
                                      {nightCount > 1 ? "s" : ""}
                                    </p>
                                    {h.dueAtProperty > 0 && (
                                      <p className="text-xs text-amber-600 mt-1">
                                        +${Math.round(h.dueAtProperty)} due at
                                        property
                                      </p>
                                    )}
                                  </>
                                ) : (
                                  <p className="text-sm text-gray-400">
                                    Price unavailable
                                  </p>
                                )}
                                <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-xl transition">
                                  Book now
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pre-search hero prompt */}
      {!hasSearched && !loading && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <Hotel className="w-14 h-14 text-blue-200 mb-4" />
          <h2 className="text-xl font-bold text-gray-700">
            Find your next stay
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Enter a destination and dates above to search available hotels.
          </p>
        </div>
      )}
    </div>
  );
}
