"use client";

import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Notification } from '@/hooks/useNotifications';

interface NotificationSystemProps {
    notifications: Notification[];
    onDismiss: (id: string) => void;
}

export function NotificationSystem({ notifications, onDismiss }: NotificationSystemProps) {
    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getBackgroundColor = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
            case 'error':
                return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            case 'warning':
                return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
            case 'info':
                return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
            default:
                return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
        }
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-6 right-6 z-50 space-y-3 max-w-sm">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`p-4 rounded-xl border shadow-xl animate-slideIn backdrop-blur-sm ${getBackgroundColor(notification.type)}`}
                >
                    <div className="flex items-start gap-3">
                        {getIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                                {notification.title}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                                {notification.message}
                            </p>
                        </div>
                        <button
                            onClick={() => onDismiss(notification.id)}
                            className="btn-ghost p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}