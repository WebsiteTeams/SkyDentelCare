import "server-only";
import { cache } from "react";
import { connectDB } from "@/lib/db";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import { serialize } from "@/lib/serialize";
import { ClinicSettings } from "@/models/ClinicSettings";
import { Doctor } from "@/models/Doctor";
import { Gallery } from "@/models/Gallery";
import { Testimonial } from "@/models/Testimonial";
import { Treatment } from "@/models/Treatment";
import type { DoctorDTO, GalleryDTO, SettingsDTO, TestimonialDTO, TreatmentDTO } from "@/types";

/**
 * Lets `next build` succeed before a database is reachable: pages fall back to empty data and
 * regenerate on the next revalidation. At runtime errors propagate, so a failed revalidation
 * keeps serving the last good page instead of caching an empty one.
 */
async function load<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  const isBuild = process.env.NEXT_PHASE === "phase-production-build";
  if (!process.env.MONGODB_URI) {
    if (!isBuild) console.warn("MONGODB_URI is not set; rendering without clinic data.");
    return fallback;
  }
  try {
    await connectDB();
    return await query();
  } catch (error) {
    if (isBuild) {
      console.warn("Database unavailable during build; rendering without clinic data.", error);
      return fallback;
    }
    throw error;
  }
}

function withDefaults(doc: unknown): SettingsDTO {
  if (!doc) return DEFAULT_SETTINGS;
  const settings = serialize<SettingsDTO>(doc);
  return { ...DEFAULT_SETTINGS, ...settings, content: { ...DEFAULT_SETTINGS.content, ...settings.content } };
}

export const getSettings = cache(() =>
  load(async () => withDefaults(await ClinicSettings.findOne({ key: "main" }).lean()), DEFAULT_SETTINGS),
);

export const getPublishedTreatments = cache(() =>
  load(
    async () =>
      serialize<TreatmentDTO[]>(await Treatment.find({ published: true }).sort({ displayOrder: 1, name: 1 }).lean()),
    [],
  ),
);

export const getTreatmentBySlug = cache((slug: string) =>
  load(async () => {
    const doc = await Treatment.findOne({ slug, published: true }).lean();
    return doc ? serialize<TreatmentDTO>(doc) : null;
  }, null),
);

export const getPublishedDoctors = cache(() =>
  load(
    async () =>
      serialize<DoctorDTO[]>(await Doctor.find({ published: true }).sort({ displayOrder: 1, name: 1 }).lean()),
    [],
  ),
);

export const getPublishedGallery = cache(() =>
  load(
    async () =>
      serialize<GalleryDTO[]>(
        await Gallery.find({
          published: true,
          // Consent is re-checked on read as well as on save.
          $or: [{ category: { $ne: "before-after" } }, { consentConfirmed: true, afterImage: { $ne: null } }],
        })
          .sort({ displayOrder: 1, createdAt: -1 })
          .lean(),
      ),
    [],
  ),
);

export const getPublishedTestimonials = cache(() =>
  load(
    async () =>
      serialize<TestimonialDTO[]>(
        await Testimonial.find({ published: true, consentConfirmed: true }).sort({ displayOrder: 1, createdAt: -1 }).lean(),
      ),
    [],
  ),
);
