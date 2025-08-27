"use client";

import React, { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import {
    User, ChevronDown, ChevronRight
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeProvider';
import Link from 'next/link';

type NavbarProps = object

const AdminDropdown = ({ toggleTheme, isDarkMode }: { toggleTheme: () => void; isDarkMode: boolean }) => (
    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50 animate-slideDown">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="font-medium text-slate-900 dark:text-white">Admin</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">admin@sigv.com</p>
                </div>
            </div>
        </div>
        <div className="p-2">
            <button className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">Mi Perfil</button>
            <button onClick={toggleTheme} className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2">
                {isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
            </button>
            <hr className="my-2 border-slate-200 dark:border-slate-700" />
            <button className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">Cerrar Sesión</button>
        </div>
    </div>
);

export default function Navbar({ }: NavbarProps) {
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();
    const pathname = usePathname();

    const breadcrumbs = useMemo(() => {
        const pathParts = pathname.split('/').filter(part => part);
        if (pathParts.length === 0) return [{ name: "Dashboard Principal", href: "/", isLast: true }];

        let currentPath = '';
        return pathParts.map((part, index) => {
            currentPath += `/${part}`;
            return {
                name: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
                href: currentPath,
                isLast: index === pathParts.length - 1
            };
        });
    }, [pathname]);

    return (
        <nav className="sticky top-0 z-30 glass-effect border-b border-slate-200/30 dark:border-slate-700/30 px-6 py-3 transition-all duration-200">
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent dark:from-slate-900/50 dark:to-transparent" />
            <div className="relative z-10 flex items-center justify-between">
                {/* Breadcrumbs - Resumen de accesos */}
                <div className="flex items-center gap-2 text-sm">
                    <Link href="/" className="text-slate-500 dark:text-slate-400 hover:text-blue-500">Home</Link>
                    {breadcrumbs.map(crumb => (
                        <React.Fragment key={crumb.href}>
                            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                            {crumb.isLast ? (
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{crumb.name}</span>
                            ) : (
                                <Link href={crumb.href} className="text-slate-500 dark:text-slate-400 hover:text-blue-500">{crumb.name}</Link>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Right side - Admin only */}
                <div className="flex items-center gap-4">
                    {/* Admin Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setIsAdminOpen(!isAdminOpen)}
                            className="flex items-center gap-2"
                        >
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Admin</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Administrador</p>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isAdminOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isAdminOpen && <AdminDropdown toggleTheme={toggleTheme} isDarkMode={isDarkMode} />}
                    </div>
                </div>
            </div>
            {isAdminOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsAdminOpen(false)} />
            )}
        </nav>
    );
}