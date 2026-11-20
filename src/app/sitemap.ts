import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://lucasgomes.dev/",
      lastModified: new Date("2026-10-25"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
