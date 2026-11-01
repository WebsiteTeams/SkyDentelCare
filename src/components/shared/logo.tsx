import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 40" fill="none" aria-hidden className={cn("h-8 w-[1.6rem]", className)}>
      <path d="M2 38V16a14 14 0 0 1 28 0v22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9.5 38V16.5a6.5 6.5 0 0 1 13 0V38" stroke="var(--brand-teal)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ inverse, className }: { inverse?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      aria-label="SkyDentalClinic home"
      className={cn("inline-flex items-center gap-3", inverse ? "text-white" : "text-navy", className)}
    >
      <LogoMark />
      <span className="font-serif text-[1.375rem] leading-none tracking-tight">
        SkyDental<span className={inverse ? "text-ice" : "text-teal"}>Clinic</span>
      </span>
    </Link>
  );
}
