import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClinicImage } from "@/components/site/ClinicImage";
import { JsonLdScript } from "@/components/site/JsonLd";
import { Eyebrow } from "@/components/site/SectionHeading";
import { TreatmentCard } from "@/components/site/TreatmentCard";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/constants";
import { getPublishedTreatments, getTreatmentBySlug } from "@/lib/data/public";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const treatments = await getPublishedTreatments();
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const treatment = await getTreatmentBySlug((await params).slug);
  if (!treatment) return { title: "Treatment not found", robots: { index: false } };
  return pageMetadata({
    title: treatment.name,
    description: treatment.shortDescription,
    path: `/treatments/${treatment.slug}`,
    image: treatment.image?.url,
  });
}

export default async function TreatmentPage({ params }: Props) {
  const treatment = await getTreatmentBySlug((await params).slug);
  if (!treatment) notFound();

  const related = (await getPublishedTreatments()).filter((t) => t._id !== treatment._id).slice(0, 2);
  const bookHref = `/appointment?treatment=${treatment.slug}`;

  return (
    <>
      <JsonLdScript
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalProcedure",
          name: treatment.name,
          description: treatment.shortDescription,
          url: `${SITE_URL}/treatments/${treatment.slug}`,
        }}
      />

      <header className="bg-ice">
        <div className="container-site grid items-end gap-10 pt-10 md:pt-16 lg:grid-cols-12 lg:gap-8">
          <div className="enter pb-4 lg:col-span-7 lg:pb-20">
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-charcoal">
              <Link href="/treatments" className="link-rule !font-medium">All treatments</Link>
            </nav>
            <h1 className="display-1">{treatment.name}</h1>
            <p className="lede mt-6 max-w-xl">{treatment.shortDescription}</p>
            <Button asChild variant="cta" size="cta" className="mt-9">
              <Link href={bookHref}>Book Appointment</Link>
            </Button>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="enter-image relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-t-full">
              <ClinicImage image={treatment.image} alt={treatment.name} sizes="(min-width: 1024px) 30vw, 90vw" priority />
            </div>
          </div>
        </div>
      </header>

      <div className="container-site section-y grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-20 lg:col-span-7">
          {treatment.overview ? (
            <section>
              <h2 className="display-3">Overview</h2>
              <p className="lede mt-5 whitespace-pre-line">{treatment.overview}</p>
            </section>
          ) : null}

          {treatment.procedure.length > 0 ? (
            <section>
              <h2 className="display-3">What to expect</h2>
              <ol className="mt-8 border-t border-border">
                {treatment.procedure.map((step, index) => (
                  <li key={step.title} className="reveal grid grid-cols-[2.5rem_1fr] gap-3 border-b border-border py-6 sm:grid-cols-[3.5rem_1fr]">
                    <span aria-hidden className="pt-1 text-sm font-semibold text-muted-foreground tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="font-serif text-xl text-navy">{step.title}</h3>
                      {step.description ? <p className="mt-1.5 text-charcoal">{step.description}</p> : null}
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-sm text-muted-foreground">
                This is a general overview. Your dentist will explain what applies to you, including any risks and alternatives.
              </p>
            </section>
          ) : null}
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="lg:sticky lg:top-32">
            {treatment.benefits.length > 0 ? (
              <div className="rounded-lg bg-ice p-7 md:p-9">
                <h2 className="display-3">Benefits</h2>
                <ul className="mt-6 space-y-4">
                  {treatment.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-3 text-charcoal">
                      <Check className="mt-1 size-4 shrink-0 text-teal" aria-hidden />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="mt-8">
              <p className="font-medium text-navy">Would you like to discuss this treatment?</p>
              <Button asChild size="pill" className="mt-4">
                <Link href={bookHref}>Request an appointment</Link>
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="section-y !pt-0">
          <div className="container-site">
            <Eyebrow>Other treatments</Eyebrow>
            <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-8">
              {related.map((t) => <TreatmentCard key={t._id} treatment={t} sizes="(min-width: 768px) 46vw, 92vw" />)}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
