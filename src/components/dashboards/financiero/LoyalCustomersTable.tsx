"use client";

import { LoyalCustomerData } from "@/lib/types";
import Card from "@/components/ui/Card";
import { Crown } from "lucide-react";

export default function LoyalCustomersTable({
  data,
}: {
  data: LoyalCustomerData[];
}) {
  // Ordenamos por días de uso
  const sortedData = [...data].sort((a, b) => b.diasDeUso - a.diasDeUso);

  return (
    <Card
      title="Top Clientes por Lealtad"
      tooltipText="Clientes con el mayor tiempo de uso activo en la plataforma."
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3">
                Cliente
              </th>
              <th scope="col" className="px-6 py-3">
                Ciudad
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Días de Uso
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {sortedData.map((item, index) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  {index === 0 && (
                    <Crown size={16} className="text-yellow-500" />
                  )}
                  {item.cliente}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                  {item.ciudad}
                </td>
                <td className="px-6 py-4 font-semibold text-right text-slate-800 dark:text-slate-200">
                  {item.diasDeUso}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
