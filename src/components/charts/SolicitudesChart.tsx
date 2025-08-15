"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import Card from "@/components/ui/Card";

interface SolicitudesChartProps {
  data: {
    correctas: number;
    erroneas: number;
  };
  title: string;
}

export default function SolicitudesChart({
  data,
  title,
}: SolicitudesChartProps) {
  const chartData = [
    { name: "Exitosos", value: data.correctas, color: "#22c55e" },
    { name: "Fallidos", value: data.erroneas, color: "#ef4444" },
  ];

  const total = data.correctas + data.erroneas;
  const porcentajeExito = total > 0 ? Math.round((data.correctas / total) * 100) : 0;

  return (
    <Card
      title={title}
      tooltipText="Distribución de solicitudes exitosas vs fallidas"
    >
      <div className="relative h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                  stroke="#0f172a"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [value.toLocaleString(), "Viajes"]}
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Legend wrapperStyle={{ color: "#94a3b8" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-100">
              {porcentajeExito}%
            </div>
            <div className="text-sm text-slate-400">
              de Éxito
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}