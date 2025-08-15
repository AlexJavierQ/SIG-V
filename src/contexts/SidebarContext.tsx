'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePersistentState } from '@/hooks/usePersistentState';

interface SidebarContextType {
    isCollapsed: boolean;
    toggleCollapse: () => void;
    isMobileOpen: boolean;
    toggleMobile: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = usePersistentState('sidebarCollapsed', false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Cerrar sidebar móvil cuando se cambia de ruta
    useEffect(() => {
        setIsMobileOpen(false);
    }, []);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleMobile = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    return (
        <SidebarContext.Provider value={{
            isCollapsed,
            toggleCollapse,
            isMobileOpen,
            toggleMobile
        }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}