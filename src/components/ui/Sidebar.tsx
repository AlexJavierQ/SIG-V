// src/components/ui/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { navigationConfig } from '@/config/navigation';

// Importamos los nuevos componentes
import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';

export default function Sidebar() {
    const { isCollapsed, toggleCollapse, isMobileOpen, toggleMobile } = useSidebar();

    return (
        <>
            {/* Botón para menú móvil */}
            <button
                onClick={toggleMobile}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 text-white lg:hidden"
            >
                {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Contenedor principal del Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 ${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-600 transform transition-all duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col shadow-lg`}>

                <SidebarHeader isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />

                <Navigation isCollapsed={isCollapsed} />

                <SidebarFooter isCollapsed={isCollapsed} />

            </div>

            {/* Overlay para cerrar en móvil */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                    onClick={toggleMobile}
                />
            )}
        </>
    );
}

// ----------------------------------------------------------------
// Navigation Component (definido en el mismo archivo)
// ----------------------------------------------------------------

interface NavigationProps {
    isCollapsed: boolean;
}

export function Navigation({ isCollapsed }: NavigationProps) {
    const pathname = usePathname();
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ 'Taxis': true });

    const toggleSection = (sectionName: string) => {
        if (!isCollapsed) {
            setExpandedSections(prev => ({ ...prev, [sectionName]: !prev[sectionName] }));
        }
    };

    return (
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(148 163 184) transparent' }}>
            <nav className="px-4 py-6 space-y-2">
                {navigationConfig.map((item) => (
                    <div key={item.name}>
                        {item.children ? (
                            <div>
                                <button
                                    onClick={() => toggleSection(item.name)}
                                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-700 group ${isCollapsed ? 'justify-center' : ''}`}
                                >
                                    <item.icon className={`${item.color} w-5 h-5`} />
                                    {!isCollapsed && (
                                        <>
                                            <span className="flex-1 text-left font-semibold text-slate-800 dark:text-slate-200 text-sm">{item.name}</span>
                                            {expandedSections[item.name] ? <ChevronUp className="w-4 h-4 text-slate-600 dark:text-slate-300" /> : <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
                                        </>
                                    )}
                                </button>
                                {!isCollapsed && expandedSections[item.name] && (
                                    <div className="ml-4 mt-2 space-y-1">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.name}
                                                href={child.href}
                                                className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${pathname === child.href ? 'bg-blue-500 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                            >
                                                <child.icon className={`w-4 h-4 ${pathname === child.href ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                                                <span>{child.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href={item.href || '#'}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isCollapsed ? 'justify-center' : ''} ${pathname === item.href ? 'bg-blue-500 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            >
                                <item.icon className={`w-5 h-5 ${pathname === item.href ? 'text-white' : item.color}`} />
                                {!isCollapsed && (
                                    <>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                                        {item.badge && <span className="px-2 py-1 text-xs font-medium bg-orange-400 text-white rounded-full">{item.badge}</span>}
                                    </>
                                )}
                            </Link>
                        )}
                    </div>
                ))}
            </nav>
        </div>
    );
}