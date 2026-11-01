"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Field, FormAlert } from "@/components/shared/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitEnquiry } from "@/lib/actions/public";
import { enquirySchema, type EnquiryInput } from "@/lib/validations/public";
import { applyFieldErrors } from "./useServerForm";

export function ContactForm() {
  const [formError, setFormError] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "", website: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(undefined);
    const result = await submitEnquiry(values).catch(() => null);
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
      <div role="status" className="rounded-lg bg-ice p-8 md:p-10">
        <CheckCircle2 className="size-8 text-teal" aria-hidden />
        <h3 className="display-3 mt-6">Thank you. Your message has been sent.</h3>
        <p className="mt-4 text-charcoal">Our team will reply as soon as they can.</p>
        <Button type="button" onClick={() => setSubmitted(false)} variant="outline" size="pill" className="mt-7">Send another message</Button>
      </div>
    );
  }

  const describe = (name: keyof EnquiryInput) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `enquiry-${name}-error` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-7">
      <FormAlert message={formError} />
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="enquiry-website">Website</label>
        <input id="enquiry-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <div className="grid gap-7 sm:grid-cols-2">
        <Field id="enquiry-name" label="Your name" error={errors.name?.message}>
          <Input id="enquiry-name" autoComplete="name" className="h-12 text-base" {...describe("name")} {...register("name")} />
        </Field>
        <Field id="enquiry-email" label="Email" error={errors.email?.message}>
          <Input id="enquiry-email" type="email" autoComplete="email" className="h-12 text-base" {...describe("email")} {...register("email")} />
        </Field>
        <Field id="enquiry-phone" label="Phone" optional error={errors.phone?.message}>
          <Input id="enquiry-phone" type="tel" autoComplete="tel" className="h-12 text-base" {...describe("phone")} {...register("phone")} />
        </Field>
        <Field id="enquiry-subject" label="Subject" optional error={errors.subject?.message}>
          <Input id="enquiry-subject" className="h-12 text-base" {...describe("subject")} {...register("subject")} />
        </Field>
        <Field id="enquiry-message" label="How can we help?" error={errors.message?.message} className="sm:col-span-2">
          <Textarea id="enquiry-message" rows={5} className="text-base" {...describe("message")} {...register("message")} />
        </Field>
      </div>
      <Button type="submit" variant="cta" size="cta" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? <Loader2 className="size-5 animate-spin" aria-hidden /> : null}
        {isSubmitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
