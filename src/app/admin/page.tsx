"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("owner@page3salon.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Standard credential check (supports demo access and documented in PRD)
    setTimeout(() => {
      if (email === "owner@page3salon.com" && password === "admin123") {
        router.push("/admin/dashboard");
      } else {
        setError("Invalid credentials. Please use owner@page3salon.com and password admin123");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-amber-600 to-amber-400 text-zinc-950 font-black text-2xl rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-amber-500/20">
            ✂️
          </div>
          <h1 className="text-xl font-bold text-white">Page 3 Business Hub</h1>
          <p className="text-xs text-zinc-400 mt-1">Salon Owner & Management Control Panel</p>
        </div>

        <form onSubmit={handleLogin} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Admin / Staff Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-zinc-950 font-bold rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/20"
          >
            {loading ? "Authenticating..." : "Access Dashboard →"}
          </button>

          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 text-[11px] text-zinc-400 text-center">
            <span className="text-amber-400 font-semibold">Demo Credentials Loaded:</span>
            <br />
            Email: <code className="text-zinc-300">owner@page3salon.com</code> | Pass: <code className="text-zinc-300">admin123</code>
          </div>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
            ← Return to Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
}
