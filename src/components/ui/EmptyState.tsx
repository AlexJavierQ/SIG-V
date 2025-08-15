"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className = ''
}: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
            {Icon && (
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
            )}
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md">
                    {description}
                </p>
            )}
            {action && (
                <button
                    onClick={action.onClick}
                    className="btn-primary"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}