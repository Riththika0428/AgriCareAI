import Link from "next/link";

export default function Home() {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#f9f5ec" }}
    >
      <div className="text-center">
        <h1
          className="text-5xl font-black mb-3"
          style={{ fontFamily: "'Playfair Display', serif", color: "#1a3a1f" }}
        >
          Agri<span style={{ color: "#4caf50" }}>AI</span>
        </h1>
        <p className="mb-8" style={{ color: "#9a948a", fontSize: "15px" }}>
          Smart Farming Platform
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #1a3a1f, #2d6a35)" }}
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-80"
            style={{
              border: "2px solid #1a3a1f",
              color: "#1a3a1f",
              background: "transparent",
            }}
          >
           Register
          </Link>
        </div>
      </div>
    </main>
  );
}