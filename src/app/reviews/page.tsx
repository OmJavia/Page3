"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ReviewContent() {
  const searchParams = useSearchParams();
  const appointmentCode = searchParams.get("appointment") || "APT-20241110-104";

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center text-3xl mb-4 border border-amber-500/40">
          ★
        </div>
        <h1 className="text-xl font-bold">Thank You For Your Review!</h1>
        <p className="text-sm text-zinc-400 mt-2 max-w-xs">
          Your feedback helps us continuously improve our services. 50 bonus loyalty points have been credited to your account.
        </p>
        <Link
          href="/profile"
          className="mt-6 bg-amber-500 text-zinc-950 font-bold px-6 py-3 rounded-xl text-sm"
        >
          Back to Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 max-w-lg mx-auto">
      <header className="py-4 flex items-center justify-between border-b border-zinc-800 mb-6">
        <Link href="/profile/history" className="text-zinc-400 hover:text-white">
          ← Cancel
        </Link>
        <h1 className="text-sm font-bold text-white">Rate Your Experience</h1>
        <div className="w-6" />
      </header>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-5">
        <div className="text-center">
          <p className="text-xs text-zinc-400 font-mono">Ref: {appointmentCode}</p>
          <h2 className="text-base font-bold text-white mt-1">
            How was your styling at Page 3 Salon?
          </h2>
          <div className="flex justify-center gap-2 mt-4 text-3xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`transition-transform hover:scale-110 ${
                  star <= rating ? "text-amber-400" : "text-zinc-700"
                }`}
              >
                ★
              </button>
            ))}
          </div>
          <span className="text-xs text-zinc-400 mt-1 inline-block">
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
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            Your Comments & Feedback
          </label>
          <textarea
            rows={4}
            placeholder="Tell us about your haircut, the stylist's attention to detail, or salon ambiance..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 resize-none"
          />
        </div>

        <button
          onClick={() => setSubmitted(true)}
          className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-3.5 rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/20"
        >
          Submit Review & Claim Points ✓
        </button>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="p-6 text-white text-center">Loading review form...</div>}>
      <ReviewContent />
    </Suspense>
  );
}

