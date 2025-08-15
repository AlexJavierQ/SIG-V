// src/config/navigation.ts

import {
    Home,
    Car,
    Bus,
    Package,
    Crown,
    TrendingUp,
    DollarSign,
    Users,
    ShoppingCart
} from 'lucide-react';

// Este es solo un array de configuración. No hay JSX aquí.
export const navigationConfig = [
    {
        name: 'Dashboard Principal',
        icon: Home,
        href: '/',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        description: 'Vista general del sistema'
    },
    {
        name: 'Taxis',
        icon: Car,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        children: [
            { name: 'Ejecutivo', href: '/taxis/ejecutivo', icon: Crown, description: 'Vista estratégica' },
            { name: 'Operacional', href: '/taxis/operacional', icon: TrendingUp, description: 'Métricas operativas' },
            { name: 'Financiero', href: '/taxis/financiero', icon: DollarSign, description: 'Análisis financiero' },
            { name: 'Marketing', href: '/taxis/marketing', icon: Users, description: 'Campañas y usuarios' },
            { name: 'Ventas y Uso', href: '/taxis/ventas', icon: ShoppingCart, description: 'Ventas y patrones' },
        ]
    },
    {
        name: 'Buses',
        icon: Bus,
        href: '#',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        badge: 'Próximamente'
    },
    {
        name: 'Delivery',
        icon: Package,
        href: '#',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        badge: 'Próximamente'
    },
];