/**
 * Prepares a new database. Safe to run repeatedly: existing records are left untouched.
 *   - Creates the first admin from ADMIN_EMAIL and ADMIN_PASSWORD.
 *   - Creates the settings document with starter copy.
 *   - Adds the common treatments as UNPUBLISHED drafts for the clinic to confirm.
 */
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { DEFAULT_CONTENT } from "../src/lib/defaults";
import { connectDB } from "../src/lib/db";
import { Admin } from "../src/models/Admin";
import { ClinicSettings } from "../src/models/ClinicSettings";
import { Treatment } from "../src/models/Treatment";
import { TREATMENT_DRAFTS } from "./treatment-drafts";

async function main() {
  await connectDB();

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local.");
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");

  if (await Admin.exists({ email })) {
    console.log(`Admin ${email} already exists; password left unchanged.`);
  } else {
    await Admin.create({
      name: process.env.ADMIN_NAME?.trim() || "Clinic Admin",
      email,
      passwordHash: await bcrypt.hash(password, 12),
    });
    console.log(`Created admin ${email}.`);
  }

  await ClinicSettings.updateOne(
    { key: "main" },
    { $setOnInsert: { key: "main", content: DEFAULT_CONTENT } },
    { upsert: true },
  );
  console.log("Clinic settings ready.");

  let added = 0;
  for (const [index, draft] of TREATMENT_DRAFTS.entries()) {
    const result = await Treatment.updateOne(
      { slug: draft.slug },
      { $setOnInsert: { ...draft, displayOrder: index, featured: index < 6, published: false } },
      { upsert: true },
    );
    added += result.upsertedCount;
  }
  console.log(`Added ${added} draft treatments. Publish the ones the clinic offers in Admin → Treatments.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
