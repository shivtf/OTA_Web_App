// pages/Dashboard.jsx  –  refactored to use shared components
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Star,
  ChevronRight,
  Search,
  ArrowLeftRight,
  CreditCard,
  Clock,
  CheckCircle,
  Tag,
  Zap,
  Lock,
  LifeBuoy,
} from "lucide-react";

import Navbar from "../Navbar/navbar";
import Footer from "../Footer/footer";
import SearchBox from "../Commons/SearchBox";
import TrustBadges from "../Dashboard/TrustBadges";
import DestinationCard from "../Commons/DestinationCard";
import FlightCard from "../Commons/FlightCard";
import HotelCard from "../Commons/HotelCard";
import NewsletterBanner from "../Dashboard/NewsLetterBanner";

// ── Data ─────────────────────────────────────────────────────────────────────

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

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [likedHotels, setLikedHotels] = useState({});

  const toggleLike = (name) =>
    setLikedHotels((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="min-h-screen bg-[#f4f4f4] font-sans text-gray-900 overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-14 min-h-[480px] md:min-h-[520px] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(/hero_image.png)` }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-32 md:pt-20 md:pb-40">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-1.5"
          >
            <Star className="w-3.5 h-3.5 fill-blue-600 " /> Smart Travel, Better
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
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 -mt-24 relative z-10">
        <SearchBox onSearch={(v) => console.log("search", v)} />
      </div>

      {/* TRUST BADGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <TrustBadges />
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
          {destinations.map((dest, i) => (
            <DestinationCard key={dest.city} {...dest} index={i} />
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
          {flightDeals.map((deal, i) => (
            <FlightCard
              key={deal.airline + deal.from + deal.to}
              {...deal}
              index={i}
            />
          ))}
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
          {hotels.map((hotel, i) => (
            <HotelCard
              key={hotel.name}
              {...hotel}
              index={i}
              liked={!!likedHotels[hotel.name]}
              onLikeToggle={() => toggleLike(hotel.name)}
            />
          ))}
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
        <NewsletterBanner />
      </section>

      <Footer />
    </div>
  );
}
