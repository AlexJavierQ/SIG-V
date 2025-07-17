// src/components/charts/SalesCharts.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// --- Componente para el Gráfico de Top Zonas ---
interface TopZonesChartProps {
  data: { name: string; viajes: number }[];
}

export function TopZonesChart({ data }: TopZonesChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis
          dataKey="name"
          type="category"
          width={120}
          tick={{ fontSize: 12 }}
        />
        <Tooltip />
        <Bar dataKey="viajes" fill="#10b981" name="Nº de Viajes" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// --- Componente para el Gráfico de Top Horas ---
interface TopHoursChartProps {
  data: { name: string; solicitudes: number }[];
}

export function TopHoursChart({ data }: TopHoursChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="solicitudes" fill="#f59e0b" name="Nº de Solicitudes" />
      </BarChart>
    </ResponsiveContainer>
  );
}
