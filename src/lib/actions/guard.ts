import "server-only";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { connectDB } from "@/lib/db";
import { invalid } from "@/lib/validations/errors";
import { objectIdSchema } from "@/lib/validations/common";
import type { ActionResult } from "@/types";

/** Authorizes first, then validates, connects and runs a mutation with uniform error handling. */
export async function adminMutation<S extends z.ZodType, R = undefined>(
  schema: S,
  input: unknown,
  run: (data: z.output<S>) => Promise<ActionResult<R>>,
): Promise<ActionResult<R>> {
  // Outside the try: its redirect is signalled by throwing and must reach Next.js.
  await requireAdmin();

  const parsed = schema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  try {
    await connectDB();
    return await run(parsed.data);
  } catch (error) {
    if (isDuplicateKey(error)) return { ok: false, error: "An entry with this name already exists." };
    console.error("Admin mutation failed", error);
    return { ok: false, error: "Something went wrong. Your changes were not saved." };
  }
}

export function isDuplicateKey(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

export const idSchema = objectIdSchema;

/** Public pages are cached, so any published content change clears them. */
export function revalidateSite() {
  revalidatePath("/", "layout");
}

export function notFound(label: string): ActionResult<never> {
  return { ok: false, error: `${label} not found. It may already have been removed.` };
}
