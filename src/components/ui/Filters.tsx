// src/components/ui/Filters.tsx
"use client";

import { FilterOptions } from "@/lib/types";

interface FiltersProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[200px]">
        <label
          htmlFor="city-select"
          className="block text-sm font-medium text-slate-700"
        >
          Ciudad
        </label>
        <select
          id="city-select"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.ciudad}
          onChange={(e) => onFilterChange({ ciudad: e.target.value })}
        >
          <option>Loja</option>
          <option>Riobamba</option>
          <option>Quevedo</option>
        </select>
      </div>
    </div>
  );
}
