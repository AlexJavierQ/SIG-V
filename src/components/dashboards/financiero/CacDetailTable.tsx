"use client";

import { CacDetailData } from "@/lib/types";
import Card from "@/components/ui/Card";

interface TableProps {
  data: CacDetailData[];
}

export default function CacDetailTable({ data }: TableProps) {
  return (
    <Card
      title="CAC Detallado (Costos de Adquisición)"
      tooltipText="Registro de los costos asociados a cada actividad de adquisición de conductores."
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800">
            <tr>
              {/* Columnas basadas en tu especificación */}
              <th scope="col" className="px-6 py-3">
                Actividad
              </th>
              <th scope="col" className="px-6 py-3">
                Responsable
              </th>
              <th scope="col" className="px-6 py-3">
                Fecha
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Costo (USD)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {data.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {item.actividad}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                  {item.responsable}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                  {item.fecha}
                </td>
                <td className="px-6 py-4 font-semibold text-right text-slate-800 dark:text-slate-200">
                  ${item.costo.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
