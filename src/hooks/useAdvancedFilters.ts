'use client';

import { useFilters } from '@/contexts/FiltersContext';

// Re-export the context hook for backward compatibility
export function useAdvancedFilters() {
    return useFilters();
}