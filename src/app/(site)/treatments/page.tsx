import { Stethoscope } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/site/CTASection";
import { PageHeader } from "@/components/site/SectionHeading";
import { TreatmentCard } from "@/components/site/TreatmentCard";
import { EmptyState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { getPublishedTreatments, getSettings } from "@/lib/data/public";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Treatments",
  description: "Explore the dental treatments offered at SkyDentalClinic, with clear information on benefits and what to expect.",
  path: "/treatments",
});

// A repeating asymmetric rhythm: wide + narrow, then narrow + wide.
const layout = [
  { span: "lg:col-span-7", tall: false, sizes: "(min-width: 1024px) 56vw, 92vw" },
  { span: "lg:col-span-4 lg:col-start-9 lg:mt-24", tall: true, sizes: "(min-width: 1024px) 30vw, 92vw" },
  { span: "lg:col-span-4 lg:col-start-1", tall: true, sizes: "(min-width: 1024px) 30vw, 92vw" },
  { span: "lg:col-span-7 lg:col-start-6 lg:mt-24", tall: false, sizes: "(min-width: 1024px) 56vw, 92vw" },
];

export default async function TreatmentsPage() {
  const [treatments, settings] = await Promise.all([getPublishedTreatments(), getSettings()]);

  return (
    <>
      <PageHeader
        eyebrow="Treatments"
        title="Thoughtful care, explained clearly."
        description="Learn what each treatment involves and how it may help, then speak with us about what suits you."
      />
      <section className="section-y">
        <div className="container-site">
          {treatments.length > 0 ? (
            <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-y-24">
              {treatments.map((treatment, index) => {
                const cell = layout[index % layout.length];
                return (
                  <div key={treatment._id} className={cell.span}>
                    <TreatmentCard treatment={treatment} tall={cell.tall} sizes={cell.sizes} />
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Stethoscope}
              title="Our treatment information is being prepared."
              description="Please contact the clinic and we will be glad to tell you about the care we offer."
              action={<Button asChild size="pill"><Link href="/contact">Contact the clinic</Link></Button>}
            />
          )}
        </div>
      </section>
      <CTASection phone={settings.phone} title="Not sure what you need?" />
    </>
  );
}
