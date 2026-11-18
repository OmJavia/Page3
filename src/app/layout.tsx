import type { Metadata, Viewport } from "next";
import "./globals.css";

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
  themeColor: "#09090b",
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
      <body className="font-sans antialiased bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-zinc-950">
        {children}
      </body>
    </html>
  );
}
