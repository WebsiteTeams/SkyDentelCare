"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-8 xl:gap-10">
      {NAV_LINKS.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative py-2 text-[0.9375rem] font-medium text-navy",
                "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:bg-teal after:transition-transform after:duration-300",
                active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
              )}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
