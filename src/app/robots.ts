import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/services", "/services/*", "/reviews", "/book"],
        disallow: ["/admin", "/admin/*", "/api/*"],
      },
    ],
    sitemap: "https://page3-dewas.vercel.app/sitemap.xml",
  };
}
