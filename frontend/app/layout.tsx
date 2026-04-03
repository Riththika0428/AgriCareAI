// import type { Metadata } from "next";
// import "./globals.css";

// export const metadata: Metadata = {
//   title: "AgriAI – Grow Smarter. Eat Better.",
//   description: "AI crop disease detection, smart weather alerts, direct marketplace and nutrition tracking for Sri Lanka.",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <head>
//         <link
//           href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap"
//           rel="stylesheet"
//         />
//       </head>
//       <body>{children}</body>
//     </html>
//   );
// }
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriAI – Grow Smarter. Eat Better.",
  description:
    "AI crop disease detection, smart weather alerts, direct marketplace and nutrition tracking for Sri Lanka.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/*
         * ── Cache-control meta tags ──────────────────────────────────────────
         * These tell the browser NOT to cache any page in this app.
         * This is the #1 fix for the back-button problem: when the user presses
         * back, the browser will not restore a stale cached page — it will
         * always re-fetch, which triggers the auth check in each page's
         * useEffect and redirects if the session has changed.
         *
         * Note: HTTP response headers set in next.config.js / middleware.ts
         * are more authoritative than meta tags, but meta tags work as a
         * reliable fallback for all browsers.
         */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />

        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}