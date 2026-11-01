import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { APPOINTMENT_STATUSES } from "@/lib/constants";

const appointmentSchema = new Schema(
  {
    patientName: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    email: { type: String, default: "", lowercase: true, trim: true, maxlength: 200 },
    // Names are snapshotted so history survives a later edit or deletion.
    treatment: { type: Schema.Types.ObjectId, ref: "Treatment", default: null },
    treatmentName: { type: String, required: true, trim: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", default: null },
    doctorName: { type: String, default: "", trim: true },
    preferredDate: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    preferredTime: { type: String, required: true, match: /^\d{2}:\d{2}$/ },
    message: { type: String, default: "", trim: true, maxlength: 1000 },
    status: { type: String, enum: APPOINTMENT_STATUSES, default: "pending" },
    internalNotes: { type: String, default: "", trim: true, maxlength: 4000 },
  },
  { timestamps: true },
);

appointmentSchema.index({ status: 1, createdAt: -1 });
appointmentSchema.index({ preferredDate: 1 });
appointmentSchema.index({ treatment: 1 });
appointmentSchema.index({ updatedAt: -1 });

export type AppointmentDoc = InferSchemaType<typeof appointmentSchema>;
export const Appointment: Model<AppointmentDoc> =
  models.Appointment || model<AppointmentDoc>("Appointment", appointmentSchema);
