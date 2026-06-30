import type { MetadataRoute } from "next";

const routes = [
  "",
  "/book",
  "/pricing",
  "/services",
  "/service-area",
  "/faq",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cleancurbco.com";

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
