import type { Metadata } from "next";
import { PageTitle } from "@/components/admin/PageTitle";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getAdminSettings } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Clinic settings" };

export default async function SettingsPage() {
  const settings = await getAdminSettings();
  return (
    <>
      <PageTitle title="Clinic settings" description="Contact details and working hours shown across the website and to search engines." />
      <SettingsForm settings={settings} />
    </>
  );
}
