import { MetadataRoute } from "next";
import { getProjects } from "@/lib/data-fetchers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://rajshilaconstruction.com";

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/projects",
    "/ongoing-projects",
    "/gallery",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const completedProjects = await getProjects({ status: "completed" });
  const projectRoutes = completedProjects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
