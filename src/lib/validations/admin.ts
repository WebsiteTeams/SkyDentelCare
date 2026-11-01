import { z } from "zod";
import { APPOINTMENT_STATUSES, ENQUIRY_STATUSES, GALLERY_CATEGORIES, type GalleryCategory } from "@/lib/constants";
import {
  emailSchema,
  optionalEmail,
  optionalImage,
  optionalPhone,
  optionalUrl,
  orderSchema,
  required,
  textItemSchema,
  trimmed,
} from "./common";

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required.").max(200),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const doctorSchema = z.object({
  name: required("Full name", 120),
  photo: optionalImage,
  qualifications: z.array(required("Qualification", 160)).max(20),
  specialization: trimmed(160),
  experience: trimmed(500),
  bio: trimmed(2000),
  displayOrder: orderSchema,
  published: z.boolean(),
});
export type DoctorInput = z.infer<typeof doctorSchema>;

export const treatmentSchema = z
  .object({
    name: required("Name", 120),
    image: optionalImage,
    shortDescription: required("Short description", 280),
    overview: trimmed(4000),
    benefits: z.array(required("Benefit", 240)).max(20),
    procedure: z.array(textItemSchema).max(20),
    featured: z.boolean(),
    displayOrder: orderSchema,
    published: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (!value.published) return;
    if (!value.image) ctx.addIssue({ code: "custom", path: ["image"], message: "Add an image before publishing." });
    if (!value.overview) ctx.addIssue({ code: "custom", path: ["overview"], message: "Add an overview before publishing." });
  });
export type TreatmentInput = z.infer<typeof treatmentSchema>;

const categoryValues = GALLERY_CATEGORIES.map((c) => c.value) as [GalleryCategory, ...GalleryCategory[]];

export const gallerySchema = z
  .object({
    title: required("Title", 120),
    category: z.enum(categoryValues, { error: "Choose a category." }),
    image: optionalImage,
    afterImage: optionalImage,
    consentConfirmed: z.boolean(),
    displayOrder: orderSchema,
    published: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (!value.image) ctx.addIssue({ code: "custom", path: ["image"], message: "An image is required." });
    if (value.category !== "before-after") return;
    if (!value.afterImage) ctx.addIssue({ code: "custom", path: ["afterImage"], message: "Add the after image." });
    if (value.published && !value.consentConfirmed) {
      ctx.addIssue({ code: "custom", path: ["consentConfirmed"], message: "Patient consent is required to publish." });
    }
  });
export type GalleryInput = z.infer<typeof gallerySchema>;

export const testimonialSchema = z
  .object({
    patientName: required("Patient name", 120),
    content: required("Testimonial", 1200),
    treatmentLabel: trimmed(120),
    consentConfirmed: z.boolean(),
    displayOrder: orderSchema,
    published: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (value.published && !value.consentConfirmed) {
      ctx.addIssue({ code: "custom", path: ["consentConfirmed"], message: "Confirm consent before publishing." });
    }
  });
export type TestimonialInput = z.infer<typeof testimonialSchema>;

export const appointmentUpdateSchema = z.object({
  status: z.enum(APPOINTMENT_STATUSES),
  internalNotes: trimmed(4000),
});
export type AppointmentUpdateInput = z.infer<typeof appointmentUpdateSchema>;

export const enquiryUpdateSchema = z.object({
  status: z.enum(ENQUIRY_STATUSES),
  internalNotes: trimmed(4000),
});
export type EnquiryUpdateInput = z.infer<typeof enquiryUpdateSchema>;

export const settingsSchema = z.object({
  clinicName: required("Clinic name", 120),
  phone: optionalPhone,
  whatsapp: optionalPhone,
  email: optionalEmail,
  streetAddress: trimmed(200),
  city: trimmed(100),
  region: trimmed(100),
  postalCode: trimmed(20),
  country: trimmed(100),
  // Only Google's embed endpoint may be framed on the contact page.
  mapsEmbedUrl: optionalUrl.refine(
    (v) => v === "" || v.startsWith("https://www.google.com/maps/embed"),
    "Use the src link from Google Maps → Share → Embed a map.",
  ),
  mapsLinkUrl: optionalUrl,
  hours: z.array(z.object({ days: required("Days", 60), hours: required("Hours", 60) })).max(14),
  instagramUrl: optionalUrl,
  facebookUrl: optionalUrl,
  seoDescription: trimmed(300),
});
export type SettingsInput = z.infer<typeof settingsSchema>;

const textItems = z.array(textItemSchema).max(20);

export const contentSchema = z.object({
  announcement: trimmed(160),
  heroHeadline: required("Headline", 120),
  heroText: trimmed(400),
  heroImage: optionalImage,
  heroSecondaryImage: optionalImage,
  trustIndicators: z.array(textItemSchema).max(4),
  introHeading: trimmed(160),
  introText: trimmed(1500),
  introImage: optionalImage,
  whyChooseUs: textItems,
  mission: trimmed(800),
  vision: trimmed(800),
  philosophy: trimmed(1500),
  careApproach: textItems,
  facilities: textItems,
  technology: textItems,
  facilitiesImage: optionalImage,
  aboutImage: optionalImage,
  faqs: z.array(z.object({ question: required("Question", 200), answer: required("Answer", 1500) })).max(30),
});
export type ContentInput = z.infer<typeof contentSchema>;

export const profileSchema = z.object({
  name: required("Name", 100),
  email: emailSchema,
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password.").max(200),
    newPassword: z.string().min(12, "Use at least 12 characters.").max(200),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });
export type PasswordInput = z.infer<typeof passwordSchema>;
