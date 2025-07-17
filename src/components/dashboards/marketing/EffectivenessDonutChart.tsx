"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Card from "@/components/ui/Card";

interface ChartProps {
  title: string;
  description: string;
  value: number; // El valor debe ser un porcentaje (0-100)
  color: string;
}

export default function EffectivenessDonutChart({
  title,
  description,
  value,
  color,
}: ChartProps) {
  // Datos para el gráfico: una parte para el valor y otra para el resto hasta 100
  const data = [
    { name: "Valor", value: value },
    { name: "Restante", value: 100 - value },
  ];

  return (
    <Card tooltipText={description}>
      <div className="relative flex flex-col items-center justify-center h-full">
        {/* Contenedor del gráfico */}
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* Círculo de fondo */}
              <Pie
                data={[{ name: "background", value: 100 }]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={75}
                dataKey="value"
                isAnimationActive={false}
                stroke="none"
                fill={"#e5e7eb"}
                className="dark:fill-slate-700"
              />
              {/* Barra de progreso circular */}
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={75}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                paddingAngle={0} // Sin espaciado
                cornerRadius={20} // Extremos redondeados
                stroke="none"
              >
                <Cell fill={color} />
                <Cell fill="transparent" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Texto en el centro del anillo */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            {value}%
          </span>
        </div>
        {/* Título debajo del gráfico */}
        <h3 className="mt-4 font-semibold text-center text-slate-700 dark:text-slate-300">
          {title}
        </h3>
      </div>
    </Card>
  );
}
