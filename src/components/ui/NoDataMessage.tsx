"use client";

import { AlertCircle, Database, RefreshCw } from "lucide-react";

interface NoDataMessageProps {
    title?: string;
    message?: string;
    showRefresh?: boolean;
    onRefresh?: () => void;
    icon?: "database" | "alert" | "refresh";
}

export default function NoDataMessage({
    title = "No hay datos disponibles",
    message = "No se encontraron datos para mostrar en este momento. Verifique la conexión al endpoint o intente actualizar.",
    showRefresh = true,
    onRefresh,
    icon = "database"
}: NoDataMessageProps) {
    const IconComponent = {
        database: Database,
        alert: AlertCircle,
        refresh: RefreshCw
    }[icon];

    return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <IconComponent className="w-8 h-8 text-slate-400" />
            </div>

            <h3 className="text-lg font-semibold text-slate-200 mb-2">
                {title}
            </h3>

            <p className="text-slate-400 text-sm max-w-md mb-6">
                {message}
            </p>

            {showRefresh && onRefresh && (
                <button
                    onClick={onRefresh}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                    <RefreshCw className="w-4 h-4" />
                    Actualizar datos
                </button>
            )}
        </div>
    );
}