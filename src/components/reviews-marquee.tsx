"use client";

import Link from "next/link";
import { SALON_INFO } from "@/lib/constants";

export interface ReviewItem {
  id: string;
  name: string;
  avatar: string;
  service: string;
  date: string;
  text: string;
}

// 3 distinct rows of verified client reviews
const ROW_1_REVIEWS: ReviewItem[] = [
  {
    id: "r1-1",
    name: "Rahul Sharma",
    avatar: "RS",
    service: "Signature Haircut + Beard Grooming",
    date: "2 days ago",
    text: "First time visiting Page 3 after moving here. John gave me the cleanest low skin fade I've had all year. Booked in 30 seconds online with zero waiting time. Definitely my new go-to salon!",
  },
  {
    id: "r1-2",
    name: "Priya Patel",
    avatar: "PP",
    service: "Dimensional Balayage & Blowdry",
    date: "4 days ago",
    text: "Got my balayage and spa done here. The color depth and softness are exceptional. They took time to understand my hair texture and gave great post-care advice. 10/10 salon!",
  },
  {
    id: "r1-3",
    name: "Aman Verma",
    avatar: "AV",
    service: "Low Fade & Beard Sculpt",
    date: "1 week ago",
    text: "The salon has a sleek, modern monochrome vibe. Super hygienic, professional staff, and they actually remember your haircut preferences from previous visits.",
  },
  {
    id: "r1-4",
    name: "Sneha Reddy",
    avatar: "SR",
    service: "Moroccan Keratin Treatment",
    date: "1 week ago",
    text: "Very friendly team and smooth booking experience on their website. Got instant WhatsApp confirmation with map directions. Loved the glossy results!",
  },
  {
    id: "r1-5",
    name: "Rohan Mehta",
    avatar: "RM",
    service: "Classic Taper & Scissor Top",
    date: "2 weeks ago",
    text: "Top tier hospitality! No pushy product sales, just genuine styling expertise and great conversation. Best haircut experience in town.",
  },
];

const ROW_2_REVIEWS: ReviewItem[] = [
  {
    id: "r2-1",
    name: "Ananya Desai",
    avatar: "AD",
    service: "Hydra Gloss Treatment & Cut",
    date: "3 days ago",
    text: "My hair was severely damaged from previous bleaching. Sarah revived it completely with the Moroccan spa. So soft and vibrant now. Highly recommended!",
  },
  {
    id: "r2-2",
    name: "Vikram Malhotra",
    avatar: "VM",
    service: "Beard Sculpt & Razor Shape",
    date: "5 days ago",
    text: "Razor sharp lines and relaxing hot towel treatment. The attention to detail is noticeable. It feels like a high-end luxury lounge without the insane prices.",
  },
  {
    id: "r2-3",
    name: "Divya Joshi",
    avatar: "DJ",
    service: "Layers Cut & Volume Blowout",
    date: "1 week ago",
    text: "Walked out feeling like a movie star! The blowdry stayed bouncy and full of volume for 3 days straight. The online appointment system was so seamless.",
  },
  {
    id: "r2-4",
    name: "Kabir Singhania",
    avatar: "KS",
    service: "Skin Fade & Scissor Crop",
    date: "2 weeks ago",
    text: "Finally found a barber who knows how to blend thick hair properly. John takes his time and gets the symmetry spot on every single visit.",
  },
  {
    id: "r2-5",
    name: "Pooja Chawla",
    avatar: "PC",
    service: "Global Color & Root Toning",
    date: "2 weeks ago",
    text: "Extremely professional color consultation. They analyzed my skin undertone before mixing the formula. Zero damage and the shine is stunning.",
  },
];

const ROW_3_REVIEWS: ReviewItem[] = [
  {
    id: "r3-1",
    name: "Siddharth Shah",
    avatar: "SS",
    service: "Executive Haircut & Beard Trim",
    date: "3 days ago",
    text: "The fact that they remember my preferences and previous visit notes is a game-changer. I don't have to explain my haircut every time. True VIP service.",
  },
  {
    id: "r3-2",
    name: "Meera Nair",
    avatar: "MN",
    service: "Deep Conditioning Spa & Trim",
    date: "6 days ago",
    text: "Very peaceful ambience, relaxing massage chairs, and gentle wash. Perfect weekend self-care. Booked through mobile and got seated immediately.",
  },
  {
    id: "r3-3",
    name: "Arjun Kapoor",
    avatar: "AK",
    service: "Beard Oil Treatment & Fade",
    date: "1 week ago",
    text: "Consistent quality every single time. They use authentic premium shears and sanitized tools right in front of you. 5 stars well deserved.",
  },
  {
    id: "r3-4",
    name: "Ritu Bhatia",
    avatar: "RB",
    service: "Hair Botox & Gloss Finish",
    date: "2 weeks ago",
    text: "Transformed my frizzy hair into silky smooth locks. The staff explained every step and gave honest after-care advice. Will be back for sure!",
  },
  {
    id: "r3-5",
    name: "Yash Dave",
    avatar: "YD",
    service: "Student Fade & Beard Lineup",
    date: "3 weeks ago",
    text: "Great value for money considering the premium level of styling. Quick, hygienic, and John is hands down the best barber in the area.",
  },
];

function ReviewCard({ review }: { review: ReviewItem }) {
  return (
    <div className="w-[320px] sm:w-[350px] h-[175px] shrink-0 p-4 rounded-2xl bg-white border border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-black/[0.2] hover:shadow-md transition-all">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {review.avatar}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-neutral-900 truncate flex items-center gap-1.5">
                <span>{review.name}</span>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.2 rounded-full font-medium shrink-0">
                  Google Verified
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 truncate mt-0.5">{review.service}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-amber-500 text-[11px] font-bold tracking-tight">★★★★★</div>
            <span className="text-[9px] text-neutral-400 font-mono">{review.date}</span>
          </div>
        </div>

        {/* First 3 lines clearly visible */}
        <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mt-2.5 italic">
          &ldquo;{review.text}&rdquo;
        </p>
      </div>

      {/* Subtle Bottom Accent */}
      <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-2 border-t border-black/[0.04]">
        <span>Page 3 Salon Client</span>
        <span className="text-emerald-600 font-medium">✓ Recommended</span>
      </div>
    </div>
  );
}

export function ReviewsMarquee() {
  // Duplicated arrays for seamless infinite loop
  const row1 = [...ROW_1_REVIEWS, ...ROW_1_REVIEWS];
  const row2 = [...ROW_2_REVIEWS, ...ROW_2_REVIEWS];
  const row3 = [...ROW_3_REVIEWS, ...ROW_3_REVIEWS];

  return (
    <section
      data-ground="ink"
      aria-label="What our clients say about Page 3 Salon"
      className="relative overflow-hidden py-12 lg:py-16 bg-[#fafafa] border-t border-black/[0.06]"
    >
      {/* Header */}
      <div className="mx-auto max-w-xl text-center px-4 mb-8">
        <div className="inline-flex items-center gap-2 border border-black/[0.08] bg-white rounded-full px-3.5 py-1 mb-3 shadow-2xs">
          <span className="text-amber-500 font-bold text-xs">4.9 ★★★★★</span>
          <span className="text-neutral-300">•</span>
          <span className="text-xs font-semibold text-neutral-700">480+ Google Reviews</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-[510] tracking-tight text-neutral-950">
          Loved by 500+ Happy Clients
        </h2>
        <p className="text-xs lg:text-sm text-neutral-500 mt-2 leading-relaxed">
          Hover over any review to pause and read. See how our community rates our master cuts and grooming.
        </p>
      </div>

      {/* 3 Rows Continuous Moving Ticker */}
      <div
        className="group-ticker relative overflow-hidden space-y-3"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        {/* ROW 1: Leftward moving */}
        <div className="overflow-hidden">
          <div className="ticker-track flex gap-3.5 items-center">
            {row1.map((item, idx) => (
              <ReviewCard key={`r1-${item.id}-${idx}`} review={item} />
            ))}
          </div>
        </div>

        {/* ROW 2: Rightward reverse moving */}
        <div className="overflow-hidden">
          <div className="ticker-track-reverse flex gap-3.5 items-center">
            {row2.map((item, idx) => (
              <ReviewCard key={`r2-${item.id}-${idx}`} review={item} />
            ))}
          </div>
        </div>

        {/* ROW 3: Leftward slow moving */}
        <div className="overflow-hidden">
          <div className="ticker-track-slow flex gap-3.5 items-center">
            {row3.map((item, idx) => (
              <ReviewCard key={`r3-${item.id}-${idx}`} review={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Google Maps link & CTA */}
      <div className="text-center mt-8 px-4">
        <a
          href={SALON_INFO.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 px-4 py-2 rounded-2xl border border-black/[0.08] bg-white hover:bg-neutral-50 transition-all shadow-2xs"
        >
          <span>📍 View All 480+ Reviews on Google Maps</span>
          <span>→</span>
        </a>
      </div>
    </section>
  );
}
