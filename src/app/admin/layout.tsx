"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/appointments", label: "Appointments", icon: "📅" },
  { href: "/admin/customers", label: "Customer CRM", icon: "👥" },
  { href: "/admin/inventory", label: "Inventory & Recipes", icon: "📦" },
  { href: "/admin/retention", label: "Retention & Reactivation", icon: "🔄" },
  { href: "/admin/finance", label: "Sales & Finances", icon: "💰" },
  { href: "/admin/services", label: "Services Menu", icon: "✂️" },
  { href: "/admin/staff", label: "Staff & Attendance", icon: "👨‍💼" },
  { href: "/admin/settings", label: "Settings & Notifications", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, don't wrap with dashboard chrome
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-zinc-900 border-r border-zinc-800 z-50 flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-zinc-950 font-black text-lg flex items-center justify-center">
                ✂️
              </div>
              <div>
                <h2 className="text-sm font-bold text-white leading-tight">Page 3 Salon</h2>
                <span className="text-[10px] text-amber-400 font-medium uppercase tracking-wider">
                  Admin System
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-zinc-400 hover:text-white"
            >
              ✕
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/15"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950/40">
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                OW
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Salon Owner</p>
                <p className="text-[10px] text-zinc-400 truncate">owner@page3salon.com</p>
              </div>
            </div>
            <Link
              href="/admin"
              title="Sign Out"
              className="text-zinc-500 hover:text-red-400 text-xs p-1"
            >
              🚪
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
            >
              ☰
            </button>
            <span className="text-xs font-semibold text-zinc-400 hidden sm:inline">
              Page 3 Salon Operating Platform
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/appointments/new"
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/10"
            >
              <span>+</span>
              <span>Walk-in / New</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="text-xs text-zinc-400 hover:text-amber-400 border border-zinc-800 px-2.5 py-1.5 rounded-lg hidden md:inline-block"
            >
              Preview Website ↗
            </Link>
          </div>
        </header>

        {/* Child Pages */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

