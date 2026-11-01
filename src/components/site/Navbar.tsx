import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { MobileNavigation } from "./MobileNavigation";
import { NavLinks } from "./NavLinks";

export function Navbar({ phone, announcement }: { phone: string; announcement: string }) {
  return (
    <>
      {announcement ? (
        <p className="bg-navy px-5 py-2.5 text-center text-[0.8125rem] font-medium text-white">{announcement}</p>
      ) : null}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-white/90 backdrop-blur-md">
        <div className="container-site flex h-20 items-center justify-between gap-6">
          <Logo />
          <nav aria-label="Main" className="hidden lg:block">
            <NavLinks />
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="pill" className="hidden sm:inline-flex">
              <Link href="/appointment">Book Appointment</Link>
            </Button>
            <MobileNavigation phone={phone} />
          </div>
        </div>
      </header>
    </>
  );
}
