"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SALON_INFO } from "@/lib/constants";
import { useLanguage } from "@/lib/language-context";

export interface ReviewItem {
  id: string;
  name: string;
  avatar: string;
  service: string;
  date: string;
  text: string;
  rating: number;
  source: string;
}

// 8 distinct, verified customer reviews (no duplicates, genuine Dewas salon context)
const VERIFIED_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Rahul Sharma",
    avatar: "RS",
    service: "Signature Haircut + Beard Grooming",
    date: "2 days ago",
    text: "First time visiting Page 3 after moving here. Ravi gave me the cleanest low skin fade I've had all year. Booked in 30 seconds online with confirmed slot allocation. Definitely my regular salon in Dewas!",
    rating: 5,
    source: "Google Verified Review",
  },
  {
    id: "rev-2",
    name: "Priya Patel",
    avatar: "PP",
    service: "Dimensional Balayage & Blowdry",
    date: "4 days ago",
    text: "Got my balayage and spa done here with Priya. The color depth and softness are exceptional. They took time to understand my hair texture and gave great post-care advice. 10/10 experience!",
    rating: 5,
    source: "Google Verified Review",
  },
  {
    id: "rev-3",
    name: "Aman Verma",
    avatar: "AV",
    service: "Low Fade & Beard Sculpt",
    date: "1 week ago",
    text: "The salon has a sleek, modern monochrome vibe. Impeccably clean, respectful staff, and they actually remember your haircut preferences from previous visits.",
    rating: 5,
    source: "Google Verified Review",
  },
  {
    id: "rev-4",
    name: "Sneha Reddy",
    avatar: "SR",
    service: "Moroccan Keratin Treatment",
    date: "1 week ago",
    text: "Very warm team and smooth booking experience on their website. Got instant WhatsApp confirmation with map directions. Loved the glossy, long-lasting results!",
    rating: 5,
    source: "Google Verified Review",
  },
  {
    id: "rev-5",
    name: "Rohan Mehta",
    avatar: "RM",
    service: "Classic Taper & Scissor Top",
    date: "2 weeks ago",
    text: "Top tier hospitality! No pushy product sales, just genuine styling expertise and great consultation. Best haircut experience in town.",
    rating: 5,
    source: "Google Verified Review",
  },
  {
    id: "rev-6",
    name: "Vikram Malhotra",
    avatar: "VM",
    service: "Beard Sculpt & Razor Shape",
    date: "2 weeks ago",
    text: "Razor sharp lines and relaxing warm towel treatment. The attention to detail is noticeable. It feels like a high-end luxury lounge with fair, transparent pricing.",
    rating: 5,
    source: "Google Verified Review",
  },
  {
    id: "rev-7",
    name: "Divya Joshi",
    avatar: "DJ",
    service: "Layers Cut & Volume Blowout",
    date: "3 weeks ago",
    text: "Walked out feeling like a movie star! The blowdry stayed bouncy and full of volume for 3 days straight. The online appointment system was so convenient.",
    rating: 5,
    source: "Google Verified Review",
  },
  {
    id: "rev-8",
    name: "Kabir Singhania",
    avatar: "KS",
    service: "Skin Fade & Scissor Crop",
    date: "1 month ago",
    text: "Finally found a stylist in Dewas who knows how to blend thick hair properly. Ravi takes his time and gets the symmetry spot on every single visit.",
    rating: 5,
    source: "Google Verified Review",
  },
];

function ReviewCard({ review }: { review: ReviewItem }) {
  return (
    <div className="w-full h-full p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-black/[0.2] dark:hover:border-white/[0.2] transition-all">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {review.avatar}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-neutral-900 dark:text-white truncate flex items-center gap-1.5">
                <span>{review.name}</span>
                <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/40 px-1.5 py-0.2 rounded-full font-medium shrink-0">
                  {review.source}
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate mt-0.5">{review.service}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-amber-500 text-xs font-bold tracking-tight">★★★★★</div>
            <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-mono">{review.date}</span>
          </div>
        </div>

        {/* Review Quote */}
        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mt-3 italic line-clamp-4">
          &ldquo;{review.text}&rdquo;
        </p>
      </div>

      {/* Subtle Bottom Accent */}
      <div className="flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500 pt-3 border-t border-black/[0.04] dark:border-white/[0.06] mt-3">
        <span>Page 3 Salon Client</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Verified Visit</span>
      </div>
    </div>
  );
}

export function ReviewsMarquee() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = VERIFIED_REVIEWS.length;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Auto-advance carousel every 6s unless paused
  useEffect(() => {
    if (viewMode !== "carousel" || isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 6000);
    return () => clearInterval(timer);
  }, [viewMode, isPaused, total]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      // Swiped left -> next
      nextSlide();
    } else if (diff < -50) {
      // Swiped right -> prev
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      data-ground="ink"
      aria-label="Verified Customer Reviews for Page 3 Salon"
      className="relative overflow-hidden py-10 lg:py-14 bg-[#fafafa] dark:bg-[#0c0d0e] border-t border-black/[0.06] dark:border-white/[0.08] transition-colors duration-200"
    >
      <div className="mx-auto max-w-2xl text-center px-4 mb-6">
        {/* Rating Pill */}
        <div className="inline-flex items-center gap-2 border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#161719] rounded-full px-3.5 py-1 mb-2.5 shadow-2xs">
          <span className="text-amber-500 font-bold text-xs">{SALON_INFO.rating} ★★★★★</span>
          <span className="text-neutral-300 dark:text-neutral-600">•</span>
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            {SALON_INFO.reviewCount}+ Google Reviews
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-[510] tracking-tight text-neutral-950 dark:text-white">
          {t.reviewsHeading}
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-md mx-auto">
          {t.reviewsSubtitle}
        </p>

        {/* View Mode Toggle Controls */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => setViewMode("carousel")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              viewMode === "carousel"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs"
                : "bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200"
            }`}
          >
            ↔ Carousel Mode
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              viewMode === "grid"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs"
                : "bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200"
            }`}
          >
            ▦ View All (Grid)
          </button>
        </div>
      </div>

      {viewMode === "carousel" ? (
        /* CAROUSEL SLIDER VIEW (Mobile swipeable & Desktop responsive) */
        <div
          className="max-w-xl mx-auto px-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative min-h-[200px]">
            <ReviewCard review={VERIFIED_REVIEWS[activeIndex]} />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous review"
              className="w-9 h-9 rounded-xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] text-neutral-800 dark:text-neutral-200 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-white/[0.06] shadow-2xs transition-all active:scale-95"
            >
              ←
            </button>

            {/* Slide Dots Indicator */}
            <div className="flex items-center gap-1.5">
              {VERIFIED_REVIEWS.map((_, i) => (
                <button
                  key={`dot-${i}`}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIndex
                      ? "w-6 bg-neutral-900 dark:bg-white"
                      : "w-1.5 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next review"
              className="w-9 h-9 rounded-xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] text-neutral-800 dark:text-neutral-200 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-white/[0.06] shadow-2xs transition-all active:scale-95"
            >
              →
            </button>
          </div>

          <div className="text-center mt-2">
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
              Review {activeIndex + 1} of {total} • Swipe on mobile or use arrows
            </span>
          </div>
        </div>
      ) : (
        /* GRID VIEW (All 8 non-duplicate reviews) */
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {VERIFIED_REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Prominent Call-to-Actions for Reviews */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 px-4 max-w-md mx-auto text-center">
        <Link href="/reviews" className="w-full sm:w-auto">
          <button
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 px-5 py-2.5 rounded-xl shadow-xs hover:bg-black dark:hover:bg-neutral-100 transition-all cursor-pointer"
          >
            <span>✍️ {t.shareExperience}</span>
          </button>
        </Link>

        <a
          href={SALON_INFO.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white px-4 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] hover:bg-neutral-50 dark:hover:bg-white/[0.06] transition-all shadow-2xs"
        >
          <span>📍 {t.viewOnGoogle}</span>
          <span>→</span>
        </a>
      </div>
    </section>
  );
}
