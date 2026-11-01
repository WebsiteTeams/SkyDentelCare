import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { imageSchema } from "./shared";

const treatmentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: imageSchema, default: null },
    shortDescription: { type: String, required: true, trim: true, maxlength: 280 },
    overview: { type: String, default: "", trim: true, maxlength: 4000 },
    benefits: { type: [String], default: [] },
    procedure: {
      type: [
        new Schema(
          {
            title: { type: String, required: true, trim: true, maxlength: 160 },
            description: { type: String, default: "", trim: true, maxlength: 800 },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    // Only services the clinic has confirmed are published.
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);

treatmentSchema.index({ published: 1, displayOrder: 1 });

export type TreatmentDoc = InferSchemaType<typeof treatmentSchema>;
export const Treatment: Model<TreatmentDoc> =
  models.Treatment || model<TreatmentDoc>("Treatment", treatmentSchema);
