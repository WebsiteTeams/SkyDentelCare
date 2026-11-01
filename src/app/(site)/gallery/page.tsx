import { Images } from "lucide-react";
import type { Metadata } from "next";
import { BeforeAfterCase } from "@/components/site/BeforeAfter";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { PageHeader, SectionHeading } from "@/components/site/SectionHeading";
import { EmptyState } from "@/components/shared/states";
import { getPublishedGallery } from "@/lib/data/public";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Gallery",
  description: "See inside SkyDentalClinic: our interiors, treatment rooms, equipment and facilities.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const items = await getPublishedGallery();
  const clinic = items.filter((item) => item.category !== "before-after");
  const cases = items.filter((item) => item.category === "before-after");

  return (
    <>
      <PageHeader eyebrow="Gallery" title="A look inside the clinic." />
      <section className="section-y !pt-14 md:!pt-20">
        <div className="container-site">
          {clinic.length > 0 ? (
            <GalleryGrid items={clinic} />
          ) : (
            <EmptyState icon={Images} title="Our gallery is coming soon." description="Photographs of the clinic will appear here." />
          )}
        </div>
      </section>
      {cases.length > 0 ? (
        <section className="section-y !pt-0">
          <div className="container-site">
            <SectionHeading eyebrow="Results" title="Before and after." description="Shown with patient consent. Individual results vary." />
            <div className="mt-12 grid gap-10 md:grid-cols-2">
              {cases.map((item) => <BeforeAfterCase key={item._id} item={item} />)}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
