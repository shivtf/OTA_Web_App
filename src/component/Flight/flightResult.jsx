// pages/FlightResults/FlightResults.jsx
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  Search,
  Tag,
  Shield,
  Zap,
  Headphones,
  Clock,
  Luggage,
  Wifi,
  Plug,
  RefreshCw,
  Edit2,
  Leaf,
  AlertCircle,
  Check,
  X,
  SlidersHorizontal,
} from "lucide-react";
import Navbar from "../Navbar/navbar";

// ── Helpers ────────────────────────────────────────────────────────────────
function parseDuration(iso) {
  // "PT2H5M" → "2h 5m"
  if (!iso) return "";
  const h = iso.match(/(\d+)H/)?.[1];
  const m = iso.match(/(\d+)M/)?.[1];
  return [h && `${h}h`, m && `${m}m`].filter(Boolean).join(" ");
}

function fmtTime(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function fmtDate(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function overnightDays(dep, arr) {
  if (!dep || !arr) return 0;
  const d1 = new Date(dep);
  const d2 = new Date(arr);
  return Math.floor((d2 - d1) / 86400000);
}

// ── Airline Logo ───────────────────────────────────────────────────────────
function AirlineLogo({ airline }) {
  const [imgError, setImgError] = useState(false);
  const colors = {
    BA: "#075AAA",
    AA: "#0078D2",
    AI: "#D0001B",
    ZZ: "#5B3EF5",
    default: "#6366F1",
  };
  const bg = colors[airline?.iataCode] || colors.default;

  if (airline?.logoUrl && !imgError) {
    return (
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          border: "1px solid #E5E7EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img
          src={airline.logoUrl}
          alt={airline.name}
          onError={() => setImgError(true)}
          style={{ width: 32, height: 32, objectFit: "contain" }}
        />
      </div>
    );
  }
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: 13,
        flexShrink: 0,
        letterSpacing: "0.02em",
      }}
    >
      {airline?.iataCode || "??"}
    </div>
  );
}

// ── Range Slider ───────────────────────────────────────────────────────────
function RangeSlider({ min, max, value, onChange }) {
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        width: "100%",
        height: 4,
        borderRadius: 4,
        appearance: "none",
        cursor: "pointer",
        background: `linear-gradient(to right, #2563EB ${pct}%, #E5E7EB ${pct}%)`,
        outline: "none",
      }}
    />
  );
}

// ── Flight Card ────────────────────────────────────────────────────────────
function FlightCard({ offer, index }) {
  const [expanded, setExpanded] = useState(false);

  const slice = offer.slices?.[0];
  const segment = slice?.segments?.[0];
  const airline = offer.owner;
  const pricing = offer.pricing;
  const conditions = offer.conditions;
  const passenger = segment?.passengers?.[0];
  const cabin = passenger?.cabin;
  const baggages = passenger?.baggages || [];
  const stops = slice?.stops ?? 0;
  const stopDetail =
    stops > 0 ? `${stops} stop${stops > 1 ? "s" : ""}` : "Non-stop";

  const depTime = fmtTime(slice?.departureAt);
  const arrTime = fmtTime(slice?.arrivalAt);
  const duration = parseDuration(slice?.duration);
  const nightDays = overnightDays(slice?.departureAt, slice?.arrivalAt);
  const originCode = slice?.origin?.iataCode;
  const destCode = slice?.destination?.iataCode;
  const fareLabel = slice?.fareBrandName;

  const checkedBag = baggages.find((b) => b.type === "checked");
  const carryOn = baggages.find((b) => b.type === "carry_on");
  const emissionsKg = pricing?.totalEmissionsKg;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        border: "1px solid #E5E7EB",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        overflow: "hidden",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)")
      }
    >
      {/* Main row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "20px 24px",
        }}
      >
        {/* Airline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: 150,
            flexShrink: 0,
          }}
        >
          <AirlineLogo airline={airline} />
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#0F172A",
                lineHeight: 1.3,
              }}
            >
              {airline?.name}
            </div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
              {airline?.iataCode} {segment?.marketingCarrierFlightNumber}
            </div>
            {fareLabel && (
              <div
                style={{
                  marginTop: 4,
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#6366F1",
                  background: "#EEF2FF",
                  padding: "1px 6px",
                  borderRadius: 4,
                  display: "inline-block",
                }}
              >
                {fareLabel}
              </div>
            )}
          </div>
        </div>

        {/* Depart */}
        <div style={{ textAlign: "center", minWidth: 60, flexShrink: 0 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#0F172A",
              lineHeight: 1,
            }}
          >
            {depTime}
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#64748B",
              marginTop: 3,
            }}
          >
            {originCode}
          </div>
          <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}>
            {fmtDate(slice?.departureAt)}
          </div>
        </div>

        {/* Route line */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: "0 8px",
          }}
        >
          <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>
            {stopDetail}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: 4,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                border: "2px solid #2563EB",
                background: "#fff",
                flexShrink: 0,
              }}
            />
            <div
              style={{
                flex: 1,
                height: 1.5,
                background: "#CBD5E1",
                position: "relative",
              }}
            >
              {stops > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#94A3B8",
                  }}
                />
              )}
            </div>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#2563EB",
                flexShrink: 0,
              }}
            />
          </div>
          <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>
            {duration}
          </div>
        </div>

        {/* Arrive */}
        <div style={{ textAlign: "center", minWidth: 60, flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#0F172A",
                lineHeight: 1,
              }}
            >
              {arrTime}
            </div>
            {nightDays > 0 && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#F97316",
                  background: "#FFF7ED",
                  padding: "1px 5px",
                  borderRadius: 4,
                  marginTop: 2,
                }}
              >
                +{nightDays}d
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#64748B",
              marginTop: 3,
            }}
          >
            {destCode}
          </div>
          <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}>
            {fmtDate(slice?.arrivalAt)}
          </div>
        </div>

        {/* Amenity icons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginLeft: 4,
            flexShrink: 0,
          }}
        >
          <div
            title={
              checkedBag
                ? `${checkedBag.quantity} checked bag`
                : "No checked bag"
            }
          >
            <Luggage
              style={{
                width: 17,
                height: 17,
                color: checkedBag ? "#2563EB" : "#CBD5E1",
              }}
            />
          </div>
          <div
            title={
              cabin?.amenities?.wifi?.available
                ? `WiFi (${cabin.amenities.wifi.cost})`
                : "No WiFi"
            }
          >
            <Wifi
              style={{
                width: 17,
                height: 17,
                color: cabin?.amenities?.wifi?.available
                  ? "#2563EB"
                  : "#CBD5E1",
              }}
            />
          </div>
          <div
            title={
              cabin?.amenities?.power?.available ? "Power outlet" : "No power"
            }
          >
            <Plug
              style={{
                width: 17,
                height: 17,
                color: cabin?.amenities?.power?.available
                  ? "#2563EB"
                  : "#CBD5E1",
              }}
            />
          </div>
          {emissionsKg && (
            <div
              title={`${emissionsKg} kg CO₂`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                fontSize: 11,
                color: parseInt(emissionsKg) < 100 ? "#16A34A" : "#64748B",
                fontWeight: 600,
              }}
            >
              <Leaf style={{ width: 14, height: 14 }} />
              {emissionsKg}kg
            </div>
          )}
        </div>

        {/* Price + select */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            marginLeft: "auto",
            flexShrink: 0,
            minWidth: 130,
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#0F172A",
              lineHeight: 1,
            }}
          >
            ${parseFloat(pricing?.totalAmount).toFixed(0)}
          </div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
            {pricing?.totalCurrency} · per person
          </div>
          <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}>
            Base ${parseFloat(pricing?.baseAmount).toFixed(2)} + Tax $
            {parseFloat(pricing?.taxAmount).toFixed(2)}
          </div>
          <button
            style={{
              marginTop: 10,
              background: "#2563EB",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "9px 20px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              width: "100%",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2563EB")}
          >
            Select
          </button>
        </div>

        {/* Expand toggle */}
        {/* <button
          onClick={() => setExpanded((p) => !p)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#94A3B8",
            padding: 4,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button> */}
      </div>

      {/* Conditions row */}
      <div
        style={{
          display: "flex",
          gap: 16,
          padding: "0 24px 14px",
          borderTop: "1px solid #F1F5F9",
          paddingTop: 10,
        }}
      >
        <ConditionBadge
          ok={conditions?.refundable}
          label={conditions?.refundable ? "Refundable" : "Non-refundable"}
        />
        <ConditionBadge
          ok={conditions?.changeable}
          label={
            conditions?.changeable
              ? `Changeable${conditions.changePenaltyAmount ? ` ($${conditions.changePenaltyAmount})` : ""}`
              : "Non-changeable"
          }
        />
        {carryOn && (
          <ConditionBadge ok label={`${carryOn.quantity} carry-on`} />
        )}
        {checkedBag && (
          <ConditionBadge ok label={`${checkedBag.quantity} checked bag`} />
        )}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div
          style={{
            borderTop: "1px solid #F1F5F9",
            background: "#F8FAFC",
            padding: "18px 24px",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#0F172A",
              marginBottom: 12,
            }}
          >
            Flight Details
          </div>
          {offer.slices?.map((sl, si) => (
            <div key={si}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#64748B",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 10,
                }}
              >
                {sl.origin?.cityName} → {sl.destination?.cityName} ·{" "}
                {parseDuration(sl.duration)}
              </div>
              {sl.segments?.map((seg, segi) => (
                <div
                  key={segi}
                  style={{
                    display: "flex",
                    gap: 16,
                    background: "#fff",
                    borderRadius: 12,
                    padding: "14px 16px",
                    border: "1px solid #E5E7EB",
                    marginBottom: 8,
                  }}
                >
                  <AirlineLogo airline={seg.marketingCarrier} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                      <div>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: "#0F172A",
                          }}
                        >
                          {fmtTime(seg.departingAt)}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#64748B",
                            marginTop: 2,
                          }}
                        >
                          {seg.origin?.iataCode} · {seg.origin?.name}
                        </div>
                        {seg.originTerminal && (
                          <div style={{ fontSize: 11, color: "#94A3B8" }}>
                            Terminal {seg.originTerminal}
                          </div>
                        )}
                        <div style={{ fontSize: 11, color: "#94A3B8" }}>
                          {fmtDate(seg.departingAt)}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#94A3B8",
                          fontSize: 11,
                          gap: 4,
                        }}
                      >
                        <Clock size={14} />
                        {parseDuration(seg.duration)}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: "#0F172A",
                          }}
                        >
                          {fmtTime(seg.arrivingAt)}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#64748B",
                            marginTop: 2,
                          }}
                        >
                          {seg.destination?.iataCode} · {seg.destination?.name}
                        </div>
                        {seg.destinationTerminal && (
                          <div style={{ fontSize: 11, color: "#94A3B8" }}>
                            Terminal {seg.destinationTerminal}
                          </div>
                        )}
                        <div style={{ fontSize: 11, color: "#94A3B8" }}>
                          {fmtDate(seg.arrivingAt)}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        marginTop: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <InfoChip
                        label="Airline"
                        value={`${seg.marketingCarrier?.name} ${seg.marketingCarrierFlightNumber}`}
                      />
                      {seg.aircraft && (
                        <InfoChip label="Aircraft" value={seg.aircraft.name} />
                      )}
                      {seg.passengers?.[0]?.cabinClassMarketingName && (
                        <InfoChip
                          label="Cabin"
                          value={seg.passengers[0].cabinClassMarketingName}
                        />
                      )}
                      {seg.passengers?.[0]?.fareBasisCode && (
                        <InfoChip
                          label="Fare basis"
                          value={seg.passengers[0].fareBasisCode}
                        />
                      )}
                      {seg.passengers?.[0]?.cabin?.amenities?.seat?.pitch && (
                        <InfoChip
                          label="Seat pitch"
                          value={`${seg.passengers[0].cabin.amenities.seat.pitch}"`}
                        />
                      )}
                      {seg.distance && (
                        <InfoChip
                          label="Distance"
                          value={`${Math.round(parseFloat(seg.distance))} km`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ConditionBadge({ ok, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        fontWeight: 500,
        color: ok ? "#16A34A" : "#9CA3AF",
      }}
    >
      {ok ? (
        <Check size={12} style={{ color: "#16A34A" }} />
      ) : (
        <X size={12} style={{ color: "#CBD5E1" }} />
      )}
      {label}
    </div>
  );
}

function InfoChip({ label, value }) {
  return (
    <div style={{ fontSize: 11, color: "#64748B" }}>
      <span style={{ color: "#94A3B8" }}>{label}: </span>
      <span style={{ fontWeight: 600, color: "#374151" }}>{value}</span>
    </div>
  );
}

// ── Normalize API response regardless of nesting ───────────────────────────
// SearchBox passes `result: data` where data is the raw fetch JSON.
// The API can return:
//   { success, message, data: { offers, filters, slices, ... } }   ← standard
//   { offers, filters, slices, ... }                                ← unwrapped
// We handle both.
function extractFlightData(result) {
  if (!result) return { offers: [], filters: {}, slices: [], totalOffers: 0 };

  // Log the raw result so we can debug nesting issues in the console
  console.log("[FlightResults] raw result keys:", Object.keys(result));

  // Handle all possible shapes:
  //   Shape A: { success, message, data: { offers, filters, ... } }
  //   Shape B: { offers, filters, ... }
  //   Shape C: { data: { offers, filters, ... } } (no success wrapper)
  let inner = null;

  if (Array.isArray(result?.data?.offers) && result.data.offers.length >= 0) {
    // Shape A or C — nested under .data
    inner = result.data;
  } else if (Array.isArray(result?.offers)) {
    // Shape B — flat
    inner = result;
  } else if (result?.data && typeof result.data === "object") {
    // Fallback: use result.data whatever it has
    inner = result.data;
  } else {
    inner = result;
  }

  const offers = Array.isArray(inner?.offers) ? inner.offers : [];
  console.log("[FlightResults] extracted offers count:", offers.length);
  console.log("[FlightResults] filters:", inner?.filters);

  return {
    offers,
    filters: inner?.filters || {},
    slices: inner?.slices || [],
    totalOffers: inner?.totalOffers || offers.length,
  };
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function FlightResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchParams, from, to, returnDate, travelers, result } =
    location.state || {};

  const { offers, filters, slices, totalOffers } = extractFlightData(result);
  const sliceInfo = slices?.[0] || {};

  const priceMin = Math.floor(parseFloat(filters.priceRange?.min ?? 0));
  const priceMax = Math.ceil(parseFloat(filters.priceRange?.max ?? 1000));

  const [activeSort, setActiveSort] = useState("cheapest");
  // Lazy init so it reads the actual priceMax on first render
  const [maxPrice, setMaxPrice] = useState(() => priceMax);
  const [stopsFilter, setStopsFilter] = useState({
    0: true,
    1: true,
    "2+": true,
  });
  const [airlineFilter, setAirlineFilter] = useState(() => {
    const init = {};
    (filters.availableAirlines || []).forEach((a) => (init[a] = true));
    return init;
  });

  const BATCH = 8; // cards to show initially and per load
  const [visibleCount, setVisibleCount] = useState(BATCH);
  const sentinelRef = useRef(null);

  // Re-sync visible count when filters/sort change — reset to first batch
  useEffect(() => {
    setVisibleCount(BATCH);
  }, [activeSort, maxPrice, stopsFilter, airlineFilter]);

  // Infinite scroll via IntersectionObserver on a sentinel div

  // Re-sync filter state if offers/filters change (e.g. navigating with new search)
  useEffect(() => {
    if (priceMax > 0) setMaxPrice(priceMax);
  }, [priceMax]);

  useEffect(() => {
    const init = {};
    (filters.availableAirlines || []).forEach((a) => (init[a] = true));
    setAirlineFilter(init);
  }, [filters.availableAirlines?.join(",")]);

  // Filter + sort
  const processed = useMemo(() => {
    let list = offers.filter((o) => {
      const price = parseFloat(o.pricing?.totalAmount);
      if (price > maxPrice) return false;
      const stops = o.slices?.[0]?.stops ?? 0;
      const stopsKey = stops >= 2 ? "2+" : stops;
      if (!stopsFilter[stopsKey]) return false;
      const airline = o.owner?.iataCode;
      if (airlineFilter[airline] === false) return false;
      return true;
    });

    if (activeSort === "cheapest") {
      list = [...list].sort(
        (a, b) =>
          parseFloat(a.pricing?.totalAmount) -
          parseFloat(b.pricing?.totalAmount),
      );
    } else if (activeSort === "fastest") {
      list = [...list].sort((a, b) => {
        const durA = a.slices?.[0]?.duration || "PT99H";
        const durB = b.slices?.[0]?.duration || "PT99H";
        return durA.localeCompare(durB);
      });
    } else {
      // best: emissions-adjusted price
      list = [...list].sort((a, b) => {
        const scoreA =
          parseFloat(a.pricing?.totalAmount) +
          (parseInt(a.pricing?.totalEmissionsKg) || 0) * 0.05;
        const scoreB =
          parseFloat(b.pricing?.totalAmount) +
          (parseInt(b.pricing?.totalEmissionsKg) || 0) * 0.05;
        return scoreA - scoreB;
      });
    }
    return list;
  }, [offers, maxPrice, stopsFilter, airlineFilter, activeSort]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + BATCH);
        }
      },
      { rootMargin: "200px" }, // trigger 200px before sentinel hits viewport
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [processed.length]);

  const cheapestPrice = useMemo(
    () =>
      offers.length
        ? Math.min(...offers.map((o) => parseFloat(o.pricing?.totalAmount)))
        : 0,
    [offers],
  );
  const fastestDur = useMemo(
    () =>
      offers.length
        ? offers.map((o) => o.slices?.[0]?.duration || "PT99H").sort()[0]
        : "",
    [offers],
  );

  const allAirlines = filters.availableAirlines || [];

  // Build a map of iataCode -> airline name from the offers themselves
  const airlineNameMap = useMemo(() => {
    const map = {};
    offers.forEach((o) => {
      if (o.owner?.iataCode && o.owner?.name) {
        map[o.owner.iataCode] = o.owner.name;
      }
    });
    return map;
  }, [offers]);

  // Count offers per airline for the filter sidebar
  const airlineOfferCount = useMemo(() => {
    const counts = {};
    offers.forEach((o) => {
      const code = o.owner?.iataCode;
      if (code) counts[code] = (counts[code] || 0) + 1;
    });
    return counts;
  }, [offers]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Search bar */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #E5E7EB",
          padding: "16px 32px",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            {/* From → To */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#94A3B8",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  From
                </div>
                <div
                  style={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}
                >
                  {from?.iataCode || sliceInfo.origin}
                </div>
                <div style={{ fontSize: 11, color: "#64748B" }}>
                  {from?.name || ""}
                </div>
              </div>
              <div style={{ color: "#CBD5E1" }}>
                <ArrowLeftRight size={16} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#94A3B8",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  To
                </div>
                <div
                  style={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}
                >
                  {to?.iataCode || sliceInfo.destination}
                </div>
                <div style={{ fontSize: 11, color: "#64748B" }}>
                  {to?.name || ""}
                </div>
              </div>
            </div>

            <div style={{ width: 1, height: 36, background: "#E5E7EB" }} />

            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "#94A3B8",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Depart
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                {searchParams?.departureDate
                  ? new Date(
                      searchParams.departureDate + "T12:00:00",
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </div>
            </div>

            {returnDate && (
              <>
                <div style={{ width: 1, height: 36, background: "#E5E7EB" }} />
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#94A3B8",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Return
                  </div>
                  <div
                    style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}
                  >
                    {new Date(returnDate + "T12:00:00").toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" },
                    )}
                  </div>
                </div>
              </>
            )}

            <div style={{ width: 1, height: 36, background: "#E5E7EB" }} />

            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "#94A3B8",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Travelers
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                {(travelers?.adults || 1) +
                  (travelers?.children || 0) +
                  (travelers?.infants || 0)}{" "}
                · {travelers?.cabinClass || "Economy"}
              </div>
            </div>

            <button
              onClick={() => navigate(-1)}
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#2563EB",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "9px 18px",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <Edit2 size={14} /> Edit search
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "24px 32px",
          display: "flex",
          gap: 24,
        }}
      >
        {/* ── Left filter sidebar ── */}
        <div style={{ width: 260, flexShrink: 0 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              border: "1px solid #E5E7EB",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#0F172A",
                }}
              >
                <SlidersHorizontal size={15} style={{ color: "#2563EB" }} />
                Filters
              </div>
              <button
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 12,
                  color: "#2563EB",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => {
                  setMaxPrice(priceMax);
                  setStopsFilter({ 0: true, 1: true, "2+": true });
                  const a = {};
                  allAirlines.forEach((k) => (a[k] = true));
                  setAirlineFilter(a);
                }}
              >
                Clear all
              </button>
            </div>

            {/* Stops */}
            <FilterSection label="Stops">
              {[
                { key: 0, label: "Non-stop" },
                { key: 1, label: "1 stop" },
                { key: "2+", label: "2+ stops" },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={stopsFilter[key] !== false}
                    onChange={(e) =>
                      setStopsFilter((p) => ({ ...p, [key]: e.target.checked }))
                    }
                    style={{ accentColor: "#2563EB" }}
                  />
                  <span style={{ color: "#0F172A", flex: 1 }}>{label}</span>
                </label>
              ))}
            </FilterSection>

            <div style={{ borderTop: "1px solid #F1F5F9", margin: "14px 0" }} />

            {/* Airlines */}
            {allAirlines.length > 0 && (
              <>
                <FilterSection label="Airlines">
                  {allAirlines.map((code) => {
                    const displayName = airlineNameMap[code] || code;
                    const count = airlineOfferCount[code] || 0;
                    return (
                      <label
                        key={code}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 8,
                          cursor: "pointer",
                          fontSize: 13,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={airlineFilter[code] !== false}
                          onChange={(e) =>
                            setAirlineFilter((p) => ({
                              ...p,
                              [code]: e.target.checked,
                            }))
                          }
                          style={{ accentColor: "#2563EB" }}
                        />
                        <span
                          style={{ color: "#0F172A", flex: 1, fontSize: 12 }}
                        >
                          {displayName}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            color: "#94A3B8",
                            fontWeight: 600,
                          }}
                        >
                          {count}
                        </span>
                      </label>
                    );
                  })}
                </FilterSection>
                <div
                  style={{ borderTop: "1px solid #F1F5F9", margin: "14px 0" }}
                />
              </>
            )}

            {/* Price */}
            <FilterSection label="Max price">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: "#64748B",
                  marginBottom: 8,
                }}
              >
                <span>${priceMin}</span>
                <span style={{ fontWeight: 700, color: "#0F172A" }}>
                  ${maxPrice}
                </span>
              </div>
              <RangeSlider
                min={priceMin}
                max={priceMax}
                value={maxPrice}
                onChange={setMaxPrice}
              />
            </FilterSection>
          </div>
        </div>

        {/* ── Results ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#0F172A",
                margin: 0,
              }}
            >
              {processed.length} flight{processed.length !== 1 ? "s" : ""} found
            </h2>
            {totalOffers > 0 && (
              <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>
                of {totalOffers} total
              </span>
            )}
          </div>

          {/* Sort tabs */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            {[
              { id: "best", label: "Best", badge: "Recommended" },
              {
                id: "cheapest",
                label: "Cheapest",
                sub: `$${cheapestPrice.toFixed(0)}`,
              },
              {
                id: "fastest",
                label: "Fastest",
                sub: parseDuration(fastestDur),
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSort(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 18px",
                  borderRadius: 12,
                  border:
                    activeSort === tab.id
                      ? "1.5px solid #2563EB"
                      : "1px solid #E5E7EB",
                  background: activeSort === tab.id ? "#EFF6FF" : "#fff",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 700,
                  color: activeSort === tab.id ? "#2563EB" : "#374151",
                  transition: "all 0.15s",
                }}
              >
                {tab.label}
                {tab.badge && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      background: "#DBEAFE",
                      color: "#2563EB",
                      padding: "2px 7px",
                      borderRadius: 20,
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
                {tab.sub && (
                  <span
                    style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}
                  >
                    {tab.sub}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Flight list */}
          {offers.length === 0 ? (
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                border: "1px solid #E5E7EB",
                padding: "60px 24px",
                textAlign: "center",
              }}
            >
              <AlertCircle
                size={40}
                style={{ color: "#CBD5E1", marginBottom: 12 }}
              />
              <div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>
                No flights found
              </div>
              <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 6 }}>
                No flights are available for this route and date. Try different
                dates or nearby airports.
              </div>
              <button
                onClick={() => navigate(-1)}
                style={{
                  marginTop: 18,
                  background: "#2563EB",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 24px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Edit search
              </button>
            </div>
          ) : processed.length === 0 ? (
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                border: "1px solid #E5E7EB",
                padding: "60px 24px",
                textAlign: "center",
              }}
            >
              <AlertCircle
                size={40}
                style={{ color: "#CBD5E1", marginBottom: 12 }}
              />
              <div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>
                No flights match your filters
              </div>
              <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 6 }}>
                Try widening the price range or relaxing stop filters
              </div>
            </div>
          ) : (
            <>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {processed.slice(0, visibleCount).map((offer, i) => (
                  <FlightCard
                    key={offer.offerId || i}
                    offer={offer}
                    index={i}
                  />
                ))}
              </div>

              {/* Sentinel — IntersectionObserver watches this */}
              {visibleCount < processed.length && (
                <div
                  ref={sentinelRef}
                  style={{
                    padding: "32px 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  {/* Skeleton cards while loading next batch */}
                  {[1, 2].map((n) => (
                    <div
                      key={n}
                      style={{
                        width: "100%",
                        height: 110,
                        borderRadius: 18,
                        background:
                          "linear-gradient(90deg, #F1F5F9 0%, #E2E8F0 50%, #F1F5F9 100%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.4s infinite",
                        border: "1px solid #E5E7EB",
                      }}
                    />
                  ))}
                  <div
                    style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}
                  >
                    Showing {Math.min(visibleCount, processed.length)} of{" "}
                    {processed.length} flights
                  </div>
                </div>
              )}

              {/* End of results */}
              {visibleCount >= processed.length && processed.length > BATCH && (
                <div style={{ padding: "24px 0", textAlign: "center" }}>
                  <div
                    style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}
                  >
                    All {processed.length} flights shown
                  </div>
                </div>
              )}

              <style>{`
                @keyframes shimmer {
                  0% { background-position: 200% 0; }
                  100% { background-position: -200% 0; }
                }
              `}</style>
            </>
          )}
        </div>

        {/* ── Right sidebar ── */}
        <div
          style={{
            width: 270,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Why book */}
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              border: "1px solid #E5E7EB",
              padding: 20,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "#0F172A",
                marginBottom: 16,
              }}
            >
              Why book with us?
            </div>
            {[
              {
                icon: <Tag size={14} />,
                title: "Best Price Guarantee",
                sub: "We match the lowest price",
              },
              {
                icon: <Shield size={14} />,
                title: "Secure Payments",
                sub: "Your payment is 100% secure",
              },
              {
                icon: <Zap size={14} />,
                title: "Instant Confirmation",
                sub: "Get your e-ticket instantly",
              },
              {
                icon: <Headphones size={14} />,
                title: "24/7 Support",
                sub: "We're here to help anytime",
              },
            ].map(({ icon, title, sub }) => (
              <div
                key={title}
                style={{ display: "flex", gap: 12, marginBottom: 14 }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "#EFF6FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#2563EB",
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}
                  >
                    {title}
                  </div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
                    {sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Offer expiry notice */}
          {offers[0]?.expiresAt && (
            <div
              style={{
                background: "#FFFBEB",
                borderRadius: 14,
                border: "1px solid #FDE68A",
                padding: "14px 16px",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <Clock
                size={15}
                style={{ color: "#D97706", flexShrink: 0, marginTop: 1 }}
              />
              <div>
                <div
                  style={{ fontSize: 12, fontWeight: 700, color: "#92400E" }}
                >
                  Prices expire soon
                </div>
                <div style={{ fontSize: 11, color: "#B45309", marginTop: 2 }}>
                  Lock in your fare before{" "}
                  {new Date(offers[0].expiresAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Filter section wrapper ─────────────────────────────────────────────────
function FilterSection({ label, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: 4 }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px 0 10px",
          fontSize: 13,
          fontWeight: 700,
          color: "#0F172A",
        }}
      >
        {label}
        {open ? (
          <ChevronUp size={14} style={{ color: "#94A3B8" }} />
        ) : (
          <ChevronDown size={14} style={{ color: "#94A3B8" }} />
        )}
      </button>
      {open && children}
    </div>
  );
}
