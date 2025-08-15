"use client";

import React from "react";
import {
    AlertTriangle,
    CheckCircle,
    Info,
    Zap,
    TrendingUp,
    Users,
    X
} from "lucide-react";

interface AlertProps {
    type: 'operational' | 'financial' | 'marketing' | 'critical';
    priority: 'high' | 'medium' | 'low';
    title: string;
    message: string;
    onDismiss?: () => void;
    className?: string;
}

export default function Alert({
    type,
    priority,
    title,
    message,
    onDismiss,
    className = ""
}: AlertProps) {

    const getTypeConfig = (alertType: string) => {
        switch (alertType) {
            case 'critical':
                return {
                    icon: AlertTriangle,
                    color: 'text-red-600 dark:text-red-400',
                    border: 'border-l-red-500 dark:border-l-red-500'
                };
            case 'operational':
                return {
                    icon: Info,
                    color: 'text-blue-600 dark:text-blue-400',
                    border: 'border-l-blue-500 dark:border-l-blue-500'
                };
            case 'financial':
                return {
                    icon: CheckCircle,
                    color: 'text-green-600 dark:text-green-400',
                    border: 'border-l-green-500 dark:border-l-green-500'
                };
            case 'marketing':
                return {
                    icon: Users,
                    color: 'text-purple-600 dark:text-purple-400',
                    border: 'border-l-purple-500 dark:border-l-purple-500'
                };
            default:
                return {
                    icon: Info,
                    color: 'text-slate-600 dark:text-slate-400',
                    border: 'border-l-slate-500 dark:border-l-slate-500'
                };
        }
    };

    const getPriorityLabel = (alertPriority: string) => {
        switch (alertPriority) {
            case 'high':
                return { label: 'Alta', color: 'text-red-600 dark:text-red-400' };
            case 'medium':
                return { label: 'Media', color: 'text-amber-600 dark:text-amber-400' };
            case 'low':
                return { label: 'Baja', color: 'text-blue-600 dark:text-blue-400' };
            default:
                return { label: 'Info', color: 'text-slate-600 dark:text-slate-400' };
        }
    };

    const typeConfig = getTypeConfig(type);
    const priorityConfig = getPriorityLabel(priority);
    const TypeIcon = typeConfig.icon;

    return (
        <div className={`
            group relative overflow-hidden
            border-l-4 ${typeConfig.border} 
            bg-white dark:bg-slate-800 
            border-r border-t border-b border-slate-200/60 dark:border-slate-700/60
            rounded-r-xl p-4 
            shadow-sm hover:shadow-md
            hover:bg-slate-50/80 dark:hover:bg-slate-750/80
            hover:border-slate-300/50 dark:hover:border-slate-600/50
            hover:scale-[1.01]
            transition-all duration-300
            backdrop-blur-sm
            ${className}
        `}>
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                        <TypeIcon className={`w-5 h-5 mt-0.5 ${typeConfig.color} flex-shrink-0 transition-colors duration-300`} />

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                    {title}
                                </h4>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full transition-colors duration-300 ${priorityConfig.color}`}>
                                    {priorityConfig.label}
                                </span>
                            </div>

                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
                                {message}
                            </p>
                        </div>
                    </div>

                    {onDismiss && (
                        <button
                            onClick={onDismiss}
                            className="text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg p-1 transition-all duration-300"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}