import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { ENQUIRY_STATUSES } from "@/lib/constants";

const enquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 200 },
    phone: { type: String, default: "", trim: true, maxlength: 30 },
    subject: { type: String, default: "", trim: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: ENQUIRY_STATUSES, default: "new" },
    internalNotes: { type: String, default: "", trim: true, maxlength: 4000 },
  },
  { timestamps: true },
);

enquirySchema.index({ status: 1, createdAt: -1 });

export type EnquiryDoc = InferSchemaType<typeof enquirySchema>;
export const Enquiry: Model<EnquiryDoc> = models.Enquiry || model<EnquiryDoc>("Enquiry", enquirySchema);
