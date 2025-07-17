"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CollapsibleSection from "./CollapsibleSection";

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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // inicia cerrado

  return (
    <>
      {/* Botón toggle siempre visible */}
      <button
        aria-label="Toggle sidebar"
        onClick={() => setIsSidebarOpen((open) => !open)}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {isSidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-4 transform transition-transform duration-300 z-40
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-2 mb-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="p-2 bg-cyan-400/20 rounded-lg">
                <div className="w-5 h-5 bg-cyan-400 rounded-sm"></div>
              </div>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                SIG-V
              </span>
            </div>
          </Link>
        </div>

        {/* Navegación Principal */}
        <nav className="flex flex-col space-y-2 overflow-y-auto">
          {navData.map((category) => {
            const isSelected = selectedCategory === category.name;
            return (
              <div key={category.name}>
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

      {/* Overlay solo visible si sidebar abierto */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-30"
        />
      )}
    </>
  );
}
