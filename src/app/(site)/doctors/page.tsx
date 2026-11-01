import { UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/site/CTASection";
import { DoctorCard } from "@/components/site/DoctorCard";
import { PageHeader } from "@/components/site/SectionHeading";
import { EmptyState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { getPublishedDoctors, getSettings } from "@/lib/data/public";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Doctors",
  description: "Meet the dentists at SkyDentalClinic, including their qualifications, specializations and experience.",
  path: "/doctors",
});

export default async function DoctorsPage() {
  const [doctors, settings] = await Promise.all([getPublishedDoctors(), getSettings()]);

  return (
    <>
      <PageHeader eyebrow="Our doctors" title="The people behind your care." />
      <section className="section-y">
        <div className="container-site space-y-24 md:space-y-36">
          {doctors.length > 0 ? (
            doctors.map((doctor, index) => <DoctorCard key={doctor._id} doctor={doctor} flip={index % 2 === 1} />)
          ) : (
            <EmptyState
              icon={UserRound}
              title="Doctor profiles are coming soon."
              description="Please contact the clinic to learn more about our team."
              action={<Button asChild size="pill"><Link href="/contact">Contact the clinic</Link></Button>}
            />
          )}
        </div>
      </section>
      <CTASection phone={settings.phone} />
    </>
  );
}
