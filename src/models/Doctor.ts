import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { imageSchema } from "./shared";

const doctorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    photo: { type: imageSchema, default: null },
    qualifications: { type: [String], default: [] },
    specialization: { type: String, default: "", trim: true, maxlength: 160 },
    experience: { type: String, default: "", trim: true, maxlength: 500 },
    bio: { type: String, default: "", trim: true, maxlength: 2000 },
    displayOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);

doctorSchema.index({ published: 1, displayOrder: 1 });

export type DoctorDoc = InferSchemaType<typeof doctorSchema>;
export const Doctor: Model<DoctorDoc> = models.Doctor || model<DoctorDoc>("Doctor", doctorSchema);
