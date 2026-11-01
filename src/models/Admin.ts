import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 200 },
    passwordHash: { type: String, required: true, select: false },
    // Incremented on password change to invalidate every existing session.
    tokenVersion: { type: Number, default: 0 },
    failedLoginAttempts: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, default: null, select: false },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export type AdminDoc = InferSchemaType<typeof adminSchema>;
export const Admin: Model<AdminDoc> = models.Admin || model<AdminDoc>("Admin", adminSchema);
