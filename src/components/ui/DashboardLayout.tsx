"use client";

import React from "react";
import { BarChart3, HelpCircle, RefreshCw } from "lucide-react";
import { ExportButton } from './ExportButton';
import { NotificationSystem } from './NotificationSystem';
import { AlertSystem } from './AlertSystem';
import { PerformanceMonitor } from './PerformanceMonitor';
import EndpointGuide from './EndpointGuide';
import Navbar from './Navbar';
import { useNotifications } from '../../hooks/useNotifications';
import { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization';

// La interfaz de props no cambia
interface DashboardLayoutProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    exportData?: any[];
    dashboardType?: string;
    kpiData?: any;
}

export default function DashboardLayout({
    title,
    subtitle,
    children,
    actions,
    exportData = [],
    dashboardType = 'dashboard',
    kpiData
}: DashboardLayoutProps) {
    // Toda tu lógica de estado y efectos se mantiene exactamente igual
    const [currentTime, setCurrentTime] = React.useState<Date | null>(null);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [showEndpointGuide, setShowEndpointGuide] = React.useState(false);
    const { debouncedFilter } = usePerformanceOptimization();
    const {
        notifications,
        markAsRead,
        dismissNotification,
        clearAllNotifications,
        notifySuccess,
        notifyError,
        notifyWarning
    } = useNotifications();

    React.useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            notifySuccess('Actualización Completa', 'Los datos han sido actualizados correctamente');
        } catch (error) {
            notifyError('Error de Actualización', 'No se pudieron actualizar los datos');
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleAlert = (alert: any) => {
        switch (alert.severity) {
            case 'critical':
                notifyError(alert.name, alert.message, { autoClose: false });
                break;
            default:
                notifyWarning(alert.name, alert.message);
        }
    };

    return (
        // MEJORA: Contenedor principal que gestiona el layout de la pantalla completa
        <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-200">

            {/* MEJORA: La cabecera ahora es un solo bloque con `sticky` */}
            <header className="sticky top-0 z-30 flex-shrink-0">
                {/* Navbar Principal */}
                <Navbar
                    title={title}
                    subtitle={subtitle && currentTime ? `${subtitle} • ${currentTime.toLocaleString('es-EC', { dateStyle: 'long', timeStyle: 'short' })}` : subtitle}
                />

                {/* Cabecera Secundaria con Acciones */}
                <div className="bg-white dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                Dashboard Analytics
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {actions}
                            {exportData.length > 0 && (
                                <ExportButton
                                    data={exportData}
                                    filename={`${dashboardType}-${new Date().toISOString().split('T')[0]}`}
                                    dashboardType={dashboardType}
                                />
                            )}
                            <button
                                onClick={() => setShowEndpointGuide(true)}
                                className="p-2 text-slate-500 dark:text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
                                title="Guía de endpoints"
                            >
                                <HelpCircle className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="p-2 text-slate-500 dark:text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all disabled:opacity-50"
                                title="Actualizar datos"
                            >
                                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* MEJORA: Área de contenido principal con su propio scroll */}
            <main className="flex-1 overflow-y-auto">
                {kpiData && (
                    <div className="px-6 pt-4">
                        <AlertSystem data={kpiData} onAlert={handleAlert} />
                    </div>
                )}
                <div className="px-6 py-8">
                    {children}
                </div>
            </main>

            {/* Los sistemas de notificación y otros overlays pueden quedar aquí */}
            <NotificationSystem
                notifications={notifications}
                onDismiss={dismissNotification}
            />
            <PerformanceMonitor />
            <EndpointGuide
                isOpen={showEndpointGuide}
                onClose={() => setShowEndpointGuide(false)}
            />
        </div>
    );
}