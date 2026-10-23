import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/shared/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // Allow crawling of noindex pages so crawlers can read their directives.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
