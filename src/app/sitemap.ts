import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getPublishedTreatments } from "@/lib/data/public";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const treatments = await getPublishedTreatments();
  const staticPaths = ["", "/about", "/treatments", "/doctors", "/gallery", "/contact", "/appointment"];
  return [
    ...staticPaths.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...treatments.map((t) => ({ url: `${SITE_URL}/treatments/${t.slug}`, lastModified: t.updatedAt })),
  ];
}
