// src/components/dashboard/WelcomeSection.tsx

import { BarChart3, Clock, Zap } from "lucide-react";

interface WelcomeSectionProps {
    serviciosActivos?: number;
    isLoading?: boolean;
}

export default function WelcomeSection({ serviciosActivos = 2, isLoading = false }: WelcomeSectionProps) {
    return (
        <div className="section-bg-welcome backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-xl p-8 shadow-lg">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Bienvenido al Sistema de Análisis
                    </h2>
                    <p className="text-slate-700 dark:text-slate-300 text-lg">
                        Datos precisos para decisiones estratégicas.
                    </p>
                    <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-slate-600 dark:text-slate-400 text-sm">Sistema operativo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            <span className="text-slate-600 dark:text-slate-400 text-sm">Actualización continua</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                            <span className="text-slate-600 dark:text-slate-400 text-sm">
                                {isLoading ? 'Cargando...' : `${serviciosActivos} servicios activos`}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <BarChart3 className="w-12 h-12 text-white" />
                    </div>
                </div>
            </div>
        </div>
    )
}