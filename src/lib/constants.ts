export const APPOINTMENT_STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const ENQUIRY_STATUSES = ["new", "in-progress", "resolved"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  "in-progress": "In progress",
  resolved: "Resolved",
};

export const GALLERY_CATEGORIES = [
  { value: "interiors", label: "Clinic interiors" },
  { value: "treatment-rooms", label: "Treatment rooms" },
  { value: "equipment", label: "Equipment" },
  { value: "doctors", label: "Doctor portraits" },
  { value: "facilities", label: "Facilities" },
  { value: "before-after", label: "Before & after" },
] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]["value"];

export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/treatments", label: "Treatments" },
  { href: "/doctors", label: "Doctors" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const PAGE_SIZE = 20;
