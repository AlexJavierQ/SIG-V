"use client";
import * as React from "react";

import {
  FunnelChart,
  Funnel,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeProvider";

interface ChartProps {
  data: {
    step: string;
    value: number;
    fill: string;
  }[];
}

interface FunnelPayload {
  step: string;
  value: number;
  overallPercentage: number;
}

interface LabelProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: FunnelPayload;
}

const CustomLabel = ({
  x,
  y,
  width,
  height,
  payload,
}: LabelProps): React.JSX.Element | null => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? "#e2e8f0" : "#1f2937";

  if (
    !payload ||
    typeof x !== "number" ||
    typeof y !== "number" ||
    typeof width !== "number" ||
    typeof height !== "number"
  )
    return null;

  return (
    <g>
      {height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          className="text-sm font-bold pointer-events-none"
        >
          {payload.value.toLocaleString()}
        </text>
      )}
      <text
        x={x + width + 20}
        y={y + height / 2}
        fill={textColor}
        textAnchor="start"
        dominantBaseline="middle"
        className="text-sm font-medium pointer-events-none"
      >
        {`${payload.step} (${payload.overallPercentage}%)`}
      </text>
    </g>
  );
};

export default function ConversionFunnelChart({ data }: ChartProps) {
  const { isDarkMode } = useTheme();
  const firstValue = data[0]?.value ?? 0;

  const processedData = data.map((entry) => ({
    ...entry,
    overallPercentage:
      firstValue > 0
        ? parseFloat(((entry.value / firstValue) * 100).toFixed(1))
        : 100,
  }));

  return (
    <Card
      title="Embudo de Conversión"
      tooltipText="Flujo de usuarios desde registro hasta viaje completado"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[auto_200px] gap-6 items-center">
        {/* === Funnel Chart === */}
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart margin={{ top: 20, bottom: 20, left: 40, right: 40 }}>
              <Tooltip
                formatter={(value: number, name: string) => [
                  value.toLocaleString(),
                  name,
                ]}
                contentStyle={
                  isDarkMode
                    ? {
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                      }
                    : {}
                }
                labelStyle={isDarkMode ? { color: "#e2e8f0" } : {}}
              />
              <Funnel
                dataKey="value"
                nameKey="step"
                data={processedData}
                isAnimationActive
                reversed
                label={(props) => <CustomLabel {...props} />}
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        {/* === Leyenda personalizada === */}
        <div className="flex flex-col space-y-3">
          {processedData.map((entry, index) => (
            <div
              key={`legend-${index}`}
              className="flex items-center space-x-2"
            >
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {entry.step} ({entry.overallPercentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
