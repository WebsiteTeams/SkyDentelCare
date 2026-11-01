"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Field, FormAlert } from "@/components/shared/field";
import { applyFieldErrors } from "@/components/site/useServerForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/actions/auth";
import { loginSchema, type LoginInput } from "@/lib/validations/admin";

export function LoginForm() {
  const [formError, setFormError] = useState<string>();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(undefined);
    const result = await login(values);
    // A successful login redirects on the server and does not return.
    if (result && !result.ok) {
      setFormError(result.error);
      applyFieldErrors(setError, result.fieldErrors);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <FormAlert message={formError} />
      <Field id="email" label="Email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="username" className="h-12" aria-invalid={errors.email ? true : undefined} {...register("email")} />
      </Field>
      <Field id="password" label="Password" error={errors.password?.message}>
        <Input id="password" type="password" autoComplete="current-password" className="h-12" aria-invalid={errors.password ? true : undefined} {...register("password")} />
      </Field>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
