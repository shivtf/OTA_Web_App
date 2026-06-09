import { useState } from "react";
import { motion } from "framer-motion";
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
import Navbar from "../Navbar/navbar";

// ── Inline SVG social icons ──────────────────────────────────────────────────
// lucide-react v1+ removed Facebook, Instagram, Twitter, Youtube.
// These drop-in replacements match the same API: className prop, currentColor.
const IconFacebook = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const IconInstagram = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const IconTwitterX = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const IconYoutube = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);
// ─────────────────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const destinations = [
  {
    city: "New York",
    country: "USA",
    price: 187,
    img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80",
  },
  {
    city: "Los Angeles",
    country: "USA",
    price: 199,
    img: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=400&q=80",
  },
  {
    city: "Miami",
    country: "USA",
    price: 165,
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  },
  {
    city: "Las Vegas",
    country: "USA",
    price: 142,
    img: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=400&q=80",
  },
  {
    city: "London",
    country: "UK",
    price: 237,
    img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80",
  },
  {
    city: "Dubai",
    country: "UAE",
    price: 289,
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80",
  },
];

const flightDeals = [
  {
    airline: "Delta Air Lines",
    color: "#E31837",
    from: "JFK",
    to: "LAX",
    dep: "08:30 AM",
    arr: "11:45 AM",
    dur: "6h 15m",
    stops: "Non-stop",
    price: 187,
    orig: 259,
    stopColor: "text-green-600 bg-green-50",
  },
  {
    airline: "United Airlines",
    color: "#004687",
    from: "JFK",
    to: "SFO",
    dep: "09:15 AM",
    arr: "01:20 PM",
    dur: "7h 05m",
    stops: "1 stop",
    price: 212,
    orig: 289,
    stopColor: "text-orange-500 bg-orange-50",
  },
  {
    airline: "American Airlines",
    color: "#B11116",
    from: "JFK",
    to: "MIA",
    dep: "07:40 AM",
    arr: "01:20 PM",
    dur: "3h 20m",
    stops: "Non-stop",
    price: 156,
    orig: 219,
    stopColor: "text-green-600 bg-green-50",
  },
  {
    airline: "Southwest",
    color: "#304CB2",
    from: "JFK",
    to: "LAS",
    dep: "10:20 AM",
    arr: "02:35 PM",
    dur: "7h 15m",
    stops: "1 stop",
    price: 189,
    orig: 249,
    stopColor: "text-orange-500 bg-orange-50",
  },
];

const hotels = [
  {
    name: "Arlo Midtown",
    location: "New York, USA",
    rating: 4.6,
    price: 289,
    amenities: ["Free Wi-Fi", "Breakfast"],
    img: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&q=80",
  },
  {
    name: "The Beverly Hills Hotel",
    location: "Los Angeles, USA",
    rating: 4.7,
    price: 320,
    amenities: ["Pool", "Breakfast"],
    img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&q=80",
  },
  {
    name: "1 Hotel South Beach",
    location: "Miami, USA",
    rating: 4.5,
    price: 275,
    amenities: ["Spa", "Breakfast"],
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
  },
  {
    name: "The Cosmopolitan",
    location: "Las Vegas, USA",
    rating: 4.6,
    price: 310,
    amenities: ["Pool", "Free Wi-Fi"],
    img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80",
  },
];

const trustFeatures = [
  {
    icon: Shield,
    title: "Secure Payments",
    desc: "Your payment is 100% secure and protected.",
  },
  {
    icon: Tag,
    title: "Best Price Guarantee",
    desc: "We compare prices to get you the best deal.",
  },
  {
    icon: Zap,
    title: "Instant Confirmation",
    desc: "Get booking confirmation instantly via email.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Our team is here to help you anytime.",
  },
  {
    icon: CalendarCheck,
    title: "Flexible Booking",
    desc: "Easy changes and cancellation options.",
  },
];

const whyChoose = [
  {
    icon: Clock,
    title: "Real-time Pricing",
    desc: "Always up-to-date prices and availability.",
  },
  {
    icon: CheckCircle,
    title: "Trusted Partners",
    desc: "We work with top airlines and hotels worldwide.",
  },
  {
    icon: Tag,
    title: "Transparent Pricing",
    desc: "No hidden fees. What you see is what you pay.",
  },
  {
    icon: Zap,
    title: "Easy & Fast Booking",
    desc: "Book in just a few clicks anytime, anywhere.",
  },
  {
    icon: Lock,
    title: "Secure Checkout",
    desc: "Your data is safe with bank-level encryption.",
  },
  {
    icon: LifeBuoy,
    title: "Dedicated Support",
    desc: "24/7 support via chat, email and phone.",
  },
];

const AirlineLogo = ({ airline, color }) => (
  <div className="flex items-center gap-1.5">
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center"
      style={{ backgroundColor: color }}
    >
      <Plane className="w-3 h-3 text-white" />
    </div>
    <span className="text-sm font-medium text-gray-800">{airline}</span>
  </div>
);

export default function Dashboard() {
  const [likedHotels, setLikedHotels] = useState({});
  const [activeTab, setActiveTab] = useState("flights");
  const tabs = [
    { id: "flights", label: "Flights", icon: Plane },
    { id: "hotels", label: "Hotels", icon: Hotel },
    { id: "cars", label: "Cars", icon: Car },
  ];

  // Social icon components keyed for the footer map
  const socialIcons = [
    { Icon: IconFacebook, label: "Facebook" },
    { Icon: IconInstagram, label: "Instagram" },
    { Icon: IconTwitterX, label: "X (Twitter)" },
    { Icon: IconYoutube, label: "YouTube" },
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f4] font-sans text-gray-900">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-14 min-h-[480px] md:min-h-[520px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-32 md:pt-20 md:pb-40">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-1.5"
          >
            <Star className="w-3.5 h-3.5 fill-blue-600" /> Smart Travel, Better
            Deals
          </motion.p>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-1"
          >
            Travel more.
          </motion.h1>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-5xl md:text-6xl font-extrabold leading-tight text-blue-600 mb-5"
          >
            Pay less.
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="text-gray-500 text-base max-w-xs"
          >
            Search and book flights, hotels and more from hundreds of trusted
            partners.
          </motion.p>
        </div>
      </section>

      {/* SEARCH BOX */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5"
        >
          {/* Tabs */}
          <div className="flex gap-1 mb-5 border-b border-gray-100">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all rounded-t-lg -mb-px ${
                  activeTab === id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {/* Search Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            <div className="lg:col-span-1">
              <label className="text-xs text-gray-500 mb-1 block">From</label>
              <div className="border border-gray-200 rounded-lg px-3 py-2.5 flex flex-col hover:border-blue-400 transition cursor-pointer">
                <span className="font-semibold text-sm">New York (JFK)</span>
                <span className="text-xs text-gray-400">NYC</span>
              </div>
            </div>
            <div className="items-end justify-center pb-2 lg:col-span-0 hidden lg:flex">
              <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition">
                <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
              </button>
            </div>
            <div className="lg:col-span-1">
              <label className="text-xs text-gray-500 mb-1 block">To</label>
              <div className="border border-gray-200 rounded-lg px-3 py-2.5 flex flex-col hover:border-blue-400 transition cursor-pointer">
                <span className="font-semibold text-sm">Los Angeles (LAX)</span>
                <span className="text-xs text-gray-400">LAX</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Depart</label>
              <div className="border border-gray-200 rounded-lg px-3 py-2.5 flex items-center justify-between hover:border-blue-400 transition cursor-pointer">
                <div>
                  <div className="font-semibold text-sm">May 24, 2025</div>
                  <div className="text-xs text-gray-400">Sat</div>
                </div>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Return</label>
              <div className="border border-gray-200 rounded-lg px-3 py-2.5 flex items-center justify-between hover:border-blue-400 transition cursor-pointer">
                <div>
                  <div className="font-semibold text-sm">May 31, 2025</div>
                  <div className="text-xs text-gray-400">Sat</div>
                </div>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Travelers & Class
              </label>
              <div className="border border-gray-200 rounded-lg px-3 py-2.5 flex items-center justify-between hover:border-blue-400 transition cursor-pointer">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">
                    1 Traveler, Economy
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600"
              />
              Add return trip
            </label>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-semibold text-sm transition"
            >
              <Search className="w-4 h-4" /> Search flights
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* TRUST BADGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {trustFeatures.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="flex gap-3 items-start"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5 text-blue-600" size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">Popular destinations</h2>
          <a
            href="#"
            className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline"
          >
            View all destinations <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {destinations.map(({ city, country, price, img }, i) => (
            <motion.div
              key={city}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i * 0.5}
              whileHover={{ y: -4 }}
              className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-[3/4]"
            >
              <img
                src={img}
                alt={city}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="font-bold text-sm leading-tight">{city}</p>
                <p className="text-xs text-white/70">{country}</p>
                <p className="text-xs mt-1 text-white/90">
                  From <span className="font-bold">${price}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FLIGHT DEALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Best flight deals</h2>
            <span className="text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">
              Limited time offers
            </span>
          </div>
          <a
            href="#"
            className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline"
          >
            View all flights <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {flightDeals.map(
            (
              {
                airline,
                color,
                from,
                to,
                dep,
                arr,
                dur,
                stops,
                price,
                orig,
                stopColor,
              },
              i,
            ) => (
              <motion.div
                key={airline + from + to}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.5}
                whileHover={{
                  y: -2,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.10)",
                }}
                className="bg-white border border-gray-100 rounded-2xl p-4 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <AirlineLogo airline={airline} color={color} />
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stopColor}`}
                  >
                    {stops}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold">{from}</span>
                  <div className="flex-1 flex items-center gap-1">
                    <div className="flex-1 border-t border-dashed border-gray-300" />
                    <Plane className="w-3.5 h-3.5 text-gray-400" />
                    <div className="flex-1 border-t border-dashed border-gray-300" />
                  </div>
                  <span className="text-lg font-bold">{to}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-3">
                  <span>{dep}</span>
                  <span className="text-gray-400">{dur}</span>
                  <span>{arr}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-extrabold text-blue-600">
                      ${price}
                    </span>
                    <span className="text-sm text-gray-400 line-through ml-1">
                      ${orig}
                    </span>
                  </div>
                  <button className="text-xs font-semibold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition">
                    View deal
                  </button>
                </div>
              </motion.div>
            ),
          )}
        </div>
      </section>

      {/* HOTELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">Top hotels</h2>
          <a
            href="#"
            className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline"
          >
            View all hotels <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hotels.map(
            ({ name, location, rating, price, amenities, img }, i) => (
              <motion.div
                key={name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.5}
                whileHover={{ y: -3 }}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={img}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold">{rating}</span>
                  </div>
                  <button
                    onClick={() =>
                      setLikedHotels((p) => ({
                        ...p,
                        [name]: !p[name],
                      }))
                    }
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${likedHotels[name] ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                    />
                  </button>
                </div>
                <div className="p-4">
                  <p className="font-bold text-sm">{name}</p>
                  <p className="text-xs text-gray-500 mb-2">{location}</p>
                  <div className="flex gap-3 mb-3">
                    {amenities.map((a) => (
                      <span
                        key={a}
                        className="text-xs text-gray-500 flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3 text-blue-400" /> {a}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-extrabold text-blue-600">
                      ${price}
                      <span className="text-xs font-normal text-gray-400">
                        {" "}
                        /night
                      </span>
                    </span>
                    <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
                      Book now
                    </button>
                  </div>
                </div>
              </motion.div>
            ),
          )}
        </div>
      </section>

      {/* HOW IT WORKS + WHY CHOOSE */}
      <section className="bg-gray-50 mt-8 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12">
          {/* How it works */}
          <div>
            <h2 className="text-2xl font-bold mb-8">How it works</h2>
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  color: "bg-blue-600",
                  title: "Search",
                  desc: "Search flights or hotels by your preferred dates, destinations and more.",
                  icon: Search,
                },
                {
                  step: 2,
                  color: "bg-blue-500",
                  title: "Compare",
                  desc: "Compare prices, airlines, hotels and amenities to find the best option.",
                  icon: ArrowLeftRight,
                },
                {
                  step: 3,
                  color: "bg-green-500",
                  title: "Book",
                  desc: "Book securely in minutes and get instant confirmation on your email.",
                  icon: CreditCard,
                },
              ].map(({ step, color, title, desc, icon: Icon }) => (
                <motion.div
                  key={step}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={step * 0.3}
                  className="flex items-start gap-4"
                >
                  <div
                    className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {step}. {title}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Why choose */}
          <div>
            <h2 className="text-2xl font-bold mb-8">
              Why choose Travel4Pennies?
            </h2>
            <div className="grid grid-cols-2 gap-5">
              {whyChoose.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i * 0.2}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                      {desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="bg-blue-600 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-white">
              Get the best travel deals in your inbox
            </h3>
            <p className="text-sm text-blue-100 mt-1">
              Subscribe to our newsletter and never miss exclusive offers.
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 md:w-64 px-4 py-2.5 rounded-xl text-sm bg-white/90 placeholder-gray-400 outline-none focus:bg-white transition"
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-blue-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:shadow-lg transition shrink-0"
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-50 border-t border-gray-100 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-1.5 font-bold text-xl text-blue-600 mb-3">
                <Plane className="w-5 h-5" /> Travel4Pennies
              </div>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                Your trusted travel partner for flights, hotels and
                unforgettable experiences.
              </p>
              {/* Social icons — inline SVGs replace removed lucide-react exports */}
              <div className="flex gap-3 mt-4">
                {socialIcons.map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center text-gray-500 transition"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            {[
              {
                title: "Company",
                links: ["About Us", "Careers", "Blog", "Press"],
              },
              {
                title: "Support",
                links: [
                  "Help Center",
                  "Contact Us",
                  "FAQs",
                  "Terms of Service",
                ],
              },
              {
                title: "Explore",
                links: ["Flights", "Hotels", "Packages", "Destinations"],
              },
              {
                title: "Policies",
                links: [
                  "Privacy Policy",
                  "Cookie Policy",
                  "Refund Policy",
                  "Accessibility",
                ],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="font-semibold text-sm mb-3">{title}</p>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-gray-500 hover:text-blue-600 transition"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              © 2025 Travel4Pennies. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 mr-1">
                Secure Payments
              </span>
              {["VISA", "MC", "AMEX", "PP"].map((card) => (
                <div
                  key={card}
                  className="px-2.5 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-gray-600"
                >
                  {card}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
