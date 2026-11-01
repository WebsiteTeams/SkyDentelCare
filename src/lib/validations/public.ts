import { z } from "zod";
import { emailSchema, optionalEmail, optionalObjectId, optionalPhone, phoneSchema, required, trimmed } from "./common";

const toDateString = (date: Date) => date.toISOString().slice(0, 10);

export const appointmentSchema = z.object({
  patientName: required("Your name", 120),
  phone: phoneSchema,
  email: optionalEmail,
  treatment: optionalObjectId.refine((v) => v !== "", "Please select a treatment."),
  doctor: optionalObjectId,
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date.")
    .refine((value) => {
      // One day of leeway because the patient's timezone may differ from the server's.
      const yesterday = new Date(Date.now() - 86_400_000);
      return value >= toDateString(yesterday);
    }, "Please choose a date that is not in the past.")
    .refine((value) => {
      const limit = new Date(Date.now() + 365 * 86_400_000);
      return value <= toDateString(limit);
    }, "Please choose a date within the next year."),
  preferredTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Please choose a time."),
  message: trimmed(1000),
  // Honeypot: hidden from people, filled in by bots.
  website: z.string().optional(),
});
export type AppointmentInput = z.infer<typeof appointmentSchema>;

export const enquirySchema = z.object({
  name: required("Your name", 120),
  email: emailSchema,
  phone: optionalPhone,
  subject: trimmed(160),
  message: required("A message", 2000).min(10, "Please include a little more detail."),
  website: z.string().optional(),
});
export type EnquiryInput = z.infer<typeof enquirySchema>;
