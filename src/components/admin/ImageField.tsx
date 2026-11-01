"use client";

import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import { FieldError } from "@/components/shared/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUploadSignature } from "@/lib/actions/media";
import type { ImageData } from "@/types";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

type ImageFieldProps = {
  label: string;
  hint?: string;
  value: ImageData | null;
  onChange: (value: ImageData | null) => void;
  error?: string;
};

/** Uploads straight from the browser to Cloudinary using a server-issued signature. */
export function ImageField({ label, hint, value, onChange, error }: ImageFieldProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>();

  const upload = async (file: File) => {
    setUploadError(undefined);
    if (!ACCEPTED.includes(file.type)) return setUploadError("Please choose a JPG, PNG, WebP or AVIF image.");
    if (file.size > MAX_BYTES) return setUploadError("Please choose an image smaller than 10 MB.");

    setUploading(true);
    try {
      const signed = await getUploadSignature();
      if (!signed.ok) return setUploadError(signed.error);

      const body = new FormData();
      body.append("file", file);
      body.append("api_key", signed.data.apiKey);
      body.append("timestamp", String(signed.data.timestamp));
      body.append("signature", signed.data.signature);
      body.append("folder", signed.data.folder);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${signed.data.cloudName}/image/upload`, { method: "POST", body });
      if (!response.ok) return setUploadError("The upload failed. Please try again.");

      const uploaded = (await response.json()) as { secure_url: string; public_id: string };
      onChange({ url: uploaded.secure_url, publicId: uploaded.public_id, alt: value?.alt ?? "" });
    } catch {
      setUploadError("The upload failed. Please check your connection and try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-navy">{label}</p>
      {hint ? <p className="text-[0.8125rem] text-muted-foreground">{hint}</p> : null}

      {value ? (
        <div className="flex flex-col gap-4 rounded-md border border-border p-3 sm:flex-row">
          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded bg-ice sm:w-40">
            <Image src={value.url} alt={value.alt || label} fill sizes="160px" className="object-cover" />
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor={`${id}-alt`} className="text-[0.8125rem] font-semibold text-navy">Description for screen readers and search engines</Label>
            <Input
              id={`${id}-alt`}
              value={value.alt}
              maxLength={200}
              placeholder="e.g. Reception area with natural light"
              onChange={(event) => onChange({ ...value, alt: event.target.value })}
              className="h-11"
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
                {uploading ? <Loader2 className="animate-spin" aria-hidden /> : <ImagePlus aria-hidden />} Replace
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
                <Trash2 aria-hidden /> Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="h-24 w-full border-dashed"
        >
          {uploading ? <Loader2 className="animate-spin" aria-hidden /> : <ImagePlus aria-hidden />}
          {uploading ? "Uploading…" : "Upload an image"}
        </Button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="sr-only"
        tabIndex={-1}
        aria-label={`Choose file for ${label}`}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />
      <FieldError message={uploadError ?? error} />
    </div>
  );
}
