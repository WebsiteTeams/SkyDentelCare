import { CalendarCheck, Building2, Images, LayoutDashboard, Mail, MessageSquareQuote, PanelsTopLeft, Stethoscope, UserCog, UserRound } from "lucide-react";

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarCheck },
  { href: "/admin/enquiries", label: "Enquiries", icon: Mail },
  { href: "/admin/doctors", label: "Doctors", icon: UserRound },
  { href: "/admin/treatments", label: "Treatments", icon: Stethoscope },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/content", label: "Website content", icon: PanelsTopLeft },
  { href: "/admin/settings", label: "Clinic settings", icon: Building2 },
  { href: "/admin/profile", label: "Profile", icon: UserCog },
] as const;
