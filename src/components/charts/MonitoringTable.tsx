// src/components/charts/MonitoringTable.tsx
"use client";
import { MonitoredDriver } from "@/lib/types";
import Card from "@/components/ui/Card";

interface MonitoringTableProps {
  data: MonitoredDriver[];
}

export default function MonitoringTable({ data }: MonitoringTableProps) {
  return (
    <Card>
      <h3 className="font-bold text-slate-800 mb-4">
        Conductores a Monitorear
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3">
                Ciudad
              </th>
              <th scope="col" className="px-6 py-3">
                Viajes Asignados
              </th>
              <th scope="col" className="px-6 py-3">
                Tasa Cancelación
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((driver) => (
              <tr
                key={driver.id}
                className="bg-white border-b hover:bg-slate-50"
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {driver.id}
                </td>
                <td className="px-6 py-4">{driver.name}</td>
                <td className="px-6 py-4">{driver.city}</td>
                <td
                  className={`px-6 py-4 font-bold ${
                    driver.assignedTrips === 0 ? "text-amber-600" : ""
                  }`}
                >
                  {driver.assignedTrips}
                </td>
                <td
                  className={`px-6 py-4 font-bold ${
                    driver.cancellationRate > 15 ? "text-red-600" : ""
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
