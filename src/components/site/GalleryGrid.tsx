"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { GalleryDTO } from "@/types";

/** Masonry gallery with category filters and a lightbox. */
export function GalleryGrid({ items }: { items: GalleryDTO[] }) {
  const [category, setCategory] = useState<string>("all");
  const [selected, setSelected] = useState<GalleryDTO | null>(null);

  const categories = useMemo(
    () => GALLERY_CATEGORIES.filter((c) => items.some((item) => item.category === c.value)),
    [items],
  );
  const visible = category === "all" ? items : items.filter((item) => item.category === category);

  return (
    <>
      {categories.length > 1 ? (
        <div role="group" aria-label="Filter gallery" className="mb-10 flex flex-wrap gap-2">
          {[{ value: "all", label: "All" }, ...categories].map((c) => (
            <button
              key={c.value}
              type="button"
              aria-pressed={category === c.value}
              onClick={() => setCategory(c.value)}
              className={cn(
                "min-h-11 rounded-full border px-5 text-sm font-semibold transition-colors duration-300",
                category === c.value ? "border-navy bg-navy text-white" : "border-input text-navy hover:bg-ice",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      ) : null}

      <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {visible.map((item, index) => (
          <li key={item._id} className="mb-5 break-inside-avoid">
            <button
              type="button"
              onClick={() => setSelected(item)}
              aria-label={`View ${item.title}`}
              className="group relative block w-full overflow-hidden rounded-lg"
            >
              <span className={cn("relative block", index % 3 === 0 ? "aspect-[4/5]" : index % 3 === 1 ? "aspect-[4/3]" : "aspect-square")}>
                <Image
                  src={item.image.url}
                  alt={item.image.alt || item.title}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent showCloseButton={false} className="max-h-[92svh] max-w-[min(92vw,72rem)] gap-0 overflow-hidden border-0 p-0 sm:max-w-[min(92vw,72rem)]">
          {selected ? (
            <>
              <div className="relative h-[72svh] w-full bg-ice">
                <Image src={selected.image.url} alt={selected.image.alt || selected.title} fill sizes="92vw" className="object-contain" />
              </div>
              <div className="flex items-center justify-between gap-4 bg-white px-5 py-4">
                <div>
                  <DialogTitle className="font-serif text-xl font-normal text-navy">{selected.title}</DialogTitle>
                  <DialogDescription className="sr-only">Enlarged gallery image</DialogDescription>
                </div>
                <DialogClose aria-label="Close" className="flex size-11 items-center justify-center rounded-full text-navy hover:bg-ice">
                  <X className="size-5" aria-hidden />
                </DialogClose>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
