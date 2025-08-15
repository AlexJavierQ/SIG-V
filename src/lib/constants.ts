// src/lib/constants.ts

import { Car, Bus, Package, Calendar, CreditCard } from "lucide-react";

/**
 * Define los datos para las tarjetas de servicios disponibles en el dashboard principal.
 * Centralizar esta información aquí facilita su mantenimiento y actualización.
 */
export const servicesCards = [
    {
        title: "Taxis",
        description: "Servicio de transporte urbano y gestión de conductores.",
        icon: Car,
        href: "/taxis/ejecutivo",
        color: "from-yellow-500 to-yellow-600",
        bgColor: "from-yellow-500/20 to-yellow-600/10",
        stats: { primary: "1,247", secondary: "Viajes activos", tertiary: "+12.5%" },
        isActive: true
    },
    {
        title: "Buses",
        description: "Transporte público masivo y rutas urbanas.",
        icon: Bus,
        href: "#",
        color: "from-green-500 to-green-600",
        bgColor: "from-green-500/20 to-green-600/10",
        stats: { primary: "---", secondary: "Próximamente", tertiary: "---" },
        isActive: false,
        badge: "Próximamente"
    },
    {
        title: "Delivery",
        description: "Entrega de productos y logística de última milla.",
        icon: Package,
        href: "#",
        color: "from-blue-500 to-blue-600",
        bgColor: "from-blue-500/20 to-blue-600/10",
        stats: { primary: "---", secondary: "Próximamente", tertiary: "---" },
        isActive: false,
        badge: "Próximamente"
    },
    {
        title: "Eventos",
        description: "Gestión de eventos y reservas de espacios.",
        icon: Calendar,
        href: "#",
        color: "from-purple-500 to-purple-600",
        bgColor: "from-purple-500/20 to-purple-600/10",
        stats: { primary: "---", secondary: "Próximamente", tertiary: "---" },
        isActive: false,
        badge: "Próximamente"
    },
    {
        title: "Pagos y Recargas",
        description: "Procesamiento de pagos y gestión de billeteras.",
        icon: CreditCard,
        href: "#",
        color: "from-emerald-500 to-emerald-600",
        bgColor: "from-emerald-500/20 to-emerald-600/10",
        stats: { primary: "---", secondary: "Próximamente", tertiary: "---" },
        isActive: false,
        badge: "Próximamente"
    }
];