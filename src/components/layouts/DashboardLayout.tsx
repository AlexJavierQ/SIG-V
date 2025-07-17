import React from "react";

interface DashboardLayoutProps {
  title: string;
  description: string;
  filters: React.ReactNode;
  onUpdateClick: () => void;
  children: React.ReactNode;
}

export default function DashboardLayout({
  title,
  description,
  filters,
  onUpdateClick,
  children,
}: DashboardLayoutProps) {
  return (
    <main className="p-4 sm:p-6 md:p-8">
      {/* El componente de filtros se mantiene arriba */}
      {filters}

      {/* Cabecera del Contenido con los estilos de modo oscuro aplicados */}
      <div className="flex justify-between items-center mb-6">
        <div>
          {/* --- CAMBIO AQUÍ --- */}
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {title}
          </h1>
          {/* --- Y AQUÍ --- */}
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </div>
        <div>
          <button
            onClick={onUpdateClick}
            className="bg-slate-800 text-white font-semibold px-4 py-2 rounded-lg hover:bg-slate-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
          >
            Actualizar Datos
          </button>
        </div>
      </div>

      {/* Contenido principal del dashboard */}
      <div className="space-y-8 mt-6">{children}</div>
    </main>
  );
}
