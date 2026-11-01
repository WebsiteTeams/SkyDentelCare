"use client";

import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { FieldErrors } from "@/types";

/** Copies field errors returned by a server action into React Hook Form. */
export function applyFieldErrors<T extends FieldValues>(setError: UseFormSetError<T>, fieldErrors?: FieldErrors) {
  if (!fieldErrors) return;
  for (const [name, message] of Object.entries(fieldErrors)) {
    setError(name as Path<T>, { type: "server", message });
  }
}
