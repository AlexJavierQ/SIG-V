"use client";

import { MonitoredDriver } from "@/lib/types";
import Card from "@/components/ui/Card";

interface CancellationRateTableProps {
  data: MonitoredDriver[];
  title: string;
}

export default function CancellationRateTable({
  data,
  title,
}: CancellationRateTableProps) {
  // Ordenar y limitar top 20
  const topDrivers = data && data.length > 0 ? [...data] : []
    .sort((a, b) => b.cancellationRate - a.cancellationRate)
    .slice(0, 20);

  return (
    <Card
      title={title}
      tooltipText="Top 20 conductores con mayor tasa de cancelación, junto a sus viajes asignados."
    >
      <div className="overflow-y-auto max-h-[250px] -mx-4 sm:-mx-6">
        <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700/50 dark:text-slate-400 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3">
                Conductor
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Viajes Asignados
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Tasa Cancelación
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {topDrivers.map((driver, index) => (
              <tr
                key={`${driver.id}-${index}`} // Previene claves duplicadas
                className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                  {driver.name}
                </td>
                <td className="px-4 py-3 text-center">
                  {driver.assignedTrips ?? 0}
                </td>
                <td
                  className={`px-4 py-3 font-bold text-right ${driver.cancellationRate > 15
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
