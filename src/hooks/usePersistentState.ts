'use client';

import { useState, useEffect } from 'react';

export function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState<T>(defaultValue);

    // MEJORA: Se agrega un estado para saber si ya se hidrató en el cliente
    const [isHydrated, setIsHydrated] = useState(false);

    // MEJORA: Este useEffect se ejecuta solo una vez en el cliente, después del montaje
    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setValue(JSON.parse(item));
            }
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error);
        }
        // Marcamos que el componente ya se ha hidratado
        setIsHydrated(true);
    }, [key]);

    // MEJORA: Este useEffect guarda los cambios en localStorage, pero solo después de la hidratación
    useEffect(() => {
        // No guardamos el valor inicial del servidor en localStorage
        if (!isHydrated) {
            return;
        }
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn(`Error setting localStorage key “${key}”:`, error);
        }
    }, [key, value, isHydrated]);

    return [value, setValue];
}