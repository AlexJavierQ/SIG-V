"use client";

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeProvider";

interface ChartProps {
  opens: number;
  interactions: number;
}

export default function EngagementRateChart({
  opens,
  interactions,
}: ChartProps) {
  const { isDarkMode } = useTheme();
  const engagementRate =
    opens > 0 ? Math.round((interactions / opens) * 100) : 0;
  const data = [{ name: "Interacción", value: engagementRate }];

  return (
    <Card
      title="Tasa de Interacción"
      tooltipText="Porcentaje de aperturas de la app que resultan en una interacción con una función clave."
    >
      <div className="h-[300px] w-full flex flex-col items-center justify-center relative">
        <ResponsiveContainer width="70%" height="70%">
          <RadialBarChart
            innerRadius="80%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={-270}
            barSize={20}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: isDarkMode ? "#334155" : "#e5e7eb" }} // Fondo del anillo con modo oscuro
              dataKey="value"
              cornerRadius={10}
              fill="#2563eb" // Color principal de la barra
            />
          </RadialBarChart>
        </ResponsiveContainer>
        {/* Texto en el centro */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-bold text-slate-800 dark:text-slate-100">
            {engagementRate}%
          </span>
        </div>
        {/* Descripción debajo */}
        <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">
          {interactions.toLocaleString()} interacciones de{" "}
          {opens.toLocaleString()} aperturas
        </p>
      </div>
    </Card>
  );
}
