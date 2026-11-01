import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { RateLimit } from "@/models/RateLimit";

async function clientKey(scope: string): Promise<string> {
  const store = await headers();
  const ip = store.get("x-forwarded-for")?.split(",")[0]?.trim() || store.get("x-real-ip") || "unknown";
  // Hashed so raw patient IP addresses are never stored.
  return `${scope}:${createHash("sha256").update(ip).digest("hex")}`;
}

/** Returns false once the caller has exceeded `limit` requests in the current window. */
export async function checkRateLimit(scope: string, limit: number, windowSeconds: number): Promise<boolean> {
  await connectDB();
  const key = await clientKey(scope);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowSeconds * 1000);

  // Expired counters may linger until MongoDB's TTL monitor runs, so reset them here.
  await RateLimit.updateOne({ key, expiresAt: { $lte: now } }, { $set: { count: 0, expiresAt } });

  const entry = await RateLimit.findOneAndUpdate(
    { key },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
    { upsert: true, returnDocument: "after" },
  ).lean();

  return (entry?.count ?? 0) <= limit;
}
