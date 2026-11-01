import { ImageOff } from "lucide-react";
import Image from "next/image";
import type { ImageData } from "@/types";

export function Thumb({ image }: { image: ImageData | null }) {
  return (
    <div className="relative flex size-12 items-center justify-center overflow-hidden rounded bg-ice">
      {image ? <Image src={image.url} alt="" fill sizes="48px" className="object-cover" /> : <ImageOff className="size-4 text-teal" aria-hidden />}
    </div>
  );
}
