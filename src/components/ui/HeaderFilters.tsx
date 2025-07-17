"use client";

import { FilterOptions } from "@/lib/types";
import { useState, useEffect, useRef, ReactNode } from "react";
import { Menu, Clock, Sun, Moon } from "lucide-react";
import CollapsibleSection from "./CollapsibleSection";
import { useTheme } from "@/contexts/ThemeProvider";

// --- Subcomponentes reutilizables para mantener el código limpio ---

const FilterSelect = ({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
}) => (
  <div>
    <label className="block mb-1 text-xs font-medium text-slate-600 dark:text-slate-300">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full p-2 text-sm text-slate-800 border-none rounded-md bg-slate-200/60 dark:bg-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </select>
  </div>
);

const DateInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <label className="block mb-1 text-xs font-medium text-slate-600 dark:text-slate-300">
      {label}
    </label>
    <input
      type="date"
      value={value}
      onChange={onChange}
      className="w-full p-2 text-sm text-slate-800 border-none rounded-md bg-slate-200/60 dark:bg-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const UiSwitch = ({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? "bg-blue-600" : "bg-slate-400 dark:bg-slate-600"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
        enabled ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

// --- Componente Principal ---

export default function HeaderFilters({
  initialFilters,
  onFilterChange,
}: {
  initialFilters: FilterOptions;
  onFilterChange: (f: Partial<FilterOptions>) => void;
}) {
  const [filters, setFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [isDatePopoverOpen, setDatePopoverOpen] = useState(false);
  const datePopoverRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, toggleTheme } = useTheme();

  // Efecto para cerrar el popover de fecha al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        datePopoverRef.current &&
        !datePopoverRef.current.contains(event.target as Node)
      ) {
        setDatePopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [datePopoverRef]);

  // Función centralizada para actualizar los filtros
  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    onFilterChange(newFilters);
  };

  // Lógica para manejar los rangos de fecha predefinidos
  const handleDatePreset = (
    preset: "hoy" | "ayer" | "mes_actual" | "mes_anterior"
  ) => {
    const today = new Date(); // Usa la fecha actual real
    let fechaInicio: Date, fechaFin: Date;

    switch (preset) {
      case "hoy":
        fechaInicio = fechaFin = today;
        break;
      case "ayer":
        fechaInicio = fechaFin = new Date(
          new Date().setDate(today.getDate() - 1)
        );
        break;
      case "mes_actual":
        fechaInicio = new Date(today.getFullYear(), today.getMonth(), 1);
        fechaFin = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "mes_anterior":
        fechaInicio = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        fechaFin = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
    }

    updateFilters({
      fechaInicio: fechaInicio.toISOString().split("T")[0],
      fechaFin: fechaFin.toISOString().split("T")[0],
    });
    setDatePopoverOpen(false);
  };

  return (
    <div className="p-4 mb-8 transition-colors bg-white border rounded-lg shadow-md border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
      {/* Barra Superior */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Menu className="text-slate-600 dark:text-slate-300" />
          </button>
          <div className="flex items-center gap-2">
            <UiSwitch
              enabled={filters.transaccional}
              onChange={(val) => updateFilters({ transaccional: val })}
            />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Transaccional
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setDatePopoverOpen(!isDatePopoverOpen)}
              className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Clock size={20} className="text-slate-500 dark:text-slate-400" />
              <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-300 sm:inline">
                {filters.fechaInicio} al {filters.fechaFin}
              </span>
            </button>
            {isDatePopoverOpen && (
              <div
                ref={datePopoverRef}
                className="absolute right-0 z-10 p-2 mt-2 bg-white border rounded-lg shadow-lg top-full w-64 dark:bg-slate-800 dark:border-slate-600"
              >
                <p className="px-2 pt-1 pb-2 font-bold text-lg dark:text-white">
                  Seleccione un rango
                </p>
                <ul>
                  <li
                    className="p-2 text-sm rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-200"
                    onClick={() => handleDatePreset("hoy")}
                  >
                    Hoy
                  </li>
                  <li
                    className="p-2 text-sm rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-200"
                    onClick={() => handleDatePreset("ayer")}
                  >
                    Ayer
                  </li>
                  <li
                    className="p-2 text-sm rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-200"
                    onClick={() => handleDatePreset("mes_actual")}
                  >
                    Este mes
                  </li>
                  <li
                    className="p-2 text-sm rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-200"
                    onClick={() => handleDatePreset("mes_anterior")}
                  >
                    Mes anterior
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isDarkMode ? (
              <Moon size={20} className="text-yellow-400" />
            ) : (
              <Sun size={20} className="text-orange-500" />
            )}
            <UiSwitch enabled={isDarkMode} onChange={toggleTheme} />
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
          <div className="text-right">
            <p className="text-sm text-black font-semibold dark:text-white">
              fefego04
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Admin</p>
          </div>
        </div>
      </div>

      {/* Fila de Filtros Desplegable */}
      <CollapsibleSection isOpen={showFilters}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
          <FilterSelect
            label="Aplicativo"
            value={filters.aplicativo}
            onChange={(e) => updateFilters({ aplicativo: e.target.value })}
          >
            <option>Clipp</option>
            <option>Ktaxi</option>
          </FilterSelect>
          <FilterSelect
            label="País"
            value={filters.pais}
            onChange={(e) => updateFilters({ pais: e.target.value })}
          >
            <option>Ecuador</option>
          </FilterSelect>
          <FilterSelect
            label="Ciudad"
            value={filters.ciudad}
            onChange={(e) => updateFilters({ ciudad: e.target.value })}
          >
            <option>Loja</option>
          </FilterSelect>
          <FilterSelect
            label="Establecimiento"
            value={filters.establecimiento}
            onChange={(e) => updateFilters({ establecimiento: e.target.value })}
          >
            <option value="">Todos</option>
          </FilterSelect>
          <div className="grid grid-cols-2 col-span-2 gap-2 md:col-span-1">
            <DateInput
              label="Desde"
              value={filters.fechaInicio}
              onChange={(e) => updateFilters({ fechaInicio: e.target.value })}
            />
            <DateInput
              label="Hasta"
              value={filters.fechaFin}
              onChange={(e) => updateFilters({ fechaFin: e.target.value })}
            />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}
