"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
    onClose: (id: string) => void;
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Animate in
        const showTimer = setTimeout(() => setIsVisible(true), 100);

        // Auto close
        const closeTimer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(closeTimer);
        };
    }, [duration]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onClose(id);
        }, 300);
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-400" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-400" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500/10 border-green-500/30';
            case 'error':
                return 'bg-red-500/10 border-red-500/30';
            case 'warning':
                return 'bg-yellow-500/10 border-yellow-500/30';
            case 'info':
                return 'bg-blue-500/10 border-blue-500/30';
        }
    };

    return (
        <div
            className={`
                transform transition-all duration-300 ease-in-out
                ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
                ${getColors()}
                backdrop-blur-sm border rounded-xl p-4 shadow-lg max-w-sm w-full
            `}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm">{title}</h4>
                    {message && (
                        <p className="text-slate-300 text-sm mt-1">{message}</p>
                    )}
                </div>
                <button
                    onClick={handleClose}
                    className="flex-shrink-0 p-1 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4 text-slate-400" />
                </button>
            </div>

            {/* Progress bar */}
            <div className="mt-3 w-full bg-slate-700/50 rounded-full h-1">
                <div
                    className={`h-1 rounded-full transition-all ease-linear ${type === 'success' ? 'bg-green-400' :
                            type === 'error' ? 'bg-red-400' :
                                type === 'warning' ? 'bg-yellow-400' :
                                    'bg-blue-400'
                        }`}
                    style={{
                        width: '100%',
                        animation: `shrink ${duration}ms linear forwards`
                    }}
                />
            </div>
        </div>
    );
}

export interface ToastContainerProps {
    toasts: ToastProps[];
    onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-3">
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} onClose={onClose} />
            ))}

            <style jsx>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
}

// Hook para manejar toasts
export function useToast() {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { ...toast, id, onClose: removeToast }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const success = (title: string, message?: string, duration?: number) => {
        addToast({ type: 'success', title, message, duration });
    };

    const error = (title: string, message?: string, duration?: number) => {
        addToast({ type: 'error', title, message, duration });
    };

    const warning = (title: string, message?: string, duration?: number) => {
        addToast({ type: 'warning', title, message, duration });
    };

    const info = (title: string, message?: string, duration?: number) => {
        addToast({ type: 'info', title, message, duration });
    };

    return {
        toasts,
        success,
        error,
        warning,
        info,
        removeToast
    };
}