import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { imageSchema } from "./shared";

const textItem = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const faqItem = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const hoursItem = new Schema(
  {
    days: { type: String, required: true, trim: true },
    hours: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const clinicSettingsSchema = new Schema(
  {
    // Singleton: exactly one document, enforced by this unique key.
    key: { type: String, default: "main", unique: true, immutable: true },

    // Verified contact facts. Anything left blank is hidden on the public site.
    clinicName: { type: String, default: "SkyDentalClinic", trim: true },
    phone: { type: String, default: "", trim: true },
    whatsapp: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    streetAddress: { type: String, default: "", trim: true },
    city: { type: String, default: "", trim: true },
    region: { type: String, default: "", trim: true },
    postalCode: { type: String, default: "", trim: true },
    country: { type: String, default: "", trim: true },
    mapsEmbedUrl: { type: String, default: "", trim: true },
    mapsLinkUrl: { type: String, default: "", trim: true },
    hours: { type: [hoursItem], default: [] },
    instagramUrl: { type: String, default: "", trim: true },
    facebookUrl: { type: String, default: "", trim: true },
    seoDescription: { type: String, default: "", trim: true },

    // Editable website copy. Fields never saved fall back to lib/defaults.ts.
    content: {
      announcement: String,
      heroHeadline: String,
      heroText: String,
      heroImage: imageSchema,
      heroSecondaryImage: imageSchema,
      trustIndicators: { type: [textItem], default: undefined },
      introHeading: String,
      introText: String,
      introImage: imageSchema,
      whyChooseUs: { type: [textItem], default: undefined },
      mission: String,
      vision: String,
      philosophy: String,
      careApproach: { type: [textItem], default: undefined },
      facilities: { type: [textItem], default: undefined },
      technology: { type: [textItem], default: undefined },
      facilitiesImage: imageSchema,
      aboutImage: imageSchema,
      faqs: { type: [faqItem], default: undefined },
    },
  },
  { timestamps: true },
);

export type ClinicSettingsDoc = InferSchemaType<typeof clinicSettingsSchema>;
export const ClinicSettings: Model<ClinicSettingsDoc> =
  models.ClinicSettings || model<ClinicSettingsDoc>("ClinicSettings", clinicSettingsSchema);
