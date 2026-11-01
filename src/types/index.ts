import type { AppointmentStatus, EnquiryStatus, GalleryCategory } from "@/lib/constants";

export type ImageData = { url: string; publicId: string; alt: string };
export type TextItem = { title: string; description: string };
export type FaqItem = { question: string; answer: string };
export type HoursItem = { days: string; hours: string };

export type DoctorDTO = {
  _id: string;
  name: string;
  slug: string;
  photo: ImageData | null;
  qualifications: string[];
  specialization: string;
  experience: string;
  bio: string;
  displayOrder: number;
  published: boolean;
};

export type TreatmentDTO = {
  _id: string;
  name: string;
  slug: string;
  image: ImageData | null;
  shortDescription: string;
  overview: string;
  benefits: string[];
  procedure: TextItem[];
  featured: boolean;
  displayOrder: number;
  published: boolean;
  updatedAt: string;
};

export type AppointmentDTO = {
  _id: string;
  patientName: string;
  phone: string;
  email: string;
  treatment: string | null;
  treatmentName: string;
  doctor: string | null;
  doctorName: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: AppointmentStatus;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
};

export type EnquiryDTO = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  internalNotes: string;
  createdAt: string;
};

export type GalleryDTO = {
  _id: string;
  title: string;
  category: GalleryCategory;
  image: ImageData;
  afterImage: ImageData | null;
  consentConfirmed: boolean;
  displayOrder: number;
  published: boolean;
};

export type TestimonialDTO = {
  _id: string;
  patientName: string;
  content: string;
  treatmentLabel: string;
  consentConfirmed: boolean;
  displayOrder: number;
  published: boolean;
};

export type SiteContent = {
  announcement: string;
  heroHeadline: string;
  heroText: string;
  heroImage: ImageData | null;
  heroSecondaryImage: ImageData | null;
  trustIndicators: TextItem[];
  introHeading: string;
  introText: string;
  introImage: ImageData | null;
  whyChooseUs: TextItem[];
  mission: string;
  vision: string;
  philosophy: string;
  careApproach: TextItem[];
  facilities: TextItem[];
  technology: TextItem[];
  facilitiesImage: ImageData | null;
  aboutImage: ImageData | null;
  faqs: FaqItem[];
};

export type SettingsDTO = {
  clinicName: string;
  phone: string;
  whatsapp: string;
  email: string;
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  mapsEmbedUrl: string;
  mapsLinkUrl: string;
  hours: HoursItem[];
  instagramUrl: string;
  facebookUrl: string;
  seoDescription: string;
  content: SiteContent;
};

export type FieldErrors = Record<string, string>;

/** The response shape returned by every server action. */
export type ActionResult<T = undefined> =
  | { ok: true; message?: string; data?: T }
  | { ok: false; error: string; fieldErrors?: FieldErrors };
