// src/components/charts/ViajesPorConductorChart.tsx
"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface ViajesPorConductorChartProps {
  data: { name: string; viajes: number }[];
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

export default function ViajesPorConductorChart({
  data,
}: ViajesPorConductorChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50} // Un poco más grande para un look más moderno
          outerRadius={90}
          paddingAngle={5}
          dataKey="viajes"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} conductores`, ""]} />
        <Legend iconSize={10} />
      </PieChart>
    </ResponsiveContainer>
  );
}
