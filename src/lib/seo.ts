import type { Metadata } from "next";

/** Per-page metadata with a canonical URL and matching Open Graph tags. */
export function pageMetadata({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "SkyDentalClinic",
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}
