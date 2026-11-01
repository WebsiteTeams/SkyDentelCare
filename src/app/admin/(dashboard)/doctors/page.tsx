import type { Metadata } from "next";
import { DoctorsManager } from "@/components/admin/DoctorsManager";
import { getAllDoctors } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Doctors" };

export default async function DoctorsPage() {
  return <DoctorsManager doctors={await getAllDoctors()} />;
}
