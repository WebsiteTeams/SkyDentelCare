"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Option = { value: string; label: string };
type SelectFilter = { name: string; label: string; options: Option[] };

const ALL = "__all";

/** Filters live in the URL, so they are shareable and survive a refresh. Queries run on the server. */
export function SearchFilter({ placeholder, selects = [], withDate }: { placeholder: string; selects?: SelectFilter[]; withDate?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const apply = (changes: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    next.delete("page");
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    startTransition(() => router.replace(next.size ? `${pathname}?${next}` : pathname));
  };

  const hasFilters = params.size > 0 && [...params.keys()].some((k) => k !== "page");

  return (
    <div className="mb-6 flex flex-col flex-wrap gap-3 md:flex-row md:items-center" aria-busy={isPending}>
      <div className="relative md:w-72">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-teal" aria-hidden />
        <Input
          type="search"
          aria-label={placeholder}
          placeholder={placeholder}
          value={query}
          className="h-11 bg-white pl-9"
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => apply({ q: value.trim() }), 300);
          }}
        />
      </div>
      {withDate ? (
        <Input
          type="date"
          aria-label="Filter by preferred date"
          value={params.get("date") ?? ""}
          onChange={(event) => apply({ date: event.target.value })}
          className="h-11 bg-white md:w-44"
        />
      ) : null}
      {selects.map((filter) => (
        <Select key={filter.name} value={params.get(filter.name) ?? ALL} onValueChange={(v) => apply({ [filter.name]: v === ALL ? "" : v })}>
          <SelectTrigger aria-label={`Filter by ${filter.label.toLowerCase()}`} className="!h-11 w-full bg-white md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All {filter.label.toLowerCase()}</SelectItem>
            {filter.options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      ))}
      {hasFilters ? (
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setQuery("");
            startTransition(() => router.replace(pathname));
          }}
        >
          <X aria-hidden /> Clear
        </Button>
      ) : null}
    </div>
  );
}
