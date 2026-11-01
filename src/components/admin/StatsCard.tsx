import type { LucideIcon } from "lucide-react";

export function StatsCard({ label, value, icon: Icon }: { label: string; value: number; icon: LucideIcon }) {
  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-charcoal">{label}</p>
        <Icon className="size-4 text-teal" aria-hidden />
      </div>
      <p className="mt-3 font-serif text-4xl text-navy tabular-nums">{value}</p>
    </div>
  );
}
