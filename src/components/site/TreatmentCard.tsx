import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { TreatmentDTO } from "@/types";
import { ClinicImage } from "./ClinicImage";

/** Editorial catalogue card; `tall` varies the crop so the grid does not read as identical tiles. */
export function TreatmentCard({ treatment, tall, sizes }: { treatment: TreatmentDTO; tall?: boolean; sizes: string }) {
  return (
    <Link href={`/treatments/${treatment.slug}`} className="group reveal block">
      <div className={`relative overflow-hidden rounded-lg ${tall ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
        <ClinicImage
          image={treatment.image}
          alt={treatment.name}
          sizes={sizes}
          className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <h3 className="display-3">{treatment.name}</h3>
        <ArrowUpRight className="mt-1.5 size-5 shrink-0 text-teal transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      </div>
      <p className="mt-2.5 max-w-prose text-charcoal">{treatment.shortDescription}</p>
    </Link>
  );
}

/** Numbered index used on the home page. */
export function TreatmentIndex({ treatments }: { treatments: TreatmentDTO[] }) {
  return (
    <ol className="border-t border-border">
      {treatments.map((treatment, index) => (
        <li key={treatment._id} className="border-b border-border">
          <Link
            href={`/treatments/${treatment.slug}`}
            className="group grid grid-cols-[2.5rem_1fr_auto] items-start gap-x-3 py-7 transition-colors duration-300 hover:bg-ice sm:grid-cols-[3.5rem_1fr_auto] sm:px-4 md:py-8"
          >
            <span className="pt-1.5 text-sm font-semibold text-muted-foreground tabular-nums" aria-hidden>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>
              <span className="display-3 block">{treatment.name}</span>
              <span className="mt-2 block max-w-xl text-charcoal">{treatment.shortDescription}</span>
            </span>
            <ArrowUpRight className="mt-1.5 size-5 text-teal transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </Link>
        </li>
      ))}
    </ol>
  );
}
