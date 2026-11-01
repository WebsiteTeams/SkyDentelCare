import type { z } from "zod";
import type { ActionResult, FieldErrors } from "@/types";

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    fieldErrors[key] ??= issue.message;
  }
  return fieldErrors;
}

export function invalid(error: z.ZodError): ActionResult<never> {
  return { ok: false, error: "Please check the highlighted fields.", fieldErrors: toFieldErrors(error) };
}
