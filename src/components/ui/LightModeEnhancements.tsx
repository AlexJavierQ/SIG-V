"use client";

import React from 'react';
import { useTheme } from '@/contexts/ThemeProvider';

export default function LightModeEnhancements() {
    const { isDarkMode } = useTheme();

    // Solo renderizar en modo claro
    if (isDarkMode) return null;

    return (
        <>
            {/* Subtle background pattern for light mode */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.02)_0%,transparent_50%)]"></div>
            </div>

            {/* Floating particles for light mode */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-200/40 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Light mode specific styles */}
            <style jsx>{`
                @keyframes lightFloat {
                    0%, 100% {
                        transform: translateY(0px) translateX(0px);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translateY(-20px) translateX(10px);
                        opacity: 0.6;
                    }
                }
                
                .light-float {
                    animation: lightFloat 6s ease-in-out infinite;
                }
            `}</style>
        </>
    );
}