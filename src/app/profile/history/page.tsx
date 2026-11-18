"use client";

import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

const HISTORY_ITEMS = [
  {
    id: "hist-1",
    code: "APT-20241110-104",
    date: "2024-11-10",
    services: ["Haircut", "Beard Trim"],
    stylist: "Ravi Kumar",
    amount: 500,
    status: "Completed",
    notes: "Client preferred low taper fade and crisp beard lining.",
    reviewed: true,
    rating: 5,
  },
  {
    id: "hist-2",
    code: "APT-20241018-082",
    date: "2024-10-18",
    services: ["Haircut + Wash", "Hair Spa"],
    stylist: "Priya Sharma",
    amount: 1200,
    status: "Completed",
    notes: "Deep conditioning spa treatment applied for dry scalp.",
    reviewed: false,
  },
  {
    id: "hist-3",
    code: "APT-20240905-041",
    date: "2024-09-05",
    services: ["Global Hair Color"],
    stylist: "Ravi Kumar",
    amount: 1500,
    status: "Completed",
    notes: "Natural dark brown shade 3.0 with ammonia-free developer.",
    reviewed: true,
    rating: 5,
  },
];

export default function AppointmentHistoryPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      <header className="bg-zinc-900 border-b border-zinc-800 px-4 py-3.5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/profile" className="text-zinc-400 hover:text-white">
            ←
          </Link>
          <h1 className="text-sm font-bold text-white">Visit & Service History</h1>
        </div>
        <Link
          href="/book"
          className="text-xs bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-3 py-1.5 rounded-lg"
        >
          Rebook
        </Link>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-4">
        <p className="text-xs text-zinc-400">
          Showing all completed salon appointments, styling recipes, and verified reviews.
        </p>

        <div className="space-y-3">
          {HISTORY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                    {item.code}
                  </span>
                  <p className="text-sm font-bold text-white mt-1">
                    {item.services.join(" + ")}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {formatDate(item.date)} • Stylist: {item.stylist}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-white">
                    {formatCurrency(item.amount)}
                  </span>
                  <p className="text-[10px] text-emerald-400 font-medium">✓ Completed</p>
                </div>
              </div>

              {item.notes && (
                <div className="bg-zinc-950 p-2.5 rounded-xl text-xs text-zinc-400 border border-zinc-800/80">
                  <span className="text-zinc-300 font-semibold">Service Notes:</span> {item.notes}
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-xs">
                {item.reviewed ? (
                  <div className="flex items-center gap-1 text-amber-400">
                    <span>{"★".repeat(item.rating || 5)}</span>
                    <span className="text-zinc-400 text-[11px]">(Reviewed)</span>
                  </div>
                ) : (
                  <Link
                    href={`/reviews?appointment=${item.code}`}
                    className="text-amber-400 hover:text-amber-300 font-medium"
                  >
                    ★ Leave a Review (+50 points)
                  </Link>
                )}
                <Link
                  href={`/book`}
                  className="text-zinc-300 hover:text-white font-medium"
                >
                  Book Same Again →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
