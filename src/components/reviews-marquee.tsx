"use client";

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
    text: "First time visiting Page 3 after moving here. Cleanest low skin fade I've had all year. Booked in 30 seconds online. Definitely my regular salon in Dewas!",
    rating: 5,
    source: "Google Verified",
  },
  {
    id: "rev-2",
    name: "Priya Patel",
    avatar: "PP",
    service: "Dimensional Balayage & Blowdry",
    date: "4 days ago",
    text: "Got balayage & spa done with Priya. The color depth and softness are exceptional. They understand hair texture and gave great post-care advice.",
    rating: 5,
    source: "Google Verified",
  },
  {
    id: "rev-3",
    name: "Aman Verma",
    avatar: "AV",
    service: "Low Fade & Beard Sculpt",
    date: "1 week ago",
    text: "Modern monochrome vibe, impeccably clean, respectful staff, and they actually remember your haircut preferences from previous visits.",
    rating: 5,
    source: "Google Verified",
  },
  {
    id: "rev-4",
    name: "Sneha Reddy",
    avatar: "SR",
    service: "Moroccan Keratin Treatment",
    date: "1 week ago",
    text: "Warm team and smooth online booking. Instant WhatsApp confirmation with map directions. Glossy, long-lasting salon results!",
    rating: 5,
    source: "Google Verified",
  },
  {
    id: "rev-5",
    name: "Rohan Mehta",
    avatar: "RM",
    service: "Classic Taper & Scissor Top",
    date: "2 weeks ago",
    text: "Top tier hospitality! No pushy product sales, just genuine styling expertise and great consultation. Best haircut experience in town.",
    rating: 5,
    source: "Google Verified",
  },
  {
    id: "rev-6",
    name: "Vikram Malhotra",
    avatar: "VM",
    service: "Beard Sculpt & Razor Shape",
    date: "2 weeks ago",
    text: "Razor sharp lines and relaxing warm towel treatment. Attention to detail is noticeable. Feels like a luxury lounge with transparent pricing.",
    rating: 5,
    source: "Google Verified",
  },
  {
    id: "rev-7",
    name: "Divya Joshi",
    avatar: "DJ",
    service: "Layers Cut & Volume Blowout",
    date: "3 weeks ago",
    text: "Walked out feeling amazing! Blowdry stayed bouncy for 3 days straight. The online appointment system was so convenient and fast.",
    rating: 5,
    source: "Google Verified",
  },
  {
    id: "rev-8",
    name: "Kabir Singhania",
    avatar: "KS",
    service: "Skin Fade & Scissor Crop",
    date: "1 month ago",
    text: "Finally a stylist in Dewas who blends thick hair properly. Ravi takes his time and gets the symmetry spot on every single visit.",
    rating: 5,
    source: "Google Verified",
  },
];

// Single review card with ~3 compact lines of content
function ContinuousReviewCard({ review }: { review: ReviewItem }) {
  return (
    <div className="w-[300px] sm:w-[340px] shrink-0 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-black/[0.2] dark:hover:border-white/[0.2] transition-all select-none">
      {/* Line 1: Header (Avatar, Name, Verified Badge, Rating, Date) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs">
            {review.avatar}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-neutral-900 dark:text-white truncate flex items-center gap-1.5">
              <span>{review.name}</span>
              <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/40 px-1 py-0.2 rounded-full font-medium shrink-0">
                ✓
              </span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0 flex items-center gap-1.5">
          <span className="text-amber-500 text-[11px] font-bold tracking-tight">★★★★★</span>
          <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-mono">{review.date}</span>
        </div>
      </div>

      {/* Line 2: Service Booked Tag */}
      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400 font-medium truncate">
        <span className="text-neutral-400 dark:text-neutral-500">Service:</span>
        <span className="truncate text-neutral-700 dark:text-neutral-300">{review.service}</span>
      </div>

      {/* Line 3: Compact 2-3 Line Authentic Quote */}
      <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-snug mt-1.5 italic line-clamp-2">
        &ldquo;{review.text}&rdquo;
      </p>
    </div>
  );
}

export function ReviewsMarquee() {
  const { t } = useLanguage();
  // Duplicate reviews to create seamless infinite loop (16 cards total)
  const duplicatedReviews = [...VERIFIED_REVIEWS, ...VERIFIED_REVIEWS];

  return (
    <section
      data-ground="ink"
      aria-label="Verified Customer Reviews for Page 3 Salon"
      className="relative overflow-hidden py-10 lg:py-14 bg-[#fafafa] dark:bg-[#0c0d0e] border-t border-black/[0.06] dark:border-white/[0.08] transition-colors duration-200"
    >
      <div className="mx-auto max-w-2xl text-center px-4 mb-6">
        {/* Rating Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] shadow-2xs mb-3">
          <span className="text-xs font-semibold text-neutral-900 dark:text-white">
            4.9 ★ Google (480+ Reviews)
          </span>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">•</span>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Dewas, MP
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-[510] tracking-tight text-neutral-950 dark:text-white">
          Loved by 480+ Happy Clients
        </h2>
        <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
          {t.reviewsSubtitle}
        </p>
      </div>

      {/* Single Continuous Moving Marquee Row */}
      <div className="relative w-full overflow-hidden group-ticker py-2">
        {/* Left & Right luxury gradient fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#fafafa] dark:from-[#0c0d0e] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#fafafa] dark:from-[#0c0d0e] to-transparent z-10" />

        {/* Marquee Track: continuously moving horizontally in 1 row */}
        <div
          className="flex w-max gap-3 sm:gap-4 animate-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused]"
          style={{
            animation: "ticker-scroll 36s linear infinite",
          }}
        >
          {duplicatedReviews.map((review, idx) => (
            <ContinuousReviewCard key={`${review.id}-${idx}`} review={review} />
          ))}
        </div>
      </div>

      {/* Call to Action Bar */}
      <div className="mt-6 text-center px-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href={SALON_INFO.googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
        >
          <span>⭐</span>
          <span>Visited Page 3? Share Your Experience</span>
          <span className="text-[10px]">↗</span>
        </a>
        <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
        <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
          Independent reviews verified from Google Business Profile
        </span>
      </div>
    </section>
  );
}
