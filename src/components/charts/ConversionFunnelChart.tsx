// src/components/charts/ConversionFunnelChart.tsx
"use client";

import React from "react"; // Importa React para usar React.ReactNode
import {
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ConversionFunnelChartProps {
  data: { step: string; value: number }[];
}

export default function ConversionFunnelChart({
  data,
}: ConversionFunnelChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <FunnelChart>
        <Tooltip />
        <Funnel dataKey="value" data={data} isAnimationActive>
          <LabelList
            position="right"
            fill="#000"
            stroke="none"
            dataKey="step"
          />

          {/* CORRECCIÓN FINAL APLICADA AQUÍ */}
          <LabelList
            position="center"
            fill="#fff"
            stroke="none"
            dataKey="value"
            formatter={(label: React.ReactNode) => {
              // La lógica interna no cambia, TypeScript es lo suficientemente
              // inteligente para saber que si la condición es cierta, 'label' es un número.
              if (typeof label === "number") {
                return label.toLocaleString();
              }
              return label;
            }}
          />
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
}
