"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Field, FormAlert } from "@/components/shared/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requestAppointment } from "@/lib/actions/public";
import { appointmentSchema, type AppointmentInput } from "@/lib/validations/public";
import { applyFieldErrors } from "./useServerForm";

type Option = { value: string; label: string };

type AppointmentFormProps = {
  treatments: Option[];
  doctors: Option[];
  defaultTreatment?: string;
  defaultDoctor?: string;
  minDate: string;
};

const NO_DOCTOR = "none";

export function AppointmentForm({ treatments, doctors, defaultTreatment = "", defaultDoctor = "", minDate }: AppointmentFormProps) {
  const [formError, setFormError] = useState<string>();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientName: "",
      phone: "",
      email: "",
      treatment: defaultTreatment,
      doctor: defaultDoctor,
      preferredDate: "",
      preferredTime: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(undefined);
    const result = await requestAppointment(values).catch(() => null);
    if (!result) return setFormError("We could not reach the clinic. Please check your connection and try again.");
    if (!result.ok) {
      setFormError(result.error);
      applyFieldErrors(setError, result.fieldErrors);
      return;
    }
    reset();
    setSubmitted(true);
  });

  if (submitted) {
    return (
      <div role="status" className="rounded-lg bg-ice p-8 md:p-12">
        <CheckCircle2 className="size-8 text-teal" aria-hidden />
        <h2 className="display-3 mt-6">We have received your request.</h2>
        <p className="lede mt-4">
          Your appointment is <strong className="font-semibold text-navy">not yet confirmed</strong>. Our team will review your request
          and contact you to confirm a time.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Button type="button" onClick={() => setSubmitted(false)} variant="outline" size="pill">Request another</Button>
          <Link href="/" className="link-rule">Back to home</Link>
        </div>
      </div>
    );
  }

  const describe = (name: keyof AppointmentInput) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-7">
      <FormAlert message={formError} />

      {/* Honeypot, invisible to people and assistive technology. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <Field id="patientName" label="Patient name" error={errors.patientName?.message} className="sm:col-span-2">
          <Input id="patientName" autoComplete="name" className="h-12 text-base" {...describe("patientName")} {...register("patientName")} />
        </Field>
        <Field id="phone" label="Phone number" error={errors.phone?.message}>
          <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" className="h-12 text-base" {...describe("phone")} {...register("phone")} />
        </Field>
        <Field id="email" label="Email" optional error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" className="h-12 text-base" {...describe("email")} {...register("email")} />
        </Field>

        <Field id="treatment" label="Treatment" error={errors.treatment?.message}>
          <Controller
            control={control}
            name="treatment"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="treatment" className="!h-12 w-full text-base" {...describe("treatment")}>
                  <SelectValue placeholder="Select a treatment" />
                </SelectTrigger>
                <SelectContent>
                  {treatments.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        {doctors.length > 0 ? (
          <Field id="doctor" label="Preferred doctor" optional error={errors.doctor?.message}>
            <Controller
              control={control}
              name="doctor"
              render={({ field }) => (
                <Select value={field.value || NO_DOCTOR} onValueChange={(v) => field.onChange(v === NO_DOCTOR ? "" : v)}>
                  <SelectTrigger id="doctor" className="!h-12 w-full text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_DOCTOR}>No preference</SelectItem>
                    {doctors.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        ) : null}

        <Field id="preferredDate" label="Preferred date" error={errors.preferredDate?.message}>
          <Input id="preferredDate" type="date" min={minDate} className="h-12 text-base" {...describe("preferredDate")} {...register("preferredDate")} />
        </Field>
        <Field id="preferredTime" label="Preferred time" error={errors.preferredTime?.message}>
          <Input id="preferredTime" type="time" className="h-12 text-base" {...describe("preferredTime")} {...register("preferredTime")} />
        </Field>

        <Field id="message" label="Additional message" optional error={errors.message?.message} className="sm:col-span-2">
          <Textarea id="message" rows={4} className="text-base" {...describe("message")} {...register("message")} />
        </Field>
      </div>

      <div className="flex flex-col gap-5 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-sm text-charcoal">
          This is a request only. Your appointment is confirmed after the clinic approves it.
        </p>
        <Button type="submit" variant="cta" size="cta" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? <Loader2 className="size-5 animate-spin" aria-hidden /> : null}
          {isSubmitting ? "Sending…" : "Request Appointment"}
        </Button>
      </div>
    </form>
  );
}
