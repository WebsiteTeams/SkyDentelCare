import Link from "next/link";
import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  pageCount: number;
  total: number;
  basePath: string;
  params: Record<string, string | string[] | undefined>;
};

export function Pagination({ page, pageCount, total, basePath, params }: PaginationProps) {
  const href = (target: number) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) if (typeof value === "string" && value && key !== "page") next.set(key, value);
    next.set("page", String(target));
    return `${basePath}?${next}`;
  };

  return (
    <div className="mt-5 flex items-center justify-between gap-4 text-sm text-charcoal">
      <p>{total} {total === 1 ? "result" : "results"}</p>
      {pageCount > 1 ? (
        <div className="flex items-center gap-2">
          {page > 1 ? <Button asChild variant="outline" size="sm"><Link href={href(page - 1)}>Previous</Link></Button> : null}
          <span>Page {page} of {pageCount}</span>
          {page < pageCount ? <Button asChild variant="outline" size="sm"><Link href={href(page + 1)}>Next</Link></Button> : null}
        </div>
      ) : null}
    </div>
  );
}
