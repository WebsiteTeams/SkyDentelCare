"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "./ConfirmationDialog";

/** Edit and delete controls shared by every catalogue table. */
export function RowActions({ name, onEdit, onDelete }: { name: string; onEdit: () => void; onDelete: () => Promise<void> }) {
  return (
    <div className="flex justify-end gap-1">
      <Button type="button" variant="ghost" size="icon-sm" aria-label={`Edit ${name}`} onClick={onEdit}><Pencil aria-hidden /></Button>
      <ConfirmationDialog
        trigger={<Button type="button" variant="ghost" size="icon-sm" aria-label={`Delete ${name}`}><Trash2 aria-hidden /></Button>}
        title={`Delete ${name}?`}
        description="This permanently removes it from the website and the dashboard. This cannot be undone."
        onConfirm={onDelete}
      />
    </div>
  );
}
