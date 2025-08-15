"use client";

import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
    text: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function InfoTooltip({ text, position = 'top' }: InfoTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    };

    const arrowClasses = {
        top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-800 dark:border-t-slate-200',
        bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-slate-800 dark:border-b-slate-200',
        left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-800 dark:border-l-slate-200',
        right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-slate-800 dark:border-r-slate-200'
    };

    return (
        <div className="relative inline-block">
            <button
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onFocus={() => setIsVisible(true)}
                onBlur={() => setIsVisible(false)}
                className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label="Información adicional"
            >
                <Info className="w-4 h-4" />
            </button>

            {isVisible && (
                <div className={`absolute z-50 ${positionClasses[position]} animate-fadeIn`}>
                    <div className="bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 text-xs rounded-lg px-3 py-2 shadow-lg max-w-xs whitespace-normal">
                        {text}
                        <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
                    </div>
                </div>
            )}
        </div>
    );
}