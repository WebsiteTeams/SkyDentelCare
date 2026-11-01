"use client";

import { ErrorState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorState
      title="This page could not be loaded."
      description="Please check the database connection and try again."
      action={<Button onClick={reset}>Try again</Button>}
    />
  );
}
