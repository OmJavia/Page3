"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PaletteItem {
  id: string;
  title: string;
  category: "Navigation" | "Quick Action" | "External";
  icon: string;
  href?: string;
  action?: () => void;
  shortcut?: string;
}

export function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const items: PaletteItem[] = [
    // Navigation
    { id: "dash", title: "Dashboard Overview", category: "Navigation", icon: "📊", href: "/admin/dashboard" },
    { id: "cal", title: "Appointments & Multi-Stylist Calendar", category: "Navigation", icon: "📅", href: "/admin/appointments" },
    { id: "pos", title: "POS Reception Checkout & Billing", category: "Navigation", icon: "🧾", href: "/admin/checkout" },
    { id: "crm", title: "Customer CRM & Dossiers", category: "Navigation", icon: "👥", href: "/admin/customers" },
    { id: "inv", title: "Inventory, Back-bar & Recipes", category: "Navigation", icon: "📦", href: "/admin/inventory" },
    { id: "ret", title: "Client Retention & Loyalty", category: "Navigation", icon: "🔄", href: "/admin/retention" },
    { id: "fin", title: "Financial Reports & Category Revenue", category: "Navigation", icon: "💰", href: "/admin/finance" },
    { id: "srv", title: "Services & Pricing Menu", category: "Navigation", icon: "✂️", href: "/admin/services" },
    { id: "stf", title: "Staff & Attendance Management", category: "Navigation", icon: "👨‍💼", href: "/admin/staff" },
    { id: "set", title: "System Settings & WhatsApp Notifications", category: "Navigation", icon: "⚙️", href: "/admin/settings" },
    
    // Quick Actions
    { id: "act-apt", title: "Create New Appointment / Walk-in", category: "Quick Action", icon: "➕", href: "/admin/appointments/new" },
    { id: "act-pos", title: "Start Quick Front-Desk Checkout", category: "Quick Action", icon: "💳", href: "/admin/checkout" },
    { id: "act-cust", title: "Register New Customer", category: "Quick Action", icon: "👤", href: "/admin/customers/new" },
    
    // External / Front
    { id: "ext-home", title: "Go to Customer Website", category: "External", icon: "🌐", href: "/" },
    { id: "ext-book", title: "Open Online Booking Flow", category: "External", icon: "📱", href: "/book" },
  ];

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filtered[selectedIndex];
        if (selected) {
          if (selected.href) {
            router.push(selected.href);
            onClose();
          } else if (selected.action) {
            selected.action();
            onClose();
          }
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-black/[0.06] dark:border-white/[0.08]">
          <span className="text-neutral-400 dark:text-neutral-500 text-sm">🔍</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search screens, actions, or shortcuts..."
            className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400 dark:text-neutral-500">
              No matching screens or actions found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const active = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.href) {
                      router.push(item.href);
                      onClose();
                    } else if (item.action) {
                      item.action();
                      onClose();
                    }
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-100 ${
                    active
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-medium"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs font-[510]">{item.title}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                      active
                        ? "bg-white/20 dark:bg-black/20 text-white dark:text-neutral-900"
                        : "bg-neutral-100 dark:bg-white/[0.06] text-neutral-400 dark:text-neutral-500"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-neutral-50 dark:bg-white/[0.02] border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>Page 3 Quick Jump</span>
        </div>
      </div>
    </div>
  );
}
