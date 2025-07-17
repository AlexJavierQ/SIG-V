"use client";

import React from "react";
import { useAnimeCounter } from "@/hooks/useAnimeCounter";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { ComplexMetric } from "@/lib/types";

export default function MetricCard({
  title,
  value,
  description,
  icon,
  iconColor = "text-slate-400 dark:text-slate-500",
  trend,
  subValue,
  chip,
}: ComplexMetric) {
  const numericValue =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
  const valueRef = useAnimeCounter<HTMLSpanElement>({ value: numericValue });

  return (
    <div className="flex flex-col h-full p-5 transition-colors duration-300 bg-white border rounded-lg shadow-sm border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
      {/* Cabecera */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-600 dark:text-slate-300">
              {title}
            </h3>
            {chip && (
              <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 rounded-full">
                {chip}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {description}
          </p>
        </div>
        {icon && <span className={`text-3xl ${iconColor}`}>{icon}</span>}
      </div>

      {/* Cuerpo principal */}
      <div className="mt-4 mb-1">
        <span
          className="text-4xl font-bold text-slate-900 dark:text-slate-100"
          ref={valueRef}
        >
          {numericValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </span>
        {/* Mostramos el sub-valor directamente */}
        {subValue && (
          <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
            {subValue}
          </span>
        )}
      </div>

      {/* Indicador de Tendencia */}
      {trend && (
        <div
          className={`flex items-center text-sm font-semibold ${
            trend.direction === "down" ? "text-red-500" : "text-green-500"
          }`}
        >
          {trend.direction === "down" ? (
            <ArrowDown size={16} />
          ) : (
            <ArrowUp size={16} />
          )}
          <span className="ml-1">{trend.value} vs. mes anterior</span>
        </div>
      )}
    </div>
  );
}
