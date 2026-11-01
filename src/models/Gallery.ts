import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { imageSchema } from "./shared";

const gallerySchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    category: { type: String, enum: GALLERY_CATEGORIES.map((c) => c.value), required: true },
    image: { type: imageSchema, required: true },
    // Before-and-after cases only: `image` is the before, `afterImage` the after.
    afterImage: { type: imageSchema, default: null },
    consentConfirmed: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);

gallerySchema.index({ published: 1, category: 1, displayOrder: 1 });

export type GalleryDoc = InferSchemaType<typeof gallerySchema>;
export const Gallery: Model<GalleryDoc> = models.Gallery || model<GalleryDoc>("Gallery", gallerySchema);
