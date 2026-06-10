import { useState } from "react";

const STATS = [
  { icon: "✈️", num: "500+", label: "Airlines" },
  { icon: "🏨", num: "1M+", label: "Hotel Deals" },
  { icon: "🛡️", num: "Secure", label: "Payments" },
  { icon: "🎧", num: "24/7", label: "Support" },
];

const DESTINATIONS = [
  {
    name: "Paris",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&q=75",
  },
  {
    name: "Dubai",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=200&q=75",
  },
  {
    name: "Bali",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200&q=75",
  },
  {
    name: "New York",
    img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=200&q=75",
  },
];

// ── Icons ──────────────────────────────────────────────────────────────────

function PlaneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M21 3L3 10.5l6.75 2.25L12 21l3-6.75L21 3z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 814 1000" fill="currentColor">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.3-57.9-155.5-127.4C58.1 791 10.8 662.8 10.8 541.6c0-194.3 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
    </svg>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 30,
          height: 30,
          background: "#1A56DB",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PlaneIcon />
      </div>
      <span
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "-0.3px",
        }}
      >
        Travelo
      </span>
    </div>
  );
}

function StatBadge({ icon, num, label }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(8px)",
        border: "0.5px solid rgba(255,255,255,0.2)",
        borderRadius: 8,
        padding: "10px 14px",
        textAlign: "center",
        minWidth: 76,
      }}
    >
      <div style={{ fontSize: 16, marginBottom: 2 }}>{icon}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{num}</div>
      <div
        style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginTop: 1 }}
      >
        {label}
      </div>
    </div>
  );
}

function DestCard({ name, img }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 7,
        overflow: "hidden",
        position: "relative",
        aspectRatio: "3/4",
        cursor: "pointer",
        transform: hovered ? "scale(1.04)" : "scale(1)",
        transition: "transform 0.2s ease",
      }}
    >
      <img
        src={img}
        alt={name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.65))",
          color: "#fff",
          fontSize: 10,
          fontWeight: 600,
          padding: "14px 6px 5px",
          textAlign: "center",
        }}
      >
        {name}
      </div>
    </div>
  );
}

function InputField({
  label,
  id,
  type,
  placeholder,
  icon,
  rightSlot,
  value,
  onChange,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 500,
          color: "#374151",
          marginBottom: 5,
        }}
      >
        {label}
      </label>
      <div
        style={{ position: "relative", display: "flex", alignItems: "center" }}
      >
        <span
          style={{
            position: "absolute",
            left: 12,
            pointerEvents: "none",
            color: "#9CA3AF",
            display: "flex",
          }}
        >
          {icon}
        </span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: "11px 40px",
            border: `1px solid ${focused ? "#1A56DB" : "#D1D5DB"}`,
            borderRadius: 8,
            fontSize: 13,
            color: "#111827",
            background: "#fff",
            outline: "none",
            fontFamily: "inherit",
            boxShadow: focused ? "0 0 0 3px rgba(26,86,219,0.1)" : "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
        />
        {rightSlot && (
          <span style={{ position: "absolute", right: 12 }}>{rightSlot}</span>
        )}
      </div>
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────

function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#111827",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        zIndex: 9999,
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        pointerEvents: "none",
      }}
    >
      {message}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [toast, setToast] = useState("");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function handleSignIn() {
    if (!email || !password) {
      showToast("Please enter your email and password.");
      return;
    }
    showToast(`Signing in as ${email}...`);
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 420px",
        minHeight: "100vh",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* ── LEFT HERO ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "28px 32px 28px",
          background: "#0a2a6e",
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            backgroundImage: `
            linear-gradient(135deg, rgba(10,42,110,0.72) 0%, rgba(10,42,110,0.3) 60%, rgba(0,0,0,0.25) 100%),
            url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80')
          `,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* All hero content sits above bg */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Logo />

          {/* Headline */}
          <div style={{ marginTop: "auto", paddingTop: 40 }}>
            <h1
              style={{
                fontSize: "clamp(36px, 4.5vw, 48px)",
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#fff",
                letterSpacing: "-1px",
                margin: 0,
              }}
            >
              Travel more.
              <br />
              <span style={{ color: "#60a5fa" }}>Pay less.</span>
            </h1>
            <p
              style={{
                marginTop: 10,
                fontSize: 14,
                color: "rgba(255,255,255,0.8)",
                maxWidth: 300,
                lineHeight: 1.6,
              }}
            >
              Book flights, hotels, cars and holiday packages at the best
              prices.
            </p>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 22,
                flexWrap: "wrap",
              }}
            >
              {STATS.map((s) => (
                <StatBadge key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              border: "0.5px solid rgba(255,255,255,0.18)",
              borderRadius: 10,
              padding: "14px 16px",
              marginTop: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
                Popular destinations
              </span>
              <a
                href="#"
                style={{
                  fontSize: 11,
                  color: "#93c5fd",
                  textDecoration: "none",
                }}
              >
                View all
              </a>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 8,
              }}
            >
              {DESTINATIONS.map((d) => (
                <DestCard key={d.name} {...d} />
              ))}
            </div>
          </div>

          {/* Trust bar */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 14,
              flexWrap: "wrap",
            }}
          >
            {[
              "🛡️ Trusted by millions worldwide",
              "🔒 Your data is safe with us",
            ].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  color: "rgba(255,255,255,0.8)",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 20,
                  padding: "4px 10px",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RIGHT SIGN-IN PANEL ── */}
      <aside
        style={{
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "36px 32px",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.07)",
        }}
      >
        <div style={{ width: "100%", maxWidth: 360 }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.4px",
              margin: 0,
            }}
          >
            Welcome back
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#6B7280",
              marginTop: 4,
              marginBottom: 24,
            }}
          >
            Sign in to continue your journey
          </p>

          <InputField
            label="Email address"
            id="email"
            type="email"
            placeholder="Enter your email"
            icon={<MailIcon />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            label="Password"
            id="password"
            type={showPw ? "text" : "password"}
            placeholder="Enter your password"
            icon={<LockIcon />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightSlot={
              <button
                onClick={() => setShowPw((v) => !v)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9CA3AF",
                  display: "flex",
                  padding: 0,
                }}
                aria-label="Toggle password visibility"
              >
                <EyeIcon open={showPw} />
              </button>
            }
          />

          {/* Remember / Forgot */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: 13,
                color: "#374151",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{
                  width: 14,
                  height: 14,
                  accentColor: "#1A56DB",
                  cursor: "pointer",
                }}
              />
              Remember me
            </label>
            <a
              href="#"
              style={{
                fontSize: 13,
                color: "#1A56DB",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Forgot password?
            </a>
          </div>

          {/* Sign in button */}
          <button
            onClick={handleSignIn}
            style={{
              width: "100%",
              padding: "13px",
              background: "#1A56DB",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1346C0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1A56DB")}
          >
            Sign in
          </button>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              margin: "16px 0",
              color: "#9CA3AF",
              fontSize: 12,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
            or continue with
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          </div>

          {/* Social buttons */}
          {[
            { label: "Continue with Google", icon: <GoogleIcon /> },
            { label: "Continue with Apple", icon: <AppleIcon /> },
          ].map(({ label, icon }) => (
            <button
              key={label}
              onClick={() =>
                showToast(`Redirecting to ${label.split(" ")[2]}...`)
              }
              style={{
                width: "100%",
                padding: "11px",
                background: "#fff",
                border: "1px solid #D1D5DB",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                color: "#374151",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                marginBottom: 10,
                fontFamily: "inherit",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#F9FAFB")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              {icon} {label}
            </button>
          ))}

          {/* Sign up link */}
          <p
            style={{
              textAlign: "center",
              marginTop: 16,
              fontSize: 13,
              color: "#6B7280",
            }}
          >
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                showToast("Opening account creation...");
              }}
              style={{
                color: "#1A56DB",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Create account
            </a>
          </p>
        </div>
      </aside>

      <Toast message={toast} />
    </div>
  );
}
