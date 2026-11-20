"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";

export interface GalleryItem {
  id: string;
  title: string;
  category: "all" | "mens" | "womens" | "beard" | "color" | "treatments" | "transformations";
  categoryLabel: string;
  stylist: string;
  serviceName: string;
  serviceId: string;
  coverImage: string;
  beforeImage?: string; // For transformations
  videoUrl?: string; // Optional direct video
  duration?: string;
  description: string;
  price: number;
}

export const GALLERY_CATEGORIES = [
  { id: "all", label: "All Works" },
  { id: "mens", label: "Men's Cuts" },
  { id: "womens", label: "Women's Styling" },
  { id: "beard", label: "Beard Grooming" },
  { id: "color", label: "Hair Colouring" },
  { id: "treatments", label: "Treatments & Spa" },
  { id: "transformations", label: "Before & After" },
] as const;

export const PORTFOLIO_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Precision Skin Fade & Textured Crop",
    category: "mens",
    categoryLabel: "Men's Cuts",
    stylist: "Ravi Kumar (Master Stylist)",
    serviceName: "Signature Haircut & Styling",
    serviceId: "s-1",
    coverImage: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=900&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hairdresser-cutting-a-mans-hair-41584-large.mp4",
    duration: "0:45",
    description: "Low razor drop fade with textured matte top, tailored for Indian hair density and easy daily styling.",
    price: 300,
  },
  {
    id: "gal-2",
    title: "Dimensional Honey Balayage & Blowout",
    category: "color",
    categoryLabel: "Hair Colouring",
    stylist: "Priya Sharma (Color Specialist)",
    serviceName: "Balayage / Ombre Colouring",
    serviceId: "s-7",
    coverImage: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=900&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hairdresser-brushing-the-hair-of-a-woman-41586-large.mp4",
    duration: "0:52",
    description: "Seamless sun-kissed honey gradient on warm dark bases with zero brassiness and high-gloss shine.",
    price: 3500,
  },
  {
    id: "gal-3",
    title: "Beard Sculpt & Warm Towel Razor Edge",
    category: "beard",
    categoryLabel: "Beard Grooming",
    stylist: "Ravi Kumar (Master Stylist)",
    serviceName: "Beard Trim & Sculpting",
    serviceId: "s-4",
    coverImage: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-barber-styling-a-mans-beard-41582-large.mp4",
    duration: "0:38",
    description: "Symmetrical cheek lines, organic tea tree oil treatment, and soothing hot towel neck finish.",
    price: 150,
  },
  {
    id: "gal-4",
    title: "Frizz-to-Silk Keratin Transformation",
    category: "transformations",
    categoryLabel: "Before & After",
    stylist: "Priya Sharma (Color Specialist)",
    serviceName: "Moroccan Keratin Treatment",
    serviceId: "s-9",
    coverImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&auto=format&fit=crop&q=80",
    beforeImage: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&auto=format&fit=crop&q=80",
    description: "Complete reversal of heat-damaged humidity frizz into silky, glass-like reflective straight hair.",
    price: 4000,
  },
  {
    id: "gal-5",
    title: "Signature Layers & Butterfly Cut",
    category: "womens",
    categoryLabel: "Women's Styling",
    stylist: "Priya Sharma (Color Specialist)",
    serviceName: "Women's Cut & Blowdry",
    serviceId: "s-3",
    coverImage: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=900&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hairdresser-brushing-the-hair-of-a-woman-41586-large.mp4",
    duration: "0:48",
    description: "Face-framing curtain bangs with cascaded volumetric layers that stay bouncy without heavy styling.",
    price: 500,
  },
  {
    id: "gal-6",
    title: "Intense Argan Restorative Hair Spa",
    category: "treatments",
    categoryLabel: "Treatments & Spa",
    stylist: "Amit Verma (Spa Specialist)",
    serviceName: "Deep Conditioning Hair Spa",
    serviceId: "s-8",
    coverImage: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=900&auto=format&fit=crop&q=80",
    description: "Acupressure scalp massage paired with deep-penetrating argan moisture mask and micro-mist steam.",
    price: 800,
  },
  {
    id: "gal-7",
    title: "Classic Gentleman Taper & Side Part",
    category: "mens",
    categoryLabel: "Men's Cuts",
    stylist: "Ravi Kumar (Master Stylist)",
    serviceName: "Signature Haircut & Styling",
    serviceId: "s-1",
    coverImage: "https://images.unsplash.com/photo-1517832606589-7629c3397143?w=900&auto=format&fit=crop&q=80",
    description: "Refined executive taper with clean side-part blend for corporate and wedding occasions.",
    price: 300,
  },
  {
    id: "gal-8",
    title: "Extreme Volume & Curl Reformation",
    category: "transformations",
    categoryLabel: "Before & After",
    stylist: "Priya Sharma (Color Specialist)",
    serviceName: "Women's Cut & Blowdry",
    serviceId: "s-3",
    coverImage: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=900&auto=format&fit=crop&q=80",
    beforeImage: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=900&auto=format&fit=crop&q=80",
    description: "Limp and lifeless strands re-energised into voluminous defined curls with tailored shaping.",
    price: 500,
  },
];

export function VideoGallery() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [showTransformationBefore, setShowTransformationBefore] = useState(false);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const filteredItems = PORTFOLIO_ITEMS.filter((item) =>
    selectedCategory === "all" ? true : item.category === selectedCategory
  );

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveItem(null);
      } else if (e.key === "ArrowRight" && activeItem) {
        navigateModal(1);
      } else if (e.key === "ArrowLeft" && activeItem) {
        navigateModal(-1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeItem, filteredItems]);

  const navigateModal = (direction: number) => {
    if (!activeItem) return;
    const currentIdx = filteredItems.findIndex((i) => i.id === activeItem.id);
    const nextIdx = (currentIdx + direction + filteredItems.length) % filteredItems.length;
    setActiveItem(filteredItems[nextIdx]);
    setShowTransformationBefore(false);
  };

  const toggleVideoPlay = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRefs.current[id];
    if (!vid) return;

    if (activePlayingId === id) {
      vid.pause();
      setActivePlayingId(null);
    } else {
      if (activePlayingId && videoRefs.current[activePlayingId]) {
        videoRefs.current[activePlayingId]?.pause();
      }
      vid.play().then(() => setActivePlayingId(id)).catch(() => {});
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Section Header */}
      <div className="text-center mb-6">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] px-3 py-1 rounded-full shadow-2xs">
          Real Salon Transformations
        </span>
        <h3 className="text-xl sm:text-2xl font-[510] tracking-tight text-neutral-950 dark:text-white mt-2">
          {t.portfolioHeading}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-md mx-auto">
          {t.portfolioSubtitle}
        </p>

        {/* Category Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 pt-4 scrollbar-none justify-start sm:justify-center">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs"
                  : "bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/[0.06]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Scroll on Mobile, Responsive Grid on Desktop */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory sm:snap-none">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setActiveItem(item);
              setShowTransformationBefore(false);
            }}
            className="w-[280px] sm:w-auto shrink-0 snap-center rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-xs hover:border-black/[0.18] dark:hover:border-white/[0.2] transition-all cursor-pointer group flex flex-col justify-between"
          >
            {/* Visual Media Header */}
            <div className="relative aspect-4/3 w-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
              <img
                src={item.coverImage}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Category & Transformation Badges */}
              <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-xs text-white px-2 py-0.5 rounded-md">
                  {item.categoryLabel}
                </span>
                {item.beforeImage && (
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500 text-black px-2 py-0.5 rounded-md shadow-xs">
                    Before / After
                  </span>
                )}
              </div>

              {/* Play Video Trigger if available */}
              {item.videoUrl && (
                <button
                  type="button"
                  onClick={(e) => toggleVideoPlay(item.id, e)}
                  aria-label="Play sample video"
                  className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-xs text-neutral-900 dark:text-white flex items-center justify-center text-xs shadow-md transition-transform hover:scale-110"
                >
                  {activePlayingId === item.id ? "⏸" : "▶"}
                </button>
              )}

              {/* Hidden Video element for inline playback */}
              {item.videoUrl && (
                <video
                  ref={(el) => {
                    videoRefs.current[item.id] = el;
                  }}
                  src={item.videoUrl}
                  loop
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover ${
                    activePlayingId === item.id ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                />
              )}
            </div>

            {/* Content Details */}
            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                  <span>{item.stylist}</span>
                  <span className="font-mono text-neutral-900 dark:text-white font-bold">
                    {formatCurrency(item.price)}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-neutral-900 dark:text-white mt-1 group-hover:underline line-clamp-1">
                  {item.title}
                </h4>

                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-0.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                  Tap to view detail 🔍
                </span>
                <Link
                  href={`/book?service=${item.serviceId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="font-bold text-[11px] text-neutral-900 dark:text-white hover:underline"
                >
                  Book Service →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FULLSCREEN LIGHTBOX / MODAL VIEWER */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="bg-white dark:bg-[#161719] border border-black/[0.1] dark:border-white/[0.12] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  {activeItem.categoryLabel}
                </span>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
                  {activeItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                aria-label="Close viewer"
                className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/[0.08] text-neutral-600 dark:text-neutral-300 flex items-center justify-center hover:bg-neutral-200 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Main Visual Display */}
            <div className="relative aspect-4/3 w-full bg-neutral-950 flex items-center justify-center overflow-hidden">
              <img
                src={showTransformationBefore && activeItem.beforeImage ? activeItem.beforeImage : activeItem.coverImage}
                alt={activeItem.title}
                className="w-full h-full object-cover transition-opacity duration-300"
              />

              {/* Before/After Toggle Pill if transformation */}
              {activeItem.beforeImage && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex bg-black/75 backdrop-blur-md p-1 rounded-full border border-white/20 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowTransformationBefore(true)}
                    className={`px-3 py-1 rounded-full font-bold transition-all ${
                      showTransformationBefore
                        ? "bg-amber-400 text-black shadow-xs"
                        : "text-neutral-300 hover:text-white"
                    }`}
                  >
                    Before
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTransformationBefore(false)}
                    className={`px-3 py-1 rounded-full font-bold transition-all ${
                      !showTransformationBefore
                        ? "bg-white text-black shadow-xs"
                        : "text-neutral-300 hover:text-white"
                    }`}
                  >
                    After Result
                  </button>
                </div>
              )}

              {/* Prev / Next Modal Arrows */}
              <button
                type="button"
                onClick={() => navigateModal(-1)}
                aria-label="Previous artwork"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-all text-xs"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => navigateModal(1)}
                aria-label="Next artwork"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-all text-xs"
              >
                →
              </button>
            </div>

            {/* Modal Body Info & Booking Action */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 dark:text-neutral-400">
                  Stylist: <strong className="text-neutral-900 dark:text-white">{activeItem.stylist}</strong>
                </span>
                <span className="font-mono text-base font-bold text-neutral-900 dark:text-white">
                  {formatCurrency(activeItem.price)}
                </span>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {activeItem.description}
              </p>

              <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center gap-2">
                <Link
                  href={`/book?service=${activeItem.serviceId}`}
                  className="flex-1"
                  onClick={() => setActiveItem(null)}
                >
                  <button
                    type="button"
                    className="w-full h-11 rounded-xl bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Book {activeItem.serviceName}</span>
                    <span>→</span>
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  className="h-11 px-4 rounded-xl border border-black/[0.08] dark:border-white/[0.12] text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.06]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
