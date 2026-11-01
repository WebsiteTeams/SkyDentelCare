"use server";

import { connectDB } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { appointmentSchema, enquirySchema } from "@/lib/validations/public";
import { invalid } from "@/lib/validations/errors";
import { Appointment } from "@/models/Appointment";
import { Doctor } from "@/models/Doctor";
import { Enquiry } from "@/models/Enquiry";
import { Treatment } from "@/models/Treatment";
import type { ActionResult } from "@/types";

const TOO_MANY = "Too many requests. Please try again later, or contact the clinic directly.";
const FAILED = "We could not send your request. Please try again, or contact the clinic directly.";

export async function requestAppointment(input: unknown): Promise<ActionResult> {
  const parsed = appointmentSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const { website, treatment: treatmentId, doctor: doctorId, ...data } = parsed.data;

  // Bots get a normal-looking success so they do not adapt.
  if (website) return { ok: true };

  try {
    if (!(await checkRateLimit("appointment", 5, 60 * 60))) return { ok: false, error: TOO_MANY };

    await connectDB();
    const treatment = await Treatment.findOne({ _id: treatmentId, published: true }).select("name").lean();
    if (!treatment) {
      return { ok: false, error: "Please check the highlighted fields.", fieldErrors: { treatment: "Please select a treatment." } };
    }

    const doctor = doctorId ? await Doctor.findOne({ _id: doctorId, published: true }).select("name").lean() : null;

    await Appointment.create({
      ...data,
      treatment: treatment._id,
      treatmentName: treatment.name,
      doctor: doctor?._id ?? null,
      doctorName: doctor?.name ?? "",
    });
    return { ok: true };
  } catch (error) {
    console.error("requestAppointment failed", error);
    return { ok: false, error: FAILED };
  }
}

export async function submitEnquiry(input: unknown): Promise<ActionResult> {
  const parsed = enquirySchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const { website, ...data } = parsed.data;

  if (website) return { ok: true };

  try {
    if (!(await checkRateLimit("enquiry", 5, 60 * 60))) return { ok: false, error: TOO_MANY };

    await connectDB();
    await Enquiry.create(data);
    return { ok: true };
  } catch (error) {
    console.error("submitEnquiry failed", error);
    return { ok: false, error: FAILED };
  }
}
