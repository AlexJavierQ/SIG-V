"use client";

import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    text?: string;
}

export default function LoadingSpinner({
    size = 'md',
    className = '',
    text
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    return (
        <div className={`flex items-center justify-center gap-3 ${className}`}>
            <div className={`${sizeClasses[size]} border-2 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin`} />
            {text && (
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    {text}
                </span>
            )}
        </div>
    );
}