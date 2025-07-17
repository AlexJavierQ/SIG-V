// src/components/charts/DonutChart.tsx
"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Card from "@/components/ui/Card";

interface DonutChartProps {
  title: string;
  correctas: number;
  erroneas: number;
}

export default function DonutChart({
  title,
  correctas,
  erroneas,
}: DonutChartProps) {
  const total = correctas + erroneas;
  const percentage = total > 0 ? Math.round((correctas / total) * 100) : 0;
  const data = [
    { name: "Correctas", value: correctas, color: "#22c55e" },
    { name: "Erróneas", value: erroneas, color: "#ef4444" },
  ];

  return (
    <Card className="h-full">
      <h3 className="text-sm font-medium text-slate-500 mb-4 text-center">
        {title}
      </h3>
      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value.toLocaleString(), ""]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {percentage}%
            </div>
            <div className="text-xs text-slate-500">Éxito</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
