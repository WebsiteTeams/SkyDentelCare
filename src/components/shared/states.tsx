import type { LucideIcon } from "lucide-react";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function LoadingState({ label = "Loading", className }: { label?: string; className?: string }) {
  return (
    <div role="status" className={cn("flex min-h-64 items-center justify-center gap-3 text-navy", className)}>
      <Loader2 className="size-5 animate-spin text-teal" aria-hidden />
      <span className="text-sm font-medium">{label}…</span>
    </div>
  );
}

type StateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: LucideIcon;
  className?: string;
};

export function EmptyState({ title, description, action, icon: Icon = Inbox, className }: StateProps) {
  return (
    <div className={cn("flex flex-col items-center rounded-lg bg-ice px-6 py-16 text-center", className)}>
      <Icon className="size-6 text-teal" aria-hidden />
      <h2 className="mt-5 font-serif text-2xl text-navy">{title}</h2>
      {description ? <p className="mt-3 max-w-md text-charcoal">{description}</p> : null}
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ title, description, action, icon: Icon = AlertCircle, className }: StateProps) {
  return (
    <div role="alert" className={cn("flex flex-col items-center rounded-lg border border-border px-6 py-16 text-center", className)}>
      <Icon className="size-6 text-navy" aria-hidden />
      <h2 className="mt-5 font-serif text-2xl text-navy">{title}</h2>
      {description ? <p className="mt-3 max-w-md text-charcoal">{description}</p> : null}
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  );
}
