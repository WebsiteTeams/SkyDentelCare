export const SESSION_COOKIE = "sdc_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8;

export function getSessionKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be set to at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}
