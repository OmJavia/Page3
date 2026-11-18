"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export interface VideoGalleryItem {
  id: string;
  title: string;
  category: string;
  stylist: string;
  duration: string;
  coverImage: string;
  videoUrl: string; // Direct video (MP4/WebM) or Instagram video link
  instagramUrl?: string; // Optional direct Instagram reel link
  serviceId: string;
  description: string;
}

// ==============================================================================
// 📸 INSTAGRAM VIDEO GALLERY LIST
// REPLACE OR ADD YOUR INSTAGRAM VIDEOS & COVER PHOTOS HERE ONE BY ONE
// ==============================================================================
export const INSTAGRAM_VIDEOS: VideoGalleryItem[] = [
  {
    id: "reel-1",
    title: "Precision Skin Fade & Textured Crop",
    category: "Gents Styling",
    stylist: "John (Master Barber)",
    duration: "0:45",
    coverImage: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=900&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hairdresser-cutting-a-mans-hair-41584-large.mp4",
    instagramUrl: "https://www.instagram.com/",
    serviceId: "svc-1",
    description: "Low razor drop fade with textured matte top. Sculpted for effortless everyday volume.",
  },
  {
    id: "reel-2",
    title: "Dimensional Honey Balayage & Blowdry",
    category: "Ladies Color",
    stylist: "Sarah (Color Specialist)",
    duration: "0:52",
    coverImage: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=900&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hairdresser-brushing-the-hair-of-a-woman-41586-large.mp4",
    instagramUrl: "https://www.instagram.com/",
    serviceId: "svc-3",
    description: "Hand-painted seamless highlights with glossy toning and signature bouncy blowout.",
  },
  {
    id: "reel-3",
    title: "Beard Sculpt, Hot Towel & Razor Shape",
    category: "Grooming",
    stylist: "Alex (Stylist)",
    duration: "0:38",
    coverImage: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-barber-styling-a-mans-beard-41582-large.mp4",
    instagramUrl: "https://www.instagram.com/",
    serviceId: "svc-2",
    description: "Crisp cheek alignment, organic beard oil soak, and straight-razor neck finish.",
  },
  {
    id: "reel-4",
    title: "Moroccan Keratin Gloss & Spa Treatment",
    category: "Hair Treatment",
    stylist: "Sarah (Color Specialist)",
    duration: "1:05",
    coverImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hairdresser-washing-a-womans-hair-41585-large.mp4",
    instagramUrl: "https://www.instagram.com/",
    serviceId: "svc-4",
    description: "Deep restorative hydration to eliminate frizz and infuse radiant mirror shine.",
  },
  {
    id: "reel-5",
    title: "Classic Gentleman Taper & Pompadour",
    category: "Gents Styling",
    stylist: "John (Master Barber)",
    duration: "0:40",
    coverImage: "https://images.unsplash.com/photo-1517832606589-7629c3397143?w=900&auto=format&fit=crop&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hairdresser-cutting-a-mans-hair-41584-large.mp4",
    instagramUrl: "https://www.instagram.com/",
    serviceId: "svc-1",
    description: "Timeless executive taper with high-hold pomade styling and clean side part.",
  },
];

export function VideoGallery() {
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const handleCardClick = (id: string) => {
    if (activePlayingId === id) {
      // Pause
      const vid = videoRefs.current[id];
      if (vid) vid.pause();
      setActivePlayingId(null);
    } else {
      // Pause any previously playing video
      if (activePlayingId && videoRefs.current[activePlayingId]) {
        videoRefs.current[activePlayingId]?.pause();
      }
      setActivePlayingId(id);
      setTimeout(() => {
        const vid = videoRefs.current[id];
        if (vid) {
          vid.play().catch(() => {});
        }
      }, 50);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    Object.values(videoRefs.current).forEach((vid) => {
      if (vid) vid.muted = !isMuted;
    });
  };

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-8 px-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-white border border-black/[0.08] px-3 py-1 rounded-full shadow-2xs">
          Interactive Video Gallery
        </span>
        <h2 className="text-2xl lg:text-3xl font-[510] tracking-tight text-neutral-950 mt-3">
          Our Craft in Motion
        </h2>
        <p className="text-xs lg:text-sm text-neutral-500 mt-2 leading-relaxed">
          Hover to view details. Tap any reel to watch real transformation clips directly from our salon chairs.
        </p>
      </div>

      {/* Interactive Expandable Strip / Accordion Grid */}
      <div className="px-4 max-w-6xl mx-auto">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:h-[480px] lg:gap-1.5 gap-2.5">
          {INSTAGRAM_VIDEOS.map((item) => {
            const isPlaying = activePlayingId === item.id;
            const isHovered = hoveredId === item.id;

            return (
              <li
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleCardClick(item.id)}
                className={`group relative overflow-hidden rounded-2xl bg-neutral-950 cursor-pointer select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  // Desktop expandable strip behavior
                  isPlaying
                    ? "lg:flex-[3.5] ring-2 ring-neutral-900"
                    : isHovered
                    ? "lg:flex-[2.5]"
                    : "lg:flex-1"
                } max-lg:aspect-[4/5]`}
              >
                {/* 1. COVER IMAGE (Shown when not playing) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1100ms] ease-out group-hover:scale-105 ${
                    isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                  loading="lazy"
                />

                {/* 2. VIDEO ELEMENT (Activated on Click) */}
                <video
                  ref={(el) => {
                    videoRefs.current[item.id] = el;
                  }}
                  src={item.videoUrl}
                  loop
                  playsInline
                  muted={isMuted}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    isPlaying ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                />

                {/* 3. VIGNETTE OVERLAY */}
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    isPlaying
                      ? "bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"
                      : "bg-[linear-gradient(to_top,rgba(14,16,20,0.92)_0%,rgba(14,16,20,0.38)_50%,rgba(14,16,20,0.16)_100%)]"
                  }`}
                />

                {/* 4. FLOATING TOP BADGES (Duration & Category) */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                  <span className="text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full border border-white/10">
                    {item.category}
                  </span>

                  {isPlaying ? (
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white text-xs flex items-center justify-center border border-white/20 hover:bg-black/90 transition-colors"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? "🔇" : "🔊"}
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-white/80 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md">
                      {item.duration}
                    </span>
                  )}
                </div>

                {/* 5. CENTER PLAY BUTTON (Pulsing trigger when paused) */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md text-neutral-900 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                      <svg className="w-5 h-5 ml-0.5 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* 6. DESKTOP VERTICAL SPINE TEXT (Seen in collapsed strip) */}
                {!isPlaying && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-2 whitespace-nowrap [writing-mode:vertical-rl] pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
                    <span className="text-xs uppercase font-bold tracking-widest text-white/70 rotate-180">
                      {item.title}
                    </span>
                  </div>
                )}

                {/* 7. CAPTION & BOOKING CTA (Bottom overlay) */}
                <div
                  className={`absolute inset-x-0 bottom-0 p-4 lg:p-5 z-10 transition-all duration-300 ${
                    isPlaying
                      ? "opacity-90 translate-y-0"
                      : "translate-y-2 group-hover:translate-y-0 opacity-90 group-hover:opacity-100"
                  }`}
                >
                  <h3 className="text-sm lg:text-base font-bold text-white leading-snug line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-white/70 mt-0.5">
                    Stylist: <span className="text-white font-medium">{item.stylist}</span>
                  </p>
                  <p className="text-[11px] text-white/60 mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                    {item.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                    <Link
                      href={`/book?service=${item.serviceId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-neutral-200 transition-colors bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/20"
                    >
                      <span>Book this look</span>
                      <span>→</span>
                    </Link>

                    {isPlaying ? (
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Playing Reel
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/60">Click to Play ▶</span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
