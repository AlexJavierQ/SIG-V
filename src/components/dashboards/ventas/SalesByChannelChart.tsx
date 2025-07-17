"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeProvider";
import React from "react";

interface ChartProps {
  data: { name: string; ventas: number }[];
}

const COLORS = ["#4f46e5", "#818cf8", "#a5b4fc", "#c7d2fe"];

// --- 1. Definimos nuestra propia interfaz, pero esta vez de forma correcta ---
// Hacemos opcionales las props que Recharts puede no pasar siempre.
interface CustomizedLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
  name?: string; // Recharts también pasa 'name' directamente
}

// --- 2. Creamos un Componente de React para la etiqueta ---
const CustomizedLabel = (props: CustomizedLabelProps) => {
  const { isDarkMode } = useTheme();
  const labelColor = isDarkMode ? "#cbd5e1" : "#475569";
  const RADIAN = Math.PI / 180;

  // 3. Añadimos una guarda de seguridad para manejar el caso donde las props son undefined
  if (
    props.cx === undefined ||
    props.cy === undefined ||
    props.midAngle === undefined ||
    props.outerRadius === undefined ||
    props.percent === undefined
  ) {
    return null;
  }

  const { cx, cy, midAngle, outerRadius, percent, name } = props;

  const radius = Number(outerRadius) + 25;
  const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN);
  const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={labelColor}
      textAnchor={x > Number(cx) ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs"
    >
      {`${name} (${(Number(percent) * 100).toFixed(0)}%)`}
    </text>
  );
};

export default function SalesByChannelChart({ data }: ChartProps) {
  const { isDarkMode } = useTheme();

  return (
    <Card
      title="Ventas por Canal"
      tooltipText="Distribución de las ventas según el canal."
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              // 4. Pasamos la referencia al componente, que ahora es totalmente compatible
              label={CustomizedLabel}
              outerRadius={100}
              dataKey="ventas"
              nameKey="name"
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
                `$${value.toLocaleString()}`,
                "Ventas",
              ]}
              contentStyle={
                isDarkMode
                  ? {
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                    }
                  : {}
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
