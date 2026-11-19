"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandPalette } from "@/components/admin/command-palette";
import { NotificationBell } from "@/components/admin/notification-bell";
import { STORE_PHONE } from "@/lib/appointments-store";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/appointments", label: "Appointments", icon: "📅" },
  { href: "/admin/checkout", label: "POS & Billing", icon: "🧾" },
  { href: "/admin/customers", label: "Customer CRM", icon: "👥" },
  { href: "/admin/inventory", label: "Inventory & Recipes", icon: "📦" },
  { href: "/admin/retention", label: "Retention & Loyalty", icon: "🔄" },
  { href: "/admin/finance", label: "Sales & Finances", icon: "💰" },
  { href: "/admin/services", label: "Services Menu", icon: "✂️" },
  { href: "/admin/staff", label: "Staff & Attendance", icon: "👨‍💼" },
  { href: "/admin/settings", label: "Settings & Notifications", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSignOut = () => {
    document.cookie = "p3_admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/admin/login";
  };

  // If on login page, don't wrap with dashboard chrome
  if (pathname === "/admin" || pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0d0e] text-[#1c1d1f] dark:text-[#f4f4f5] flex transition-colors duration-200">
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-[#121214] border-r border-black/[0.08] dark:border-white/[0.08] z-50 flex flex-col justify-between transition-all duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="overflow-y-auto">
          {/* Brand header */}
          <div className="p-4 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-sm flex items-center justify-center shadow-xs">
                ✂️
              </div>
              <div>
                <h2 className="text-sm font-[510] text-neutral-900 dark:text-white leading-tight">Page 3 Salon</h2>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium uppercase tracking-wider">
                  Admin System
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Quick jump command search in sidebar */}
          <div className="p-3 pb-1">
            <button
              onClick={() => setPaletteOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-[510] bg-neutral-100/80 dark:bg-white/[0.06] text-neutral-500 dark:text-neutral-400 border border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.12] dark:hover:border-white/[0.14] transition-all"
            >
              <div className="flex items-center gap-2">
                <span>🔍</span>
                <span>Quick jump...</span>
              </div>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.1] text-neutral-400 dark:text-neutral-500">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Nav links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-[510] transition-all ${
                    active
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs font-semibold"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-white/[0.06]"
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User footer & Theme Switcher */}
        <div className="p-3 border-t border-black/[0.06] dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.02] space-y-2">
          {/* Theme Mode Toggle in Sidebar */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-[510] text-neutral-500 dark:text-neutral-400">
              Interface Theme
            </span>
            <ThemeToggle showLabel size="sm" />
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#18191c] border border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-white/[0.08] text-neutral-800 dark:text-neutral-200 font-bold flex items-center justify-center text-xs">
                OW
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">Salon Owner</p>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">owner@page3salon.com</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-[10px] text-neutral-500 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium ml-2 shrink-0 border border-black/[0.08] dark:border-white/[0.12] px-2 py-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-white/[0.06] transition-colors"
              title="Sign Out of Console"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar for all screens */}
        <header className="bg-white dark:bg-[#121214] border-b border-black/[0.06] dark:border-white/[0.06] px-4 py-2.5 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] text-neutral-700 dark:text-neutral-300 text-xs"
            >
              ☰ Menu
            </button>
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">Page 3 Management Console</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/[0.06] text-neutral-500 dark:text-neutral-400">
                Store #{STORE_PHONE}
              </span>
            </div>
            <div className="lg:hidden text-center">
              <span className="text-xs font-bold text-neutral-900 dark:text-white">Page 3 Hub</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick search button */}
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-neutral-50 dark:bg-white/[0.04] text-neutral-500 dark:text-neutral-400 text-xs hover:border-black/[0.15] dark:hover:border-white/[0.15] transition-all"
            >
              <span>🔍</span>
              <span className="text-[11px]">Jump to...</span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.1]">
                ⌘K
              </kbd>
            </button>

            {/* Notification Bell */}
            <NotificationBell />

            {/* Theme Toggle */}
            <ThemeToggle size="sm" />

            {/* Storefront Link */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex text-[11px] font-[510] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-black/[0.08] dark:border-white/[0.1] px-2.5 py-1.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-all"
            >
              Storefront ↗
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
