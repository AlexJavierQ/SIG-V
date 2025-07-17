// src/components/ui/InfoTooltip.tsx
"use client";
import { Info } from "lucide-react";
import styles from "./InfoTooltip.module.css"; // Usaremos CSS Modules para el estilo del tooltip

interface InfoTooltipProps {
  text: string;
}

export default function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <div className={styles.tooltipContainer}>
      <Info size={16} className="text-slate-400 dark:text-slate-500" />
      <span className={styles.tooltipText}>{text}</span>
    </div>
  );
}
