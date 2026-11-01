import "server-only";
import type { QueryFilter } from "mongoose";
import { requireAdmin } from "@/lib/auth/session";
import { connectDB } from "@/lib/db";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import { PAGE_SIZE, APPOINTMENT_STATUSES, ENQUIRY_STATUSES } from "@/lib/constants";
import { serialize } from "@/lib/serialize";
import { escapeRegExp } from "@/lib/utils";
import { Appointment, type AppointmentDoc } from "@/models/Appointment";
import { Doctor } from "@/models/Doctor";
import { Enquiry, type EnquiryDoc } from "@/models/Enquiry";
import { ClinicSettings } from "@/models/ClinicSettings";
import { Gallery } from "@/models/Gallery";
import { Testimonial } from "@/models/Testimonial";
import { Treatment } from "@/models/Treatment";
import { objectIdSchema } from "@/lib/validations/common";
import type { AppointmentDTO, DoctorDTO, EnquiryDTO, GalleryDTO, SettingsDTO, TestimonialDTO, TreatmentDTO } from "@/types";

export type Paged<T> = { items: T[]; total: number; page: number; pageCount: number };

/** Every admin read is authorized here, in addition to the layout and proxy checks. */
async function authorize() {
  await requireAdmin();
  await connectDB();
}

const toPage = (value?: string) => Math.max(1, Number.parseInt(value ?? "1", 10) || 1);

export async function getDashboardStats() {
  await authorize();
  const [total, pending, confirmed, cancelled, enquiries, recent] = await Promise.all([
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: "pending" }),
    Appointment.countDocuments({ status: "confirmed" }),
    Appointment.countDocuments({ status: "cancelled" }),
    Enquiry.countDocuments(),
    Appointment.find().sort({ updatedAt: -1 }).limit(8).lean(),
  ]);
  return { total, pending, confirmed, cancelled, enquiries, recent: serialize<AppointmentDTO[]>(recent) };
}

type Param = string | string[] | undefined;
const one = (value: Param) => (typeof value === "string" ? value : undefined);

export type AppointmentFilters = { q?: Param; date?: Param; treatment?: Param; status?: Param; page?: Param };

export async function getAppointments(raw: AppointmentFilters): Promise<Paged<AppointmentDTO>> {
  await authorize();
  const filters = { q: one(raw.q), date: one(raw.date), treatment: one(raw.treatment), status: one(raw.status), page: one(raw.page) };
  const query: QueryFilter<AppointmentDoc> = {};
  if (filters.q) query.patientName = { $regex: escapeRegExp(filters.q.slice(0, 120)), $options: "i" };
  if (filters.date && /^\d{4}-\d{2}-\d{2}$/.test(filters.date)) query.preferredDate = filters.date;
  if (filters.treatment && objectIdSchema.safeParse(filters.treatment).success) query.treatment = filters.treatment;
  const status = APPOINTMENT_STATUSES.find((value) => value === filters.status);
  if (status) query.status = status;

  const page = toPage(filters.page);
  const [items, total] = await Promise.all([
    Appointment.find(query).sort({ createdAt: -1 }).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).lean(),
    Appointment.countDocuments(query),
  ]);
  return { items: serialize(items), total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export type EnquiryFilters = { q?: Param; status?: Param; page?: Param };

export async function getEnquiries(raw: EnquiryFilters): Promise<Paged<EnquiryDTO>> {
  await authorize();
  const filters = { q: one(raw.q), status: one(raw.status), page: one(raw.page) };
  const query: QueryFilter<EnquiryDoc> = {};
  if (filters.q) {
    const pattern = { $regex: escapeRegExp(filters.q.slice(0, 120)), $options: "i" };
    query.$or = [{ name: pattern }, { email: pattern }];
  }
  const status = ENQUIRY_STATUSES.find((value) => value === filters.status);
  if (status) query.status = status;

  const page = toPage(filters.page);
  const [items, total] = await Promise.all([
    Enquiry.find(query).sort({ createdAt: -1 }).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).lean(),
    Enquiry.countDocuments(query),
  ]);
  return { items: serialize(items), total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getAllDoctors() {
  await authorize();
  return serialize<DoctorDTO[]>(await Doctor.find().sort({ displayOrder: 1, name: 1 }).lean());
}

export async function getAllTreatments() {
  await authorize();
  return serialize<TreatmentDTO[]>(await Treatment.find().sort({ displayOrder: 1, name: 1 }).lean());
}

export async function getTreatmentOptions() {
  await authorize();
  const items = await Treatment.find().select("name").sort({ name: 1 }).lean();
  return items.map((t) => ({ value: String(t._id), label: t.name }));
}

export async function getAllGallery() {
  await authorize();
  return serialize<GalleryDTO[]>(await Gallery.find().sort({ displayOrder: 1, createdAt: -1 }).lean());
}

export async function getAllTestimonials() {
  await authorize();
  return serialize<TestimonialDTO[]>(await Testimonial.find().sort({ displayOrder: 1, createdAt: -1 }).lean());
}

/** Uncached, so the editor always shows what is stored. */
export async function getAdminSettings(): Promise<SettingsDTO> {
  await authorize();
  const doc = await ClinicSettings.findOne({ key: "main" }).lean();
  if (!doc) return DEFAULT_SETTINGS;
  const settings = serialize<SettingsDTO>(doc);
  return { ...DEFAULT_SETTINGS, ...settings, content: { ...DEFAULT_SETTINGS.content, ...settings.content } };
}
