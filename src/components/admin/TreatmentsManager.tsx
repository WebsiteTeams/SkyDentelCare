"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Field } from "@/components/shared/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTreatment, deleteTreatment, updateTreatment } from "@/lib/actions/treatments";
import { treatmentSchema, type TreatmentInput } from "@/lib/validations/admin";
import type { TreatmentDTO } from "@/types";
import { DataTable, type Column } from "./DataTable";
import { ItemListField, StringListField, SwitchField, firstError } from "./fields";
import { FormActions, FormDialog } from "./FormDialog";
import { ImageField } from "./ImageField";
import { PageTitle } from "./PageTitle";
import { RowActions } from "./RowActions";
import { PublishedBadge } from "./StatusBadge";
import { Thumb } from "./Thumb";
import { useAdminSubmit } from "./useAdminSubmit";

function TreatmentForm({ treatment, nextOrder, onClose }: { treatment: TreatmentDTO | null; nextOrder: number; onClose: () => void }) {
  const { control, register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<TreatmentInput>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      name: treatment?.name ?? "",
      image: treatment?.image ?? null,
      shortDescription: treatment?.shortDescription ?? "",
      overview: treatment?.overview ?? "",
      benefits: treatment?.benefits ?? [],
      procedure: treatment?.procedure ?? [],
      featured: treatment?.featured ?? false,
      displayOrder: treatment?.displayOrder ?? nextOrder,
      published: treatment?.published ?? false,
    },
  });
  const submit = useAdminSubmit(setError, onClose);

  return (
    <form
      onSubmit={handleSubmit((values) => submit(() => (treatment ? updateTreatment(treatment._id, values) : createTreatment(values))))}
      noValidate
      className="space-y-6"
    >
      <Field id="treatment-name" label="Name" error={errors.name?.message}>
        <Input id="treatment-name" className="h-11" {...register("name")} />
      </Field>
      <Controller control={control} name="image" render={({ field }) => <ImageField label="Treatment image" hint="Required before publishing." value={field.value} onChange={field.onChange} error={firstError(errors.image)} />} />
      <Field id="treatment-short" label="Short description" hint="Shown in lists and search results." error={errors.shortDescription?.message}>
        <Textarea id="treatment-short" rows={2} {...register("shortDescription")} />
      </Field>
      <Field id="treatment-overview" label="Detailed overview" hint="Required before publishing." error={errors.overview?.message}>
        <Textarea id="treatment-overview" rows={6} {...register("overview")} />
      </Field>
      <Controller control={control} name="benefits" render={({ field }) => <StringListField id="benefit" label="Benefits" value={field.value} onChange={field.onChange} addLabel="Add benefit" error={firstError(errors.benefits)} />} />
      <Controller
        control={control}
        name="procedure"
        render={({ field }) => <ItemListField label="Procedure overview" value={field.value} onChange={field.onChange} addLabel="Add step" error={firstError(errors.procedure)} keys={[{ key: "title", label: "Step title" }, { key: "description", label: "Step description", multiline: true }]} />}
      />
      <Field id="treatment-order" label="Display order" hint="Lower numbers appear first." error={errors.displayOrder?.message}>
        <Input id="treatment-order" type="number" min={0} className="h-11 w-32" {...register("displayOrder", { valueAsNumber: true })} />
      </Field>
      <Controller control={control} name="featured" render={({ field }) => <SwitchField id="treatment-featured" label="Feature on home page" description="Up to six featured treatments are shown." checked={field.value} onChange={field.onChange} />} />
      <Controller control={control} name="published" render={({ field }) => <SwitchField id="treatment-published" label="Show on website" description="Publish only services the clinic has confirmed." checked={field.value} onChange={field.onChange} />} />
      <FormActions isSubmitting={isSubmitting} onCancel={onClose} />
    </form>
  );
}

export function TreatmentsManager({ treatments }: { treatments: TreatmentDTO[] }) {
  const [editing, setEditing] = useState<TreatmentDTO | "new" | null>(null);
  const remove = useAdminSubmit();

  const columns: Column<TreatmentDTO>[] = [
    { header: "Image", cell: (t) => <Thumb image={t.image} /> },
    { header: "Name", cell: (t) => <span className="font-semibold text-navy">{t.name}</span> },
    { header: "Home page", cell: (t) => (t.featured ? "Featured" : "—"), className: "hidden md:table-cell" },
    { header: "Status", cell: (t) => <PublishedBadge published={t.published} /> },
    { header: "Actions", className: "text-right", cell: (t) => <RowActions name={t.name} onEdit={() => setEditing(t)} onDelete={() => remove(() => deleteTreatment(t._id))} /> },
  ];

  return (
    <>
      <PageTitle
        title="Treatments"
        description="Draft treatments are hidden from the website. Review the wording and publish only the services the clinic offers."
        action={<Button onClick={() => setEditing("new")}><Plus aria-hidden /> Add treatment</Button>}
      />
      <DataTable columns={columns} rows={treatments} getKey={(t) => t._id} emptyTitle="No treatments yet." emptyDescription="Add a treatment, or run the seed script to load editable drafts." />
      <FormDialog wide open={editing !== null} onOpenChange={(open) => !open && setEditing(null)} title={editing === "new" ? "Add treatment" : "Edit treatment"}>
        {editing !== null ? <TreatmentForm treatment={editing === "new" ? null : editing} nextOrder={treatments.length} onClose={() => setEditing(null)} /> : null}
      </FormDialog>
    </>
  );
}
