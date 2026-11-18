"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

    setTimeout(() => {
      if (email === "owner@page3salon.com" && password === "admin123") {
        router.push("/admin/dashboard");
      } else {
        setError("Invalid credentials. Please use owner@page3salon.com and password admin123");
        setLoading(false);
      }
    }, 500);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1c1d1f] flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 text-lg font-bold shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
            ✂️
          </div>
          <h1 className="text-xl font-[510] tracking-tight text-neutral-950">Page 3 Business Hub</h1>
          <p className="text-xs text-neutral-500 mt-1">Salon Owner & Management Control Panel</p>
        </div>

        <div className="rf-card p-6 space-y-4">
          {/* User Requested Exact Rightfit.so Google Login Button */}
          <button
            type="button"
            tabIndex={0}
            data-slot="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="inline-flex shrink-0 transform-gpu items-center justify-center gap-2 rounded-2xl text-sm font-[510] tracking-[-0.011em] whitespace-nowrap transition-all duration-200 outline-none focus-visible:ring-[3px] focus-visible:ring-neutral-400/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 chroma-text-animate-parent border border-black/[0.08] bg-white text-[#1c1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.05)] [--foreground:#1c1d1f] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08),0_8px_20px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-[0.5px] active:translate-y-0 h-10 px-6 py-2.5 has-[>svg]:px-4 w-full"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="chroma-text-out chroma-text-out-animate !uppercase text-xs font-semibold">
              Log in with google
            </span>
          </button>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-black/[0.08] w-full" />
            <span className="bg-white px-2 text-[10px] uppercase text-neutral-400 font-semibold tracking-wider relative">
              Or continue with email
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Admin / Staff Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-black/[0.08] text-xs bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-black/[0.08] text-xs bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              variant="default"
              className="w-full h-10 text-xs font-semibold"
            >
              {loading ? "Authenticating..." : "Access Dashboard →"}
            </Button>

            <div className="p-3 bg-neutral-50 rounded-xl border border-black/[0.06] text-[11px] text-neutral-500 text-center">
              <span className="font-semibold text-neutral-800">Demo Credentials:</span>
              <br />
              Email: <code className="text-neutral-900 font-mono">owner@page3salon.com</code> | Pass: <code className="text-neutral-900 font-mono">admin123</code>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
            ← Return to Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
}
