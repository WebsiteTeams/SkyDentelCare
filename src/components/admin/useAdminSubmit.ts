"use client";

import { useRouter } from "next/navigation";
import type { FieldValues, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { applyFieldErrors } from "@/components/site/useServerForm";
import type { ActionResult } from "@/types";

/** Runs a server action, reports the outcome, maps field errors and refreshes server data. */
export function useAdminSubmit<T extends FieldValues = FieldValues>(setError?: UseFormSetError<T>, onSuccess?: () => void) {
  const router = useRouter();
  return async (run: () => Promise<ActionResult<unknown>>) => {
    const result = await run().catch(() => null);
    if (!result) {
      toast.error("Could not reach the server. Your changes were not saved.");
      return;
    }
    if (!result.ok) {
      toast.error(result.error);
      if (setError) applyFieldErrors(setError, result.fieldErrors);
      return;
    }
    toast.success(result.message ?? "Saved.");
    router.refresh();
    onSuccess?.();
  };
}
