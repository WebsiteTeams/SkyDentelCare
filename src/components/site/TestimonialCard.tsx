import { cn } from "@/lib/utils";
import type { TestimonialDTO } from "@/types";

export function TestimonialCard({ testimonial, large, className }: { testimonial: TestimonialDTO; large?: boolean; className?: string }) {
  return (
    <figure className={cn("reveal", className)}>
      <blockquote className={large ? "font-serif text-[clamp(1.625rem,1.2rem+1.6vw,2.75rem)] leading-[1.22] text-navy" : "text-lg leading-relaxed text-charcoal"}>
        “{testimonial.content}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 text-sm">
        <span aria-hidden className="h-px w-8 bg-teal" />
        <span className="font-semibold text-navy">{testimonial.patientName}</span>
        {testimonial.treatmentLabel ? <span className="text-muted-foreground">{testimonial.treatmentLabel}</span> : null}
      </figcaption>
    </figure>
  );
}
