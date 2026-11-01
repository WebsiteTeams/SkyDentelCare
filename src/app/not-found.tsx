import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-7 bg-ice px-5 text-center">
      <Logo />
      <h1 className="display-2">This page could not be found.</h1>
      <p className="lede max-w-md">The page may have moved, or the link may be incorrect.</p>
      <Button asChild variant="cta" size="cta">
        <Link href="/">Back to home</Link>
      </Button>
    </main>
  );
}
