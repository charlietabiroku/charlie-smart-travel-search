import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const baseUrl = getSiteUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/routes", "/ranking", "/prices/new", "/settings"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7
  }));
}
