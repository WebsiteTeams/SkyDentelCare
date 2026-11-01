"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { Field } from "@/components/shared/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveSettings } from "@/lib/actions/settings";
import { settingsSchema, type SettingsInput } from "@/lib/validations/admin";
import type { SettingsDTO } from "@/types";
import { ItemListField, firstError } from "./fields";
import { FormActions } from "./FormDialog";
import { useAdminSubmit } from "./useAdminSubmit";

export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-white p-5 md:p-7">
      <h2 className="font-serif text-2xl text-navy">{title}</h2>
      {description ? <p className="mt-1.5 text-sm text-charcoal">{description}</p> : null}
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}

export function SettingsForm({ settings }: { settings: SettingsDTO }) {
  const { control, register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      clinicName: settings.clinicName,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      email: settings.email,
      streetAddress: settings.streetAddress,
      city: settings.city,
      region: settings.region,
      postalCode: settings.postalCode,
      country: settings.country,
      mapsEmbedUrl: settings.mapsEmbedUrl,
      mapsLinkUrl: settings.mapsLinkUrl,
      hours: settings.hours,
      instagramUrl: settings.instagramUrl,
      facebookUrl: settings.facebookUrl,
      seoDescription: settings.seoDescription,
    },
  });
  const submit = useAdminSubmit(setError);

  const text = (name: keyof SettingsInput, label: string, extra?: { hint?: string; type?: string; className?: string }) => (
    <Field id={`settings-${name}`} label={label} hint={extra?.hint} error={firstError(errors[name])} className={extra?.className}>
      <Input id={`settings-${name}`} type={extra?.type ?? "text"} className="h-11" {...register(name)} />
    </Field>
  );

  return (
    <form onSubmit={handleSubmit((values) => submit(() => saveSettings(values)))} noValidate className="max-w-3xl space-y-6">
      <FormSection title="Clinic details" description="Anything left blank is hidden on the website.">
        {text("clinicName", "Clinic name")}
        <div className="grid gap-6 sm:grid-cols-2">
          {text("phone", "Phone number", { type: "tel" })}
          {text("whatsapp", "WhatsApp number", { type: "tel", hint: "Include the country code." })}
        </div>
        {text("email", "Email", { type: "email" })}
      </FormSection>

      <FormSection title="Address and map">
        {text("streetAddress", "Street address")}
        <div className="grid gap-6 sm:grid-cols-2">
          {text("city", "City")}
          {text("region", "State / region")}
          {text("postalCode", "Postal code")}
          {text("country", "Country")}
        </div>
        {text("mapsEmbedUrl", "Google Maps embed link", { hint: "In Google Maps: Share → Embed a map → copy only the link inside src=\"…\"." })}
        {text("mapsLinkUrl", "Google Maps directions link", { hint: "In Google Maps: Share → Copy link." })}
      </FormSection>

      <FormSection title="Working hours">
        <Controller
          control={control}
          name="hours"
          render={({ field }) => <ItemListField label="Hours" hint="For example: Monday to Saturday, and 9:00 am to 7:00 pm." value={field.value} onChange={field.onChange} addLabel="Add hours" max={14} error={firstError(errors.hours)} keys={[{ key: "days", label: "Days" }, { key: "hours", label: "Hours" }]} />}
        />
      </FormSection>

      <FormSection title="Social media and search">
        <div className="grid gap-6 sm:grid-cols-2">
          {text("instagramUrl", "Instagram link")}
          {text("facebookUrl", "Facebook link")}
        </div>
        <Field id="settings-seo" label="Clinic description" hint="Used by search engines and in the site footer. Up to 300 characters." error={errors.seoDescription?.message}>
          <Textarea id="settings-seo" rows={3} {...register("seoDescription")} />
        </Field>
      </FormSection>

      <FormActions isSubmitting={isSubmitting} label="Save settings" />
    </form>
  );
}
