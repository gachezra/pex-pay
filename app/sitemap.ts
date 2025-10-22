import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pay.pexmon.one/";

  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/login",
    "/pricing",
    "/privacy",
    "/signup",
    "/toc",
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
