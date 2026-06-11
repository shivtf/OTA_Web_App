// components/SearchBox.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Hotel,
  Car,
  Search,
  ArrowLeftRight,
  Calendar,
  Users,
  ChevronDown,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Loader2,
} from "lucide-react";

const TABS = [
  { id: "flights", label: "Flights", icon: Plane },
  { id: "hotels", label: "Hotels", icon: Hotel },
  { id: "cars", label: "Cars", icon: Car },
];

const CLASSES = ["Economy", "Premium Economy", "Business", "First Class"];
const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
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
const DAYS_FULL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseDate(str) {
  return str ? new Date(str + "T12:00:00") : null;
}
function toISO(d) {
  if (!d) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function fmt(str) {
  const d = parseDate(str);
  return d
    ? `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`
    : "";
}
function fmtShort(str) {
  const d = parseDate(str);
  return d
    ? `${DAYS_FULL[d.getDay()]}, ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`
    : "";
}

const LABEL = {
  fontSize: 10,
  fontWeight: 700,
  color: "#9ca3af",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: 6,
};
const BOX = {
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 14,
  fontWeight: 600,
  color: "#111827",
  background: "#fff",
  boxSizing: "border-box",
  width: "100%",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.15s",
  cursor: "text",
};

// ── Place Autocomplete Input ─────────────────────────────────────────────────
function PlaceInput({
  label,
  value,
  onChange,
  placeholder = "City or airport",
}) {
  const [query, setQuery] = useState(value?.name || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const debounceRef = useRef(null);

  // Sync external value changes (e.g. swap)
  useEffect(() => {
    setQuery(value?.name || "");
  }, [value?.name]);

  // Close on outside click
  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  function handleChange(e) {
    const q = e.target.value;
    setQuery(q);
    onChange(null); // clear selected until user picks

    clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${BASE_URL}/meta/places/search?q=${encodeURIComponent(q.trim())}`,
        );
        const json = await res.json();
        // API returns { success, message, data: [...] }
        const places = Array.isArray(json.data)
          ? json.data
          : Array.isArray(json)
            ? json
            : [];
        console.log("[PlaceInput] results:", places);
        setResults(places);
        setOpen(places.length > 0);
      } catch (err) {
        console.error("[PlaceInput] fetch error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }

  function handleSelect(place) {
    setQuery(`${place.name} (${place.iataCode})`);
    onChange(place);
    setOpen(false);
    setResults([]);
  }

  const typeIcon = (type) => {
    if (type === "airport") return "✈";
    if (type === "city") return "🏙";
    return "📍";
  };

  return (
    <div
      ref={ref}
      style={{ flex: "1 1 0", minWidth: 140, position: "relative" }}
    >
      <div style={LABEL}>{label}</div>
      <div style={{ position: "relative" }}>
        <input
          style={{
            ...BOX,
            paddingRight: 32,
            borderColor: open ? "#2563eb" : "#d1d5db",
          }}
          value={query}
          onChange={handleChange}
          onFocus={() => {
            if (results.length) setOpen(true);
          }}
          placeholder={placeholder}
          autoComplete="off"
        />
        <div
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        >
          {loading ? (
            <Loader2
              style={{
                width: 14,
                height: 14,
                color: "#9ca3af",
                animation: "spin 1s linear infinite",
              }}
            />
          ) : (
            <MapPin style={{ width: 14, height: 14, color: "#9ca3af" }} />
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.13 }}
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              width: "max(100%, 280px)",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              boxShadow: "0 8px 30px rgba(0,0,0,0.13)",
              zIndex: 300,
              overflow: "hidden",
            }}
          >
            {results.map((place, i) => (
              <div
                key={place.id || i}
                onClick={() => handleSelect(place)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  cursor: "pointer",
                  borderBottom:
                    i < results.length - 1 ? "1px solid #f3f4f6" : "none",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f8faff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#fff")
                }
              >
                {/* Icon */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    flexShrink: 0,
                  }}
                >
                  {typeIcon(place.type)}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#111827",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {place.name}
                    {place.iataCode && (
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#2563eb",
                          background: "#eff6ff",
                          padding: "1px 6px",
                          borderRadius: 4,
                        }}
                      >
                        {place.iataCode}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>
                    {[place.city, place.country].filter(Boolean).join(", ")}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { from { transform: translateY(-50%) rotate(0deg); } to { transform: translateY(-50%) rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Calendar Picker ─────────────────────────────────────────────────────────
function CalendarPicker({ label, value, onChange, minDate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = parseDate(value);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const [view, setView] = useState(() => {
    const d = selected || today;
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  function prevMonth() {
    setView((v) =>
      v.month === 0
        ? { year: v.year - 1, month: 11 }
        : { year: v.year, month: v.month - 1 },
    );
  }
  function nextMonth() {
    setView((v) =>
      v.month === 11
        ? { year: v.year + 1, month: 0 }
        : { year: v.year, month: v.month + 1 },
    );
  }

  const firstDay = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);
  while (cells.length % 7 !== 0) cells.push(null);

  const minD = minDate ? parseDate(minDate) : null;

  function pickDay(day) {
    if (!day) return;
    const picked = new Date(view.year, view.month, day, 12);
    if (minD && picked < minD) return;
    onChange(toISO(picked));
    setOpen(false);
  }
  const isSelected = (day) =>
    day &&
    selected &&
    selected.getFullYear() === view.year &&
    selected.getMonth() === view.month &&
    selected.getDate() === day;
  const isToday = (day) =>
    day &&
    today.getFullYear() === view.year &&
    today.getMonth() === view.month &&
    today.getDate() === day;
  const isDisabled = (day) => {
    if (!day || !minD) return false;
    return new Date(view.year, view.month, day, 12) < minD;
  };

  return (
    <div ref={ref} style={{ minWidth: 140, position: "relative" }}>
      <div style={LABEL}>{label}</div>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          ...BOX,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
          borderColor: open ? "#2563eb" : "#d1d5db",
          userSelect: "none",
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#111827",
            lineHeight: 1.2,
          }}
        >
          {value ? fmt(value) : "Select date"}
        </div>
        <Calendar
          style={{
            width: 15,
            height: 15,
            flexShrink: 0,
            color: open ? "#2563eb" : "#9ca3af",
            transition: "color 0.15s",
          }}
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              width: 300,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              boxShadow: "0 12px 40px rgba(0,0,0,0.14)",
              zIndex: 200,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#2563eb",
                padding: "16px 20px 14px",
                color: "#fff",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  opacity: 0.75,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                {label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>
                {value ? fmt(value) : "Pick a date"}
              </div>
              {value && (
                <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>
                  {fmtShort(value)}
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px 8px",
              }}
            >
              <button
                onClick={prevMonth}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  borderRadius: 6,
                  color: "#374151",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ChevronLeft style={{ width: 18, height: 18 }} />
              </button>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                {MONTHS[view.month]} {view.year}
              </span>
              <button
                onClick={nextMonth}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  borderRadius: 6,
                  color: "#374151",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ChevronRight style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7,1fr)",
                padding: "0 12px",
                gap: 2,
              }}
            >
              {DAYS_SHORT.map((d) => (
                <div
                  key={d}
                  style={{
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#9ca3af",
                    padding: "4px 0",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7,1fr)",
                padding: "4px 12px 16px",
                gap: 2,
              }}
            >
              {cells.map((day, i) => {
                const sel = isSelected(day),
                  tod = isToday(day),
                  dis = isDisabled(day);
                return (
                  <div
                    key={i}
                    onClick={() => !dis && pickDay(day)}
                    style={{
                      textAlign: "center",
                      padding: "7px 0",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: sel ? 700 : 400,
                      cursor: day && !dis ? "pointer" : "default",
                      background: sel
                        ? "#2563eb"
                        : tod
                          ? "#eff6ff"
                          : "transparent",
                      color: sel
                        ? "#fff"
                        : dis
                          ? "#d1d5db"
                          : tod
                            ? "#2563eb"
                            : day
                              ? "#111827"
                              : "transparent",
                      border:
                        tod && !sel
                          ? "1.5px solid #bfdbfe"
                          : "1.5px solid transparent",
                      transition: "background 0.12s, color 0.12s",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      if (day && !dis && !sel)
                        e.currentTarget.style.background = "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                      if (!sel)
                        e.currentTarget.style.background = tod
                          ? "#eff6ff"
                          : "transparent";
                    }}
                  >
                    {day || ""}
                  </div>
                );
              })}
            </div>

            <div
              style={{
                borderTop: "1px solid #f3f4f6",
                padding: "10px 16px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 13,
                  color: "#6b7280",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Clear
              </button>
              <button
                onClick={() => {
                  onChange(toISO(today));
                  setOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 13,
                  color: "#2563eb",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
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

// ── Travelers Dropdown ───────────────────────────────────────────────────────
function TravelersDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [adults, setAdults] = useState(value.adults);
  const [children, setChildren] = useState(value.children);
  const [infants, setInfants] = useState(value.infants);
  const [cabinClass, setCabinClass] = useState(value.cabinClass);
  const ref = useRef(null);

  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    onChange({ adults, children, infants, cabinClass });
  }, [adults, children, infants, cabinClass]);

  const total = adults + children + infants;
  const summary = `${total} Traveler${total !== 1 ? "s" : ""}, ${cabinClass}`;

  const Counter = ({ label, sub, value: val, onInc, onDec, min = 0 }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
          {label}
        </div>
        {sub && (
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>
            {sub}
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={onDec}
          disabled={val <= min}
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: "1px solid #d1d5db",
            background: val <= min ? "#f9fafb" : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: val <= min ? "not-allowed" : "pointer",
            color: val <= min ? "#d1d5db" : "#374151",
          }}
        >
          <Minus style={{ width: 13, height: 13 }} />
        </button>
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#111827",
            minWidth: 16,
            textAlign: "center",
          }}
        >
          {val}
        </span>
        <button
          onClick={onInc}
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: "1px solid #2563eb",
            background: "#eff6ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#2563eb",
          }}
        >
          <Plus style={{ width: 13, height: 13 }} />
        </button>
      </div>
    </div>
  );

  return (
    <div ref={ref} style={{ minWidth: 200, position: "relative" }}>
      <div style={LABEL}>Travelers &amp; Class</div>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          ...BOX,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          borderColor: open ? "#2563eb" : "#d1d5db",
          userSelect: "none",
        }}
      >
        <Users
          style={{ width: 13, height: 13, color: "#9ca3af", flexShrink: 0 }}
        />
        <span
          style={{
            flex: 1,
            fontSize: 14,
            fontWeight: 600,
            color: "#111827",
            whiteSpace: "nowrap",
          }}
        >
          {summary}
        </span>
        <ChevronDown
          style={{
            width: 13,
            height: 13,
            color: "#9ca3af",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              width: 280,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              padding: "4px 16px 12px",
              zIndex: 200,
            }}
          >
            <Counter
              label="Adults"
              sub="Age 12+"
              value={adults}
              min={1}
              onInc={() => setAdults((a) => a + 1)}
              onDec={() => setAdults((a) => Math.max(1, a - 1))}
            />
            <Counter
              label="Children"
              sub="Age 2–11"
              value={children}
              min={0}
              onInc={() => setChildren((c) => c + 1)}
              onDec={() => setChildren((c) => Math.max(0, c - 1))}
            />
            <Counter
              label="Infants"
              sub="Under 2"
              value={infants}
              min={0}
              onInc={() => setInfants((i) => i + 1)}
              onDec={() => setInfants((i) => Math.max(0, i - 1))}
            />
            <div style={{ marginTop: 12 }}>
              <div style={{ ...LABEL, marginBottom: 8 }}>Cabin class</div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 6,
                }}
              >
                {CLASSES.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setCabinClass(cls)}
                    style={{
                      padding: "7px 10px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: cabinClass === cls ? 600 : 400,
                      cursor: "pointer",
                      textAlign: "center",
                      border:
                        cabinClass === cls
                          ? "1.5px solid #2563eb"
                          : "1px solid #e5e7eb",
                      background: cabinClass === cls ? "#eff6ff" : "#fff",
                      color: cabinClass === cls ? "#2563eb" : "#374151",
                      transition: "all 0.15s",
                    }}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                marginTop: 14,
                width: "100%",
                padding: "9px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main SearchBox ───────────────────────────────────────────────────────────
export default function SearchBox({ defaultTab = "flights", onSearch }) {
  const today = new Date();
  const defaultDepart = today.toISOString().split("T")[0];
  const returnDay = new Date();
  returnDay.setDate(returnDay.getDate() + 7);
  const defaultReturnDate = returnDay.toISOString().split("T")[0];
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [depart, setDepart] = useState(defaultDepart);
  const [returnDate, setReturnDate] = useState(defaultReturnDate);
  const [showReturn, setShowReturn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [travelers, setTravelers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: "Economy",
  });

  async function handleSearch() {
    if (!from?.iataCode || !to?.iataCode) {
      alert("Please select a valid origin and destination.");
      return;
    }
    if (!depart) {
      alert("Please select a departure date.");
      return;
    }

    if (activeTab === "flights") {
      setLoading(true);
      try {
        const payload = {
          origin: from.iataCode,
          destination: to.iataCode,
          departureDate: depart,
          adults: travelers.adults,
          children: travelers.children,
          infants: travelers.infants,
          cabinClass: travelers.cabinClass.toLowerCase().replace(/ /g, "_"),
        };
        const res = await fetch(`${BASE_URL}/flights/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        // Call optional callback
        onSearch?.({
          tab: activeTab,
          from,
          to,
          depart,
          returnDate,
          travelers,
          result: data,
        });

        // Navigate to results page, passing results + search params via router state
        navigate("/flights/results", {
          state: {
            searchParams: payload,
            from,
            to,
            returnDate: showReturn ? returnDate : null,
            travelers,
            result: data,
          },
        });
      } catch (err) {
        console.error("Flight search error:", err);
        onSearch?.({
          tab: activeTab,
          from,
          to,
          depart,
          returnDate,
          travelers,
          error: err,
        });
      } finally {
        setLoading(false);
      }
    } else {
      onSearch?.({ tab: activeTab, from, to, depart, returnDate, travelers });
    }
  }

  function handleSwap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      style={{ width: "100%", position: "relative", zIndex: 10 }}
    >
      {/* ── TABS ── */}
      <div
        style={{
          display: "inline-flex",
          background: "#fff",
          borderRadius: "12px 12px 0 0",
          paddingLeft: 20,
          paddingTop: 10,
          paddingRight: 4,
        }}
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 18px 10px",
              fontSize: 14,
              fontWeight: activeTab === id ? 600 : 500,
              whiteSpace: "nowrap",
              border: "none",
              borderBottom:
                activeTab === id
                  ? "2px solid #2563eb"
                  : "2px solid transparent",
              background: "transparent",
              color: activeTab === id ? "#2563eb" : "#6b7280",
              cursor: "pointer",
              transition: "color 0.15s",
            }}
          >
            <Icon
              style={{
                width: 14,
                height: 14,
                flexShrink: 0,
                color: activeTab === id ? "#2563eb" : "#9ca3af",
              }}
            />
            {label}
          </button>
        ))}
      </div>

      {/* ── CARD ── */}
      <div
        style={{
          width: "100%",
          background: "#fff",
          borderRadius: "0 12px 12px 12px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        }}
      >
        {/* FIELDS */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            padding: "16px 16px 14px 20px",
          }}
        >
          <PlaceInput
            label="From"
            value={from}
            onChange={setFrom}
            placeholder="City or airport"
          />

          {/* Swap */}
          <button
            onClick={handleSwap}
            aria-label="Swap"
            style={{
              flexShrink: 0,
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1px solid #d1d5db",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginBottom: 1,
            }}
          >
            <ArrowLeftRight
              style={{ width: 13, height: 13, color: "#2563eb" }}
            />
          </button>

          <PlaceInput
            label="To"
            value={to}
            onChange={setTo}
            placeholder="City or airport"
          />

          <CalendarPicker label="Depart" value={depart} onChange={setDepart} />

          {showReturn && (
            <CalendarPicker
              label="Return"
              value={returnDate}
              onChange={setReturnDate}
              minDate={depart}
            />
          )}

          <TravelersDropdown value={travelers} onChange={setTravelers} />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSearch}
            disabled={loading}
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: loading ? "#93c5fd" : "#2563eb",
              color: "#fff",
              padding: "9px 20px",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 14,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
              transition: "background 0.2s",
            }}
          >
            <Search style={{ width: 15, height: 15 }} />
            {loading ? "Searching…" : "Search flights"}
          </motion.button>
        </div>

        {/* FOOTER */}
        <div style={{ padding: "0 20px 14px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: 13,
              color: "#6b7280",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              checked={showReturn}
              onChange={(e) => setShowReturn(e.target.checked)}
              style={{
                width: 13,
                height: 13,
                accentColor: "#2563eb",
                cursor: "pointer",
              }}
            />
            Add return trip
          </label>
        </div>
      </div>
    </motion.div>
  );
}
