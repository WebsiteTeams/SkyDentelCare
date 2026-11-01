import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

// Fixed-window counters shared across serverless instances. MongoDB removes them via the TTL index.
const rateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export type RateLimitDoc = InferSchemaType<typeof rateLimitSchema>;
export const RateLimit: Model<RateLimitDoc> =
  models.RateLimit || model<RateLimitDoc>("RateLimit", rateLimitSchema);
