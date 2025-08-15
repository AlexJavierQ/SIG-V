"use client";

import React, { useState } from 'react';
import { CheckCircle, AlertCircle, XCircle, Clock, Zap, Database, X, Activity, TrendingUp, Target } from 'lucide-react';

interface ServiceStatus {
    name: string;
    status: 'online' | 'warning' | 'offline' | 'checking';
    responseTime?: number;
    lastCheck: Date;
    endpoint?: string;
    records?: number;
}

interface FloatingSystemStatusProps {
    endpointData?: {
        marketing: { data: Record<string, unknown>[] | null; error: string | null; loading: boolean; lastFetch: Date | null };
        finanzas: { data: Record<string, unknown>[] | null; error: string | null; loading: boolean; lastFetch: Date | null };
        operativos: { data: Record<string, unknown>[] | null; error: string | null; loading: boolean; lastFetch: Date | null };
        ventas: { data: Record<string, unknown>[] | null; error: string | null; loading: boolean; lastFetch: Date | null };
    };
    realTimeData?: {
        marketing: unknown[] | null;
        finanzas: unknown[] | null;
        operativos: unknown[] | null;
        ventas: unknown[] | null;
    };
    onCheckEndpoints?: () => void;
}

export default function FloatingSystemStatus({ endpointData, realTimeData, onCheckEndpoints }: FloatingSystemStatusProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [services, setServices] = useState<ServiceStatus[]>([
        {
            name: 'API Principal',
            status: 'offline',
            endpoint: 'http://localhost:8000',
            lastCheck: new Date()
        },
        {
            name: 'Marketing',
            status: 'offline',
            endpoint: `http://localhost:8000/datos?tabla=marketing`,
            lastCheck: new Date()
        },
        {
            name: 'Finanzas',
            status: 'offline',
            endpoint: `http://localhost:8000/datos?tabla=finanzas`,
            lastCheck: new Date()
        },
        {
            name: 'Operaciones',
            status: 'offline',
            endpoint: `http://localhost:8000/datos?tabla=df_operativos_prueba`,
            lastCheck: new Date()
        },
        {
            name: 'Ventas',
            status: 'offline',
            endpoint: `http://localhost:8000/datos?tabla=df_ventas_prueba`,
            lastCheck: new Date()
        }
    ]);

    const checkServiceStatus = async (service: ServiceStatus): Promise<ServiceStatus> => {
        const startTime = Date.now();

        try {
            console.log(`Consultando endpoint: ${service.endpoint}`);

            const response = await fetch(service.endpoint!, {
                method: 'GET',
                signal: AbortSignal.timeout(5000) // 5 second timeout
            });

            const responseTime = Date.now() - startTime;
            let records = 0;

            console.log(`Respuesta de ${service.name}: Status ${response.status}, OK: ${response.ok}`);

            if (response.ok && service.name !== 'API Principal') {
                try {
                    const data = await response.json();
                    records = Array.isArray(data) ? data.length : 0;
                    console.log(`${service.name}: ${records} registros encontrados`);
                } catch (error) {
                    console.error(`Error parsing JSON para ${service.name}:`, error);
                }
            }

            return {
                ...service,
                status: responseTime > 2000 ? 'warning' : 'online',
                responseTime,
                records,
                lastCheck: new Date()
            };
        } catch (error) {
            console.error(`Error consultando ${service.name}:`, error);
            return {
                ...service,
                status: 'offline',
                responseTime: Date.now() - startTime,
                records: 0,
                lastCheck: new Date()
            };
        }
    };

    const checkAllServices = React.useCallback(async () => {
        setIsChecking(true);

        // Actualizar estado a "checking" para todos los servicios
        setServices(prevServices =>
            prevServices.map(service => ({ ...service, status: 'checking' as const }))
        );

        try {
            const updatedServices = await Promise.all(
                services.map(service => checkServiceStatus(service))
            );
            setServices(updatedServices);
        } catch (error) {
            console.error('Error checking services:', error);
        } finally {
            setIsChecking(false);
        }
    }, [services]);

    // Función para manejar el clic en el botón flotante
    const handleFloatingButtonClick = async () => {
        if (onCheckEndpoints) {
            // Si hay un handler externo, usarlo (viene del hook useEndpointData)
            await onCheckEndpoints();
        } else {
            // Fallback a consultas directas si no hay hook disponible
            await checkAllServices();
        }
        setIsOpen(true);
    };

    const getStatusIcon = (status: ServiceStatus['status']) => {
        switch (status) {
            case 'online':
                return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'warning':
                return <AlertCircle className="w-4 h-4 text-yellow-400" />;
            case 'offline':
                return <XCircle className="w-4 h-4 text-red-400" />;
            case 'checking':
                return <Clock className="w-4 h-4 text-blue-400 animate-spin" />;
        }
    };

    const getStatusColor = (status: ServiceStatus['status']) => {
        switch (status) {
            case 'online':
                return 'border-green-500/30 bg-green-500/10';
            case 'warning':
                return 'border-yellow-500/30 bg-yellow-500/10';
            case 'offline':
                return 'border-red-500/30 bg-red-500/10';
            case 'checking':
                return 'border-blue-500/30 bg-blue-500/10';
        }
    };

    const getStatusText = (status: ServiceStatus['status']) => {
        switch (status) {
            case 'online':
                return 'Operativo';
            case 'warning':
                return 'Lento';
            case 'offline':
                return 'Sin conexión';
            case 'checking':
                return 'Verificando...';
        }
    };

    // Calcular métricas basadas en datos reales
    const totalRecords = endpointData ?
        (endpointData.marketing.data?.length || 0) +
        (endpointData.finanzas.data?.length || 0) +
        (endpointData.operativos.data?.length || 0) +
        (endpointData.ventas.data?.length || 0) : 0;

    // Determinar estado basado en datos reales
    const getEndpointStatus = (endpoint: 'marketing' | 'finanzas' | 'operativos' | 'ventas'): ServiceStatus['status'] => {
        if (!endpointData) return 'offline';
        const data = endpointData[endpoint];
        if (data.loading) return 'checking';
        if (data.error) return 'offline';
        if (data.data !== null) return 'online';
        return 'offline';
    };

    // Actualizar servicios basado en datos reales
    const updatedServices = endpointData ? [
        {
            name: 'API Principal',
            status: (endpointData.marketing.data || endpointData.finanzas.data || endpointData.operativos.data || endpointData.ventas.data ? 'online' : 'offline') as ServiceStatus['status'],
            endpoint: 'http://localhost:8000',
            lastCheck: new Date(),
            responseTime: 0
        },
        {
            name: 'Marketing',
            status: getEndpointStatus('marketing'),
            endpoint: `http://localhost:8000/datos?tabla=marketing`,
            lastCheck: endpointData.marketing.lastFetch || new Date(),
            records: endpointData.marketing.data?.length || 0
        },
        {
            name: 'Finanzas',
            status: getEndpointStatus('finanzas'),
            endpoint: `http://localhost:8000/datos?tabla=finanzas`,
            lastCheck: endpointData.finanzas.lastFetch || new Date(),
            records: endpointData.finanzas.data?.length || 0
        },
        {
            name: 'Operaciones',
            status: getEndpointStatus('operativos'),
            endpoint: `http://localhost:8000/datos?tabla=df_operativos_prueba`,
            lastCheck: endpointData.operativos.lastFetch || new Date(),
            records: endpointData.operativos.data?.length || 0
        },
        {
            name: 'Ventas',
            status: getEndpointStatus('ventas'),
            endpoint: `http://localhost:8000/datos?tabla=df_ventas_prueba`,
            lastCheck: endpointData.ventas.lastFetch || new Date(),
            records: endpointData.ventas.data?.length || 0
        }
    ] : services;

    const overallStatus = updatedServices.every(s => s.status === 'online') ? 'online' :
        updatedServices.some(s => s.status === 'offline') ? 'offline' : 'warning';

    const activeEndpoints = updatedServices.filter(s => s.status === 'online').length;
    const avgResponseTime = updatedServices.reduce((sum, s) => sum + (s.responseTime || 0), 0) / updatedServices.length;

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={handleFloatingButtonClick}
                disabled={isChecking}
                className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${isChecking ? 'bg-blue-500 cursor-not-allowed' :
                    overallStatus === 'online' ? 'bg-green-500 hover:bg-green-600' :
                        overallStatus === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' :
                            'bg-red-500 hover:bg-red-600'
                    }`}
                title={isChecking ? "Consultando endpoints..." : "Consultar estado del sistema"}
            >
                <div className="relative">
                    {isChecking ? <Clock className="w-6 h-6 text-white animate-spin" /> : getStatusIcon(overallStatus)}
                    {!isChecking && (
                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse ${overallStatus === 'online' ? 'bg-green-300' :
                            overallStatus === 'warning' ? 'bg-yellow-300' :
                                'bg-red-300'
                            }`}></div>
                    )}
                </div>
            </button>

            {/* Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${overallStatus === 'online' ? 'bg-green-500/20' :
                                    overallStatus === 'warning' ? 'bg-yellow-500/20' :
                                        'bg-red-500/20'
                                    }`}>
                                    <Database className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-card-foreground">Estado del Sistema</h2>
                                    <p className="text-muted-foreground text-sm">Verificación bajo demanda</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {/* Métricas Generales */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-muted/50 rounded-lg p-4 text-center border border-border">
                                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{activeEndpoints}/5</div>
                                    <div className="text-muted-foreground text-sm">Endpoints Activos</div>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-4 text-center border border-border">
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalRecords.toLocaleString()}</div>
                                    <div className="text-muted-foreground text-sm">Registros Totales</div>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-4 text-center border border-border">
                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{Math.round(avgResponseTime)}ms</div>
                                    <div className="text-muted-foreground text-sm">Tiempo Promedio</div>
                                </div>
                            </div>

                            {/* Estado de Servicios */}
                            <div className="space-y-3 mb-6">
                                <h3 className="text-lg font-semibold text-card-foreground mb-3">Estado de Endpoints</h3>
                                {updatedServices.map((service, index) => (
                                    <div key={index} className={`border rounded-lg p-4 transition-all duration-300 ${getStatusColor(service.status)} bg-card`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {getStatusIcon(service.status)}
                                                <div>
                                                    <h4 className="text-card-foreground font-medium">{service.name}</h4>
                                                    <p className="text-muted-foreground text-xs">
                                                        {service.lastCheck ?
                                                            `Última consulta: ${service.lastCheck.toLocaleTimeString()}` :
                                                            'Sin consultas realizadas'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-sm font-medium ${service.status === 'online' ? 'text-green-600 dark:text-green-400' :
                                                    service.status === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                                                        service.status === 'offline' ? 'text-red-600 dark:text-red-400' :
                                                            'text-blue-600 dark:text-blue-400'
                                                    }`}>
                                                    {getStatusText(service.status)}
                                                </div>
                                                <div className="text-muted-foreground text-xs">
                                                    {service.records !== undefined && service.records >= 0 &&
                                                        `${service.records.toLocaleString()} registros`
                                                    }
                                                    {endpointData && service.name !== 'API Principal' && (
                                                        <>
                                                            {(() => {
                                                                const serviceName = service.name.toLowerCase();
                                                                let key: 'marketing' | 'finanzas' | 'operativos' | 'ventas';

                                                                if (serviceName === 'operaciones') {
                                                                    key = 'operativos';
                                                                } else if (serviceName === 'marketing') {
                                                                    key = 'marketing';
                                                                } else if (serviceName === 'finanzas') {
                                                                    key = 'finanzas';
                                                                } else {
                                                                    key = 'ventas';
                                                                }

                                                                const data = endpointData[key];
                                                                return data?.error && (
                                                                    <div className="text-red-600 dark:text-red-400 text-xs mt-1">
                                                                        Error: {data.error}
                                                                    </div>
                                                                );
                                                            })()}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Métricas de Datos */}
                            {endpointData && (
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-card-foreground mb-3">Datos por Endpoint</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                <span className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">Marketing</span>
                                            </div>
                                            <div className="text-lg font-bold text-card-foreground">
                                                {endpointData.marketing.data?.length || 0} registros
                                            </div>
                                            {endpointData.marketing.loading && (
                                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Cargando...</div>
                                            )}
                                        </div>
                                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">Finanzas</span>
                                            </div>
                                            <div className="text-lg font-bold text-card-foreground">
                                                {endpointData.finanzas.data?.length || 0} registros
                                            </div>
                                            {endpointData.finanzas.loading && (
                                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Cargando...</div>
                                            )}
                                        </div>
                                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                <span className="text-purple-600 dark:text-purple-400 font-medium text-sm">Operaciones</span>
                                            </div>
                                            <div className="text-lg font-bold text-card-foreground">
                                                {endpointData.operativos.data?.length || 0} registros
                                            </div>
                                            {endpointData.operativos.loading && (
                                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Cargando...</div>
                                            )}
                                        </div>
                                        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Database className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                                <span className="text-orange-600 dark:text-orange-400 font-medium text-sm">Ventas</span>
                                            </div>
                                            <div className="text-lg font-bold text-card-foreground">
                                                {endpointData.ventas.data?.length || 0} registros
                                            </div>
                                            {endpointData.ventas.loading && (
                                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Cargando...</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-border p-4 bg-muted/30">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <Database className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                        {services.some(s => s.status === 'checking') || isChecking
                                            ? 'Consultando endpoints...'
                                            : 'Consultas bajo demanda'
                                        }
                                    </span>
                                </div>
                                <button
                                    onClick={onCheckEndpoints || checkAllServices}
                                    disabled={isChecking || (endpointData && Object.values(endpointData).some(d => d.loading))}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isChecking || (endpointData && Object.values(endpointData).some(d => d.loading))
                                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                >
                                    <Zap className={`w-4 h-4 ${isChecking || (endpointData && Object.values(endpointData).some(d => d.loading)) ? 'animate-spin' : ''}`} />
                                    {isChecking || (endpointData && Object.values(endpointData).some(d => d.loading)) ? 'Consultando...' : 'Volver a consultar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}