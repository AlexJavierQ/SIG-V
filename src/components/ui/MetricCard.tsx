"use client";

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  subtitle?: string;
  value: number;
  trend?: number;
  format: 'currency' | 'number' | 'percentage' | 'rating' | 'time' | 'fraction';
  className?: string;
  onClick?: () => void;
  metadata?: { total?: number };
}

export default function MetricCard({
  title,
  subtitle,
  value,
  trend,
  format,
  className = "",
  onClick,
  metadata
}: MetricCardProps) {
  const formatValue = (val: number, fmt: string) => {
    switch (fmt) {
      case 'currency':
        return new Intl.NumberFormat('es-EC', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'rating':
        return `${val.toFixed(1)}/5`;
      case 'time':
        return val < 60 ? `${val.toFixed(1)} min` : `${(val / 60).toFixed(1)} hrs`;
      case 'fraction':
        return `${val}/${metadata?.total || 5}`;
      case 'number':
      default:
        return val.toLocaleString('es-EC');
    }
  };

  const getTrendColor = (trendValue?: number) => {
    if (!trendValue) return 'text-slate-500 dark:text-slate-400';
    return trendValue > 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';
  };

  const getTrendIcon = (trendValue?: number) => {
    if (!trendValue) return null;
    return trendValue > 0 ?
      <TrendingUp className="w-4 h-4" /> :
      <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div
      className={`unified-card hover-unified group relative ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-secondary-unified group-hover:text-primary-unified transition-colors duration-300">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-tertiary-unified mt-1 leading-tight">
                {subtitle}
              </p>
            )}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-medium transition-colors duration-300 ${getTrendColor(trend)} ml-2`}>
              {getTrendIcon(trend)}
              <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-primary-unified group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {formatValue(value, format)}
        </div>
      </div>
    </div>
  );
}