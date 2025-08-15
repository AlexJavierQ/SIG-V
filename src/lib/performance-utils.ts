// Performance optimization utilities

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// Memoization utility
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
    const cache = new Map();
    return ((...args: Parameters<T>) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
    }) as T;
}

// Lazy loading utility
export function createLazyComponent<T extends React.ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    fallback?: React.ComponentType
) {
    const LazyComponent = React.lazy(importFn);

    return (props: React.ComponentProps<T>) => (
        <React.Suspense fallback= { fallback?<fallback /> : <div>Loading...</div>
}>
    <LazyComponent { ...props } />
    </React.Suspense>
  );
}

// Performance measurement
export class PerformanceTracker {
    private static instance: PerformanceTracker;
    private metrics: Map<string, number[]> = new Map();

    static getInstance(): PerformanceTracker {
        if (!PerformanceTracker.instance) {
            PerformanceTracker.instance = new PerformanceTracker();
        }
        return PerformanceTracker.instance;
    }

    startMeasure(name: string): void {
        performance.mark(`${name}-start`);
    }

    endMeasure(name: string): number {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);

        const measure = performance.getEntriesByName(name)[0];
        const duration = measure.duration;

        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }
        this.metrics.get(name)!.push(duration);

        // Clean up
        performance.clearMarks(`${name}-start`);
        performance.clearMarks(`${name}-end`);
        performance.clearMeasures(name);

        return duration;
    }

    getAverageTime(name: string): number {
        const times = this.metrics.get(name) || [];
        return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    }

    getAllMetrics(): Record<string, { average: number; count: number }> {
        const result: Record<string, { average: number; count: number }> = {};

        this.metrics.forEach((times, name) => {
            result[name] = {
                average: times.reduce((a, b) => a + b, 0) / times.length,
                count: times.length
            };
        });

        return result;
    }
}

// Virtual scrolling utility
export function calculateVisibleRange(
    scrollTop: number,
    containerHeight: number,
    itemHeight: number,
    totalItems: number,
    overscan: number = 5
): { start: number; end: number } {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(totalItems, start + visibleCount + overscan * 2);

    return { start, end };
}

// Image optimization
export function getOptimizedImageUrl(
    src: string,
    width: number,
    height?: number,
    quality: number = 75
): string {
    // This would integrate with your image optimization service
    // For now, return the original src
    return src;
}

// Bundle size optimization
export function loadChunkOnDemand(chunkName: string): Promise<any> {
    return import(/* webpackChunkName: "[request]" */ `../chunks/${chunkName}`);
}

// Memory management
export function cleanupResources(resources: (() => void)[]): void {
    resources.forEach(cleanup => {
        try {
            cleanup();
        } catch (error) {
            console.warn('Error during cleanup:', error);
        }
    });
}

// React performance utilities
import React from 'react';

export const withPerformanceTracking = <P extends object>(
    Component: React.ComponentType<P>,
    componentName: string
) => {
    return React.memo((props: P) => {
        const tracker = PerformanceTracker.getInstance();

        React.useEffect(() => {
            tracker.startMeasure(`${componentName}-render`);
            return () => {
                tracker.endMeasure(`${componentName}-render`);
            };
        });

        return <Component { ...props } />;
    });
};