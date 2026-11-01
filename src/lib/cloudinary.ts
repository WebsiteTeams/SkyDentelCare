import "server-only";
import { v2 as cloudinary } from "cloudinary";

export const CLOUDINARY_FOLDER = "skydentalclinic";

function configure(): boolean {
  const cloud_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) return false;
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  return true;
}

export function createUploadSignature() {
  if (!configure()) return null;
  const timestamp = Math.round(Date.now() / 1000);
  const params = { timestamp, folder: CLOUDINARY_FOLDER };
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);
  return {
    ...params,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  };
}

/** Best effort: a failed clean-up leaves an unused file but must not fail the admin's action. */
export async function deleteImages(publicIds: Array<string | null | undefined>) {
  const ids = publicIds.filter((id): id is string => Boolean(id));
  if (ids.length === 0 || !configure()) return;
  await Promise.allSettled(ids.map((id) => cloudinary.uploader.destroy(id)));
}
