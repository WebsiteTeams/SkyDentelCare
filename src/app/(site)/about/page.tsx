import type { Metadata } from "next";
import { ClinicImage } from "@/components/site/ClinicImage";
import { CTASection } from "@/components/site/CTASection";
import { Eyebrow, PageHeader } from "@/components/site/SectionHeading";
import { getSettings } from "@/lib/data/public";
import { pageMetadata } from "@/lib/seo";
import type { TextItem } from "@/types";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "Learn about SkyDentalClinic, our mission and vision, and our approach to patient care.",
  path: "/about",
});

function ItemColumns({ items }: { items: TextItem[] }) {
  return (
    <ul className="grid gap-x-12 border-t border-border sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.title} className="border-b border-border py-7">
          <h3 className="font-serif text-2xl text-navy">{item.title}</h3>
          {item.description ? <p className="mt-2 text-charcoal">{item.description}</p> : null}
        </li>
      ))}
    </ul>
  );
}

export default async function AboutPage() {
  const settings = await getSettings();
  const { content } = settings;

  return (
    <>
      <PageHeader eyebrow="About the clinic" title={content.introHeading} />

      <section className="section-y">
        <div className="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="reveal arch relative mx-auto aspect-[4/5] max-w-md overflow-hidden lg:max-w-none">
              <ClinicImage image={content.aboutImage} alt="Inside SkyDentalClinic" sizes="(min-width: 1024px) 38vw, 90vw" />
            </div>
          </div>
          <div className="reveal lg:col-span-6 lg:col-start-7">
            <p className="lede">{content.introText}</p>
            {content.philosophy ? (
              <>
                <h2 className="display-3 mt-12">Our philosophy</h2>
                <p className="mt-4 text-lg leading-relaxed text-charcoal">{content.philosophy}</p>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {content.mission || content.vision ? (
        <section className="bg-navy">
          <div className="container-site grid gap-14 py-20 md:grid-cols-2 md:py-28 lg:gap-24">
            {content.mission ? (
              <div className="reveal">
                <Eyebrow inverse>Our mission</Eyebrow>
                <p className="mt-6 font-serif text-[clamp(1.625rem,1.3rem+1.1vw,2.5rem)] leading-tight text-white">{content.mission}</p>
              </div>
            ) : null}
            {content.vision ? (
              <div className="reveal">
                <Eyebrow inverse>Our vision</Eyebrow>
                <p className="mt-6 font-serif text-[clamp(1.625rem,1.3rem+1.1vw,2.5rem)] leading-tight text-white">{content.vision}</p>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {content.careApproach.length > 0 ? (
        <section className="section-y">
          <div className="container-site">
            <Eyebrow>Patient care</Eyebrow>
            <h2 className="display-2 mt-6">How we care for you.</h2>
            <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {content.careApproach.map((step, index) => (
                <li key={step.title} className="reveal border-t-2 border-teal pt-6">
                  <span className="text-sm font-semibold text-muted-foreground tabular-nums" aria-hidden>{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-serif text-2xl text-navy">{step.title}</h3>
                  {step.description ? <p className="mt-2.5 text-charcoal">{step.description}</p> : null}
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {content.facilities.length > 0 ? (
        <section className="section-y !pt-0">
          <div className="container-site">
            <h2 className="display-2 mb-12">Facilities</h2>
            <ItemColumns items={content.facilities} />
          </div>
        </section>
      ) : null}

      {content.technology.length > 0 ? (
        <section className="section-y !pt-0">
          <div className="container-site">
            <h2 className="display-2 mb-12">Technology</h2>
            <ItemColumns items={content.technology} />
          </div>
        </section>
      ) : null}

      <CTASection phone={settings.phone} />
    </>
  );
}
