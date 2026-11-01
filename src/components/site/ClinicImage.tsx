import Image from "next/image";
import type { ImageData } from "@/types";
import { cn } from "@/lib/utils";

type ClinicImageProps = {
  image: ImageData | null | undefined;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** Fills its positioned parent. Without a photo, shows quiet brand arches rather than an invented picture. */
export function ClinicImage({ image, alt, sizes, priority, className }: ClinicImageProps) {
  if (!image) return <ImageFallback className={className} />;
  return (
    <Image
      src={image.url}
      alt={image.alt || alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}

function ImageFallback({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("absolute inset-0 overflow-hidden bg-ice", className)}>
      <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMax slice" fill="none" className="absolute inset-0 size-full">
        {[0, 1, 2, 3].map((i) => {
          const inset = 40 + i * 44;
          const radius = 200 - inset;
          return (
            <path
              key={i}
              d={`M${inset} 500V${140 + i * 44 + radius}a${radius} ${radius} 0 0 1 ${radius * 2} 0V500`}
              stroke="var(--brand-teal)"
              strokeOpacity={0.45 - i * 0.07}
              strokeWidth="1.25"
            />
          );
        })}
      </svg>
    </div>
  );
}
