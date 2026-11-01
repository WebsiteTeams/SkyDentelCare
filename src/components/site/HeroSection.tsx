import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SiteContent } from "@/types";
import { ClinicImage } from "./ClinicImage";
import { Eyebrow } from "./SectionHeading";

export function HeroSection({ content }: { content: SiteContent }) {
  const trust = content.trustIndicators;

  return (
    <section className="relative overflow-hidden">
      {/* Ice-blue field that the arch rises out of on large screens. */}
      <div aria-hidden className="absolute inset-y-0 right-0 hidden w-[38%] bg-ice lg:block" />

      <div className="container-site relative grid items-center gap-12 pt-12 pb-16 md:pt-16 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-12 lg:gap-8 lg:py-16">
        <div className="lg:col-span-7 lg:pr-10">
          <div className="enter">
            <Eyebrow>Modern dental care</Eyebrow>
          </div>
          <h1 className="display-1 enter mt-7" style={{ "--enter-delay": "80ms" } as React.CSSProperties}>
            {content.heroHeadline}
          </h1>
          {content.heroText ? (
            <p className="lede enter mt-7 max-w-xl" style={{ "--enter-delay": "160ms" } as React.CSSProperties}>
              {content.heroText}
            </p>
          ) : null}
          <div
            className="enter mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-9"
            style={{ "--enter-delay": "240ms" } as React.CSSProperties}
          >
            <Button asChild variant="cta" size="cta">
              <Link href="/appointment">Book Appointment</Link>
            </Button>
            <Link href="/treatments" className="link-rule">Explore Treatments</Link>
          </div>

          {trust.length > 0 ? (
            <dl className="enter mt-14 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-7 sm:grid-cols-4" style={{ "--enter-delay": "320ms" } as React.CSSProperties}>
              {trust.map((item) => (
                <div key={item.title}>
                  <dt className="font-serif text-2xl leading-tight text-navy">{item.title}</dt>
                  {item.description ? <dd className="mt-1 text-sm text-muted-foreground">{item.description}</dd> : null}
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <div className="enter-image arch relative aspect-[4/5] overflow-hidden shadow-soft">
            <ClinicImage image={content.heroImage} alt="SkyDentalClinic" sizes="(min-width: 1024px) 40vw, 90vw" priority />
          </div>
          {content.heroSecondaryImage ? (
            <div
              className="enter-image absolute -bottom-6 -left-4 aspect-square w-[38%] overflow-hidden rounded-lg border-[6px] border-white shadow-soft lg:-left-14"
              style={{ "--enter-delay": "350ms" } as React.CSSProperties}
            >
              <ClinicImage image={content.heroSecondaryImage} alt="Inside SkyDentalClinic" sizes="(min-width: 1024px) 16vw, 35vw" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
