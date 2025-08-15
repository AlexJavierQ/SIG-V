"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Clock, Zap, Database, Wifi } from 'lucide-react';
import { AVAILABLE_TABLES } from '@/lib/api-service';

interface ServiceStatus {
    name: string;
    status: 'online' | 'warning' | 'offline' | 'checking';
    responseTime?: number;
    lastCheck: Date;
    endpoint?: string;
}

export default function SystemStatus() {
    const [services, setServices] = useState<ServiceStatus[]>([
        {
            name: 'API Principal',
            status: 'checking',
            endpoint: 'http://localhost:8000',
            lastCheck: new Date()
        },
        {
            name: 'Endpoint Marketing',
            status: 'checking',
            endpoint: `http://localhost:8000/datos?tabla=${AVAILABLE_TABLES.MARKETING}`,
            lastCheck: new Date()
        },
        {
            name: 'Endpoint Finanzas',
            status: 'checking',
            endpoint: `http://localhost:8000/datos?tabla=${AVAILABLE_TABLES.FINANZAS}`,
            lastCheck: new Date()
        },
        {
            name: 'Endpoint Operaciones',
            status: 'checking',
            endpoint: `http://localhost:8000/datos?tabla=${AVAILABLE_TABLES.OPERATIVOS}`,
            lastCheck: new Date()
        },
        {
            name: 'Endpoint Ventas',
            status: 'checking',
            endpoint: `http://localhost:8000/datos?tabla=${AVAILABLE_TABLES.VENTAS}`,
            lastCheck: new Date()
        }
    ]);

    const checkServiceStatus = async (service: ServiceStatus): Promise<ServiceStatus> => {
        const startTime = Date.now();

        try {
            const response = await fetch(service.endpoint!, {
                method: 'GET',
                signal: AbortSignal.timeout(5000) // 5 second timeout
            });

            const responseTime = Date.now() - startTime;

            if (response.ok) {
                return {
                    ...service,
                    status: responseTime > 2000 ? 'warning' : 'online',
                    responseTime,
                    lastCheck: new Date()
                };
            } else {
                return {
                    ...service,
                    status: 'warning',
                    responseTime,
                    lastCheck: new Date()
                };
            }
        } catch (error) {
            return {
                ...service,
                status: 'offline',
                responseTime: Date.now() - startTime,
                lastCheck: new Date()
            };
        }
    };

    const checkAllServices = async () => {
        const updatedServices = await Promise.all(
            services.map(service => checkServiceStatus(service))
        );
        setServices(updatedServices);
    };

    useEffect(() => {
        // Check immediately
        checkAllServices();

        // Then check every 30 seconds
        const interval = setInterval(checkAllServices, 30000);

        return () => clearInterval(interval);
    }, []);

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

    const overallStatus = services.every(s => s.status === 'online') ? 'online' :
        services.some(s => s.status === 'offline') ? 'offline' : 'warning';

    return (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-600/50 rounded-lg">
                        <Database className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Estado del Sistema</h3>
                        <p className="text-slate-400 text-sm">Monitoreo de servicios en tiempo real</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {getStatusIcon(overallStatus)}
                    <span className={`text-sm font-medium ${overallStatus === 'online' ? 'text-green-400' :
                            overallStatus === 'warning' ? 'text-yellow-400' :
                                'text-red-400'
                        }`}>
                        {getStatusText(overallStatus)}
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                {services.map((service, index) => (
                    <div key={index} className={`border rounded-lg p-4 transition-all duration-300 ${getStatusColor(service.status)}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {getStatusIcon(service.status)}
                                <div>
                                    <h4 className="text-white font-medium">{service.name}</h4>
                                    <p className="text-slate-400 text-xs">
                                        Última verificación: {service.lastCheck.toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`text-sm font-medium ${service.status === 'online' ? 'text-green-400' :
                                        service.status === 'warning' ? 'text-yellow-400' :
                                            service.status === 'offline' ? 'text-red-400' :
                                                'text-blue-400'
                                    }`}>
                                    {getStatusText(service.status)}
                                </div>
                                {service.responseTime && (
                                    <div className="text-slate-400 text-xs">
                                        {service.responseTime}ms
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-600/50">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-400">Próxima verificación en 30s</span>
                    </div>
                    <button
                        onClick={checkAllServices}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <Zap className="w-4 h-4" />
                        Verificar ahora
                    </button>
                </div>
            </div>
        </div>
    );
}