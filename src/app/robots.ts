import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://repairtrust.in";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/services", "/services/", "/technician"],
      disallow: ["/dashboard", "/admin", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
