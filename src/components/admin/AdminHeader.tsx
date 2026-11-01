"use client";

import { ExternalLink, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { logout } from "@/lib/actions/auth";
import { AdminNav } from "./AdminSidebar";

export function AdminHeader({ name }: { name: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-white px-4 sm:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open admin menu" className="lg:hidden">
            <Menu className="size-5" aria-hidden />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 overflow-y-auto border-0 bg-navy p-4 text-white">
          <SheetTitle className="sr-only">Admin menu</SheetTitle>
          <SheetDescription className="sr-only">Admin navigation</SheetDescription>
          <div className="px-2 py-3"><Logo inverse className="[&_span]:text-lg" /></div>
          <AdminNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="ml-auto flex items-center gap-1 sm:gap-3">
        <span className="hidden text-sm font-medium text-navy sm:inline">{name}</span>
        <Button asChild variant="ghost" size="sm">
          <a href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink aria-hidden /> <span className="hidden sm:inline">View site</span>
            <span className="sr-only sm:hidden">View site</span>
          </a>
        </Button>
        <form action={logout}>
          <Button type="submit" variant="ghost" size="sm"><LogOut aria-hidden /> Sign out</Button>
        </form>
      </div>
    </header>
  );
}
