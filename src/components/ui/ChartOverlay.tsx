"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ChartOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export default function ChartOverlay({ isOpen, onClose, title, subtitle, children }: ChartOverlayProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-6xl max-h-[90vh] mx-4 bg-slate-800 rounded-2xl shadow-2xl border border-slate-600/50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-200">{title}</h2>
                        {subtitle && (
                            <p className="text-slate-400 mt-1">{subtitle}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {children}
                </div>
            </div>
        </div>
    );
}