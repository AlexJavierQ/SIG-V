"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardSectionProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    children: React.ReactNode;
    className?: string;
    backgroundType?: 'welcome' | 'filters' | 'metrics' | 'services' | 'analytics' | 'none';
}

export default function DashboardSection({
    title,
    subtitle,
    icon: Icon,
    children,
    className = "",
    backgroundType = 'none'
}: DashboardSectionProps) {
    const getBackgroundClass = () => {
        switch (backgroundType) {
            case 'welcome':
                return 'section-bg-welcome';
            case 'filters':
                return 'section-bg-filters';
            case 'metrics':
                return 'section-bg-metrics';
            case 'services':
                return 'section-bg-services';
            case 'analytics':
                return 'section-bg-analytics';
            default:
                return '';
        }
    };

    const backgroundClass = getBackgroundClass();
    const sectionClasses = backgroundClass
        ? `${backgroundClass} section-container`
        : 'section-container bg-white dark:bg-slate-800 border-unified';

    return (
        <section className={`space-y-5 ${sectionClasses} ${className}`}>
            {/* Section Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-unified">
                {Icon && (
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl transition-colors duration-200">
                        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                )}
                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-primary-unified">
                        {title}
                    </h2>
                    {subtitle && (
                        <div className="text-sm text-secondary-unified mt-0.5">
                            {subtitle}
                        </div>
                    )}
                </div>
            </div>

            {/* Section Content */}
            <div className="animate-fadeIn">
                {children}
            </div>
        </section>
    );
}