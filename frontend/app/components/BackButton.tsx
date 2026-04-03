/**
 * components/BackButton.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Drop-in back button + logo for every Agreal page.
 *
 * Usage — sub-page with back button:
 *   <BackButton fallback="/dashboard/farmer" />
 *
 * Usage — logo that always goes home:
 *   <AppLogo />
 *
 * Usage — both together in a page header:
 *   <PageHeader title="Crop Doctor" backTo="/dashboard/farmer" />
 */

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Agreal palette (matches your design tokens) ──────────────────────────────
const C = {
  forest:    "#1a3a2a",
  sage:      "#6aaa78",
  cream:     "#f4f0e8",
  text:      "#1a3a2a",
  textMuted: "#7a9a84",
  border:    "rgba(26,58,42,0.1)",
  white:     "#ffffff",
};

// ─── AppLogo ──────────────────────────────────────────────────────────────────
// Clicking this always navigates to "/" (the landing page).
// Works from any page, any role.
export function AppLogo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link
      href="/"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      {/* Leaf icon */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: C.sage,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C6.5 2 3 7 3 12c0 3.5 2 6.5 5 8l1-3c-2-1-3-3-3-5 0-3.5 2.5-7 6-7s6 3.5 6 7c0 2-1 4-3 5l1 3c3-1.5 5-4.5 5-8 0-5-3.5-10-9-10z"
            fill="white"
          />
          <path
            d="M12 8v8M9 14l3 3 3-3"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand name — hidden when collapsed (e.g. mobile sidebar) */}
      {!collapsed && (
        <span
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: C.white,
            fontFamily: "'Playfair Display', serif",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
        >
          Agreal<span style={{ color: "#f0c96b" }}>.</span>
        </span>
      )}
    </Link>
  );
}

// ─── BackButton ───────────────────────────────────────────────────────────────
// Shows "← Back to X" on sub-pages.
//
// Props:
//   fallback  — the route to go to (always used — we never call router.back()
//               because that can leave the app entirely if the user arrived
//               via a direct link / bookmark)
//   label     — custom label, defaults to "Back"
//   light     — use light (white/cream) colours for dark sidebar backgrounds
export function BackButton({
  fallback,
  label = "Back",
  light = false,
}: {
  fallback: string;
  label?: string;
  light?: boolean;
}) {
  const router = useRouter();

  const handleClick = () => {
    // Always navigate to the fixed fallback route.
    // Using router.replace() keeps the history stack clean —
    // the user cannot press Back again to return to the sub-page
    // they just left.
    router.replace(fallback);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "6px 0",
        color: light ? "rgba(168,213,181,0.8)" : C.textMuted,
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        transition: "color 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = light
          ? "#a8d5b5"
          : C.sage;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = light
          ? "rgba(168,213,181,0.8)"
          : C.textMuted;
      }}
    >
      {/* Arrow icon */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M19 12H5M5 12l7 7M5 12l7-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </button>
  );
}

// ─── PageHeader ───────────────────────────────────────────────────────────────
// Combines back button + page title in one component.
// Use this at the top of every sub-page.
//
//   <PageHeader title="Crop Doctor" backTo="/dashboard/farmer" />
//   <PageHeader title="My Orders"   backTo="/dashboard/consumer" />
//   <PageHeader title="AI Reports"  backTo="/dashboard/admin" />
export function PageHeader({
  title,
  backTo,
  backLabel,
  subtitle,
  action,
}: {
  title: string;
  backTo: string;
  backLabel?: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  // Build a smart label: "Back to Farmer Dashboard" instead of just "Back"
  const smartLabel =
    backLabel ??
    `Back to ${
      backTo.includes("farmer")
        ? "Farmer Dashboard"
        : backTo.includes("consumer")
        ? "Consumer Dashboard"
        : backTo.includes("admin")
        ? "Admin Dashboard"
        : "Dashboard"
    }`;

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Back button row */}
      <BackButton fallback={backTo} label={smartLabel} />

      {/* Title row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: 8,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: C.text,
              fontFamily: "'Playfair Display', serif",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: 13,
                color: C.textMuted,
                margin: "4px 0 0",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}