"use client";

import { Plus, Trash2 } from "lucide-react";
import { Field, FieldError } from "@/components/shared/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

/** Finds the first message inside a possibly nested React Hook Form error. */
export function firstError(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;
  if ("message" in error && typeof error.message === "string") return error.message;
  for (const value of Object.values(error)) {
    if (value && typeof value === "object" && !(value instanceof Element)) {
      const found = firstError(value);
      if (found) return found;
    }
  }
  return undefined;
}

export function SwitchField({ id, label, description, checked, onChange, error }: { id: string; label: string; description?: string; checked: boolean; onChange: (checked: boolean) => void; error?: string }) {
  return (
    <div className="rounded-md border border-border p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Label htmlFor={id} className="font-semibold text-navy">{label}</Label>
          {description ? <p className="mt-1 text-[0.8125rem] text-muted-foreground">{description}</p> : null}
        </div>
        <Switch id={id} checked={checked} onCheckedChange={onChange} />
      </div>
      {error ? <div className="mt-2"><FieldError message={error} /></div> : null}
    </div>
  );
}

export function SelectField({ id, label, value, onChange, options, error }: { id: string; label: string; value: string; onChange: (value: string) => void; options: ReadonlyArray<{ value: string; label: string }>; error?: string }) {
  return (
    <Field id={id} label={label} error={error}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="!h-11 w-full"><SelectValue placeholder="Select" /></SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </Field>
  );
}

export function StringListField({ id, label, hint, value, onChange, addLabel, error }: { id: string; label: string; hint?: string; value: string[]; onChange: (value: string[]) => void; addLabel: string; error?: string }) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-navy">{label}</legend>
      {hint ? <p className="text-[0.8125rem] text-muted-foreground">{hint}</p> : null}
      {value.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            id={`${id}-${index}`}
            aria-label={`${label} ${index + 1}`}
            value={item}
            onChange={(event) => onChange(value.map((v, i) => (i === index ? event.target.value : v)))}
            className="h-11"
          />
          <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${label} ${index + 1}`} onClick={() => onChange(value.filter((_, i) => i !== index))}>
            <Trash2 aria-hidden />
          </Button>
        </div>
      ))}
      <FieldError message={error} />
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, ""])}>
        <Plus aria-hidden /> {addLabel}
      </Button>
    </fieldset>
  );
}

type ItemKey<K extends string> = { key: K; label: string; multiline?: boolean };

/** Edits a list of small objects, such as procedure steps, FAQs or opening hours. */
export function ItemListField<K extends string>({ label, hint, value, onChange, keys, addLabel, error, max }: { label: string; hint?: string; value: Array<Record<K, string>>; onChange: (value: Array<Record<K, string>>) => void; keys: ItemKey<K>[]; addLabel: string; error?: string; max?: number }) {
  const blank = Object.fromEntries(keys.map((k) => [k.key, ""])) as Record<K, string>;
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-navy">{label}</legend>
      {hint ? <p className="text-[0.8125rem] text-muted-foreground">{hint}</p> : null}
      {value.map((item, index) => (
        <div key={index} className="space-y-3 rounded-md border border-border p-4">
          {keys.map((k) => {
            const props = {
              "aria-label": `${k.label} ${index + 1}`,
              placeholder: k.label,
              value: item[k.key] ?? "",
              onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                onChange(value.map((v, i) => (i === index ? { ...v, [k.key]: event.target.value } : v))),
            };
            return k.multiline ? <Textarea key={k.key} rows={2} {...props} /> : <Input key={k.key} className="h-11" {...props} />;
          })}
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(value.filter((_, i) => i !== index))}>
            <Trash2 aria-hidden /> Remove
          </Button>
        </div>
      ))}
      <FieldError message={error} />
      {max === undefined || value.length < max ? (
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, blank])}>
          <Plus aria-hidden /> {addLabel}
        </Button>
      ) : null}
    </fieldset>
  );
}
