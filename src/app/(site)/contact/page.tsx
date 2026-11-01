import type { Metadata } from "next";
import { ContactSection } from "@/components/site/ContactSection";
import { PageHeader } from "@/components/site/SectionHeading";
import { getSettings } from "@/lib/data/public";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Contact SkyDentalClinic. Find our address, phone number, working hours and directions, or send us a message.",
  path: "/contact",
});

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHeader eyebrow="Contact" title="We would love to hear from you." />
      <ContactSection settings={settings} />
    </>
  );
}
