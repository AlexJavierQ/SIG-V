import React, { Suspense, lazy } from 'react';

// Lazy load del ChartOverlay para reducir el bundle inicial
const ChartOverlay = lazy(() => import('./ChartOverlay'));

interface LazyChartOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

const LoadingSpinner = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg text-slate-300">Cargando análisis detallado...</p>
        </div>
    </div>
);

export const LazyChartOverlay: React.FC<LazyChartOverlayProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    children
}) => {
    if (!isOpen) return null;

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ChartOverlay isOpen={isOpen} onClose={onClose} title={title} subtitle={subtitle}>
                {children}
            </ChartOverlay>
        </Suspense>
    );
};

export default LazyChartOverlay;