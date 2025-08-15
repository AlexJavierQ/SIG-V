"use client";

import React from 'react';
import { ErrorDisplay, useOnlineStatus } from './ErrorBoundary';
import ApiDebugPanel from './ApiDebugPanel';
import { useApiData } from '@/hooks/useApiData';

interface DataContainerProps {
    tabla: string;
    children: (data: any[]) => React.ReactNode;
    fallback?: React.ReactNode;
    showDebugPanel?: boolean;
    className?: string;
}

export default function DataContainer({
    tabla,
    children,
    fallback,
    showDebugPanel = false,
    className = ""
}: DataContainerProps) {
    const { data, loading, error, refetch, buildCurrentUrl, lastUpdated, isFromCache } = useApiData({ tabla });
    const isOnline = useOnlineStatus();

    // Mostrar loading state
    if (loading && !data) {
        return (
            <div className={`flex items-center justify-center p-8 ${className}`}>
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-600 dark:text-slate-400">Cargando datos...</span>
                </div>
            </div>
        );
    }

    // Mostrar error state
    if (error) {
        return (
            <div className={className}>
                <ErrorDisplay
                    error={error}
                    onRetry={refetch}
                    loading={loading}
                />
                {showDebugPanel && (
                    <ApiDebugPanel
                        url={buildCurrentUrl()}
                        data={data}
                        loading={loading}
                        error={error}
                        onRefetch={refetch}
                        lastUpdated={lastUpdated}
                        isFromCache={isFromCache}
                    />
                )}
            </div>
        );
    }

    // Mostrar fallback si no hay datos
    if (!data || data.length === 0) {
        return (
            <div className={className}>
                {fallback || (
                    <div className="text-center p-8 text-slate-500 dark:text-slate-400">
                        <p>No hay datos disponibles</p>
                        <button
                            onClick={refetch}
                            className="mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                        >
                            Reintentar
                        </button>
                    </div>
                )}
                {showDebugPanel && (
                    <ApiDebugPanel
                        url={buildCurrentUrl()}
                        data={data}
                        loading={loading}
                        error={error}
                        onRefetch={refetch}
                        lastUpdated={lastUpdated}
                        isFromCache={isFromCache}
                    />
                )}
            </div>
        );
    }

    // Renderizar datos exitosamente
    return (
        <div className={className}>
            {/* Indicador de conexión si está offline */}
            {!isOnline && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        Sin conexión - Mostrando datos guardados
                    </div>
                </div>
            )}

            {/* Indicador de datos del caché */}
            {isFromCache && isOnline && (
                <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-sm text-blue-700 dark:text-blue-300">
                    Datos del caché - Última actualización: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString('es-ES') : 'Desconocida'}
                </div>
            )}

            {children(data)}

            {showDebugPanel && (
                <ApiDebugPanel
                    url={buildCurrentUrl()}
                    data={data}
                    loading={loading}
                    error={error}
                    onRefetch={refetch}
                    lastUpdated={lastUpdated}
                    isFromCache={isFromCache}
                />
            )}
        </div>
    );
}

// Hook personalizado para usar datos con manejo de errores integrado
export function useDataWithErrorHandling(tabla: string) {
    const apiData = useApiData({ tabla });
    const isOnline = useOnlineStatus();

    return {
        ...apiData,
        isOnline,
        hasData: apiData.data && apiData.data.length > 0,
        isEmpty: !apiData.loading && (!apiData.data || apiData.data.length === 0),
        isStale: apiData.isFromCache && !isOnline
    };
}