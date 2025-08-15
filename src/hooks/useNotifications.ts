"use client";

import { useState, useCallback } from 'react';

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    autoClose?: boolean;
    duration?: number;
    timestamp: Date;
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification: Notification = {
            ...notification,
            id,
            timestamp: new Date(),
            autoClose: notification.autoClose ?? true,
            duration: notification.duration ?? 5000
        };

        setNotifications(prev => [...prev, newNotification]);

        if (newNotification.autoClose) {
            setTimeout(() => {
                dismissNotification(id);
            }, newNotification.duration);
        }

        return id;
    }, []);

    const dismissNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    const markAsRead = useCallback((id: string) => {
        // For future implementation if needed
        console.log('Marking notification as read:', id);
    }, []);

    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const notifySuccess = useCallback((title: string, message: string, options?: Partial<Notification>) => {
        return addNotification({
            type: 'success',
            title,
            message,
            ...options
        });
    }, [addNotification]);

    const notifyError = useCallback((title: string, message: string, options?: Partial<Notification>) => {
        return addNotification({
            type: 'error',
            title,
            message,
            autoClose: false, // Errors should not auto-close by default
            ...options
        });
    }, [addNotification]);

    const notifyWarning = useCallback((title: string, message: string, options?: Partial<Notification>) => {
        return addNotification({
            type: 'warning',
            title,
            message,
            ...options
        });
    }, [addNotification]);

    const notifyInfo = useCallback((title: string, message: string, options?: Partial<Notification>) => {
        return addNotification({
            type: 'info',
            title,
            message,
            ...options
        });
    }, [addNotification]);

    return {
        notifications,
        addNotification,
        dismissNotification,
        markAsRead,
        clearAllNotifications,
        notifySuccess,
        notifyError,
        notifyWarning,
        notifyInfo
    };
}