// src/components/charts/EffectivenessChart.tsx
"use client";
import React from "react";
import { RadialBarChart, RadialBar, Legend } from "recharts";

interface Props {
  value: number;
}

export default function EffectivenessChart({ value }: Props) {
  const data = [{ name: "Efectividad", uv: value, fill: "#22c55e" }];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <RadialBarChart
        width={250}
        height={250}
        cx="50%"
        cy="50%"
        innerRadius="80%"
        outerRadius="100%"
        barSize={15}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <RadialBar
          dataKey="uv"
          background={{ fill: "#eee" }}
          cornerRadius={10}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-4xl font-bold fill-slate-800"
        >
          {`${value}%`}
        </text>
      </RadialBarChart>
    </div>
  );
}
