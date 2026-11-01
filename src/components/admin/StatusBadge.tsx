import { APPOINTMENT_STATUS_LABELS, ENQUIRY_STATUS_LABELS, type AppointmentStatus, type EnquiryStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";

const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap";

// Statuses differ by fill and label within the brand palette, never by colour alone.
const appointmentStyles: Record<AppointmentStatus, string> = {
  pending: "border-navy/30 bg-white text-navy",
  confirmed: "border-navy bg-navy text-white",
  completed: "border-ice bg-ice text-navy",
  cancelled: "border-charcoal/30 bg-white text-charcoal line-through decoration-charcoal/50",
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return <span className={cn(base, appointmentStyles[status])}>{APPOINTMENT_STATUS_LABELS[status]}</span>;
}

const enquiryStyles: Record<EnquiryStatus, string> = {
  new: "border-navy bg-navy text-white",
  "in-progress": "border-navy/30 bg-white text-navy",
  resolved: "border-ice bg-ice text-navy",
};

export function EnquiryStatusBadge({ status }: { status: EnquiryStatus }) {
  return <span className={cn(base, enquiryStyles[status])}>{ENQUIRY_STATUS_LABELS[status]}</span>;
}

export function PublishedBadge({ published }: { published: boolean }) {
  return (
    <span className={cn(base, published ? "border-navy bg-navy text-white" : "border-navy/30 bg-white text-navy")}>
      {published ? "Published" : "Draft"}
    </span>
  );
}
