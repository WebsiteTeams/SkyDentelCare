"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Field } from "@/components/shared/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createDoctor, deleteDoctor, updateDoctor } from "@/lib/actions/doctors";
import { doctorSchema, type DoctorInput } from "@/lib/validations/admin";
import type { DoctorDTO } from "@/types";
import { DataTable, type Column } from "./DataTable";
import { StringListField, SwitchField, firstError } from "./fields";
import { FormActions, FormDialog } from "./FormDialog";
import { ImageField } from "./ImageField";
import { PageTitle } from "./PageTitle";
import { RowActions } from "./RowActions";
import { PublishedBadge } from "./StatusBadge";
import { Thumb } from "./Thumb";
import { useAdminSubmit } from "./useAdminSubmit";

function DoctorForm({ doctor, nextOrder, onClose }: { doctor: DoctorDTO | null; nextOrder: number; onClose: () => void }) {
  const { control, register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<DoctorInput>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: doctor?.name ?? "",
      photo: doctor?.photo ?? null,
      qualifications: doctor?.qualifications ?? [],
      specialization: doctor?.specialization ?? "",
      experience: doctor?.experience ?? "",
      bio: doctor?.bio ?? "",
      displayOrder: doctor?.displayOrder ?? nextOrder,
      published: doctor?.published ?? false,
    },
  });
  const submit = useAdminSubmit(setError, onClose);

  return (
    <form
      onSubmit={handleSubmit((values) => submit(() => (doctor ? updateDoctor(doctor._id, values) : createDoctor(values))))}
      noValidate
      className="space-y-6"
    >
      <Field id="doctor-name" label="Full name" error={errors.name?.message}>
        <Input id="doctor-name" className="h-11" {...register("name")} />
      </Field>
      <Controller control={control} name="photo" render={({ field }) => <ImageField label="Photograph" value={field.value} onChange={field.onChange} error={firstError(errors.photo)} />} />
      <Controller
        control={control}
        name="qualifications"
        render={({ field }) => <StringListField id="qualification" label="Qualifications" hint="Enter only verified qualifications." value={field.value} onChange={field.onChange} addLabel="Add qualification" error={firstError(errors.qualifications)} />}
      />
      <Field id="doctor-specialization" label="Specialization" optional error={errors.specialization?.message}>
        <Input id="doctor-specialization" className="h-11" {...register("specialization")} />
      </Field>
      <Field id="doctor-experience" label="Professional experience" optional error={errors.experience?.message}>
        <Textarea id="doctor-experience" rows={2} {...register("experience")} />
      </Field>
      <Field id="doctor-bio" label="Short biography" optional error={errors.bio?.message}>
        <Textarea id="doctor-bio" rows={4} {...register("bio")} />
      </Field>
      <Field id="doctor-order" label="Display order" hint="Lower numbers appear first." error={errors.displayOrder?.message}>
        <Input id="doctor-order" type="number" min={0} className="h-11 w-32" {...register("displayOrder", { valueAsNumber: true })} />
      </Field>
      <Controller control={control} name="published" render={({ field }) => <SwitchField id="doctor-published" label="Show on website" checked={field.value} onChange={field.onChange} />} />
      <FormActions isSubmitting={isSubmitting} onCancel={onClose} />
    </form>
  );
}

export function DoctorsManager({ doctors }: { doctors: DoctorDTO[] }) {
  const [editing, setEditing] = useState<DoctorDTO | "new" | null>(null);
  const remove = useAdminSubmit();

  const columns: Column<DoctorDTO>[] = [
    { header: "Photo", cell: (d) => <Thumb image={d.photo} /> },
    { header: "Name", cell: (d) => <span className="font-semibold text-navy">{d.name}</span> },
    { header: "Specialization", cell: (d) => d.specialization || "—", className: "hidden md:table-cell" },
    { header: "Status", cell: (d) => <PublishedBadge published={d.published} /> },
    { header: "Actions", className: "text-right", cell: (d) => <RowActions name={d.name} onEdit={() => setEditing(d)} onDelete={() => remove(() => deleteDoctor(d._id))} /> },
  ];

  return (
    <>
      <PageTitle
        title="Doctors"
        description="Only verified names, qualifications and experience should be entered here."
        action={<Button onClick={() => setEditing("new")}><Plus aria-hidden /> Add doctor</Button>}
      />
      <DataTable columns={columns} rows={doctors} getKey={(d) => d._id} emptyTitle="No doctors yet." emptyDescription="Add your first doctor to show them on the website." />
      <FormDialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)} title={editing === "new" ? "Add doctor" : "Edit doctor"}>
        {editing !== null ? <DoctorForm doctor={editing === "new" ? null : editing} nextOrder={doctors.length} onClose={() => setEditing(null)} /> : null}
      </FormDialog>
    </>
  );
}
