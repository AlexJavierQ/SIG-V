// src/components/charts/CancellationRateTable.tsx
"use client";

import { MonitoredDriver } from "@/lib/types";
import Card from "@/components/ui/Card";

interface CancellationRateTableProps {
  drivers: MonitoredDriver[];
}

export default function CancellationRateTable({
  drivers,
}: CancellationRateTableProps) {
  const sortedDrivers = [...drivers].sort(
    (a, b) => b.cancellationRate - a.cancellationRate
  );

  return (
    <Card
      title="Tasa de Cancelación"
      tooltipText="Conductores ordenados por su tasa de cancelación (de mayor a menor)."
    >
      <div className="overflow-y-auto max-h-[250px] -mx-4 sm:-mx-6">
        <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700/50 dark:text-slate-400 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3">
                Conductor
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Tasa Cancelación
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {sortedDrivers.map((driver) => (
              <tr
                key={driver.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                  {driver.name}
                </td>
                <td
                  className={`px-4 py-3 font-bold text-right ${
                    driver.cancellationRate > 15
                      ? "text-red-500"
                      : "text-green-500 dark:text-green-400"
                  }`}
                >
                  {driver.cancellationRate}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
