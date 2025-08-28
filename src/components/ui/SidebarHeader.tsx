// src/components/ui/SidebarHeader.tsx
'use client';

import Link from 'next/link';
import { BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarHeaderProps {
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

export default function SidebarHeader({ isCollapsed, toggleCollapse }: SidebarHeaderProps) {
    return (
        <div className="flex items-center justify-between p-6 border-b border-blue-100 dark:border-slate-700/50 flex-shrink-0 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-slate-800 dark:to-slate-800">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md group-hover:shadow-lg transition-all duration-300">
                    <BarChart3 className="w-5 h-5 text-white" />
                </div>
                {!isCollapsed && (
                    <div className="transition-opacity duration-300 opacity-100">
                        <div className="text-slate-900 dark:text-slate-100 font-bold text-lg">CLIPP</div>
                        <div className="text-blue-600 dark:text-slate-300 text-xs font-medium">Plataforma de Análisis</div>
                    </div>
                )}
            </Link>
            <button onClick={toggleCollapse} className="hidden lg:block p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300">
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
        </div>
    );
}