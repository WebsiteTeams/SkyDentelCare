"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { requireAdmin, createSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db";
import { passwordSchema, profileSchema } from "@/lib/validations/admin";
import { invalid } from "@/lib/validations/errors";
import { Admin } from "@/models/Admin";
import type { ActionResult } from "@/types";
import { adminMutation } from "./guard";

export async function updateProfile(input: unknown) {
  const current = await requireAdmin();
  const result = await adminMutation(profileSchema, input, async (data) => {
    await Admin.updateOne({ _id: current.id }, data, { runValidators: true });
    return { ok: true, message: "Profile updated." };
  });
  if (!result.ok && result.error.includes("already exists")) {
    return { ok: false as const, error: "That email is already in use.", fieldErrors: { email: "That email is already in use." } };
  }
  return result;
}

export async function changePassword(input: unknown): Promise<ActionResult> {
  const current = await requireAdmin();
  const parsed = passwordSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  try {
    await connectDB();
    const admin = await Admin.findById(current.id).select("+passwordHash");
    if (!admin) redirect("/admin/login");

    if (!(await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash))) {
      const message = "Your current password is incorrect.";
      return { ok: false, error: message, fieldErrors: { currentPassword: message } };
    }

    // Bumping the version signs out every other device; this one gets a fresh session.
    const tokenVersion = (admin.tokenVersion ?? 0) + 1;
    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
    await Admin.updateOne({ _id: admin._id }, { passwordHash, tokenVersion });
    await createSession(String(admin._id), tokenVersion);
    return { ok: true, message: "Password changed. Other devices have been signed out." };
  } catch (error) {
    // redirect() signals by throwing and must not be swallowed here.
    if (error instanceof Error && "digest" in error) throw error;
    console.error("changePassword failed", error);
    return { ok: false, error: "Something went wrong. Your password was not changed." };
  }
}
