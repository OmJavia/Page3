"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

function ReviewContent() {
  const searchParams = useSearchParams();
  const appointmentCode = searchParams.get("appointment") || "APT-20241110-104";

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0d0e] text-[#1c1d1f] dark:text-[#f4f4f5] flex flex-col items-center justify-center p-6 text-center transition-colors duration-200">
        <div className="w-16 h-16 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm">
          ★
        </div>
        <h1 className="text-xl font-[510] text-neutral-900 dark:text-white">Thank You For Your Review!</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-xs">
          Your feedback helps us continuously improve our services. 50 bonus loyalty points have been credited to your account.
        </p>
        <Link
          href="/profile"
          className="mt-6 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-[510] px-6 py-3 rounded-xl text-sm shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all hover:scale-[1.01]"
        >
          Back to Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0d0e] text-[#1c1d1f] dark:text-[#f4f4f5] p-4 max-w-lg mx-auto transition-colors duration-200">
      <header className="py-4 flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] mb-6">
        <Link href="/profile" className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium">
          ← Cancel
        </Link>
        <h1 className="text-sm font-[510] tracking-tight text-neutral-900 dark:text-white">Rate Your Experience</h1>
        <ThemeToggle size="sm" />
      </header>

      <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)]">
        <div className="text-center">
          <p className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">Ref: {appointmentCode}</p>
          <h2 className="text-base font-[510] text-neutral-900 dark:text-white mt-1">
            How was your styling at Page 3 Salon?
          </h2>

          <div className="flex justify-center gap-2 mt-4 text-3xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`transition-transform hover:scale-110 ${
                  star <= rating ? "text-neutral-900 dark:text-white" : "text-neutral-200 dark:text-neutral-700"
                }`}
              >
                ★
              </button>
            ))}
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 inline-block">
            {rating === 5
              ? "Exceptional Experience! 🌟"
              : rating === 4
              ? "Very Good 👍"
              : rating === 3
              ? "Average 👌"
              : "Needs Improvement"}
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
            Your Comments &amp; Feedback
          </label>
          <textarea
            rows={4}
            placeholder="Tell us about your haircut, the stylist's attention to detail, or salon ambiance..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3.5 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.12] rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs resize-none"
          />
        </div>

        <button
          onClick={() => setSubmitted(true)}
          className="w-full bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-[510] py-3.5 rounded-xl text-sm transition-all shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:scale-[1.01]"
        >
          Submit Review &amp; Claim Points ✓
        </button>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="p-6 text-neutral-500 text-center">Loading review form...</div>}>
      <ReviewContent />
    </Suspense>
  );
}
