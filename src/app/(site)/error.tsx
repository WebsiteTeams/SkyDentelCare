"use client";

import { ErrorState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-site section-y">
      <ErrorState
        title="We could not load this page."
        description="Please try again in a moment."
        action={<Button onClick={reset} size="pill">Try again</Button>}
      />
    </div>
  );
}
