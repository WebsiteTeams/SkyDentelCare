import type { ReactNode } from "react";
import { EmptyState } from "@/components/shared/states";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type Column<T> = { header: string; cell: (row: T) => ReactNode; className?: string };

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  getKey: (row: T) => string;
  emptyTitle: string;
  emptyDescription?: string;
};

export function DataTable<T>({ columns, rows, getKey, emptyTitle, emptyDescription }: DataTableProps<T>) {
  if (rows.length === 0) return <EmptyState title={emptyTitle} description={emptyDescription} />;

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.header} className={`h-12 px-4 font-semibold text-navy ${column.className ?? ""}`}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={getKey(row)} className="hover:bg-ice/50">
              {columns.map((column) => (
                <TableCell key={column.header} className={`px-4 py-3 align-middle ${column.className ?? ""}`}>{column.cell(row)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
