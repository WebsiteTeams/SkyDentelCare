import type { GalleryDTO } from "@/types";
import { ClinicImage } from "./ClinicImage";

function Half({ item, label, image }: { item: GalleryDTO; label: string; image: GalleryDTO["image"] | null }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden">
      <ClinicImage image={image} alt={`${item.title}, ${label.toLowerCase()} treatment`} sizes="(min-width: 768px) 25vw, 50vw" />
      <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-navy">{label}</span>
    </div>
  );
}

/** Rendered only for items with both images and confirmed patient consent. */
export function BeforeAfterCase({ item }: { item: GalleryDTO }) {
  return (
    <figure className="reveal">
      <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-lg">
        <Half item={item} label="Before" image={item.image} />
        <Half item={item} label="After" image={item.afterImage} />
      </div>
      <figcaption className="mt-3 font-medium text-navy">{item.title}</figcaption>
    </figure>
  );
}
