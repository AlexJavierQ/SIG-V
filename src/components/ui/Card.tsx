// src/components/ui/Card.tsx
import React from "react";
// Importaremos el nuevo componente de tooltip aquí
import InfoTooltip from "./InfoTooltip";

interface CardProps {
  title?: string;
  // --- Nueva prop para el texto del tooltip ---
  tooltipText?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({
  title,
  tooltipText,
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`
        bg-white border-slate-200 
        dark:bg-slate-800/80 dark:border-slate-700 
        p-4 sm:p-6 rounded-lg shadow-md flex flex-col transition-colors duration-300 ${className}
      `}
    >
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-200">
            {title}
          </h3>
          {/* Renderiza el tooltip si se proporciona el texto */}
          {tooltipText && <InfoTooltip text={tooltipText} />}
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}
