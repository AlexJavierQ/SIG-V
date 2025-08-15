"use client";

import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';

interface ExportButtonProps {
    data: any[];
    filename: string;
    dashboardType: string;
}

export function ExportButton({ data, filename, dashboardType }: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const exportToCSV = async () => {
        setIsExporting(true);
        try {
            if (!data || data.length === 0) {
                throw new Error('No hay datos para exportar');
            }

            const headers = Object.keys(data[0]);
            const csvContent = [
                headers.join(','),
                ...data.map(row =>
                    headers.map(header =>
                        typeof row[header] === 'string' && row[header].includes(',')
                            ? `"${row[header]}"`
                            : row[header]
                    ).join(',')
                )
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${filename}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting CSV:', error);
        } finally {
            setIsExporting(false);
            setShowOptions(false);
        }
    };

    const exportToJSON = async () => {
        setIsExporting(true);
        try {
            const jsonContent = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonContent], { type: 'application/json' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${filename}.json`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting JSON:', error);
        } finally {
            setIsExporting(false);
            setShowOptions(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowOptions(!showOptions)}
                disabled={isExporting}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Download className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">Exportar</span>
            </button>

            {showOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 z-50 animate-slideDown">
                    <div className="p-2">
                        <button
                            onClick={exportToCSV}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <FileSpreadsheet className="w-4 h-4 text-green-600" />
                            Exportar como CSV
                        </button>
                        <button
                            onClick={exportToJSON}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <FileText className="w-4 h-4 text-blue-600" />
                            Exportar como JSON
                        </button>
                    </div>
                </div>
            )}

            {/* Click outside to close */}
            {showOptions && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowOptions(false)}
                />
            )}
        </div>
    );
}