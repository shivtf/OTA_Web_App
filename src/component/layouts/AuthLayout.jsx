import { Outlet } from "react-router-dom";

/**
 * AuthLayout
 * Wraps authentication pages (Login, Register, ForgotPassword, etc.).
 * Handles the full-viewport background and passes children through.
 */
export default function AuthLayout() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden font-sans">
      {/* ── Full-screen background image ──────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/login.png')`,
        }}
        aria-hidden="true"
      />

      {/* ── Dark atmospheric overlay ──────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(2,8,20,0.72) 0%, rgba(5,12,30,0.55) 50%, rgba(2,8,20,0.80) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Page content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
