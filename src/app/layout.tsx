import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./compiled.css";

export const metadata: Metadata = {
  title: "Page 3 Salon | Luxury Hair & Beauty",
  description:
    "Book your appointment at Page 3 Salon. Expert hair styling, coloring, and beauty services. Easy online booking available 24/7.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Page 3 Salon",
  },
  openGraph: {
    title: "Page 3 Salon | Luxury Hair & Beauty",
    description: "Book your appointment at Page 3 Salon.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#fafafa] text-[#1c1d1f] selection:bg-neutral-900 selection:text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
