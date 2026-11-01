import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { DoctorDTO } from "@/types";
import { ClinicImage } from "./ClinicImage";

/** Full-width profile; `flip` alternates the portrait side down the Doctors page. */
export function DoctorCard({ doctor, flip, headingLevel: H = "h2" }: { doctor: DoctorDTO; flip?: boolean; headingLevel?: "h2" | "h3" }) {
  return (
    <article className="reveal grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
      <div className={`lg:col-span-5 ${flip ? "lg:order-2 lg:col-start-8" : ""}`}>
        <div className="arch relative mx-auto aspect-[4/5] max-w-md overflow-hidden lg:max-w-none">
          <ClinicImage image={doctor.photo} alt={`Portrait of ${doctor.name}`} sizes="(min-width: 1024px) 38vw, 90vw" />
        </div>
      </div>
      <div className={`lg:col-span-6 ${flip ? "lg:order-1 lg:col-start-1 lg:row-start-1" : "lg:col-start-7"}`}>
        {doctor.specialization ? (
          <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-navy">{doctor.specialization}</p>
        ) : null}
        <H className="display-2 mt-4">{doctor.name}</H>
        {doctor.qualifications.length > 0 ? (
          <p className="mt-4 font-medium text-navy">{doctor.qualifications.join(" · ")}</p>
        ) : null}
        {doctor.bio ? <p className="lede mt-6 whitespace-pre-line">{doctor.bio}</p> : null}
        {doctor.experience ? (
          <p className="mt-6 border-l-2 border-teal pl-5 text-charcoal whitespace-pre-line">{doctor.experience}</p>
        ) : null}
        <Button asChild variant="default" size="pill" className="mt-9">
          <Link href={`/appointment?doctor=${doctor.slug}`}>Book with {doctor.name}</Link>
        </Button>
      </div>
    </article>
  );
}
