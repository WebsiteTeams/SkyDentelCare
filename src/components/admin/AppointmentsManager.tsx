"use client";

import { Mail, MessageCircle, Phone, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/shared/field";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { deleteAppointment, updateAppointment } from "@/lib/actions/appointments";
import { APPOINTMENT_STATUSES, APPOINTMENT_STATUS_LABELS } from "@/lib/constants";
import { formatDate, formatDateTime, formatTime, toTelHref, toWhatsAppUrl } from "@/lib/utils";
import { appointmentUpdateSchema, type AppointmentUpdateInput } from "@/lib/validations/admin";
import type { AppointmentDTO } from "@/types";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { DataTable, type Column } from "./DataTable";
import { SelectField } from "./fields";
import { FormActions, FormDialog } from "./FormDialog";
import { AppointmentStatusBadge } from "./StatusBadge";
import { useAdminSubmit } from "./useAdminSubmit";

const STATUS_OPTIONS = APPOINTMENT_STATUSES.map((value) => ({ value, label: APPOINTMENT_STATUS_LABELS[value] }));

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-charcoal">{children}</dd>
    </div>
  );
}

function AppointmentForm({ appointment, onClose }: { appointment: AppointmentDTO; onClose: () => void }) {
  const { control, register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<AppointmentUpdateInput>({
    resolver: zodResolver(appointmentUpdateSchema),
    defaultValues: { status: appointment.status, internalNotes: appointment.internalNotes },
  });
  const submit = useAdminSubmit(setError, onClose);
  const remove = useAdminSubmit(undefined, onClose);

  return (
    <form onSubmit={handleSubmit((values) => submit(() => updateAppointment(appointment._id, values)))} className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm"><a href={toTelHref(appointment.phone)}><Phone aria-hidden /> {appointment.phone}</a></Button>
        <Button asChild variant="outline" size="sm"><a href={toWhatsAppUrl(appointment.phone)} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden /> WhatsApp</a></Button>
        {appointment.email ? <Button asChild variant="outline" size="sm"><a href={`mailto:${appointment.email}`}><Mail aria-hidden /> {appointment.email}</a></Button> : null}
      </div>

      <dl className="grid gap-4 rounded-md bg-ice p-4 sm:grid-cols-2">
        <Detail label="Treatment">{appointment.treatmentName}</Detail>
        <Detail label="Preferred doctor">{appointment.doctorName || "No preference"}</Detail>
        <Detail label="Preferred date">{formatDate(appointment.preferredDate)}</Detail>
        <Detail label="Preferred time">{formatTime(appointment.preferredTime)}</Detail>
        {appointment.message ? <div className="sm:col-span-2"><Detail label="Patient message"><span className="whitespace-pre-line">{appointment.message}</span></Detail></div> : null}
        <div className="sm:col-span-2"><Detail label="Requested">{formatDateTime(appointment.createdAt)}</Detail></div>
      </dl>

      <Controller
        control={control}
        name="status"
        render={({ field }) => <SelectField id="status" label="Status" value={field.value} onChange={field.onChange} options={STATUS_OPTIONS} error={errors.status?.message} />}
      />
      <Field id="internalNotes" label="Internal notes" hint="Visible to clinic staff only." error={errors.internalNotes?.message}>
        <Textarea id="internalNotes" rows={4} {...register("internalNotes")} />
      </Field>

      <FormActions isSubmitting={isSubmitting} onCancel={onClose} />
      <div className="text-right">
        <ConfirmationDialog
          trigger={<Button type="button" variant="ghost" size="sm"><Trash2 aria-hidden /> Delete request</Button>}
          title="Delete this appointment request?"
          description={`This permanently removes the request from ${appointment.patientName}. This cannot be undone.`}
          onConfirm={() => remove(() => deleteAppointment(appointment._id))}
        />
      </div>
    </form>
  );
}

export function AppointmentsManager({ appointments }: { appointments: AppointmentDTO[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = appointments.find((a) => a._id === selectedId) ?? null;

  const columns: Column<AppointmentDTO>[] = [
    {
      header: "Patient",
      cell: (a) => (
        <div>
          <p className="font-semibold text-navy">{a.patientName}</p>
          <p className="text-[0.8125rem] whitespace-nowrap text-muted-foreground">{a.phone}</p>
          {/* Phones hide the columns below, so their key details move here. */}
          <p className="mt-1 text-[0.8125rem] text-charcoal md:hidden">{a.treatmentName}</p>
          <p className="text-[0.8125rem] whitespace-nowrap text-charcoal md:hidden">{formatDate(a.preferredDate)}, {formatTime(a.preferredTime)}</p>
          <div className="mt-2 md:hidden"><AppointmentStatusBadge status={a.status} /></div>
        </div>
      ),
    },
    { header: "Treatment", cell: (a) => a.treatmentName, className: "hidden md:table-cell" },
    { header: "Preferred", cell: (a) => <span className="whitespace-nowrap">{formatDate(a.preferredDate)}, {formatTime(a.preferredTime)}</span>, className: "hidden md:table-cell" },
    { header: "Doctor", cell: (a) => a.doctorName || "Any", className: "hidden xl:table-cell" },
    { header: "Status", cell: (a) => <AppointmentStatusBadge status={a.status} />, className: "hidden md:table-cell" },
    { header: "Requested", cell: (a) => <span className="whitespace-nowrap">{formatDateTime(a.createdAt)}</span>, className: "hidden xl:table-cell" },
    {
      header: "Actions",
      className: "text-right",
      cell: (a) => <Button type="button" variant="outline" size="sm" onClick={() => setSelectedId(a._id)}>Manage<span className="sr-only"> {a.patientName}</span></Button>,
    },
  ];

  return (
    <>
      <DataTable columns={columns} rows={appointments} getKey={(a) => a._id} emptyTitle="No appointment requests found." emptyDescription="New requests from the website will appear here." />
      <FormDialog open={selected !== null} onOpenChange={(open) => !open && setSelectedId(null)} title={selected?.patientName ?? "Appointment"} description="Review the request, update its status and add notes.">
        {selected ? <AppointmentForm key={selected._id} appointment={selected} onClose={() => setSelectedId(null)} /> : null}
      </FormDialog>
    </>
  );
}
