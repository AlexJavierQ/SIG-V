"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import CollapsibleSection from "./CollapsibleSection"; // Re-introducimos este componente

const navData = [
  {
    name: "Taxis",
    icon: "🚕",
    basePath: "/taxis",
    subLinks: [
      { name: "Operacional", href: "/taxis/operacional" },
      { name: "Financiero", href: "/taxis/financiero" },
      { name: "Marketing", href: "/taxis/marketing" },
      { name: "Ventas y Uso", href: "/taxis/ventas" },
    ],
  },
  {
    name: "Buses",
    icon: "🚌",
    basePath: "/buses",
    subLinks: [],
  },
  {
    name: "Delivery",
    icon: "📦",
    basePath: "/delivery",
    subLinks: [],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const [selectedCategory, setSelectedCategory] = useState(
    () =>
      navData.find((category) => pathname.startsWith(category.basePath))
        ?.name || "Taxis"
  );

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-4">
      {/* Logo */}
      <div className="h-16 flex items-center px-2 mb-4">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="p-2 bg-cyan-400/20 rounded-lg">
              <div className="w-5 h-5 bg-cyan-400 rounded-sm"></div>
            </div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-500">
              clipp
            </span>
          </div>
        </Link>
      </div>

      {/* Navegación Principal Unificada */}
      <nav className="flex flex-col space-y-2">
        {navData.map((category) => {
          const isSelected = selectedCategory === category.name;
          return (
            <div key={category.name}>
              {/* Botón de la Categoría Principal */}
              <button
                onClick={() => setSelectedCategory(category.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors
                  ${
                    isSelected
                      ? "bg-slate-900 text-white dark:bg-slate-800"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>

              {/* Sección Desplegable con los Sub-enlaces */}
              <CollapsibleSection isOpen={isSelected}>
                <div className="pl-4 pt-2">
                  <ul className="flex flex-col space-y-2 border-l-2 border-slate-200 dark:border-slate-700">
                    {category.subLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <li key={link.name}>
                          <Link
                            href={link.href}
                            className={`block pl-5 pr-2 py-2 rounded-r-lg text-sm font-medium transition-colors relative
                                        before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-slate-300 dark:before:bg-slate-600
                                        ${
                                          isActive
                                            ? "text-blue-700 dark:text-blue-300 before:bg-blue-600 dark:before:bg-blue-500"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                        }`}
                          >
                            {link.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </CollapsibleSection>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
