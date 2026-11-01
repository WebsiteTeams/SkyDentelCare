"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type FormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  wide?: boolean;
  children: ReactNode;
};

/** Dialog content unmounts on close, so forms inside it always start from fresh values. */
export function FormDialog({ open, onOpenChange, title, description, wide, children }: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-h-[92svh] overflow-y-auto ${wide ? "sm:max-w-3xl" : "sm:max-w-xl"}`}>
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-normal text-navy">{title}</DialogTitle>
          <DialogDescription className={description ? "text-charcoal" : "sr-only"}>{description ?? title}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export function FormActions({ isSubmitting, onCancel, label = "Save" }: { isSubmitting: boolean; onCancel?: () => void; label?: string }) {
  return (
    <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
      {onCancel ? <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button> : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
        {isSubmitting ? "Saving…" : label}
      </Button>
    </div>
  );
}
