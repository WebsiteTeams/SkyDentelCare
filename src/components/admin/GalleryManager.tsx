"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Field } from "@/components/shared/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createGalleryItem, deleteGalleryItem, updateGalleryItem } from "@/lib/actions/gallery";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { gallerySchema, type GalleryInput } from "@/lib/validations/admin";
import type { GalleryDTO } from "@/types";
import { DataTable, type Column } from "./DataTable";
import { SelectField, SwitchField, firstError } from "./fields";
import { FormActions, FormDialog } from "./FormDialog";
import { ImageField } from "./ImageField";
import { PageTitle } from "./PageTitle";
import { RowActions } from "./RowActions";
import { PublishedBadge } from "./StatusBadge";
import { Thumb } from "./Thumb";
import { useAdminSubmit } from "./useAdminSubmit";

function GalleryForm({ item, nextOrder, onClose }: { item: GalleryDTO | null; nextOrder: number; onClose: () => void }) {
  const { control, register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<GalleryInput>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: item?.title ?? "",
      category: item?.category ?? "interiors",
      image: item?.image ?? null,
      afterImage: item?.afterImage ?? null,
      consentConfirmed: item?.consentConfirmed ?? false,
      displayOrder: item?.displayOrder ?? nextOrder,
      published: item?.published ?? false,
    },
  });
  const submit = useAdminSubmit(setError, onClose);
  const isCase = useWatch({ control, name: "category" }) === "before-after";

  return (
    <form
      onSubmit={handleSubmit((values) => submit(() => (item ? updateGalleryItem(item._id, values) : createGalleryItem(values))))}
      noValidate
      className="space-y-6"
    >
      <Field id="gallery-title" label="Title" error={errors.title?.message}>
        <Input id="gallery-title" className="h-11" {...register("title")} />
      </Field>
      <Controller control={control} name="category" render={({ field }) => <SelectField id="gallery-category" label="Category" value={field.value} onChange={field.onChange} options={GALLERY_CATEGORIES} error={errors.category?.message} />} />
      <Controller control={control} name="image" render={({ field }) => <ImageField label={isCase ? "Before image" : "Image"} value={field.value} onChange={field.onChange} error={firstError(errors.image)} />} />
      {isCase ? (
        <>
          <Controller control={control} name="afterImage" render={({ field }) => <ImageField label="After image" value={field.value} onChange={field.onChange} error={firstError(errors.afterImage)} />} />
          <Controller control={control} name="consentConfirmed" render={({ field }) => <SwitchField id="gallery-consent" label="Patient consent confirmed" description="These are authentic images of this patient, who has given written consent to publish them." checked={field.value} onChange={field.onChange} error={errors.consentConfirmed?.message} />} />
        </>
      ) : null}
      <Field id="gallery-order" label="Display order" hint="Lower numbers appear first." error={errors.displayOrder?.message}>
        <Input id="gallery-order" type="number" min={0} className="h-11 w-32" {...register("displayOrder", { valueAsNumber: true })} />
      </Field>
      <Controller control={control} name="published" render={({ field }) => <SwitchField id="gallery-published" label="Show on website" checked={field.value} onChange={field.onChange} />} />
      <FormActions isSubmitting={isSubmitting} onCancel={onClose} />
    </form>
  );
}

const categoryLabel = (value: string) => GALLERY_CATEGORIES.find((c) => c.value === value)?.label ?? value;

export function GalleryManager({ items }: { items: GalleryDTO[] }) {
  const [editing, setEditing] = useState<GalleryDTO | "new" | null>(null);
  const remove = useAdminSubmit();

  const columns: Column<GalleryDTO>[] = [
    { header: "Image", cell: (g) => <Thumb image={g.image} /> },
    { header: "Title", cell: (g) => <span className="font-semibold text-navy">{g.title}</span> },
    { header: "Category", cell: (g) => categoryLabel(g.category), className: "hidden md:table-cell" },
    { header: "Status", cell: (g) => <PublishedBadge published={g.published} /> },
    { header: "Actions", className: "text-right", cell: (g) => <RowActions name={g.title} onEdit={() => setEditing(g)} onDelete={() => remove(() => deleteGalleryItem(g._id))} /> },
  ];

  return (
    <>
      <PageTitle
        title="Gallery"
        description="Use authentic photographs of the clinic. Before-and-after cases require patient consent."
        action={<Button onClick={() => setEditing("new")}><Plus aria-hidden /> Add image</Button>}
      />
      <DataTable columns={columns} rows={items} getKey={(g) => g._id} emptyTitle="No images yet." emptyDescription="Upload photographs of the clinic to build the gallery." />
      <FormDialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)} title={editing === "new" ? "Add image" : "Edit image"}>
        {editing !== null ? <GalleryForm item={editing === "new" ? null : editing} nextOrder={items.length} onClose={() => setEditing(null)} /> : null}
      </FormDialog>
    </>
  );
}
