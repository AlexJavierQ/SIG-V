"use client";

import React, { useState } from 'react';
import { HelpCircle, X, Database, Filter, Calendar, MapPin, Smartphone, Info } from 'lucide-react';
import { AVAILABLE_TABLES, DIAS_SEMANA } from '@/lib/api-service';

interface EndpointGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function EndpointGuide({ isOpen, onClose }: EndpointGuideProps) {
    const [activeTab, setActiveTab] = useState<'endpoints' | 'filters' | 'examples'>('endpoints');

    if (!isOpen) return null;

    const endpoints = [
        {
            name: 'Marketing',
            table: AVAILABLE_TABLES.MARKETING,
            description: 'Datos de campañas, usuarios activos, conversiones y métricas de adquisición',
            fields: ['usuarios_activos', 'nuevos_usuarios', 'campanas', 'ctr', 'conversion', 'costo_adq', 'valor_vida', 'eficiencia']
        },
        {
            name: 'Finanzas',
            table: AVAILABLE_TABLES.FINANZAS,
            description: 'Información financiera, ingresos, transacciones y análisis de rentabilidad',
            fields: ['ingresos_totales', 'transacciones', 'ticket_promedio', 'comisiones', 'costos', 'margen', 'roi']
        },
        {
            name: 'Operaciones',
            table: AVAILABLE_TABLES.OPERATIVOS,
            description: 'Métricas operacionales, procesos, eficiencia y calidad de servicio',
            fields: ['operaciones', 'completadas', 'canceladas', 'tiempo_promedio', 'recursos', 'eficiencia', 'satisfaccion']
        },
        {
            name: 'Ventas',
            table: AVAILABLE_TABLES.VENTAS,
            description: 'Datos de ventas, productos, conversiones y rendimiento comercial',
            fields: ['ventas_totales', 'unidades', 'precio_promedio', 'descuentos', 'productos', 'conversion', 'abandono']
        }
    ];

    const filterTypes = [
        {
            name: 'fecha',
            type: 'string',
            description: 'Fecha exacta en formato yyyy-mm-dd',
            example: '2024-08-05',
            priority: 'high'
        },
        {
            name: 'anio',
            type: 'number',
            description: 'Año (4 dígitos)',
            example: '2024',
            priority: 'medium'
        },
        {
            name: 'mes',
            type: 'number',
            description: 'Mes (1 a 12)',
            example: '7',
            priority: 'medium'
        },
        {
            name: 'dia_semana',
            type: 'string',
            description: 'Día de la semana en español (acepta tildes)',
            example: 'miércoles',
            priority: 'low'
        },
        {
            name: 'pais',
            type: 'string',
            description: 'Nombre del país',
            example: 'Ecuador',
            priority: 'medium'
        },
        {
            name: 'ciudad',
            type: 'string',
            description: 'Nombre de la ciudad',
            example: 'Loja',
            priority: 'medium'
        },
        {
            name: 'aplicativo',
            type: 'string',
            description: 'Nombre del aplicativo',
            example: 'Clipp',
            priority: 'low'
        }
    ];

    const examples = [
        {
            title: 'Solo tabla (sin filtros)',
            url: 'http://localhost:8000/datos?tabla=marketing',
            description: 'Obtiene todos los datos de marketing disponibles'
        },
        {
            title: 'Tabla + fecha exacta',
            url: 'http://localhost:8000/datos?tabla=finanzas&fecha=2024-08-05',
            description: 'Datos financieros de una fecha específica'
        },
        {
            title: 'Tabla + año + mes',
            url: 'http://localhost:8000/datos?tabla=marketing&anio=2024&mes=7',
            description: 'Datos de marketing de julio 2024'
        },
        {
            title: 'Filtros combinados',
            url: 'http://localhost:8000/datos?tabla=finanzas&anio=2023&mes=12&pais=Chile',
            description: 'Datos financieros de Chile en diciembre 2023'
        },
        {
            title: 'Con día de semana',
            url: 'http://localhost:8000/datos?tabla=df_operativos_prueba&dia=viernes',
            description: 'Datos operativos de todos los viernes'
        },
        {
            title: 'Filtro completo',
            url: 'http://localhost:8000/datos?tabla=df_ventas_prueba&anio=2023&dia=lunes&ciudad=Guayaquil&aplicativo=AppX',
            description: 'Datos de ventas muy específicos'
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-600">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <HelpCircle className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Guía de Endpoints</h2>
                            <p className="text-slate-400 text-sm">Documentación de la API de datos</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-600">
                    {[
                        { id: 'endpoints', label: 'Endpoints', icon: Database },
                        { id: 'filters', label: 'Filtros', icon: Filter },
                        { id: 'examples', label: 'Ejemplos', icon: Info }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                                    : 'text-slate-400 hover:text-slate-300'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {activeTab === 'endpoints' && (
                        <div className="space-y-6">
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Info className="w-4 h-4 text-blue-400" />
                                    <span className="text-blue-400 font-medium">Endpoint Base</span>
                                </div>
                                <code className="text-slate-300 bg-slate-700 px-3 py-1 rounded text-sm">
                                    http://localhost:8000/datos?tabla=&lt;nombre_tabla&gt;
                                </code>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {endpoints.map((endpoint, index) => (
                                    <div key={index} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Database className="w-4 h-4 text-emerald-400" />
                                            <h3 className="text-lg font-semibold text-white">{endpoint.name}</h3>
                                        </div>
                                        <p className="text-slate-300 text-sm mb-3">{endpoint.description}</p>
                                        <div className="mb-3">
                                            <span className="text-slate-400 text-xs">Tabla:</span>
                                            <code className="ml-2 text-emerald-400 bg-slate-800 px-2 py-1 rounded text-xs">
                                                {endpoint.table}
                                            </code>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-xs">Campos disponibles:</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {endpoint.fields.slice(0, 4).map((field, i) => (
                                                    <span key={i} className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">
                                                        {field}
                                                    </span>
                                                ))}
                                                {endpoint.fields.length > 4 && (
                                                    <span className="text-xs text-slate-400">
                                                        +{endpoint.fields.length - 4} más
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'filters' && (
                        <div className="space-y-6">
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Info className="w-4 h-4 text-yellow-400" />
                                    <span className="text-yellow-400 font-medium">Reglas Importantes</span>
                                </div>
                                <ul className="text-slate-300 text-sm space-y-1">
                                    <li>• El parámetro <code className="bg-slate-700 px-1 rounded">tabla</code> es obligatorio</li>
                                    <li>• Si <code className="bg-slate-700 px-1 rounded">fecha</code> está presente, ignora filtros por año, mes y día</li>
                                    <li>• Los filtros se pueden combinar libremente</li>
                                    <li>• El filtro <code className="bg-slate-700 px-1 rounded">dia</code> acepta valores en español</li>
                                </ul>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {filterTypes.map((filter, index) => (
                                    <div key={index} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {filter.name === 'fecha' && <Calendar className="w-4 h-4 text-blue-400" />}
                                                {(filter.name === 'pais' || filter.name === 'ciudad') && <MapPin className="w-4 h-4 text-green-400" />}
                                                {filter.name === 'aplicativo' && <Smartphone className="w-4 h-4 text-purple-400" />}
                                                {!['fecha', 'pais', 'ciudad', 'aplicativo'].includes(filter.name) && <Filter className="w-4 h-4 text-orange-400" />}
                                                <h3 className="text-white font-medium">{filter.name}</h3>
                                                <span className={`px-2 py-1 rounded text-xs ${filter.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                                        filter.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-green-500/20 text-green-400'
                                                    }`}>
                                                    {filter.priority}
                                                </span>
                                            </div>
                                            <span className="text-slate-400 text-sm">{filter.type}</span>
                                        </div>
                                        <p className="text-slate-300 text-sm mb-2">{filter.description}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400 text-xs">Ejemplo:</span>
                                            <code className="text-emerald-400 bg-slate-800 px-2 py-1 rounded text-xs">
                                                {filter.example}
                                            </code>
                                        </div>
                                        {filter.name === 'dia_semana' && (
                                            <div className="mt-2">
                                                <span className="text-slate-400 text-xs">Valores válidos:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {DIAS_SEMANA.slice(0, 7).map((dia, i) => (
                                                        <span key={i} className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">
                                                            {dia}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'examples' && (
                        <div className="space-y-4">
                            {examples.map((example, index) => (
                                <div key={index} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                                    <h3 className="text-white font-medium mb-2">{example.title}</h3>
                                    <p className="text-slate-300 text-sm mb-3">{example.description}</p>
                                    <div className="bg-slate-800 rounded-lg p-3">
                                        <code className="text-emerald-400 text-sm break-all">
                                            {example.url}
                                        </code>
                                    </div>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(example.url)}
                                        className="mt-2 text-blue-400 hover:text-blue-300 text-xs transition-colors"
                                    >
                                        Copiar URL
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-600 p-4 bg-slate-700/30">
                    <div className="flex items-center justify-between text-sm">
                        <div className="text-slate-400">
                            API Base: <code className="text-slate-300">http://localhost:8000</code>
                        </div>
                        <div className="text-slate-400">
                            Documentación actualizada
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}