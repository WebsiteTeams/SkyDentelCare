import { z } from "zod";

export const trimmed = (max: number) => z.string().trim().max(max, `Must be ${max} characters or fewer.`);
export const required = (label: string, max: number) =>
  trimmed(max).min(1, `${label} is required.`);

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[\d\s().-]{7,20}$/, "Enter a valid phone number.")
  .refine((v) => v.replace(/\D/g, "").length >= 7, "Enter a valid phone number.");

export const emailSchema = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address."));
export const optionalEmail = z.union([z.literal(""), emailSchema]);
export const optionalPhone = z.union([z.literal(""), phoneSchema]);

export const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https:\/\/[^\s]+$/.test(v), "Enter a full https:// link.");

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export const imageSchema = z.object({
  // Uploads from this project's Cloudinary account, or the bundled preview photographs.
  url: z
    .string()
    .trim()
    .refine(
      (v) => v.startsWith("/demo/") || v.startsWith(CLOUD_NAME ? `https://res.cloudinary.com/${CLOUD_NAME}/` : "https://res.cloudinary.com/"),
      "Images must be uploaded through the image picker.",
    ),
  publicId: trimmed(300),
  alt: trimmed(200),
});
export const optionalImage = imageSchema.nullable();

export const textItemSchema = z.object({
  title: required("Title", 160),
  description: trimmed(800),
});

export const orderSchema = z.number().int().min(0).max(9999);
export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid identifier.");
export const optionalObjectId = z.union([z.literal(""), objectIdSchema]);
