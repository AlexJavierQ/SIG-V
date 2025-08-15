// Design System Configuration
export const designSystem = {
    // Color palette
    colors: {
        primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
        },
        gray: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
        },
        success: {
            500: '#10b981',
            600: '#059669',
        },
        warning: {
            500: '#f59e0b',
            600: '#d97706',
        },
        error: {
            500: '#ef4444',
            600: '#dc2626',
        },
    },

    // Spacing scale
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
    },

    // Border radius
    radius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
    },

    // Typography
    typography: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
    },

    // Shadows
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },

    // Animation durations
    animation: {
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
    },

    // Breakpoints
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },
};

// Component variants - Updated with unified system
export const componentVariants = {
    button: {
        primary: 'btn-primary',
        minimal: 'btn-minimal',
        ghost: 'btn-ghost',
    },
    card: {
        default: 'unified-card',
        service: 'service-card-unified',
        interactive: 'unified-card hover-unified hover:scale-[1.02]',
        modern: 'card-modern', // Legacy support
    },
    section: {
        welcome: 'section-bg-welcome section-container',
        filters: 'section-bg-filters section-container',
        metrics: 'section-bg-metrics section-container',
        services: 'section-bg-services section-container',
        analytics: 'section-bg-analytics section-container',
        default: 'section-container bg-white dark:bg-slate-800 border-unified',
    },
    text: {
        primary: 'text-primary-unified',
        secondary: 'text-secondary-unified',
        tertiary: 'text-tertiary-unified',
    },
    input: {
        default: 'rounded-lg border-unified px-3 py-2 text-sm text-primary-unified bg-white dark:bg-slate-800',
    },
};

// Utility functions
export const getSpacing = (size: keyof typeof designSystem.spacing) => designSystem.spacing[size];
export const getRadius = (size: keyof typeof designSystem.radius) => designSystem.radius[size];
export const getColor = (color: string, shade: number) => {
    const colorObj = designSystem.colors[color as keyof typeof designSystem.colors];
    return colorObj ? colorObj[shade as keyof typeof colorObj] : color;
};

// Unified system utilities
export const getUnifiedClasses = {
    card: (variant: keyof typeof componentVariants.card = 'default') =>
        componentVariants.card[variant],

    section: (type: keyof typeof componentVariants.section = 'default') =>
        componentVariants.section[type],

    text: (variant: keyof typeof componentVariants.text = 'primary') =>
        componentVariants.text[variant],

    button: (variant: keyof typeof componentVariants.button = 'primary') =>
        componentVariants.button[variant],

    input: () => componentVariants.input.default,
};

// Theme-aware color utilities
export const getThemeColor = (isDark: boolean, lightColor: string, darkColor: string) => {
    return isDark ? darkColor : lightColor;
};

// Status color utilities
export const statusColors = {
    success: {
        light: 'text-green-600 bg-green-50 border-green-200',
        dark: 'text-green-400 bg-green-900/20 border-green-800',
    },
    warning: {
        light: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        dark: 'text-yellow-400 bg-yellow-900/20 border-yellow-800',
    },
    error: {
        light: 'text-red-600 bg-red-50 border-red-200',
        dark: 'text-red-400 bg-red-900/20 border-red-800',
    },
    info: {
        light: 'text-blue-600 bg-blue-50 border-blue-200',
        dark: 'text-blue-400 bg-blue-900/20 border-blue-800',
    },
};

export const getStatusClasses = (status: keyof typeof statusColors, isDark: boolean) => {
    return isDark ? statusColors[status].dark : statusColors[status].light;
};