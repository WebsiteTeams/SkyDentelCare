import { CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AppointmentForm } from "@/components/site/AppointmentForm";
import { Eyebrow } from "@/components/site/SectionHeading";
import { EmptyState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { getPublishedDoctors, getPublishedTreatments, getSettings } from "@/lib/data/public";
import { pageMetadata } from "@/lib/seo";
import { toTelHref } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Book an Appointment",
  description: "Request an appointment at SkyDentalClinic. Choose your treatment and preferred time, and our team will contact you to confirm.",
  path: "/appointment",
});

const steps = [
  { title: "Send your request", description: "Tell us the treatment and the time you prefer." },
  { title: "We review it", description: "Our team checks availability for your request." },
  { title: "We confirm with you", description: "Your appointment is confirmed once the clinic approves it." },
];

type Props = { searchParams: Promise<{ treatment?: string; doctor?: string }> };

export default async function AppointmentPage({ searchParams }: Props) {
  const [params, treatments, doctors, settings] = await Promise.all([
    searchParams,
    getPublishedTreatments(),
    getPublishedDoctors(),
    getSettings(),
  ]);

  return (
    <div className="bg-ice">
      <div className="container-site grid gap-12 py-14 md:py-20 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="enter lg:sticky lg:top-32">
            <Eyebrow>Appointments</Eyebrow>
            <h1 className="display-2 mt-6">Request your visit.</h1>
            <ol className="mt-10 space-y-7">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span aria-hidden className="w-5 shrink-0 font-serif text-2xl leading-none text-navy">{index + 1}</span>
                  <div>
                    <h2 className="font-semibold text-navy">{step.title}</h2>
                    <p className="mt-1 text-charcoal">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            {settings.phone ? (
              <p className="mt-10 text-charcoal">
                Prefer to talk? <a href={toTelHref(settings.phone)} className="link-rule">Call {settings.phone}</a>
              </p>
            ) : null}
          </div>
        </div>
        <div className="relative rounded-lg bg-white p-6 shadow-soft sm:p-10 lg:col-span-7 lg:col-start-6 lg:p-12">
          {treatments.length > 0 ? (
            <AppointmentForm
              treatments={treatments.map((t) => ({ value: t._id, label: t.name }))}
              doctors={doctors.map((d) => ({ value: d._id, label: d.name }))}
              defaultTreatment={treatments.find((t) => t.slug === params.treatment)?._id}
              defaultDoctor={doctors.find((d) => d.slug === params.doctor)?._id}
              minDate={new Date().toISOString().slice(0, 10)}
            />
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="Online booking is opening soon."
              description="In the meantime, please contact the clinic to arrange your appointment."
              action={<Button asChild size="pill"><Link href="/contact">Contact the clinic</Link></Button>}
            />
          )}
        </div>
      </div>
    </div>
  );
}
