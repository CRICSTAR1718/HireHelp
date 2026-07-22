import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  emptyIcon?: LucideIcon;
  loading?: boolean;
}

export function DataTable<T>({ columns, data, emptyMessage = "No data available", emptyIcon, loading }: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="min-h-64 grid place-items-center">
        <div className="w-full max-w-2xl space-y-3 px-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg hh-skeleton" style={{ borderRadius: 'var(--hh-radius-sm)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState 
        icon={emptyIcon} 
        title="No data found" 
        description={emptyMessage}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 font-semibold text-slate-900"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-50">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-slate-700">
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
