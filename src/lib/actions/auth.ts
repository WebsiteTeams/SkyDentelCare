"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validations/admin";
import { invalid } from "@/lib/validations/errors";
import { Admin } from "@/models/Admin";
import type { ActionResult } from "@/types";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
const INVALID_CREDENTIALS = "Incorrect email or password.";
// Compared against when the email is unknown, so response time does not reveal which emails exist.
const DUMMY_HASH = "$2b$12$2m5KkLk03jg4kiEIG3H8IewViv1r6fCXl7vv0Wm1jphIhv.rK3Tve";

export async function login(input: unknown): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const { email, password } = parsed.data;

  try {
    if (!(await checkRateLimit("login", 20, 15 * 60))) {
      return { ok: false, error: "Too many attempts. Please wait a few minutes and try again." };
    }

    await connectDB();
    const admin = await Admin.findOne({ email }).select("+passwordHash +failedLoginAttempts +lockUntil");

    if (!admin) {
      await bcrypt.compare(password, DUMMY_HASH);
      return { ok: false, error: INVALID_CREDENTIALS };
    }

    if (admin.lockUntil && admin.lockUntil > new Date()) {
      return { ok: false, error: `Too many failed attempts. Please try again within ${LOCK_MINUTES} minutes.` };
    }

    if (!(await bcrypt.compare(password, admin.passwordHash))) {
      const attempts = (admin.failedLoginAttempts ?? 0) + 1;
      const locked = attempts >= MAX_FAILED_ATTEMPTS;
      await Admin.updateOne(
        { _id: admin._id },
        {
          failedLoginAttempts: locked ? 0 : attempts,
          lockUntil: locked ? new Date(Date.now() + LOCK_MINUTES * 60_000) : null,
        },
      );
      return { ok: false, error: INVALID_CREDENTIALS };
    }

    await Admin.updateOne({ _id: admin._id }, { failedLoginAttempts: 0, lockUntil: null, lastLoginAt: new Date() });
    await createSession(String(admin._id), admin.tokenVersion ?? 0);
  } catch (error) {
    console.error("login failed", error);
    return { ok: false, error: "Sign-in is unavailable right now. Please try again." };
  }
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
