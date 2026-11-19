"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  getOwnerNotifications,
  markNotificationAsRead,
  markAllNotificationsRead,
  OwnerNotification,
  STORE_PHONE,
} from "@/lib/appointments-store";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<OwnerNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = () => {
    setNotifications(getOwnerNotifications());
  };

  useEffect(() => {
    loadNotifications();
    const handleUpdate = () => loadNotifications();
    window.addEventListener("page3_appointment_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("page3_appointment_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#18191c] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.06] transition-all flex items-center justify-center"
        title="Owner Booking Notifications"
      >
        <span className="text-sm">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-xs animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
            <div>
              <h3 className="text-xs font-[510] text-neutral-900 dark:text-white flex items-center gap-1.5">
                <span>🚨</span>
                <span>Booking Alerts &amp; Dispatches</span>
              </h3>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                Routed to Store #{STORE_PHONE}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={() => markAllNotificationsRead()}
                className="text-[10px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-black/[0.04] dark:divide-white/[0.04]">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400 dark:text-neutral-500">
                No recent booking alerts.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-3.5 transition-colors cursor-pointer text-xs space-y-1.5 ${
                    notif.read
                      ? "bg-white dark:bg-[#161719] opacity-80"
                      : "bg-neutral-50/80 dark:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      )}
                      {notif.customerName}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                      {new Date(notif.timestamp).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                    {notif.serviceName} with <strong className="text-neutral-800 dark:text-neutral-200">{notif.stylistName}</strong>
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500 pt-1">
                    <span>
                      📅 {notif.date} at {notif.time}
                    </span>
                    <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                      ₹{notif.amount}
                    </span>
                  </div>

                  <div className="pt-1 flex items-center gap-2">
                    <Link
                      href="/admin/appointments"
                      onClick={() => setIsOpen(false)}
                      className="px-2.5 py-1 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-medium text-[10px]"
                    >
                      View in Calendar →
                    </Link>
                    <a
                      href={`https://wa.me/91${notif.customerPhone}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2 py-1 rounded-lg border border-black/[0.08] dark:border-white/[0.1] text-[10px] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.06]"
                    >
                      WhatsApp Client 💬
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-neutral-50 dark:bg-white/[0.02] border-t border-black/[0.06] dark:border-white/[0.08] text-center">
            <Link
              href="/admin/appointments"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-[510] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              Open Resource Calendar Matrix →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
