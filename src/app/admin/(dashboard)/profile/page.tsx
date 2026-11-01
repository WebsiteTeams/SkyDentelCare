import type { Metadata } from "next";
import { PageTitle } from "@/components/admin/PageTitle";
import { PasswordForm, ProfileForm } from "@/components/admin/ProfileForms";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const admin = await requireAdmin();
  return (
    <>
      <PageTitle title="Profile" />
      <div className="max-w-2xl space-y-6">
        <ProfileForm name={admin.name} email={admin.email} />
        <PasswordForm />
      </div>
    </>
  );
}
