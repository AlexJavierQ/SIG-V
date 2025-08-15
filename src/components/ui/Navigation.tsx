'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useMemo } from 'react';
import { navigationConfig } from '@/config/navigation';
import { usePersistentState } from '@/hooks/usePersistentState';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface NavigationProps {
    isCollapsed: boolean;
}

export function Navigation({ isCollapsed }: NavigationProps) {
    const pathname = usePathname();
    // MEJORA: Usa el estado persistente para recordar las secciones abiertas
    const [expandedSections, setExpandedSections] = usePersistentState<Record<string, boolean>>('sidebarSections', { 'Taxis': true });
    const [searchTerm, setSearchTerm] = useState('');

    const toggleSection = (sectionName: string) => {
        if (!isCollapsed) {
            setExpandedSections(prev => ({ ...prev, [sectionName]: !prev[sectionName] }));
        }
    };

    // MEJORA: Lógica de filtrado para la búsqueda
    const filteredNavigation = useMemo(() => {
        if (!searchTerm.trim()) return navigationConfig;

        const lowerCaseSearch = searchTerm.toLowerCase();

        return navigationConfig
            .map(category => {
                if (category.children) {
                    const filteredChildren = category.children.filter(child =>
                        child.name.toLowerCase().includes(lowerCaseSearch) ||
                        child.description.toLowerCase().includes(lowerCaseSearch)
                    );
                    if (filteredChildren.length > 0) {
                        return { ...category, children: filteredChildren };
                    }
                }
                if (category.name.toLowerCase().includes(lowerCaseSearch)) {
                    const { children, ...restOfCategory } = category;
                    return restOfCategory;
                }
                return null;
            })
            .filter(Boolean) as typeof navigationConfig; // Filtra los nulos y asegura el tipo
    }, [searchTerm]);

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            {/* MEJORA: Input de Búsqueda */}
            <div className="px-4 py-3">
                <div className="relative">
                    <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none transition-opacity ${!isCollapsed ? 'opacity-100' : 'opacity-0'}`} />
                    <input
                        type="text"
                        placeholder={isCollapsed ? "..." : "Buscar dashboard..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full bg-slate-100 dark:bg-slate-800/80 border border-transparent dark:border-slate-700/50 rounded-lg text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isCollapsed ? 'w-12 h-12 text-center cursor-pointer' : 'pl-9 pr-3 py-2.5'}`}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(148 163 184) transparent' }}>
                <nav className="px-4 pb-6 space-y-2">
                    {filteredNavigation.map((item) => (
                        <div key={item.name}>
                            {item.children ? (
                                // --- Categoría con Hijos (ej. Taxis) ---
                                <div>
                                    <button
                                        onClick={() => toggleSection(item.name)}
                                        className={`group relative w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 ${isCollapsed ? 'justify-center' : ''}`}
                                    >
                                        <item.icon className={`${item.color} w-5 h-5 flex-shrink-0`} />
                                        {!isCollapsed && (
                                            <>
                                                <span className="flex-1 text-left font-semibold text-slate-800 dark:text-white text-sm">{item.name}</span>
                                                {expandedSections[item.name] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </>
                                        )}
                                        {/* MEJORA: Tooltip */}
                                        {isCollapsed && <span className="absolute left-full ml-4 px-2 py-1 text-sm bg-slate-800 text-white rounded-md invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap">{item.name}</span>}
                                    </button>
                                    {!isCollapsed && expandedSections[item.name] && (
                                        <div className="ml-4 mt-2 space-y-1">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.name}
                                                    href={child.href}
                                                    className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${pathname === child.href ? 'bg-blue-100/70 dark:bg-slate-800/80' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                                >
                                                    <div className={`absolute left-0 top-1/2 h-1/2 w-1 -translate-y-1/2 rounded-r-full bg-blue-500 transition-all duration-300 ${pathname === child.href ? 'opacity-100' : 'opacity-0'}`}></div>
                                                    <child.icon className={`w-4 h-4 transition-colors ${pathname === child.href ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`} />
                                                    <span className={`font-medium transition-colors ${pathname === child.href ? 'text-blue-600 dark:text-slate-100' : ''}`}>{child.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // --- Enlace Simple (ej. Dashboard Principal) ---
                                <Link
                                    href={item.href || '#'}
                                    className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${isCollapsed ? 'justify-center' : ''} ${pathname === item.href ? 'bg-blue-500 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    <div className={`absolute left-0 top-1/2 h-4/5 w-1 -translate-y-1/2 rounded-r-full bg-white transition-all duration-300 ${pathname === item.href ? 'opacity-100' : 'opacity-0'}`}></div>
                                    <item.icon className={`w-5 h-5 flex-shrink-0 ${pathname === item.href ? 'text-white' : item.color}`} />
                                    {!isCollapsed && (
                                        <>
                                            <span className={`font-semibold ${pathname === item.href ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{item.name}</span>
                                            {item.badge && <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-orange-400 text-white rounded-full">{item.badge}</span>}
                                        </>
                                    )}
                                    {/* MEJORA: Tooltip */}
                                    {isCollapsed && <span className="absolute left-full ml-4 px-2 py-1 text-sm bg-slate-800 text-white rounded-md invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap">{item.name}</span>}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
}