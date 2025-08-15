"use client";

import React, { useState, useEffect } from 'react';
import { Activity, Zap } from 'lucide-react';

export function PerformanceMonitor() {
    const [metrics, setMetrics] = useState({
        loadTime: 0,
        renderTime: 0,
        memoryUsage: 0
    });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Simulate performance monitoring
        const startTime = performance.now();

        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (entry.entryType === 'navigation') {
                    setMetrics(prev => ({
                        ...prev,
                        loadTime: entry.loadEventEnd - entry.loadEventStart
                    }));
                }
            });
        });

        observer.observe({ entryTypes: ['navigation'] });

        // Simulate render time calculation
        setTimeout(() => {
            const endTime = performance.now();
            setMetrics(prev => ({
                ...prev,
                renderTime: endTime - startTime,
                memoryUsage: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0
            }));
        }, 100);

        return () => observer.disconnect();
    }, []);

    // Only show in development or when performance is poor
    const shouldShow = process.env.NODE_ENV === 'development' || metrics.renderTime > 1000;

    if (!shouldShow && !isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 z-50">
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="p-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg shadow-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                title="Monitor de Rendimiento"
            >
                <Activity className="w-4 h-4" />
            </button>

            {isVisible && (
                <div className="absolute bottom-12 left-0 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-4 min-w-[200px] animate-slideUp">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                            Performance
                        </h4>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Carga:</span>
                            <span className="font-medium text-slate-900 dark:text-white">
                                {metrics.loadTime.toFixed(0)}ms
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Render:</span>
                            <span className="font-medium text-slate-900 dark:text-white">
                                {metrics.renderTime.toFixed(0)}ms
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Memoria:</span>
                            <span className="font-medium text-slate-900 dark:text-white">
                                {metrics.memoryUsage.toFixed(1)}MB
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}