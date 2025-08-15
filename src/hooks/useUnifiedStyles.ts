// src/hooks/useUnifiedStyles.ts
"use client";

import { useTheme } from '@/contexts/ThemeProvider';

/**
 * Hook para obtener clases CSS unificadas basadas en el tema actual
 */
export function useUnifiedStyles() {
    const { isDarkMode } = useTheme();

    const getCardClasses = (variant: 'default' | 'service' | 'interactive' = 'default') => {
        const baseClasses = 'transition-all duration-300';

        switch (variant) {
            case 'service':
                return `service-card-unified ${baseClasses}`;
            case 'interactive':
                return `unified-card hover-unified ${baseClasses} hover:scale-[1.02]`;
            default:
                return `unified-card hover-unified ${baseClasses}`;
        }
    };

    const getSectionClasses = (backgroundType?: 'welcome' | 'filters' | 'metrics' | 'services' | 'analytics') => {
        const baseClasses = 'section-container';

        if (backgroundType) {
            return `section-bg-${backgroundType} ${baseClasses}`;
        }

        return `${baseClasses} bg-white dark:bg-slate-800 border-unified`;
    };

    const getTextClasses = (variant: 'primary' | 'secondary' | 'tertiary' = 'primary') => {
        return `text-${variant}-unified`;
    };

    const getBorderClasses = () => {
        return 'border-unified';
    };

    const getHoverClasses = () => {
        return 'hover-unified';
    };

    // Utilidades para colores dinámicos
    const getStatusColor = (status: 'success' | 'warning' | 'error' | 'info') => {
        const colors = {
            success: isDarkMode ? 'text-green-400' : 'text-green-600',
            warning: isDarkMode ? 'text-yellow-400' : 'text-yellow-600',
            error: isDarkMode ? 'text-red-400' : 'text-red-600',
            info: isDarkMode ? 'text-blue-400' : 'text-blue-600',
        };

        return colors[status];
    };

    const getGradientClasses = (type: 'primary' | 'secondary' | 'accent' = 'primary') => {
        const gradients = {
            primary: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:from-blue-400/20 dark:to-blue-500/10',
            secondary: 'bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700',
            accent: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 dark:from-emerald-400/20 dark:to-emerald-500/10',
        };

        return gradients[type];
    };

    return {
        // Clases principales
        getCardClasses,
        getSectionClasses,
        getTextClasses,
        getBorderClasses,
        getHoverClasses,

        // Utilidades
        getStatusColor,
        getGradientClasses,

        // Estado del tema
        isDarkMode,

        // Clases comunes pre-construidas
        classes: {
            card: getCardClasses(),
            serviceCard: getCardClasses('service'),
            interactiveCard: getCardClasses('interactive'),
            section: getSectionClasses(),
            textPrimary: getTextClasses('primary'),
            textSecondary: getTextClasses('secondary'),
            textTertiary: getTextClasses('tertiary'),
            border: getBorderClasses(),
            hover: getHoverClasses(),
        }
    };
}

/**
 * Hook simplificado para casos de uso comunes
 */
export function useCardStyles(variant: 'default' | 'service' | 'interactive' = 'default') {
    const { getCardClasses } = useUnifiedStyles();
    return getCardClasses(variant);
}

/**
 * Hook para estilos de sección
 */
export function useSectionStyles(backgroundType?: 'welcome' | 'filters' | 'metrics' | 'services' | 'analytics') {
    const { getSectionClasses } = useUnifiedStyles();
    return getSectionClasses(backgroundType);
}

/**
 * Hook para colores de estado
 */
export function useStatusColors() {
    const { getStatusColor } = useUnifiedStyles();

    return {
        success: getStatusColor('success'),
        warning: getStatusColor('warning'),
        error: getStatusColor('error'),
        info: getStatusColor('info'),
    };
}