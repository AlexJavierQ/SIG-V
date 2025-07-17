// src/components/charts/FinancialChart.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface FinancialChartProps {
  data: { mes: string; ingresos: number; churn: number }[];
}

// Nota: Este componente espera estar dentro de un contenedor con altura definida (ej. <div className="h-[350px]">)
export default function FinancialChart({ data }: FinancialChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis
          yAxisId="left"
          label={{
            value: "Ingresos ($)",
            angle: -90,
            position: "insideLeft",
            offset: -10,
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          label={{ value: "Churn (%)", angle: 90, position: "insideRight" }}
        />
        <Tooltip
          formatter={(value, name) => {
            if (name === "Tasa de Churn") return [`${value}%`, name];
            if (name === "Ingresos Totales")
              return [`$${Number(value).toLocaleString()}`, name];
            return [value, name];
          }}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="ingresos"
          stroke="#4f46e5"
          strokeWidth={2}
          name="Ingresos Totales"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="churn"
          stroke="#e11d48"
          strokeWidth={2}
          name="Tasa de Churn"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
