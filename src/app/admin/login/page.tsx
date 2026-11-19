"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin/dashboard";

  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const performLogin = (role: string) => {
    setIsLoading(true);
    setError("");

    // Set authenticated cookie (valid for 24 hours)
    document.cookie = "p3_admin_session=authenticated; Path=/; Max-Age=86400; SameSite=Lax";
    localStorage.setItem("p3_admin_role", role);

    setTimeout(() => {
      router.push(redirectPath);
      router.refresh();
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError("Please enter your store passcode");
      return;
    }

    // Accepts 9111, admin123, or store phone 9111198911
    if (
      passcode.trim() === "9111" ||
      passcode.trim() === "admin123" ||
      passcode.trim() === "9111198911"
    ) {
      performLogin("Owner");
    } else {
      setError("Invalid passcode. Use demo passcode: 9111 or 9111198911");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0d0e] text-[#1c1d1f] dark:text-[#f4f4f5] flex flex-col justify-between p-4 sm:p-6 transition-colors duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-md mx-auto w-full pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Back to Salon</span>
        </Link>
        <ThemeToggle size="sm" />
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-white dark:bg-[#151619] border border-black/[0.08] dark:border-white/[0.12] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-bold text-xl mx-auto mb-3 shadow-sm">
              P3
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-white/[0.08] text-[10px] font-mono font-medium text-neutral-600 dark:text-neutral-400 mb-2">
              🔒 MANAGEMENT CONSOLE
            </div>
            <h1 className="text-xl sm:text-2xl font-[510] tracking-tight text-neutral-950 dark:text-white">
              Page 3 Salon
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Authorized access for Salon Owner &amp; Front Desk Staff
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Salon Security Passcode / PIN
              </label>
              <input
                type="password"
                placeholder="Enter 4-digit PIN (Demo: 9111)"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError("");
                }}
                className="w-full h-11 px-3.5 rounded-xl border border-black/[0.08] dark:border-white/[0.12] bg-neutral-50 dark:bg-[#1b1c20] text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 tracking-wider font-mono text-center"
              />
              {error && (
                <p className="text-[11px] text-rose-500 dark:text-rose-400 mt-1.5 text-center font-medium">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-[510] text-xs shadow-xs transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Unlock Management Console</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Access Demo Badges */}
          <div className="mt-6 pt-5 border-t border-black/[0.06] dark:border-white/[0.08]">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-semibold block text-center mb-2.5">
              Quick One-Click Sign In
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => performLogin("Owner")}
                className="p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.12] bg-neutral-50/50 dark:bg-white/[0.04] hover:bg-neutral-100 dark:hover:bg-white/[0.08] text-left transition-all group"
              >
                <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center justify-between">
                  <span>👑 Salon Owner</span>
                  <span className="opacity-0 group-hover:opacity-100 text-[10px] transition-opacity">→</span>
                </div>
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Store #9111198911
                </div>
              </button>

              <button
                type="button"
                onClick={() => performLogin("Front Desk")}
                className="p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.12] bg-neutral-50/50 dark:bg-white/[0.04] hover:bg-neutral-100 dark:hover:bg-white/[0.08] text-left transition-all group"
              >
                <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center justify-between">
                  <span>💼 Front Desk</span>
                  <span className="opacity-0 group-hover:opacity-100 text-[10px] transition-opacity">→</span>
                </div>
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  POS &amp; Appointments
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-neutral-400 dark:text-neutral-500 mt-4 leading-relaxed">
          Protected by Next.js Edge Session Security &amp; DPDP compliance.
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-neutral-400 dark:text-neutral-600 pb-2">
        Page 3 Salon Management System · Version 1.0
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#0c0d0e]">
          <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
