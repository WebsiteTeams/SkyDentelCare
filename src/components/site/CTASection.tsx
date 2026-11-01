import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toTelHref } from "@/lib/utils";

export function CTASection({ phone, title = "Begin with a conversation." }: { phone?: string; title?: string }) {
  return (
    <section className="bg-ice">
      <div className="container-site grid items-end gap-10 py-20 md:py-28 lg:grid-cols-12">
        <div className="reveal lg:col-span-8">
          <h2 className="display-1">{title}</h2>
          <p className="lede mt-6 max-w-xl">
            Tell us what you need and when you would like to visit. Our team will contact you to confirm your appointment.
          </p>
        </div>
        <div className="reveal flex flex-col items-start gap-5 lg:col-span-4 lg:items-end">
          <Button asChild variant="cta" size="cta">
            <Link href="/appointment">Book Appointment</Link>
          </Button>
          {phone ? <a href={toTelHref(phone)} className="link-rule">Call {phone}</a> : null}
        </div>
      </div>
    </section>
  );
}
