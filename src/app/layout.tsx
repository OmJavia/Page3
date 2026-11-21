import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/language-context";
import { SALON_INFO } from "@/lib/constants";
import "./compiled.css";

export const metadata: Metadata = {
  title: "Page 3 – The Family Salon | Best Hair & Beauty Salon in Dewas",
  description:
    "Page 3 – The Family Salon in Dewas, MP. Premium haircuts, beard styling, hair coloring, keratin treatments & bridal grooming. Book your slot online in 60 seconds.",
  manifest: "/manifest.json",
  keywords: [
    "salon in dewas",
    "best salon in dewas",
    "haircut salon in dewas",
    "family salon dewas",
    "hair coloring dewas",
    "hair spa dewas",
    "page 3 salon dewas",
    "grooming dewas",
  ],
  authors: [{ name: "Page 3 – The Family Salon" }],
  creator: "Page 3 – The Family Salon",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Page 3 Salon",
  },
  openGraph: {
    title: "Page 3 – The Family Salon | Best Salon in Dewas",
    description:
      "Your Style. Your Confidence. Your Page 3. Book your appointment online with confirmed slot allocation in Dewas.",
    type: "website",
    locale: "en_IN",
    siteName: "Page 3 Salon",
    url: "https://page3-dewas.vercel.app",
  },
  alternates: {
    canonical: "https://page3-dewas.vercel.app",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0d0e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "name": "Page 3 – The Family Salon",
  "image": "https://page3-dewas.vercel.app/images/salon-hero.jpg",
  "@id": "https://page3-dewas.vercel.app",
  "url": "https://page3-dewas.vercel.app",
  "telephone": "+919111198911",
  "priceRange": "₹₹",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "AB Road, Near Bhopal Chouraha, Civil Lines",
    "addressLocality": "Dewas",
    "addressRegion": "Madhya Pradesh",
    "postalCode": "455001",
    "addressCountry": "IN",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 22.9676,
    "longitude": 76.0534,
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "10:00",
      "closes": "20:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday", "Sunday"],
      "opens": "09:00",
      "closes": "21:00",
    },
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "214",
    "bestRating": "5",
    "worstRating": "1",
  },
  "sameAs": [
    "https://maps.google.com/?q=Page+3+Salon+Dewas+Madhya+Pradesh",
    "https://instagram.com/page3salondewas",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var urlParams = new URLSearchParams(window.location.search);
                  var paramTheme = urlParams.get('theme');
                  var storedTheme = paramTheme || localStorage.getItem('p3_theme');
                  if (storedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-[#fafafa] dark:bg-[#0c0d0e] text-[#1c1d1f] dark:text-[#f4f4f5] selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black overflow-x-hidden">
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
