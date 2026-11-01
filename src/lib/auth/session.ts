import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Admin } from "@/models/Admin";
import { SESSION_COOKIE, SESSION_MAX_AGE, getSessionKey } from "./token";

export type CurrentAdmin = { id: string; name: string; email: string };

export async function createSession(adminId: string, tokenVersion: number) {
  const token = await new SignJWT({ tv: tokenVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSessionKey());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete({ name: SESSION_COOKIE, path: "/admin" });
}

/** Verifies the signed cookie, then checks the admin still exists and the session has not been revoked. */
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  let payload;
  try {
    ({ payload } = await jwtVerify(token, getSessionKey(), { algorithms: ["HS256"] }));
  } catch {
    return null;
  }
  if (!payload.sub) return null;

  await connectDB();
  const admin = await Admin.findById(payload.sub).select("name email tokenVersion").lean();
  if (!admin || admin.tokenVersion !== payload.tv) return null;

  return { id: String(admin._id), name: admin.name, email: admin.email };
}

/** Authorization guard for every admin page and server action. */
export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
