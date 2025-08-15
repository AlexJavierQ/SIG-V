import React from "react";
import InfoTooltip from "./InfoTooltip";

interface CardProps {
  title?: string;
  tooltipText?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  title,
  tooltipText,
  children,
  className = "",
  onClick,
}: CardProps) {
  return (
    <div
      className={`
        group relative overflow-hidden
        bg-white dark:bg-slate-800 
        border border-slate-200/50 dark:border-slate-700/50
        rounded-xl shadow-sm
        hover:shadow-md hover:border-slate-300/50 dark:hover:border-slate-600/50
        transition-all duration-300
        flex flex-col animate-fade-in ${className}
        ${onClick ? 'cursor-pointer focus-enhanced hover:-translate-y-1' : ''}
      `}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {/* Subtle hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full">
        {title && (
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200/30 dark:border-slate-700/30">
            <div className="flex items-center gap-2 flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {title}
              </h3>
              {tooltipText && <InfoTooltip text={tooltipText} />}
            </div>
            <div className="w-2 h-2 rounded-full bg-blue-500 opacity-60 group-hover:opacity-100 transition-all duration-300" />
          </div>
        )}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
