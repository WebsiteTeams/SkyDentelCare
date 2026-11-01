"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Field } from "@/components/shared/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTestimonial, deleteTestimonial, updateTestimonial } from "@/lib/actions/testimonials";
import { testimonialSchema, type TestimonialInput } from "@/lib/validations/admin";
import type { TestimonialDTO } from "@/types";
import { DataTable, type Column } from "./DataTable";
import { SwitchField } from "./fields";
import { FormActions, FormDialog } from "./FormDialog";
import { PageTitle } from "./PageTitle";
import { RowActions } from "./RowActions";
import { PublishedBadge } from "./StatusBadge";
import { useAdminSubmit } from "./useAdminSubmit";

function TestimonialForm({ testimonial, nextOrder, onClose }: { testimonial: TestimonialDTO | null; nextOrder: number; onClose: () => void }) {
  const { control, register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      patientName: testimonial?.patientName ?? "",
      content: testimonial?.content ?? "",
      treatmentLabel: testimonial?.treatmentLabel ?? "",
      consentConfirmed: testimonial?.consentConfirmed ?? false,
      displayOrder: testimonial?.displayOrder ?? nextOrder,
      published: testimonial?.published ?? false,
    },
  });
  const submit = useAdminSubmit(setError, onClose);

  return (
    <form
      onSubmit={handleSubmit((values) => submit(() => (testimonial ? updateTestimonial(testimonial._id, values) : createTestimonial(values))))}
      noValidate
      className="space-y-6"
    >
      <Field id="testimonial-name" label="Patient name" hint="Use the form of name the patient agreed to, such as initials." error={errors.patientName?.message}>
        <Input id="testimonial-name" className="h-11" {...register("patientName")} />
      </Field>
      <Field id="testimonial-content" label="Testimonial" error={errors.content?.message}>
        <Textarea id="testimonial-content" rows={5} {...register("content")} />
      </Field>
      <Field id="testimonial-treatment" label="Treatment" optional error={errors.treatmentLabel?.message}>
        <Input id="testimonial-treatment" className="h-11" {...register("treatmentLabel")} />
      </Field>
      <Field id="testimonial-order" label="Display order" hint="The lowest number becomes the large home page quote." error={errors.displayOrder?.message}>
        <Input id="testimonial-order" type="number" min={0} className="h-11 w-32" {...register("displayOrder", { valueAsNumber: true })} />
      </Field>
      <Controller control={control} name="consentConfirmed" render={({ field }) => <SwitchField id="testimonial-consent" label="Genuine and consented" description="This is the patient's own words, and they agreed to it being published." checked={field.value} onChange={field.onChange} error={errors.consentConfirmed?.message} />} />
      <Controller control={control} name="published" render={({ field }) => <SwitchField id="testimonial-published" label="Show on website" checked={field.value} onChange={field.onChange} />} />
      <FormActions isSubmitting={isSubmitting} onCancel={onClose} />
    </form>
  );
}

export function TestimonialsManager({ testimonials }: { testimonials: TestimonialDTO[] }) {
  const [editing, setEditing] = useState<TestimonialDTO | "new" | null>(null);
  const remove = useAdminSubmit();

  const columns: Column<TestimonialDTO>[] = [
    { header: "Patient", cell: (t) => <span className="font-semibold text-navy">{t.patientName}</span> },
    { header: "Testimonial", cell: (t) => <p className="max-w-md truncate">{t.content}</p>, className: "hidden md:table-cell" },
    { header: "Status", cell: (t) => <PublishedBadge published={t.published} /> },
    { header: "Actions", className: "text-right", cell: (t) => <RowActions name={`the testimonial from ${t.patientName}`} onEdit={() => setEditing(t)} onDelete={() => remove(() => deleteTestimonial(t._id))} /> },
  ];

  return (
    <>
      <PageTitle
        title="Testimonials"
        description="Only genuine patient testimonials, shared with consent."
        action={<Button onClick={() => setEditing("new")}><Plus aria-hidden /> Add testimonial</Button>}
      />
      <DataTable columns={columns} rows={testimonials} getKey={(t) => t._id} emptyTitle="No testimonials yet." emptyDescription="The testimonials section stays hidden until one is published." />
      <FormDialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)} title={editing === "new" ? "Add testimonial" : "Edit testimonial"}>
        {editing !== null ? <TestimonialForm testimonial={editing === "new" ? null : editing} nextOrder={testimonials.length} onClose={() => setEditing(null)} /> : null}
      </FormDialog>
    </>
  );
}
