"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Field } from "@/components/shared/field";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { deleteEnquiry, updateEnquiry } from "@/lib/actions/enquiries";
import { ENQUIRY_STATUSES, ENQUIRY_STATUS_LABELS } from "@/lib/constants";
import { formatDateTime, toTelHref } from "@/lib/utils";
import { enquiryUpdateSchema, type EnquiryUpdateInput } from "@/lib/validations/admin";
import type { EnquiryDTO } from "@/types";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { DataTable, type Column } from "./DataTable";
import { SelectField } from "./fields";
import { FormActions, FormDialog } from "./FormDialog";
import { EnquiryStatusBadge } from "./StatusBadge";
import { useAdminSubmit } from "./useAdminSubmit";

const STATUS_OPTIONS = ENQUIRY_STATUSES.map((value) => ({ value, label: ENQUIRY_STATUS_LABELS[value] }));

function EnquiryForm({ enquiry, onClose }: { enquiry: EnquiryDTO; onClose: () => void }) {
  const { control, register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<EnquiryUpdateInput>({
    resolver: zodResolver(enquiryUpdateSchema),
    defaultValues: { status: enquiry.status, internalNotes: enquiry.internalNotes },
  });
  const submit = useAdminSubmit(setError, onClose);
  const remove = useAdminSubmit(undefined, onClose);

  return (
    <form onSubmit={handleSubmit((values) => submit(() => updateEnquiry(enquiry._id, values)))} className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm"><a href={`mailto:${enquiry.email}`}><Mail aria-hidden /> {enquiry.email}</a></Button>
        {enquiry.phone ? <Button asChild variant="outline" size="sm"><a href={toTelHref(enquiry.phone)}><Phone aria-hidden /> {enquiry.phone}</a></Button> : null}
      </div>
      <div className="rounded-md bg-ice p-4">
        {enquiry.subject ? <p className="font-semibold text-navy">{enquiry.subject}</p> : null}
        <p className="mt-1 whitespace-pre-line text-charcoal">{enquiry.message}</p>
        <p className="mt-3 text-[0.8125rem] text-muted-foreground">Received {formatDateTime(enquiry.createdAt)}</p>
      </div>
      <Controller
        control={control}
        name="status"
        render={({ field }) => <SelectField id="enquiry-status" label="Status" value={field.value} onChange={field.onChange} options={STATUS_OPTIONS} error={errors.status?.message} />}
      />
      <Field id="enquiry-notes" label="Internal notes" hint="Visible to clinic staff only." error={errors.internalNotes?.message}>
        <Textarea id="enquiry-notes" rows={4} {...register("internalNotes")} />
      </Field>
      <FormActions isSubmitting={isSubmitting} onCancel={onClose} />
      <div className="text-right">
        <ConfirmationDialog
          trigger={<Button type="button" variant="ghost" size="sm"><Trash2 aria-hidden /> Delete enquiry</Button>}
          title="Delete this enquiry?"
          description={`This permanently removes the message from ${enquiry.name}. This cannot be undone.`}
          onConfirm={() => remove(() => deleteEnquiry(enquiry._id))}
        />
      </div>
    </form>
  );
}

export function EnquiriesManager({ enquiries }: { enquiries: EnquiryDTO[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = enquiries.find((e) => e._id === selectedId) ?? null;

  const columns: Column<EnquiryDTO>[] = [
    { header: "From", cell: (e) => <div><p className="font-semibold text-navy">{e.name}</p><p className="text-[0.8125rem] text-muted-foreground">{e.email}</p></div> },
    { header: "Message", cell: (e) => <p className="max-w-md truncate">{e.subject || e.message}</p>, className: "hidden md:table-cell" },
    { header: "Status", cell: (e) => <EnquiryStatusBadge status={e.status} /> },
    { header: "Received", cell: (e) => <span className="whitespace-nowrap">{formatDateTime(e.createdAt)}</span>, className: "hidden md:table-cell" },
    { header: "Actions", className: "text-right", cell: (e) => <Button type="button" variant="outline" size="sm" onClick={() => setSelectedId(e._id)}>View<span className="sr-only"> enquiry from {e.name}</span></Button> },
  ];

  return (
    <>
      <DataTable columns={columns} rows={enquiries} getKey={(e) => e._id} emptyTitle="No enquiries found." emptyDescription="Messages from the contact form will appear here." />
      <FormDialog open={selected !== null} onOpenChange={(open) => !open && setSelectedId(null)} title={selected ? `Enquiry from ${selected.name}` : "Enquiry"}>
        {selected ? <EnquiryForm key={selected._id} enquiry={selected} onClose={() => setSelectedId(null)} /> : null}
      </FormDialog>
    </>
  );
}
