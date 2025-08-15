"use client";

import { useState, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';

export function usePerformanceOptimization() {
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Debounced filter function to prevent excessive API calls
  const debouncedFilter = useMemo(
    () => debounce((filterFn: () => void) => {
      setIsOptimizing(true);
      filterFn();
      setTimeout(() => setIsOptimizing(false), 500);
    }, 300),
    []
  );

  // Memoized data processing
  const memoizeData = useCallback((data: any[], processingFn: (data: any[]) => any[]) => {
    return useMemo(() => processingFn(data), [data]);
  }, []);

  // Virtual scrolling helper
  const getVisibleItems = useCallback((items: any[], startIndex: number, endIndex: number) => {
    return items.slice(startIndex, endIndex);
  }, []);

  // Performance metrics
  const measurePerformance = useCallback((name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
  }, []);

  return {
    isOptimizing,
    debouncedFilter,
    memoizeData,
    getVisibleItems,
    measurePerformance
  };
}