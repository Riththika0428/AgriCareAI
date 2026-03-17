import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriAI – Grow Smarter. Eat Better.",
  description: "AI crop disease detection, smart weather alerts, direct marketplace and nutrition tracking for Sri Lanka.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}