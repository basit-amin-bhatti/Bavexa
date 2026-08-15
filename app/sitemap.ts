import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/contact", "/privacy", "/terms"];
  return routes.map((route) => ({ url: `${siteConfig.brand.url}${route}`, lastModified: new Date(), changeFrequency: route === "" ? "weekly" : "monthly", priority: route === "" ? 1 : route === "/contact" ? 0.9 : 0.7 }));
}
