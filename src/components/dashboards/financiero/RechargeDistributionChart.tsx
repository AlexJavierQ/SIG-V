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
import { useTheme } from "@/contexts/ThemeProvider";

interface ChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ["#4f46e5", "#818cf8", "#a5b4fc"];

export default function RechargeDistributionChart({ data }: ChartProps) {
  const { isDarkMode } = useTheme();

  return (
    <Card
      title="Distribución de Recargas"
      tooltipText="Modalidad de recarga más común entre los conductores."
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              dataKey="value"
              paddingAngle={5}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                value.toLocaleString(),
                "Transacciones",
              ]}
              contentStyle={
                isDarkMode
                  ? { backgroundColor: "#1e293b", border: "1px solid #334155" }
                  : {}
              }
              labelStyle={isDarkMode ? { color: "#e2e8f0" } : {}}
            />
            <Legend wrapperStyle={isDarkMode ? { color: "#94a3b8" } : {}} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
