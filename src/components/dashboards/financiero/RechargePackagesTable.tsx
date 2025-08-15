"use client";

import { RechargePackageData } from "@/lib/types";
import Card from "@/components/ui/Card";
// import { Badge } from "lucide-react"; // Usaremos un ícono

interface TableProps {
  data: RechargePackageData[];
}

export default function RechargePackagesTable({ data }: TableProps) {
  const packageColors = {
    Básico: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    Plus: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300",
    Pro: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300",
  };

  return (
    <Card
      title="Conductores con Paquetes de Recarga"
      tooltipText="Detalle de los paquetes de recarga activos por conductor."
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3">
                Conductor
              </th>
              <th scope="col" className="px-6 py-3">
                Tipo de Paquete
              </th>
              <th scope="col" className="px-6 py-3">
                Monto
              </th>
              <th scope="col" className="px-6 py-3">
                Última Recarga
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {data.map((driver) => (
              <tr
                key={driver.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {driver.nombre}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      packageColors[driver.tipoPaquete]
                    }`}
                  >
                    {driver.tipoPaquete}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-800 dark:text-slate-200">
                  ${driver.monto.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                  {driver.ultimaRecarga}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
