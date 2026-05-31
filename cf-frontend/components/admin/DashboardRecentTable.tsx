"use client";

import Link from "next/link";
import DataTable from "./DataTable";
import type { Column } from "./DataTable";

interface DashboardRecentTableProps<T> {
  title: string;
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  href: string;
  loading?: boolean;
}

export default function DashboardRecentTable<T>({
  title,
  columns,
  data,
  keyExtractor,
  href,
  loading = false,
}: DashboardRecentTableProps<T>) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <Link
          href={href}
          className="text-xs font-medium text-[#E8B800] hover:text-[#d4a700] transition-colors"
        >
          View All;
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={keyExtractor}
        loading={loading}
      />
    </div>
  );
}
