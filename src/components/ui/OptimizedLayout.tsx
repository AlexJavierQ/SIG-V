"use client";

import React, { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';

interface OptimizedLayoutProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    className?: string;
}

export default function OptimizedLayout({
    children,
    fallback,
    className = ''
}: OptimizedLayoutProps) {
    const defaultFallback = (
        <div className="flex items-center justify-center min-h-[200px]">
            <LoadingSpinner size="lg" text="Cargando contenido..." />
        </div>
    );

    return (
        <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 ${className}`}>
            <ErrorBoundary>
                <Suspense fallback={fallback || defaultFallback}>
                    {children}
                </Suspense>
            </ErrorBoundary>
        </div>
    );
}