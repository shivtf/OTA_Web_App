import { useState, useId } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, Globe, ChevronDown, Plane } from "lucide-react";
import authService from "../api/authService";

// ── Utility: extract a readable message from any error shape ─────────────────
function parseError(err) {
  if (!err) return "Something went wrong. Please try again.";
  if (err.response) {
    const { data, status } = err.response;
    if (status === 401) return "Incorrect email or password.";
    if (status === 422 && data?.errors) {
      const first = Object.values(data.errors)[0];
      return Array.isArray(first) ? first[0] : first;
    }
    return data?.message || `Server error (${status}).`;
  }
  if (err.request) return "No response from server. Check your connection.";
  return err.message || "An unexpected error occurred.";
}

// ── Glassmorphism Navbar ──────────────────────────────────────────────────────
function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6 px-5 py-2.5 rounded-full"
      style={{
        background: "rgba(10, 15, 30, 0.55)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 group"
        aria-label="Travel4Pennies home"
      >
        <span
          className="flex items-center justify-center w-7 h-7 rounded-full"
          style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
        >
          <Plane size={14} className="text-white" strokeWidth={2.5} />
        </span>
        <span className="text-white font-semibold text-sm tracking-tight whitespace-nowrap">
          Travel<span className="text-blue-400">4Pennies</span>
        </span>
      </Link>

      <div className="w-px h-4 bg-white/15" aria-hidden="true" />

      {/* Links */}
      <Link
        to="/support"
        className="text-white/65 hover:text-white text-sm transition-colors duration-150"
      >
        Support
      </Link>
      <Link
        to="/contact"
        className="text-white/65 hover:text-white text-sm transition-colors duration-150"
      >
        Contact
      </Link>

      <div className="w-px h-4 bg-white/15" aria-hidden="true" />

      {/* Currency selector */}
      <button
        type="button"
        className="flex items-center gap-1.5 text-white/65 hover:text-white text-sm transition-colors duration-150"
      >
        <Globe size={13} />
        <span>USD</span>
        <ChevronDown size={11} />
      </button>
    </motion.nav>
  );
}

// ── Google Button ─────────────────────────────────────────────────────────────
function GoogleButton({ disabled }) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium text-white/85 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,0.10)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
      }
    >
      {/* Google "G" SVG */}
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Continue with Google
    </motion.button>
  );
}

// ── Main Login Page ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();
  const emailId = useId();
  const passwordId = useId();

  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // ── Inline validation ──────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    if (errorMsg) setErrorMsg("");
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      await authService.login({ email: form.email, password: form.password });
      setStatus("success");
      // Brief success flash before redirect
      setTimeout(() => navigate("/dashboard", { replace: true }), 5000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(parseError(err));
    }
  };

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden">
      {/* ── Background ──────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/login.png')`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(2,8,20,0.75) 0%, rgba(5,12,30,0.50) 55%, rgba(2,8,20,0.82) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <Navbar />

      {/* ── Main layout ─────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col md:flex-row h-full w-full">
        {/* ── LEFT: Hero copy (65%) ──────────────────────────────────────── */}
        <motion.div
          className="hidden md:flex flex-col justify-end pb-20 pl-12 lg:pl-20 pr-8"
          style={{ flex: "0 0 65%" }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center gap-2 mb-5"
          >
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
              style={{
                color: "#93c5fd",
                background: "rgba(59,130,246,0.12)",
                border: "1px solid rgba(59,130,246,0.25)",
                letterSpacing: "0.12em",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Smart travel, starting now
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="text-white font-extrabold leading-none tracking-tight mb-5"
            style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)" }}
          >
            Travel better.
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, #60a5fa 0%, #818cf8 60%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Spend less.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="text-white/55 max-w-md leading-relaxed"
            style={{ fontSize: "clamp(1rem, 1.5vw, 1.15rem)" }}
          >
            Join Travel4Pennies and discover a smarter way to book travel.
            <br className="hidden lg:block" /> Great prices, zero compromise.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.65 }}
            className="flex items-center gap-8 mt-10"
          >
            {/* {[
              { value: "2M+", label: "Travellers" },
              { value: "$340", label: "Avg. saved/trip" },
              { value: "190+", label: "Destinations" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span
                  className="font-bold text-white"
                  style={{ fontSize: "clamp(1.3rem, 2vw, 1.6rem)" }}
                >
                  {value}
                </span>
                <span className="text-xs text-white/40 uppercase tracking-wider">
                  {label}
                </span>
              </div>
            ))} */}
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Auth card (35%) ─────────────────────────────────────── */}
        <div
          className="flex items-center justify-center w-full md:justify-end px-4 md:pr-10 lg:pr-16 pt-24 pb-8 md:pt-0 md:pb-0"
          style={{ flex: "0 0 35%" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="w-full"
            style={{ maxWidth: "420px" }}
          >
            <div
              className="rounded-[32px] p-7 sm:p-8"
              style={{
                background: "rgba(10,15,25,0.65)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow:
                  "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) inset",
              }}
            >
              {/* Card header */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="mb-7"
              >
                {/* Mobile logo */}
                <div className="flex md:hidden items-center gap-2 mb-5">
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                    }}
                  >
                    <Plane size={15} className="text-white" strokeWidth={2.5} />
                  </span>
                  <span className="text-white font-semibold text-sm tracking-tight">
                    Travel<span className="text-blue-400">4Pennies</span>
                  </span>
                </div>

                <h2
                  className="font-bold text-white mb-1.5"
                  style={{ fontSize: "1.55rem" }}
                >
                  Welcome back
                </h2>
                <p className="text-sm text-white/45">
                  Sign in to continue to Travel4Pennies.
                </p>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55, duration: 0.45 }}
                >
                  <label
                    htmlFor={emailId}
                    className="block text-xs font-medium text-white/55 mb-1.5 tracking-wide"
                  >
                    Email Address
                  </label>
                  <input
                    id={emailId}
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={isLoading || isSuccess}
                    placeholder="Enter your email"
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={
                      fieldErrors.email ? `${emailId}-err` : undefined
                    }
                    className="w-full text-sm text-white placeholder-white/25 rounded-xl px-4 py-2.5 outline-none transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: fieldErrors.email
                        ? "1px solid rgba(248,113,113,0.7)"
                        : "1px solid rgba(255,255,255,0.10)",
                    }}
                    onFocus={(e) => {
                      if (!fieldErrors.email)
                        e.currentTarget.style.border =
                          "1px solid rgba(99,102,241,0.65)";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(99,102,241,0.15)";
                    }}
                    onBlur={(e) => {
                      if (!fieldErrors.email)
                        e.currentTarget.style.border =
                          "1px solid rgba(255,255,255,0.10)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  <AnimatePresence>
                    {fieldErrors.email && (
                      <motion.p
                        id={`${emailId}-err`}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="mt-1.5 text-xs text-red-400"
                        role="alert"
                      >
                        {fieldErrors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.62, duration: 0.45 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor={passwordId}
                      className="block text-xs font-medium text-white/55 tracking-wide"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      tabIndex={isLoading ? -1 : 0}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-150"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id={passwordId}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={form.password}
                      onChange={handleChange}
                      disabled={isLoading || isSuccess}
                      placeholder="••••••••"
                      aria-invalid={!!fieldErrors.password}
                      aria-describedby={
                        fieldErrors.password ? `${passwordId}-err` : undefined
                      }
                      className="w-full text-sm text-white placeholder-white/25 rounded-xl px-4 py-2.5 pr-11 outline-none transition-all duration-200 disabled:opacity-50"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: fieldErrors.password
                          ? "1px solid rgba(248,113,113,0.7)"
                          : "1px solid rgba(255,255,255,0.10)",
                      }}
                      onFocus={(e) => {
                        if (!fieldErrors.password)
                          e.currentTarget.style.border =
                            "1px solid rgba(99,102,241,0.65)";
                        e.currentTarget.style.boxShadow =
                          "0 0 0 3px rgba(99,102,241,0.15)";
                      }}
                      onBlur={(e) => {
                        if (!fieldErrors.password)
                          e.currentTarget.style.border =
                            "1px solid rgba(255,255,255,0.10)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors duration-150"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {fieldErrors.password && (
                      <motion.p
                        id={`${passwordId}-err`}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="mt-1.5 text-xs text-red-400"
                        role="alert"
                      >
                        {fieldErrors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Remember me */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.68, duration: 0.4 }}
                  className="flex items-center gap-2.5"
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={rememberMe}
                    onClick={() => setRememberMe((v) => !v)}
                    disabled={isLoading}
                    className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    style={{
                      background: rememberMe
                        ? "linear-gradient(135deg, #3b82f6, #6366f1)"
                        : "rgba(255,255,255,0.07)",
                      border: rememberMe
                        ? "1px solid transparent"
                        : "1px solid rgba(255,255,255,0.18)",
                    }}
                  >
                    {rememberMe && (
                      <svg
                        width="9"
                        height="7"
                        viewBox="0 0 9 7"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M1 3.5L3.5 6L8 1"
                          stroke="white"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                  <span
                    className="text-xs text-white/45 cursor-pointer select-none"
                    onClick={() => setRememberMe((v) => !v)}
                  >
                    Keep me signed in
                  </span>
                </motion.div>

                {/* Global error */}
                <AnimatePresence>
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.25 }}
                      role="alert"
                      className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm text-red-300"
                      style={{
                        background: "rgba(239,68,68,0.10)",
                        border: "1px solid rgba(239,68,68,0.20)",
                      }}
                    >
                      <svg
                        className="flex-shrink-0 mt-0.5"
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm.75 3.75a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5zm-.75 6.5a.875.875 0 110-1.75.875.875 0 010 1.75z" />
                      </svg>
                      {errorMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sign In button */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.72, duration: 0.45 }}
                >
                  <motion.button
                    type="submit"
                    disabled={isLoading || isSuccess}
                    whileHover={
                      !isLoading && !isSuccess
                        ? {
                            scale: 1.015,
                            y: -2,
                            boxShadow: "0 10px 30px rgba(99,102,241,0.45)",
                          }
                        : {}
                    }
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-opacity duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: isSuccess
                        ? "linear-gradient(135deg, #22c55e, #16a34a)"
                        : "linear-gradient(135deg, #3b82f6 0%, #6366f1 60%, #818cf8 100%)",
                      boxShadow: "0 4px 20px rgba(99,102,241,0.30)",
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Signing in…
                      </>
                    ) : isSuccess ? (
                      <>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M2.5 8.5l4 4 7-8"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Redirecting…
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </motion.button>
                </motion.div>
              </form>

              {/* Divider */}
              {/* <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-xs text-white/30">or continue with</span>
                <div className="flex-1 h-px bg-white/8" />
              </div> */}

              {/* Google SSO */}
              {/* <GoogleButton disabled={isLoading || isSuccess} /> */}

              {/* Sign-up link */}
              <p className="text-center text-xs text-white/35 mt-5">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-150"
                >
                  Create account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
