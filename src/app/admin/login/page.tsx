import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { LogoMark } from "@/components/shared/logo";
import { getCurrentAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await getCurrentAdmin()) redirect("/admin");

  return (
    <main className="flex min-h-svh items-center justify-center bg-ice p-5">
      <div className="w-full max-w-md rounded-lg bg-white p-7 shadow-soft sm:p-10">
        <LogoMark className="text-navy" />
        <h1 className="mt-6 font-serif text-3xl text-navy">Clinic admin</h1>
        <p className="mt-2 mb-8 text-charcoal">Sign in to manage appointments and the website.</p>
        <LoginForm />
      </div>
    </main>
  );
}
