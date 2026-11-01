import type { Metadata } from "next";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";
import { getAllTestimonials } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Testimonials" };

export default async function TestimonialsPage() {
  return <TestimonialsManager testimonials={await getAllTestimonials()} />;
}
