"use client";

import React from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface ErrorDisplayProps {
    error: string;
    onRetry?: () => void;
    loading?: boolean;
    className?: string;
}

export function ErrorDisplay({ error, onRetry, loading = false, className = "" }: ErrorDisplayProps) {
    const getErrorType = (errorMessage: string) => {
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
            return 'network';
        }
        if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
            return 'notFound';
        }
        if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
            return 'server';
        }
        if (errorMessage.includes('timeout')) {
            return 'timeout';
        }
        return 'generic';
    };

    const errorType = getErrorType(error);

    const getErrorConfig = () => {
        switch (errorType) {
            case 'network':
                return {
                    icon: WifiOff,
                    title: 'Sin conexión',
                    message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
                    color: 'text-red-500',
                    bgColor: 'bg-red-50 dark:bg-red-900/20',
                    borderColor: 'border-red-200 dark:border-red-800'
                };
            case 'notFound':
                return {
                    icon: AlertTriangle,
                    title: 'Datos no encontrados',
                    message: 'Los datos solicitados no están disponibles en este momento.',
                    color: 'text-orange-500',
                    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
                    borderColor: 'border-orange-200 dark:border-orange-800'
                };
            case 'server':
                return {
                    icon: AlertTriangle,
                    title: 'Error del servidor',
                    message: 'Hay un problema temporal con el servidor. Intenta nuevamente en unos minutos.',
                    color: 'text-red-500',
                    bgColor: 'bg-red-50 dark:bg-red-900/20',
                    borderColor: 'border-red-200 dark:border-red-800'
                };
            case 'timeout':
                return {
                    icon: AlertTriangle,
                    title: 'Tiempo de espera agotado',
                    message: 'La solicitud tardó demasiado en responder. Intenta nuevamente.',
                    color: 'text-yellow-500',
                    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
                    borderColor: 'border-yellow-200 dark:border-yellow-800'
                };
            default:
                return {
                    icon: AlertTriangle,
                    title: 'Error inesperado',
                    message: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
                    color: 'text-red-500',
                    bgColor: 'bg-red-50 dark:bg-red-900/20',
                    borderColor: 'border-red-200 dark:border-red-800'
                };
        }
    };

    const config = getErrorConfig();
    const IconComponent = config.icon;

    return (
        <div className={`rounded-lg border p-4 ${config.bgColor} ${config.borderColor} ${className}`}>
            <div className="flex items-start gap-3">
                <IconComponent className={`w-5 h-5 ${config.color} mt-0.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-semibold ${config.color} mb-1`}>
                        {config.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {config.message}
                    </p>

                    {/* Detalles técnicos (colapsables) */}
                    <details className="mb-3">
                        <summary className="text-xs text-slate-500 dark:text-slate-500 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
                            Ver detalles técnicos
                        </summary>
                        <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono text-slate-700 dark:text-slate-300 break-all">
                            {error}
                        </div>
                    </details>

                    {onRetry && (
                        <button
                            onClick={onRetry}
                            disabled={loading}
                            className={`
                                inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md
                                ${config.color} hover:bg-white dark:hover:bg-slate-800
                                border border-current hover:border-current
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-colors duration-200
                            `}
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            {loading ? 'Reintentando...' : 'Reintentar'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

interface ConnectionStatusProps {
    isOnline: boolean;
    className?: string;
}

export function ConnectionStatus({ isOnline, className = "" }: ConnectionStatusProps) {
    return (
        <div className={`flex items-center gap-2 text-sm ${className}`}>
            {isOnline ? (
                <>
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 dark:text-green-400">Conectado</span>
                </>
            ) : (
                <>
                    <WifiOff className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 dark:text-red-400">Sin conexión</span>
                </>
            )}
        </div>
    );
}

// Hook para detectar el estado de conexión
export function useOnlineStatus() {
    const [isOnline, setIsOnline] = React.useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );

    React.useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}