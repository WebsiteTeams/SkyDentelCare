import type { Metadata } from "next";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { getAllGallery } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryPage() {
  return <GalleryManager items={await getAllGallery()} />;
}
