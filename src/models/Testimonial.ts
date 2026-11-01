import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const testimonialSchema = new Schema(
  {
    patientName: { type: String, required: true, trim: true, maxlength: 120 },
    content: { type: String, required: true, trim: true, maxlength: 1200 },
    treatmentLabel: { type: String, default: "", trim: true, maxlength: 120 },
    // Must be genuine and consented; publishing is refused until this is confirmed.
    consentConfirmed: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);

testimonialSchema.index({ published: 1, displayOrder: 1 });

export type TestimonialDoc = InferSchemaType<typeof testimonialSchema>;
export const Testimonial: Model<TestimonialDoc> =
  models.Testimonial || model<TestimonialDoc>("Testimonial", testimonialSchema);
