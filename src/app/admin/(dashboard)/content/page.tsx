import type { Metadata } from "next";
import { ContentForm } from "@/components/admin/ContentForm";
import { PageTitle } from "@/components/admin/PageTitle";
import { getAdminSettings } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Website content" };

export default async function ContentPage() {
  const { content } = await getAdminSettings();
  return (
    <>
      <PageTitle title="Website content" description="Edit the wording and photographs across the public website." />
      <ContentForm content={content} />
    </>
  );
}
