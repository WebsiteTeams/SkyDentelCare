import type { Metadata } from "next";
import Link from "next/link";
import { BeforeAfterCase } from "@/components/site/BeforeAfter";
import { ClinicImage } from "@/components/site/ClinicImage";
import { CTASection } from "@/components/site/CTASection";
import { DoctorCard } from "@/components/site/DoctorCard";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { HeroSection } from "@/components/site/HeroSection";
import { Eyebrow, SectionHeading } from "@/components/site/SectionHeading";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { TreatmentIndex } from "@/components/site/TreatmentCard";
import { getPublishedDoctors, getPublishedGallery, getPublishedTestimonials, getPublishedTreatments, getSettings } from "@/lib/data/public";
import { pageMetadata } from "@/lib/seo";
import type { TextItem } from "@/types";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { content, seoDescription, clinicName } = await getSettings();
  return {
    ...pageMetadata({
      title: `${clinicName} | Premium Dental Care`,
      description: seoDescription || content.heroText,
      path: "/",
      image: content.heroImage?.url,
    }),
    title: { absolute: `${clinicName} | Premium Dental Care` },
  };
}

function FacilityList({ title, items }: { title: string; items: TextItem[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-navy">{title}</h3>
      <ul className="mt-4 border-t border-navy/15">
        {items.map((item) => (
          <li key={item.title} className="border-b border-navy/15 py-5">
            <p className="font-serif text-xl text-navy">{item.title}</p>
            {item.description ? <p className="mt-1.5 text-charcoal">{item.description}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function HomePage() {
  const [settings, treatments, doctors, testimonials, gallery] = await Promise.all([
    getSettings(),
    getPublishedTreatments(),
    getPublishedDoctors(),
    getPublishedTestimonials(),
    getPublishedGallery(),
  ]);
  const { content } = settings;
  const featured = (treatments.some((t) => t.featured) ? treatments.filter((t) => t.featured) : treatments).slice(0, 6);
  const beforeAfter = gallery.filter((item) => item.category === "before-after").slice(0, 2);
  const [leadDoctor] = doctors;
  const [leadQuote, ...otherQuotes] = testimonials;
  const hasFacilities = content.facilities.length > 0 || content.technology.length > 0;

  return (
    <>
      <HeroSection content={content} />

      {/* Clinic introduction */}
      <section className="section-y">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="reveal lg:col-span-7">
            <Eyebrow>Welcome</Eyebrow>
            <h2 className="display-2 mt-6">{content.introHeading}</h2>
          </div>
          <div className="reveal lg:col-span-4 lg:col-start-9 lg:pt-14">
            <p className="lede">{content.introText}</p>
            <Link href="/about" className="link-rule mt-7 inline-block">About the clinic</Link>
          </div>
          {content.introImage ? (
            <div className="reveal relative mt-4 aspect-[16/10] overflow-hidden rounded-lg md:aspect-[21/9] lg:col-span-12">
              <ClinicImage image={content.introImage} alt="Inside SkyDentalClinic" sizes="(min-width: 1320px) 1224px, 100vw" />
            </div>
          ) : null}
        </div>
      </section>

      {/* Featured treatments */}
      {featured.length > 0 ? (
        <section className="section-y !pt-0">
          <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <SectionHeading eyebrow="Treatments" title="Care for every stage of your smile." className="[&_h2]:!text-[clamp(2.25rem,1.6rem+1.8vw,3.25rem)]" />
                <Link href="/treatments" className="link-rule mt-8 inline-block">View all treatments</Link>
              </div>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <TreatmentIndex treatments={featured} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Why choose us */}
      {content.whyChooseUs.length > 0 ? (
        <section className="bg-navy">
          <div className="container-site section-y">
            <SectionHeading eyebrow="Why choose us" title="Dentistry that begins with listening." inverse />
            <ul className="mt-16 grid border-t border-white/15 md:grid-cols-2">
              {content.whyChooseUs.map((item, index) => (
                <li key={item.title} className="reveal flex gap-6 border-b border-white/15 py-9 md:even:pl-12 md:odd:border-r md:odd:pr-12">
                  <span aria-hidden className="w-7 shrink-0 font-serif text-3xl leading-none text-teal">{index + 1}</span>
                  <div>
                    <h3 className="font-serif text-2xl text-white">{item.title}</h3>
                    {item.description ? <p className="mt-2.5 text-white/80">{item.description}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Doctor introduction */}
      {leadDoctor ? (
        <section className="section-y">
          <div className="container-site">
            <DoctorCard doctor={leadDoctor} />
            {doctors.length > 1 ? (
              <div className="mt-14 text-right">
                <Link href="/doctors" className="link-rule">Meet all our doctors</Link>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Facilities and technology */}
      {hasFacilities ? (
        <section className="bg-ice">
          <div className="container-site section-y grid gap-14 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="Facilities" title="A space designed for comfort and care." className="[&_h2]:!text-[clamp(2.25rem,1.6rem+1.8vw,3.25rem)]" />
              {content.facilitiesImage ? (
                <div className="reveal arch relative mt-10 aspect-[4/5] max-w-sm overflow-hidden">
                  <ClinicImage image={content.facilitiesImage} alt="SkyDentalClinic facilities" sizes="(min-width: 1024px) 28vw, 80vw" />
                </div>
              ) : null}
            </div>
            <div className="grid content-start gap-12 sm:grid-cols-2 lg:col-span-6 lg:col-start-7 lg:grid-cols-1">
              <FacilityList title="Facilities" items={content.facilities} />
              <FacilityList title="Technology" items={content.technology} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Testimonials */}
      {leadQuote ? (
        <section className="section-y">
          <div className="container-site">
            <Eyebrow>Patient stories</Eyebrow>
            <TestimonialCard testimonial={leadQuote} large className="mt-8 max-w-5xl" />
            {otherQuotes.length > 0 ? (
              <div className="mt-16 grid gap-12 border-t border-border pt-12 md:grid-cols-2 lg:ml-[25%]">
                {otherQuotes.slice(0, 2).map((t) => <TestimonialCard key={t._id} testimonial={t} />)}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Before and after: authentic, consented cases only */}
      {beforeAfter.length > 0 ? (
        <section className="section-y !pt-0">
          <div className="container-site">
            <SectionHeading eyebrow="Results" title="Before and after." description="Shown with patient consent. Individual results vary." />
            <div className="mt-12 grid gap-10 md:grid-cols-2">
              {beforeAfter.map((item) => <BeforeAfterCase key={item._id} item={item} />)}
            </div>
          </div>
        </section>
      ) : null}

      <CTASection phone={settings.phone} />

      {/* FAQ */}
      {content.faqs.length > 0 ? (
        <section className="section-y">
          <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="Questions" title="Good to know." className="[&_h2]:!text-[clamp(2.25rem,1.6rem+1.8vw,3.25rem)]" />
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <FaqAccordion items={content.faqs} />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
