"use client";

import React, { useState } from 'react';
import { Code, Eye, EyeOff, Copy, ExternalLink } from 'lucide-react';

interface ApiDebugPanelProps {
    url: string;
    data: any;
    loading: boolean;
    error: string | null;
    onRefetch: () => void;
    lastUpdated?: number | null;
    isFromCache?: boolean;
}

export default function ApiDebugPanel({
    url,
    data,
    loading,
    error,
    onRefetch,
    lastUpdated,
    isFromCache = false
}: ApiDebugPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showRawData, setShowRawData] = useState(false);

    const copyUrl = () => {
        navigator.clipboard.writeText(url);
    };

    const openInNewTab = () => {
        window.open(url, '_blank');
    };

    if (!isExpanded) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setIsExpanded(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    title="Mostrar panel de depuración de API"
                >
                    <Code className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        API Debug Panel
                    </h3>
                </div>
                <button
                    onClick={() => setIsExpanded(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded"
                >
                    <EyeOff className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                {/* URL Section */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            Endpoint URL
                        </label>
                        <div className="flex gap-1">
                            <button
                                onClick={copyUrl}
                                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded"
                                title="Copiar URL"
                            >
                                <Copy className="w-3 h-3" />
                            </button>
                            <button
                                onClick={openInNewTab}
                                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded"
                                title="Abrir en nueva pestaña"
                            >
                                <ExternalLink className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-md p-2 text-xs font-mono text-slate-800 dark:text-slate-200 break-all">
                        {url}
                    </div>
                </div>

                {/* Status Section */}
                <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                        Estado
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' :
                            error ? 'bg-red-500' :
                                'bg-green-500'
                            }`} />
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                            {loading ? 'Cargando...' : error ? 'Error' : 'Éxito'}
                        </span>
                        {isFromCache && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                                Caché
                            </span>
                        )}
                        <button
                            onClick={onRefetch}
                            disabled={loading}
                            className="ml-auto px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded transition-colors"
                        >
                            Refrescar
                        </button>
                    </div>
                    {lastUpdated && (
                        <div className="text-xs text-slate-500 dark:text-slate-500">
                            Última actualización: {new Date(lastUpdated).toLocaleTimeString('es-ES')}
                        </div>
                    )}
                </div>

                {/* Error Section */}
                {error && (
                    <div>
                        <label className="text-xs font-medium text-red-600 dark:text-red-400 mb-2 block">
                            Error
                        </label>
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-2 text-xs text-red-800 dark:text-red-200">
                            {error}
                        </div>
                    </div>
                )}

                {/* Data Section */}
                {data && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Datos Recibidos
                            </label>
                            <button
                                onClick={() => setShowRawData(!showRawData)}
                                className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                            >
                                {showRawData ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                {showRawData ? 'Ocultar' : 'Ver Raw'}
                            </button>
                        </div>

                        {showRawData ? (
                            <div className="bg-slate-100 dark:bg-slate-700 rounded-md p-2 text-xs font-mono text-slate-800 dark:text-slate-200 max-h-40 overflow-y-auto">
                                <pre>{JSON.stringify(data, null, 2)}</pre>
                            </div>
                        ) : (
                            <div className="bg-slate-100 dark:bg-slate-700 rounded-md p-2 text-xs text-slate-800 dark:text-slate-200">
                                <div className="flex justify-between">
                                    <span>Registros:</span>
                                    <span className="font-semibold">
                                        {Array.isArray(data) ? data.length : typeof data === 'object' ? Object.keys(data).length : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tipo:</span>
                                    <span className="font-semibold">{Array.isArray(data) ? 'Array' : typeof data}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}