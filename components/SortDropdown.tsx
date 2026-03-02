"use client";

import { ChevronDown } from "lucide-react";

export default function SortDropdown({
  setSort,
}: {
  setSort: (value: string) => void;
}) {
  return (
    <div className="relative">
      <select
        onChange={(e) => setSort(e.target.value)}
        className="appearance-none px-4 py-2 pr-10 rounded-xl bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-colors cursor-pointer font-medium text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
      >
        <option value="uploaded_at-desc">Latest</option>
        <option value="uploaded_at-asc">Oldest</option>
        <option value="file_size-desc">Largest</option>
        <option value="file_size-asc">Smallest</option>
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400" size={16} />
    </div>
  );
}