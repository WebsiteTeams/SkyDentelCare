"use client";

import { Menu, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/constants";
import { toTelHref } from "@/lib/utils";

export function MobileNavigation({ phone }: { phone: string }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu" className="lg:hidden">
          <Menu className="size-6" aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col gap-0 border-0 p-0 sm:max-w-sm">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">Site navigation</SheetDescription>
        <div className="flex h-20 items-center px-5">
          <span onClick={close}>
            <Logo />
          </span>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 pt-6">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="border-b border-border">
                <Link href={link.href} onClick={close} className="block py-5 font-serif text-3xl text-navy">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-4 bg-ice p-5">
          {phone ? (
            <a href={toTelHref(phone)} className="flex items-center justify-center gap-2 font-semibold text-navy">
              <Phone className="size-4 text-teal" aria-hidden />
              {phone}
            </a>
          ) : null}
          <Button asChild variant="cta" size="cta" className="w-full">
            <Link href="/appointment" onClick={close}>
              Book Appointment
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
