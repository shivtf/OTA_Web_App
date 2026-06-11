import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { countries as countryData } from "country-data-list";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// ── Password strength ─────────────────────────────────────────────────────────
function getPasswordStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];

// ── Framer Motion variants ────────────────────────────────────────────────────
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};
const leftVariants = {
  hidden: { opacity: 0, x: -36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};
const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
  },
};
const navVariants = {
  hidden: { opacity: 0, y: -18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const formContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.35 } },
};
const formRowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
};
const errorVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, y: -4, scale: 0.97, transition: { duration: 0.16 } },
};
const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};
const modalCardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, y: 12, scale: 0.97, transition: { duration: 0.22 } },
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconUser = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ opacity: 0.45 }}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconMail = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ opacity: 0.45 }}
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const IconPhone = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ opacity: 0.45 }}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.19 12 19.79 19.79 0 0 1 1.15 3.4 2 2 0 0 1 3.12 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z" />
  </svg>
);
const IconCalendar = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ opacity: 0.45 }}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IconGlobe = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ opacity: 0.45 }}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const IconLock = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ opacity: 0.45 }}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconPassport = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ opacity: 0.45 }}
  >
    <rect x="2" y="3" width="20" height="18" rx="2" />
    <path d="M8 7h8M8 11h8M8 15h5" />
  </svg>
);
const IconEye = ({ off }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ opacity: 0.4 }}
  >
    {off ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);
const IconShield = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3b82f6"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconPadlock = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3b82f6"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconCheckCircle = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#22c55e"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconChevronDown = ({ color = "rgba(255,255,255,0.4)" }) => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconSpinner = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,0.5)"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ animation: "spin 0.8s linear infinite" }}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// ── Shared input style ────────────────────────────────────────────────────────
const inputBase = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: "10px",
  color: "#fff",
  fontSize: "13px",
  outline: "none",
  width: "100%",
  padding: "9px 12px",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label
        style={{
          fontSize: "12px",
          fontWeight: 500,
          color: "rgba(255,255,255,0.70)",
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            key="err"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ fontSize: "11px", color: "#f87171" }}
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Country Code Dropdown (searchable) ───────────────────────────────────────
function PhoneDialCodeSelect({ value, onChange, countries, loading }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const searchRef = useRef(null);

  const selected = countries.find((c) => c.idd === value) || null;

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.idd.includes(search),
  );

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "9px 8px 9px 10px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: "10px 0 0 10px",
          borderRight: "none",
          color: "#fff",
          fontSize: "13px",
          cursor: loading ? "not-allowed" : "pointer",
          whiteSpace: "nowrap",
          height: "100%",
          minWidth: "86px",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
          if (!loading)
            e.currentTarget.style.background = "rgba(255,255,255,0.09)";
        }}
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
        }
      >
        {loading ? (
          <IconSpinner />
        ) : selected ? (
          <>
            <span style={{ fontSize: "16px", lineHeight: 1 }}>
              {selected.flag}
            </span>
            <span
              style={{
                color: "rgba(255,255,255,0.80)",
                fontSize: "12.5px",
                fontWeight: 500,
              }}
            >
              {selected.idd}
            </span>
          </>
        ) : (
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>
            +--
          </span>
        )}
        <IconChevronDown
          color={open ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)"}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              width: "240px",
              zIndex: 200,
              background: "rgba(12,18,35,0.97)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "12px",
              boxShadow: "0 16px 40px rgba(0,0,0,0.55)",
              overflow: "hidden",
            }}
          >
            {/* Search */}
            <div style={{ padding: "8px 8px 4px" }}>
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country or code…"
                style={{
                  ...inputBase,
                  padding: "7px 10px",
                  fontSize: "12px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "8px",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(59,130,246,0.10)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
            {/* List */}
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                padding: "4px 0",
              }}
            >
              {filtered.length === 0 ? (
                <div
                  style={{
                    padding: "12px 14px",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.35)",
                    textAlign: "center",
                  }}
                >
                  No results
                </div>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onChange(c.idd);
                      setOpen(false);
                      setSearch("");
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      padding: "7px 12px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      background:
                        c.idd === value
                          ? "rgba(59,130,246,0.12)"
                          : "transparent",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      if (c.idd !== value)
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        c.idd === value
                          ? "rgba(59,130,246,0.12)"
                          : "transparent";
                    }}
                  >
                    <span
                      style={{ fontSize: "16px", lineHeight: 1, flexShrink: 0 }}
                    >
                      {c.flag}
                    </span>
                    <span
                      style={{
                        fontSize: "12.5px",
                        color: "rgba(255,255,255,0.80)",
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.name}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.45)",
                        flexShrink: 0,
                      }}
                    >
                      {c.idd}
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Success Modal ─────────────────────────────────────────────────────────────
function SuccessModal({ onOk, countdown }) {
  return (
    <motion.div
      variants={modalBackdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <motion.div
        variants={modalCardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          background: "rgba(10,15,28,0.92)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: "24px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          padding: "40px 36px",
          maxWidth: "400px",
          width: "90%",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 22,
            delay: 0.15,
          }}
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <IconCheckCircle />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          style={{
            color: "#fff",
            fontSize: "20px",
            fontWeight: 700,
            marginBottom: "10px",
          }}
        >
          Verify your email
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.35 }}
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: "13.5px",
            lineHeight: 1.6,
            marginBottom: "6px",
          }}
        >
          Your account has been created successfully.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.35 }}
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "13px",
            lineHeight: 1.6,
            marginBottom: "28px",
          }}
        >
          Please check your email and verify your account before signing in.
        </motion.p>
        <p
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.30)",
            marginBottom: "16px",
          }}
        >
          Redirecting in {countdown}s…
        </p>
        <motion.button
          onClick={onOk}
          whileHover={{
            scale: 1.02,
            y: -1,
            boxShadow: "0 8px 24px rgba(37,99,235,0.45)",
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          style={{
            width: "100%",
            padding: "11px",
            background: "linear-gradient(90deg, #2563eb, #3b82f6)",
            border: "none",
            borderRadius: "10px",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          OK
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate();

  // ── Country data from REST Countries API ─────────────────────────────────
  const countries = countryData.all
    .map((country) => ({
      code: country.alpha2,
      name: country.name,
      idd: country.countryCallingCodes?.[0] || "",
      flag: "",
    }))
    .filter((country) => country.idd)
    .sort((a, b) => a.name.localeCompare(b.name));

  const countriesLoading = false;
  const countriesError = "";
  // Default dial code for India once countries load
  const [dialCode, setDialCode] = useState("+1");
  // Default nationality (IN) resolved from loaded list
  const defaultNationality = "US";

  // ── Form state ────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: defaultNationality,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const countdownRef = useRef(null);
  const strength = getPasswordStrength(formData.password);

  useEffect(() => {
    if (showModal) {
      setCountdown(5);
      countdownRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(countdownRef.current);
            navigate("/login");
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdownRef.current);
  }, [showModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError) setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!formData.firstName.trim()) e.firstName = "First name is required.";
    if (!formData.lastName.trim()) e.lastName = "Last name is required.";
    if (!formData.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Enter a valid email.";
    if (!formData.phone.trim()) e.phone = "Phone number is required.";
    if (!formData.dateOfBirth) e.dateOfBirth = "Date of birth is required.";
    if (!formData.nationality) e.nationality = "Nationality is required.";
    if (!formData.passportNumber.trim())
      e.passportNumber = "Passport number is required.";
    if (!formData.password) e.password = "Password is required.";
    else if (formData.password.length < 6) e.password = "Minimum 6 characters.";
    if (!formData.confirmPassword)
      e.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setApiError("");
    try {
      await axios.post(
        `${BASE_URL}/auth/register`,
        {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: `${dialCode}${formData.phone}`, // full E.164 phone
          dateOfBirth: formData.dateOfBirth,
          nationality: formData.nationality,
          passportNumber: formData.passportNumber,
        },
        { headers: { "Content-Type": "application/json" } },
      );
      setShowModal(true);
    } catch (err) {
      if (err.response)
        setApiError(
          err.response.data?.message ||
            `Error ${err.response.status}. Please try again.`,
        );
      else if (err.request)
        setApiError("No response from server. Check your connection.");
      else setApiError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasErr) => ({
    ...inputBase,
    border: hasErr
      ? "1px solid rgba(248,113,113,0.7)"
      : "1px solid rgba(255,255,255,0.10)",
  });

  const onFocus = (e) => {
    e.currentTarget.style.borderColor = "rgba(59,130,246,0.6)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
  };
  const onBlur = (e, hasErr) => {
    e.currentTarget.style.borderColor = hasErr
      ? "rgba(248,113,113,0.7)"
      : "rgba(255,255,255,0.10)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow: hidden; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        select option { background: #0f172a; color: #fff; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
        .reg-input:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('/register.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(3,7,18,0.80) 0%, rgba(3,7,18,0.55) 45%, rgba(3,7,18,0.20) 100%)",
          }}
        />

        {/* ── Navbar ──────────────────────────────────────────────────────── */}
        <motion.nav
          variants={navVariants}
          initial="hidden"
          animate="visible"
          style={{
            position: "absolute",
            top: "20px",
            left: "35%",
            transform: "translateX(-50%)",
            zIndex: 50,
            display: "inline-flex",
            alignItems: "center",
            padding: "7px 18px 7px 7px",
            background: "rgba(15,22,40,0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "999px",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              marginRight: "18px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 2px 10px rgba(37,99,235,0.45)",
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
              </svg>
            </div>
            <span
              style={{
                fontSize: "14.5px",
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              <span style={{ color: "#ffffff" }}>Travel4</span>
              <span style={{ color: "#3b82f6" }}>Pennies</span>
            </span>
          </div>
          <div
            style={{
              width: "1px",
              height: "18px",
              background: "rgba(255,255,255,0.15)",
              marginRight: "18px",
              flexShrink: 0,
            }}
          />
          {["Support", "Contact"].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: "13.5px",
                fontWeight: 500,
                textDecoration: "none",
                marginRight: "20px",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.75)")
              }
            >
              {link}
            </a>
          ))}
          <div
            style={{
              width: "1px",
              height: "18px",
              background: "rgba(255,255,255,0.15)",
              marginRight: "16px",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              cursor: "pointer",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.65)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span
              style={{
                color: "rgba(255,255,255,0.80)",
                fontSize: "13.5px",
                fontWeight: 500,
              }}
            >
              USD
            </span>
            <IconChevronDown color="rgba(255,255,255,0.50)" />
          </div>
        </motion.nav>

        {/* ── Layout ──────────────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            width: "100%",
            height: "100%",
          }}
        >
          {/* LEFT 55% */}
          <motion.div
            variants={leftVariants}
            initial="hidden"
            animate="visible"
            style={{
              flex: "0 0 55%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "0 0 56px 56px",
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: "clamp(3rem, 5.5vw, 4.4rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                marginBottom: "20px",
              }}
            >
              Travel better<span style={{ color: "#3b82f6" }}>.</span>
              <br />
              Spend less<span style={{ color: "#3b82f6" }}>.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.65 }}
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)",
                lineHeight: 1.65,
                maxWidth: "360px",
                marginBottom: "36px",
              }}
            >
              Create your Travel4Pennies account and start discovering smarter
              ways to book flights, hotels and travel experiences.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.55 }}
              style={{ display: "flex", alignItems: "center", gap: "24px" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "7px" }}
              >
                <IconShield />
                <span
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: "12.5px",
                  }}
                >
                  Your data is safe with us.
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "7px" }}
              >
                <IconPadlock />
                <span
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: "12.5px",
                  }}
                >
                  Secure booking guaranteed.
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT 45% */}
          <div
            style={{
              flex: "0 0 45%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "72px 28px 16px",
              overflowY: "auto",
            }}
          >
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              style={{ width: "100%", maxWidth: "460px" }}
            >
              <div
                style={{
                  background: "rgba(10,15,25,0.65)",
                  backdropFilter: "blur(30px)",
                  WebkitBackdropFilter: "blur(30px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "24px",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
                  padding: "28px 28px 24px",
                }}
              >
                {/* Countries load error banner */}
                <AnimatePresence>
                  {countriesError && (
                    <motion.div
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      style={{
                        background: "rgba(239,68,68,0.10)",
                        border: "1px solid rgba(239,68,68,0.20)",
                        borderRadius: "8px",
                        padding: "9px 12px",
                        fontSize: "12px",
                        color: "#fca5a5",
                        marginBottom: "14px",
                      }}
                    >
                      {countriesError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Card header */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  style={{ marginBottom: "20px" }}
                >
                  <h2
                    style={{
                      color: "#fff",
                      fontSize: "22px",
                      fontWeight: 700,
                      marginBottom: "5px",
                    }}
                  >
                    Create your account
                  </h2>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: "13px",
                    }}
                  >
                    Start planning smarter journeys with Travel4Pennies.
                  </p>
                </motion.div>

                {/* Form */}
                <motion.div
                  variants={formContainerVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "13px",
                  }}
                >
                  {/* Row 1: Name */}
                  <motion.div
                    variants={formRowVariants}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                    }}
                  >
                    <Field label="First Name" error={errors.firstName}>
                      <div style={{ position: "relative" }}>
                        <span
                          style={{
                            position: "absolute",
                            left: "11px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            display: "flex",
                          }}
                        >
                          <IconUser />
                        </span>
                        <input
                          className="reg-input"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="First name"
                          style={{
                            ...inputStyle(errors.firstName),
                            paddingLeft: "30px",
                          }}
                          onFocus={onFocus}
                          onBlur={(e) => onBlur(e, errors.firstName)}
                        />
                      </div>
                    </Field>
                    <Field label="Last Name" error={errors.lastName}>
                      <div style={{ position: "relative" }}>
                        <span
                          style={{
                            position: "absolute",
                            left: "11px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            display: "flex",
                          }}
                        >
                          <IconUser />
                        </span>
                        <input
                          className="reg-input"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Last name"
                          style={{
                            ...inputStyle(errors.lastName),
                            paddingLeft: "30px",
                          }}
                          onFocus={onFocus}
                          onBlur={(e) => onBlur(e, errors.lastName)}
                        />
                      </div>
                    </Field>
                  </motion.div>

                  {/* Row 2: Email */}
                  <motion.div variants={formRowVariants}>
                    <Field label="Email Address" error={errors.email}>
                      <div style={{ position: "relative" }}>
                        <span
                          style={{
                            position: "absolute",
                            left: "11px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            display: "flex",
                          }}
                        >
                          <IconMail />
                        </span>
                        <input
                          className="reg-input"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                          style={{
                            ...inputStyle(errors.email),
                            paddingLeft: "30px",
                          }}
                          onFocus={onFocus}
                          onBlur={(e) => onBlur(e, errors.email)}
                        />
                      </div>
                    </Field>
                  </motion.div>

                  {/* Row 3: Phone — dial code picker + number input */}
                  <motion.div variants={formRowVariants}>
                    <Field label="Phone Number" error={errors.phone}>
                      <div style={{ display: "flex" }}>
                        {/* Country dial-code selector */}
                        <PhoneDialCodeSelect
                          value={dialCode}
                          onChange={setDialCode}
                          countries={countries}
                          loading={countriesLoading}
                        />
                        {/* Number input */}
                        <input
                          className="reg-input"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Phone number"
                          style={{
                            ...inputStyle(errors.phone),
                            borderRadius: "0 10px 10px 0",
                            flex: 1,
                          }}
                          onFocus={onFocus}
                          onBlur={(e) => onBlur(e, errors.phone)}
                        />
                      </div>
                    </Field>
                  </motion.div>

                  {/* Row 4: DOB + Nationality from API */}
                  <motion.div
                    variants={formRowVariants}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                    }}
                  >
                    <Field label="Date of Birth" error={errors.dateOfBirth}>
                      <div style={{ position: "relative" }}>
                        <span
                          style={{
                            position: "absolute",
                            left: "11px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            display: "flex",
                            zIndex: 1,
                          }}
                        >
                          <IconCalendar />
                        </span>
                        <input
                          className="reg-input"
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          style={{
                            ...inputStyle(errors.dateOfBirth),
                            paddingLeft: "30px",
                          }}
                          onFocus={onFocus}
                          onBlur={(e) => onBlur(e, errors.dateOfBirth)}
                        />
                      </div>
                    </Field>
                    <Field label="Nationality" error={errors.nationality}>
                      <div style={{ position: "relative" }}>
                        <span
                          style={{
                            position: "absolute",
                            left: "11px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            display: "flex",
                            zIndex: 1,
                          }}
                        >
                          {countriesLoading ? <IconSpinner /> : <IconGlobe />}
                        </span>
                        <select
                          className="reg-input"
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleChange}
                          disabled={countriesLoading}
                          style={{
                            ...inputStyle(errors.nationality),
                            paddingLeft: "30px",
                            paddingRight: "28px",
                            appearance: "none",
                            WebkitAppearance: "none",
                            cursor: countriesLoading
                              ? "not-allowed"
                              : "pointer",
                            opacity: countriesLoading ? 0.55 : 1,
                          }}
                          onFocus={onFocus}
                          onBlur={(e) => onBlur(e, errors.nationality)}
                        >
                          {countriesLoading ? (
                            <option value="">Loading…</option>
                          ) : (
                            countries.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.flag} {c.code} – {c.name}
                              </option>
                            ))
                          )}
                        </select>
                        <span
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            display: "flex",
                          }}
                        >
                          <IconChevronDown />
                        </span>
                      </div>
                    </Field>
                  </motion.div>

                  {/* Row 6: Password */}
                  <motion.div variants={formRowVariants}>
                    <Field label="Password" error={errors.password}>
                      <div style={{ position: "relative" }}>
                        <span
                          style={{
                            position: "absolute",
                            left: "11px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            display: "flex",
                          }}
                        >
                          <IconLock />
                        </span>
                        <input
                          className="reg-input"
                          type={showPass ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a password"
                          style={{
                            ...inputStyle(errors.password),
                            paddingLeft: "30px",
                            paddingRight: "38px",
                          }}
                          onFocus={onFocus}
                          onBlur={(e) => onBlur(e, errors.password)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass((v) => !v)}
                          style={{
                            position: "absolute",
                            right: "11px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            padding: 0,
                          }}
                        >
                          <IconEye off={showPass} />
                        </button>
                      </div>
                    </Field>
                  </motion.div>

                  {/* Row 7: Confirm Password */}
                  <motion.div variants={formRowVariants}>
                    <Field
                      label="Confirm Password"
                      error={errors.confirmPassword}
                    >
                      <div style={{ position: "relative" }}>
                        <span
                          style={{
                            position: "absolute",
                            left: "11px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            display: "flex",
                          }}
                        >
                          <IconLock />
                        </span>
                        <input
                          className="reg-input"
                          type={showConfirm ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          style={{
                            ...inputStyle(errors.confirmPassword),
                            paddingLeft: "30px",
                            paddingRight: "38px",
                          }}
                          onFocus={onFocus}
                          onBlur={(e) => onBlur(e, errors.confirmPassword)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          style={{
                            position: "absolute",
                            right: "11px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            padding: 0,
                          }}
                        >
                          <IconEye off={showConfirm} />
                        </button>
                      </div>
                    </Field>
                  </motion.div>

                  {/* Password strength */}
                  <AnimatePresence>
                    {formData.password && (
                      <motion.div
                        key="strength"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ marginTop: "-6px", overflow: "hidden" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "5px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "11px",
                              color: "rgba(255,255,255,0.40)",
                            }}
                          >
                            Password strength:
                          </span>
                          <motion.span
                            key={strength}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            style={{
                              fontSize: "11px",
                              color: strengthColors[strength],
                              fontWeight: 500,
                            }}
                          >
                            {strengthLabels[strength]}
                          </motion.span>
                        </div>
                        <div style={{ display: "flex", gap: "4px" }}>
                          {[1, 2, 3, 4].map((i) => (
                            <motion.div
                              key={i}
                              animate={{
                                background:
                                  i <= strength
                                    ? strengthColors[strength]
                                    : "rgba(255,255,255,0.10)",
                              }}
                              transition={{ duration: 0.3 }}
                              style={{
                                flex: 1,
                                height: "3px",
                                borderRadius: "2px",
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* API error */}
                  <AnimatePresence>
                    {apiError && (
                      <motion.div
                        key="apierr"
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{
                          background: "rgba(239,68,68,0.10)",
                          border: "1px solid rgba(239,68,68,0.20)",
                          borderRadius: "8px",
                          padding: "10px 12px",
                          fontSize: "12.5px",
                          color: "#fca5a5",
                        }}
                      >
                        {apiError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.div variants={formRowVariants}>
                    <motion.button
                      onClick={handleSubmit}
                      disabled={loading}
                      whileHover={
                        !loading
                          ? {
                              scale: 1.015,
                              y: -2,
                              boxShadow: "0 10px 28px rgba(37,99,235,0.50)",
                            }
                          : {}
                      }
                      whileTap={{ scale: 0.97 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 22,
                      }}
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: loading
                          ? "rgba(37,99,235,0.55)"
                          : "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
                        border: "none",
                        borderRadius: "10px",
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: loading ? "not-allowed" : "pointer",
                        boxShadow: "0 4px 16px rgba(37,99,235,0.30)",
                      }}
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </motion.button>
                  </motion.div>

                  {/* Sign in */}
                  <motion.p
                    variants={formRowVariants}
                    style={{
                      textAlign: "center",
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.40)",
                      marginTop: "2px",
                    }}
                  >
                    Already have an account?{" "}
                    <motion.button
                      onClick={() => navigate("/login")}
                      whileHover={{ color: "#93c5fd" }}
                      transition={{ duration: 0.15 }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#3b82f6",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 500,
                        padding: 0,
                      }}
                    >
                      Sign in
                    </motion.button>
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <SuccessModal
            key="modal"
            countdown={countdown}
            onOk={() => {
              clearInterval(countdownRef.current);
              navigate("/login");
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
