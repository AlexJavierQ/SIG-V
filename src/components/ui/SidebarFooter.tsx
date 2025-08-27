// src/components/ui/SidebarFooter.tsx
'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeProvider';

interface SidebarFooterProps {
    isCollapsed: boolean;
}

export default function SidebarFooter({ isCollapsed }: SidebarFooterProps) {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className="p-4 border-t border-blue-100 dark:border-slate-700 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:bg-slate-800/50 flex-shrink-0">

            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                <div className={`flex items-center ${isCollapsed ? 'flex-col space-y-2' : 'gap-3'}`}>
                    <button
                        onClick={toggleTheme}
                        className={`group p-3 rounded-xl bg-gradient-to-r transition-all duration-300 hover:scale-110 shadow-lg ${isDarkMode ? 'from-yellow-400 to-orange-500' : 'from-slate-600 to-slate-700'}`}
                        title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                    >
                        {isDarkMode ? <Sun className="w-4 h-4 text-white group-hover:rotate-180 transition-transform duration-500" /> : <Moon className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />}
                    </button>
                    {!isCollapsed && (
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}</div>
                            <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">Tema del sistema</div>
                        </div>
                    )}
                </div>
            </div>

            {!isCollapsed && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-center">
                        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">SIG-V Analytics v2.1.0</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">© 2025 Clipp Dashboard</div>
                    </div>
                </div>
            )}
        </div>
    );
}