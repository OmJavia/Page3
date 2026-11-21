"use client";

import Link from "next/link";
import { SALON_INFO } from "@/lib/constants";
import { useLanguage } from "@/lib/language-context";

export interface ReviewItem {
  id: string;
  name: string;
  avatar: string;
  service: string;
  serviceHi?: string;
  date: string;
  dateHi?: string;
  text: string;
  textHi?: string;
  rating: number;
  source: string;
  sourceHi?: string;
}

// 8 distinct customer reviews reflecting Dewas salon experiences
const VERIFIED_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Rahul Sharma",
    avatar: "RS",
    service: "Signature Haircut + Beard Grooming",
    serviceHi: "सिग्नेचर हेयरकट + दाढ़ी ग्रूमिंग",
    date: "2 days ago",
    dateHi: "2 दिन पहले",
    text: "First time visiting Page 3 after moving here. Cleanest low skin fade I've had all year. Booked in 30 seconds online. Definitely my regular salon in Dewas!",
    textHi: "देवास आने के बाद पहली बार पेज 3 गया। इस साल का सबसे बेहतरीन लो स्किन फेड मिला। 30 सेकंड में ऑनलाइन बुक हुआ। देवास में मेरा पक्का सैलून!",
    rating: 5,
    source: "Client Review",
    sourceHi: "सत्यापित ग्राहक",
  },
  {
    id: "rev-2",
    name: "Priya Patel",
    avatar: "PP",
    service: "Dimensional Balayage & Blowdry",
    serviceHi: "डाइमेंशनल बाल्याज और ब्लो ड्राई",
    date: "4 days ago",
    dateHi: "4 दिन पहले",
    text: "Got balayage & spa done with Priya. The color depth and softness are exceptional. They understand hair texture and gave great post-care advice.",
    textHi: "प्रिया के साथ बाल्याज और स्पा कराया। बालों की चमक और कोमलता शानदार है। हेयर टेक्सचर की गहरी समझ और पोस्ट-केयर सलाह बहुत अच्छी रही।",
    rating: 5,
    source: "Client Review",
    sourceHi: "सत्यापित ग्राहक",
  },
  {
    id: "rev-3",
    name: "Aman Verma",
    avatar: "AV",
    service: "Low Fade & Beard Sculpt",
    serviceHi: "लो फेड और दाढ़ी शेपिंग",
    date: "1 week ago",
    dateHi: "1 हफ्ता पहले",
    text: "Modern monochrome vibe, impeccably clean, respectful staff, and they actually remember your haircut preferences from previous visits.",
    textHi: "शानदार आधुनिक माहौल, बेहद साफ-सुथरा, सम्मानजनक स्टाफ और पिछली विज़िट के हेयरकट की पसंद भी याद रखते हैं।",
    rating: 5,
    source: "Client Review",
    sourceHi: "सत्यापित ग्राहक",
  },
  {
    id: "rev-4",
    name: "Sneha Reddy",
    avatar: "SR",
    service: "Moroccan Keratin Treatment",
    serviceHi: "मोरक्कन केरातिन ट्रीटमेंट",
    date: "1 week ago",
    dateHi: "1 हफ्ता पहले",
    text: "Warm team and smooth online booking. Instant WhatsApp confirmation with map directions. Glossy, long-lasting salon results!",
    textHi: "सुलझा हुआ स्टाफ और आसान ऑनलाइन बुकिंग। मैप लोकेशन के साथ तुरंत व्हाट्सएप कन्फर्मेशन मिला। बालों में लंबे समय तक चमक बनी रही!",
    rating: 5,
    source: "Client Review",
    sourceHi: "सत्यापित ग्राहक",
  },
  {
    id: "rev-5",
    name: "Rohan Mehta",
    avatar: "RM",
    service: "Classic Taper & Scissor Top",
    serviceHi: "क्लासिक टेपर और कैंची कट",
    date: "2 weeks ago",
    dateHi: "2 हफ्ते पहले",
    text: "Top tier hospitality! No pushy product sales, just genuine styling expertise and great consultation. Best haircut experience in town.",
    textHi: "सर्वोत्तम आतिथ्य! कोई फालतू प्रोडक्ट बेचने का दबाव नहीं, सिर्फ वास्तविक स्टाइलिंग अनुभव। शहर का सबसे बेहतरीन अनुभव।",
    rating: 5,
    source: "Client Review",
    sourceHi: "सत्यापित ग्राहक",
  },
  {
    id: "rev-6",
    name: "Vikram Malhotra",
    avatar: "VM",
    service: "Beard Sculpt & Razor Shape",
    serviceHi: "दाढ़ी शेपिंग और रेजर फिनिश",
    date: "2 weeks ago",
    dateHi: "2 हफ्ते पहले",
    text: "Razor sharp lines and relaxing warm towel treatment. Attention to detail is noticeable. Feels like a luxury lounge with transparent pricing.",
    textHi: "एकदम शार्प लाइन्स और रिलैक्सिंग वार्म टॉवल ट्रीटमेंट। बारीक काम और लक्ज़री लाउंज जैसा फील, वह भी पारदर्शी कीमतों में।",
    rating: 5,
    source: "Client Review",
    sourceHi: "सत्यापित ग्राहक",
  },
  {
    id: "rev-7",
    name: "Divya Joshi",
    avatar: "DJ",
    service: "Layers Cut & Volume Blowout",
    serviceHi: "लेयर्स कट और वॉल्यूम ब्लोआउट",
    date: "3 weeks ago",
    dateHi: "3 हफ्ते पहले",
    text: "Walked out feeling amazing! Blowdry stayed bouncy for 3 days straight. The online appointment system was so convenient and fast.",
    textHi: "बहुत ही खूबसूरत हेयरकट! 3 दिनों तक ब्लो ड्राई बाउंस बना रहा। ऑनलाइन अपॉइंटमेंट सिस्टम बहुत ही सुविधाजनक और तेज़ था।",
    rating: 5,
    source: "Client Review",
    sourceHi: "सत्यापित ग्राहक",
  },
  {
    id: "rev-8",
    name: "Kabir Singhania",
    avatar: "KS",
    service: "Skin Fade & Scissor Crop",
    serviceHi: "स्किन फेड और सीज़र क्रॉप",
    date: "1 month ago",
    dateHi: "1 महीना पहले",
    text: "Finally a stylist in Dewas who blends thick hair properly. Staff takes their time and gets the symmetry spot on every single visit.",
    textHi: "आखिरकार देवास में ऐसा स्टाइलिस्ट मिला जो घने बालों को सही से ब्लेंड करता है। हर बार बिल्कुल परफेक्ट सिमिट्री मिलती है।",
    rating: 5,
    source: "Client Review",
    sourceHi: "सत्यापित ग्राहक",
  },
];

// Single review card with ~3 compact lines of content
function ContinuousReviewCard({ review, language, t }: { review: ReviewItem; language: string; t: any }) {
  const isHi = language === "hi";
  const displayService = (isHi && review.serviceHi) ? review.serviceHi : review.service;
  const displayText = (isHi && review.textHi) ? review.textHi : review.text;
  const displayDate = (isHi && review.dateHi) ? review.dateHi : review.date;
  const displaySource = (isHi && review.sourceHi) ? review.sourceHi : (t.clientReviewBadge || review.source);

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
              <span className="text-[9px] bg-neutral-100 dark:bg-white/[0.08] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/[0.1] px-1.5 py-0.2 rounded-full font-medium shrink-0">
                {displaySource}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0 flex items-center gap-1.5">
          <span className="text-amber-500 text-[11px] font-bold tracking-tight">★★★★★</span>
          <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-mono">{displayDate}</span>
        </div>
      </div>

      {/* Line 2: Service Booked Tag */}
      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400 font-medium truncate">
        <span className="text-neutral-400 dark:text-neutral-500">{t.serviceLabel || "Service:"}</span>
        <span className="truncate text-neutral-700 dark:text-neutral-300">{displayService}</span>
      </div>

      {/* Line 3: Compact 2-3 Line Authentic Quote */}
      <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-snug mt-1.5 italic line-clamp-2">
        &ldquo;{displayText}&rdquo;
      </p>
    </div>
  );
}

export function ReviewsMarquee() {
  const { language, t } = useLanguage();
  // Duplicate reviews to create seamless infinite loop (16 cards total)
  const duplicatedReviews = [...VERIFIED_REVIEWS, ...VERIFIED_REVIEWS];

  return (
    <section
      data-ground="ink"
      aria-label="Customer Reviews for Page 3 Salon"
      className="relative overflow-hidden py-10 lg:py-14 bg-[#fafafa] dark:bg-[#0c0d0e] border-t border-black/[0.06] dark:border-white/[0.08] transition-colors duration-200"
    >
      <div className="mx-auto max-w-2xl text-center px-4 mb-6">
        {/* Rating Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] shadow-2xs mb-3">
          <span className="text-xs font-semibold text-neutral-900 dark:text-white">
            {t.googleRating}
          </span>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">•</span>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
            {t.dewasLocation}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-[510] tracking-tight text-neutral-950 dark:text-white">
          {t.reviewsHeading}
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
            <ContinuousReviewCard key={`${review.id}-${idx}`} review={review} language={language} t={t} />
          ))}
        </div>
      </div>

      {/* Call to Action Bar */}
      <div className="mt-6 text-center px-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href={SALON_INFO.googleReviewUrl || SALON_INFO.googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
        >
          <span>⭐</span>
          <span>{t.shareExperience}</span>
          <span className="text-[10px]">↗</span>
        </a>
        <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
        <a
          href={SALON_INFO.googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:underline inline-flex items-center gap-1"
        >
          <span>{t.viewOnGoogle}</span>
          <span className="text-[10px]">↗</span>
        </a>
      </div>
    </section>
  );
}
