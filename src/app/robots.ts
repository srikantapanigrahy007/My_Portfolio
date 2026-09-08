import { MetadataRoute } from "next";
import { getPortfolioData } from "@/lib/api";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { profile } = await getPortfolioData();
  const baseUrl = profile?.url || "https://srikantapanigrahy.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
