import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriAI – Smart Farming Platform",
  description: "AI crop disease detection, nutrition tracking & direct marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}