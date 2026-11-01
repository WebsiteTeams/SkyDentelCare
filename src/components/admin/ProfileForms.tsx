"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Field } from "@/components/shared/field";
import { Input } from "@/components/ui/input";
import { changePassword, updateProfile } from "@/lib/actions/profile";
import { passwordSchema, profileSchema, type PasswordInput, type ProfileInput } from "@/lib/validations/admin";
import { FormActions } from "./FormDialog";
import { FormSection } from "./SettingsForm";
import { useAdminSubmit } from "./useAdminSubmit";

export function ProfileForm({ name, email }: ProfileInput) {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name, email },
  });
  const submit = useAdminSubmit(setError);

  return (
    <form onSubmit={handleSubmit((values) => submit(() => updateProfile(values)))} noValidate>
      <FormSection title="Your details">
        <Field id="profile-name" label="Name" error={errors.name?.message}>
          <Input id="profile-name" autoComplete="name" className="h-11" {...register("name")} />
        </Field>
        <Field id="profile-email" label="Email" hint="You use this to sign in." error={errors.email?.message}>
          <Input id="profile-email" type="email" autoComplete="username" className="h-11" {...register("email")} />
        </Field>
        <FormActions isSubmitting={isSubmitting} label="Save details" />
      </FormSection>
    </form>
  );
}

export function PasswordForm() {
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });
  const submit = useAdminSubmit(setError, () => reset());

  return (
    <form onSubmit={handleSubmit((values) => submit(() => changePassword(values)))} noValidate>
      <FormSection title="Change password" description="Changing your password signs you out on all other devices.">
        <Field id="current-password" label="Current password" error={errors.currentPassword?.message}>
          <Input id="current-password" type="password" autoComplete="current-password" className="h-11" {...register("currentPassword")} />
        </Field>
        <Field id="new-password" label="New password" hint="At least 12 characters." error={errors.newPassword?.message}>
          <Input id="new-password" type="password" autoComplete="new-password" className="h-11" {...register("newPassword")} />
        </Field>
        <Field id="confirm-password" label="Confirm new password" error={errors.confirmPassword?.message}>
          <Input id="confirm-password" type="password" autoComplete="new-password" className="h-11" {...register("confirmPassword")} />
        </Field>
        <FormActions isSubmitting={isSubmitting} label="Change password" />
      </FormSection>
    </form>
  );
}
