import type { Metadata } from "next";
import { TreatmentsManager } from "@/components/admin/TreatmentsManager";
import { getAllTreatments } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Treatments" };

export default async function TreatmentsPage() {
  return <TreatmentsManager treatments={await getAllTreatments()} />;
}
