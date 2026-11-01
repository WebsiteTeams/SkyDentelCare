"use server";

import { requireAdmin } from "@/lib/auth/session";
import { createUploadSignature } from "@/lib/cloudinary";

export type UploadSignature = NonNullable<ReturnType<typeof createUploadSignature>>;

/** Signs a browser-to-Cloudinary upload, which also avoids Vercel's request body limit. */
export async function getUploadSignature(): Promise<
  { ok: true; data: UploadSignature } | { ok: false; error: string }
> {
  await requireAdmin();
  const data = createUploadSignature();
  if (!data) return { ok: false, error: "Image uploads are not configured. Add the Cloudinary environment variables." };
  return { ok: true, data };
}
