"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Control, type FieldErrors } from "react-hook-form";
import { Field } from "@/components/shared/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveContent } from "@/lib/actions/settings";
import { contentSchema, type ContentInput } from "@/lib/validations/admin";
import type { SiteContent } from "@/types";
import { ItemListField, firstError } from "./fields";
import { FormActions } from "./FormDialog";
import { ImageField } from "./ImageField";
import { FormSection } from "./SettingsForm";
import { useAdminSubmit } from "./useAdminSubmit";

type ImageName = "heroImage" | "heroSecondaryImage" | "introImage" | "facilitiesImage" | "aboutImage";
type ItemsName = "trustIndicators" | "whyChooseUs" | "careApproach" | "facilities" | "technology";

type SharedProps = { control: Control<ContentInput>; errors: FieldErrors<ContentInput> };

function ImageControl({ control, errors, name, label, hint }: SharedProps & { name: ImageName; label: string; hint?: string }) {
  return <Controller control={control} name={name} render={({ field }) => <ImageField label={label} hint={hint} value={field.value} onChange={field.onChange} error={firstError(errors[name])} />} />;
}

function ItemsControl({ control, errors, name, label, hint, addLabel, max }: SharedProps & { name: ItemsName; label: string; hint?: string; addLabel: string; max?: number }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => <ItemListField label={label} hint={hint} value={field.value} onChange={field.onChange} addLabel={addLabel} max={max} error={firstError(errors[name])} keys={[{ key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]} />}
    />
  );
}

export function ContentForm({ content }: { content: SiteContent }) {
  const { control, register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<ContentInput>({
    resolver: zodResolver(contentSchema),
    defaultValues: content,
  });
  const submit = useAdminSubmit(setError);
  const shared = { control, errors };

  return (
    <form onSubmit={handleSubmit((values) => submit(() => saveContent(values)))} noValidate className="max-w-3xl space-y-6">
      <FormSection title="Announcement bar" description="Optional. Leave blank to hide it.">
        <Field id="content-announcement" label="Announcement" optional error={errors.announcement?.message}>
          <Input id="content-announcement" className="h-11" {...register("announcement")} />
        </Field>
      </FormSection>

      <FormSection title="Home page hero">
        <Field id="content-headline" label="Headline" error={errors.heroHeadline?.message}>
          <Input id="content-headline" className="h-11" {...register("heroHeadline")} />
        </Field>
        <Field id="content-herotext" label="Supporting text" error={errors.heroText?.message}>
          <Textarea id="content-herotext" rows={3} {...register("heroText")} />
        </Field>
        <ImageControl {...shared} name="heroImage" label="Main photograph" hint="Portrait orientation works best. Displayed inside an arch." />
        <ImageControl {...shared} name="heroSecondaryImage" label="Small overlapping photograph" hint="Optional." />
        <ItemsControl {...shared} name="trustIndicators" label="Trust indicators" hint="Up to four, and verified facts only, such as a real number of years in practice. Hidden when empty." addLabel="Add indicator" max={4} />
      </FormSection>

      <FormSection title="Clinic introduction">
        <Field id="content-introheading" label="Heading" error={errors.introHeading?.message}>
          <Input id="content-introheading" className="h-11" {...register("introHeading")} />
        </Field>
        <Field id="content-introtext" label="Text" error={errors.introText?.message}>
          <Textarea id="content-introtext" rows={4} {...register("introText")} />
        </Field>
        <ImageControl {...shared} name="introImage" label="Wide photograph" hint="Optional. Landscape orientation." />
      </FormSection>

      <FormSection title="Why choose us">
        <ItemsControl {...shared} name="whyChooseUs" label="Reasons" addLabel="Add reason" />
      </FormSection>

      <FormSection title="About page">
        <ImageControl {...shared} name="aboutImage" label="About page photograph" />
        <Field id="content-mission" label="Mission" error={errors.mission?.message}>
          <Textarea id="content-mission" rows={2} {...register("mission")} />
        </Field>
        <Field id="content-vision" label="Vision" error={errors.vision?.message}>
          <Textarea id="content-vision" rows={2} {...register("vision")} />
        </Field>
        <Field id="content-philosophy" label="Clinic philosophy" error={errors.philosophy?.message}>
          <Textarea id="content-philosophy" rows={3} {...register("philosophy")} />
        </Field>
        <ItemsControl {...shared} name="careApproach" label="Patient care approach" addLabel="Add step" />
      </FormSection>

      <FormSection title="Facilities and technology" description="List only what the clinic actually has. These sections stay hidden until something is added.">
        <ImageControl {...shared} name="facilitiesImage" label="Facilities photograph" />
        <ItemsControl {...shared} name="facilities" label="Facilities" addLabel="Add facility" />
        <ItemsControl {...shared} name="technology" label="Technology" addLabel="Add technology" />
      </FormSection>

      <FormSection title="Frequently asked questions">
        <Controller
          control={control}
          name="faqs"
          render={({ field }) => <ItemListField label="Questions" value={field.value} onChange={field.onChange} addLabel="Add question" error={firstError(errors.faqs)} keys={[{ key: "question", label: "Question" }, { key: "answer", label: "Answer", multiline: true }]} />}
        />
      </FormSection>

      <FormActions isSubmitting={isSubmitting} label="Save content" />
    </form>
  );
}
