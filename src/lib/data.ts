// src/lib/data.ts

import type {
  OperationalData,
  FilterOptions,
  FinancialDashboardData,
  MarketingDashboardData,
  SalesUsageData,
  ExecutiveDashboardData,
} from "./types";

export async function getOperationalData(
  _filters?: FilterOptions
): Promise<OperationalData> {
  return {
    kpis: {
      conductoresActivos: {
        title: "Conductores Activos",
        value: 125,
        description: "Conductores con al menos 1 servicio al mes",
        icon: "👤",
        iconColor: "text-blue-600",
      },
      conductoresAtendieron: {
        title: "Conductores Atendieron",
        value: 102,
        description: "Conductores que atendieron solicitudes",
        progress: 82, // Usamos la propiedad 'progress'
      },
      sinViajesAsignados: {
        title: "Sin Viajes Asignados",
        value: 8,
        description: "Conductores sin viajes en el período",
        badge: "danger", // Usamos la propiedad 'badge'
      },
      vehiculosActivos: {
        title: "Vehículos Activos",
        value: 118,
        description: "Vehículos operativos en el sistema",
        icon: "🚗",
        iconColor: "text-green-600",
      },
      tiempoPromedioAtencion: {
        title: "Tiempo Promedio de Atención",
        value: "3.5 min",
        description: "Desde la solicitud hasta la asignación del conductor.",
        trend: {
          direction: "down",
          value: "0.7 min",
        },
      },
      solicitudesTotales: {
        title: "Solicitudes Totales",
        value: 3450,
        description: "Número total de viajes solicitados en el período.",
      },
      efectividad: {
        title: "Efectividad Conductores",
        value: 82,
        description:
          "% de conductores activos que atendieron al menos una solicitud.",
        gauge: 82, // Usamos la propiedad 'gauge'
        iconColor: "#22c55e",
      },
      eficienciaOperativa: {
        title: "Eficiencia Operativa",
        value: 78,
        description:
          "Indicador general de eficiencia basado en viajes completados vs. cancelados.",
        gauge: 78, // Usamos la propiedad 'gauge'
        iconColor: "#f59e0b",
      },
    },
    solicitudesDonut: {
      title: "Distribución de Solicitudes",
      description:
        "Porcentaje de solicitudes completadas con éxito frente a las erróneas o canceladas.",
      correctas: 2932,
      erroneas: 518,
    },
    monitoredDrivers: [
      {
        id: 105,
        name: "Carlos R.",
        city: "Loja",
        assignedTrips: 25,
        cancellationRate: 25,
      },
      {
        id: 212,
        name: "Juan P.",
        city: "Quevedo",
        assignedTrips: 30,
        cancellationRate: 18,
      },
      {
        id: 88,
        name: "Maria G.",
        city: "Loja",
        assignedTrips: 0,
        cancellationRate: 5,
      },
      {
        id: 88,
        name: "Jean A.",
        city: "Loja",
        assignedTrips: 0,
        cancellationRate: 5,
      },
      {
        id: 88,
        name: "Guillermo G.",
        city: "Loja",
        assignedTrips: 100,
        cancellationRate: 60,
      },
      {
        id: 88,
        name: "Mario V.",
        city: "Loja",
        assignedTrips: 30,
        cancellationRate: 12,
      },
    ],
    viajesPorConductorData: [
      { name: "Carlos R.", viajes: 45 },
      { name: "Juan P.", viajes: 41 },
      { name: "Maria G.", viajes: 38 },
      { name: "Luis F.", viajes: 35 },
      { name: "Ana M.", viajes: 32 },
      { name: "Pedro S.", viajes: 15 },
      { name: "Sofia L.", viajes: 12 },
      { name: "David C.", viajes: 9 },
      { name: "Laura V.", viajes: 5 },
      { name: "Miguel A.", viajes: 2 },
    ],
    // --- Nuevos datos para el gráfico de tendencias ---
    kpiHistory: [
      { date: "Ene", solicitudes: 2800, activos: 110, eficiencia: 75 },
      { date: "Feb", solicitudes: 3100, activos: 115, eficiencia: 78 },
      { date: "Mar", solicitudes: 3500, activos: 120, eficiencia: 80 },
      { date: "Abr", solicitudes: 3300, activos: 122, eficiencia: 79 },
      { date: "May", solicitudes: 3800, activos: 125, eficiencia: 82 },
      { date: "Jun", solicitudes: 3450, activos: 125, eficiencia: 78 },
    ],
    // --- Nuevos datos para el ranking por ingresos ---
    driverRevenueRanking: [
      { name: "Ana M.", ingresos: 1500 },
      { name: "Carlos R.", ingresos: 1250 },
      { name: "Juan P.", ingresos: 1050 },
      { name: "Luis F.", ingresos: 980 },
      { name: "Maria G.", ingresos: 950 },
      { name: "Sofia L.", ingresos: 450 },
      { name: "Pedro S.", ingresos: 400 },
      { name: "David C.", ingresos: 250 },
      { name: "Laura V.", ingresos: 150 },
      { name: "Miguel A.", ingresos: 80 },
    ],
  };
}

export async function getFinancialData(
  _filters?: FilterOptions
): Promise<FinancialDashboardData> {
  // Datos basados en la imagen de KPIs financieros
  return {
    kpis: {
      ingresosTotales: {
        title: "Ingresos Totales",
        value: 12580.5,
        description: "Recaudo total por ciudad/establecimiento.",
        icon: "💰",
      },
      ingresosPorConductor: {
        title: "Ingresos por Conductor",
        value: 100.64,
        subValue: "Empresa: $20.12", // Valor secundario para el tooltip
        description: "Promedio generado por conductor activo.",
        icon: "🧑‍💼",
      },
      recargaPromedio: {
        title: "Recarga Promedio",
        value: 25.5,
        chip: "Semanal", // Chip con la modalidad más común
        description: "Promedio en USD por conductor.",
        icon: "💳",
      },
      cacConductor: {
        title: "CAC Conductor",
        value: 75.0,
        description: "Costo de adquisición por conductor.",
      },
      cacCliente: {
        title: "CAC Cliente",
        value: 12.0,
        description: "Costo para convertir un usuario.",
      },
      churnRateConductores: {
        title: "Churn Rate Conductores",
        value: 8,
        description: "% de conductores que se van.",
        trend: { direction: "down", value: "1.2%" },
      },
      churnRateClientes: {
        title: "Churn Rate Clientes",
        value: 12,
        description: "% de usuarios que se van.",
        trend: { direction: "up", value: "0.5%" },
      },
      tiempoUsoCliente: {
        title: "Tiempo de Uso Cliente",
        value: 182,
        description: "Duración promedio del cliente en días.",
      },
    },
    ingresosPorCanal: [
      { name: "App Móvil", ingresos: 8500 },
      { name: "Corporativos", ingresos: 2500 },
      { name: "Eventos", ingresos: 980 },
      { name: "Whatsapp", ingresos: 600 },
    ],
    distribucionRecargas: [
      { name: "Diaria", value: 450 },
      { name: "Semanal", value: 300 },
      { name: "Mensual", value: 250 },
    ],
    ingresoPromedioHistorico: [
      { date: "Ene", promedio: 3.2 },
      { date: "Feb", promedio: 3.5 },
      { date: "Mar", promedio: 3.45 },
      { date: "Abr", promedio: 3.8 },
      { date: "May", promedio: 4.1 },
      { date: "Jun", promedio: 4.0 },
    ],
    rendimientoConductores: [
      { name: "C. Ramos", viajes: 45, ingresos: 1250 },
      { name: "J. Pérez", viajes: 41, ingresos: 1050 },
      { name: "M. Gómez", viajes: 38, ingresos: 950 },
      { name: "L. Flores", viajes: 35, ingresos: 980 },
      { name: "A. Medina", viajes: 55, ingresos: 1500 },
      { name: "S. Vargas", viajes: 22, ingresos: 600 },
      { name: "R. Castro", viajes: 30, ingresos: 800 },
    ],
    comisionesPorSegmento: [
      { ciudad: "Loja", regular: 15, ejecutivo: 18, vip: 22 },
      { ciudad: "Riobamba", regular: 14, ejecutivo: 17, vip: 20 },
      { ciudad: "Quevedo", regular: 16, ejecutivo: 18, vip: 21 },
    ],
    conductoresConPaquetes: [
      {
        id: 105,
        nombre: "Carlos R.",
        tipoPaquete: "Pro",
        monto: 50,
        frecuencia: "Mensual",
        ultimaRecarga: "2025-07-12",
      },
      {
        id: 212,
        nombre: "Juan P.",
        tipoPaquete: "Plus",
        monto: 25,
        frecuencia: "Semanal",
        ultimaRecarga: "2025-07-10",
      },
      {
        id: 88,
        nombre: "Maria G.",
        tipoPaquete: "Básico",
        monto: 10,
        frecuencia: "Semanal",
        ultimaRecarga: "2025-07-13",
      },
      {
        id: 115,
        nombre: "Luis F.",
        tipoPaquete: "Pro",
        monto: 50,
        frecuencia: "Mensual",
        ultimaRecarga: "2025-07-05",
      },
      {
        id: 33,
        nombre: "Ana M.",
        tipoPaquete: "Plus",
        monto: 25,
        frecuencia: "Semanal",
        ultimaRecarga: "2025-07-11",
      },
    ],
    cacDetallado: [
      {
        actividad: "Campaña en Redes Sociales",
        costo: 450.0,
        fecha: "2025-06-05",
        responsable: "Marketing",
      },
      {
        actividad: "Referidos de Conductores",
        costo: 200.0,
        fecha: "2025-06-12",
        responsable: "Operaciones",
      },
      {
        actividad: "Activación en Evento",
        costo: 150.5,
        fecha: "2025-06-18",
        responsable: "Ventas",
      },
      {
        actividad: "Publicidad en Radio",
        costo: 300.0,
        fecha: "2025-06-25",
        responsable: "Marketing",
      },
    ],
    clientesLeales: [
      {
        id: 1,
        cliente: "Ana G.",
        ciudad: "Loja",
        primerUso: "2023-01-15",
        ultimoUso: "2025-07-13",
        diasDeUso: 544,
      },
      {
        id: 2,
        cliente: "Luis M.",
        ciudad: "Quevedo",
        primerUso: "2023-03-20",
        ultimoUso: "2025-07-12",
        diasDeUso: 480,
      },
      {
        id: 3,
        cliente: "Sofia P.",
        ciudad: "Riobamba",
        primerUso: "2023-02-10",
        ultimoUso: "2025-07-14",
        diasDeUso: 519,
      },
    ],
  };
}

export async function getMarketingData(
  _filters?: FilterOptions
): Promise<MarketingDashboardData> {
  return {
    kpis: {
      registradosTotales: {
        title: "Usuarios Registrados Totales",
        value: 25890,
        description: "Número total de usuarios en la base de datos.",
        icon: "👥",
      },
      registradosNuevos: {
        title: "Nuevos Usuarios (Período)",
        value: 1250,
        description: "Usuarios que se registraron en el rango de fechas.",
        icon: "✨",
      },
      cac: {
        title: "Costo por Adquisición (CAC)",
        value: 5.75,
        description: "Costo promedio para adquirir un nuevo usuario.",
        icon: "💸",
      },
      abrenYNoPiden: {
        title: "Abren y No Piden",
        value: 225,
        description: "Usuarios que solo navegan y no solicitan.",
        badge: "warning",
      },
      efectividadNuevos: {
        title: "Efectividad Nuevos",
        value: 46,
        description: "% de nuevos usuarios que solicitaron al menos un viaje.",
        gauge: 46,
      },
      efectividadUsuariosActivos: {
        title: "Efectividad Usuarios Activos",
        value: 78,
        description: "% de usuarios activos que realizaron viajes.",
        gauge: 78,
      },
      retencion7dias: {
        title: "Retención (7 Días)",
        value: 45,
        description:
          "% de nuevos usuarios que vuelven a usar la app en 7 días.",
        gauge: 45,
      },
      retencion30dias: {
        title: "Retención (30 Días)",
        value: 25,
        description:
          "% de nuevos usuarios que vuelven a usar la app en 30 días.",
        gauge: 25,
      },
      inversionTotalMarketing: {
        title: "Inversión Total en Marketing",
        value: 7187.5, // (1250 nuevos usuarios * $5.75 CAC)
        description: "Suma de todos los costos de adquisición en el período.",
        icon: "📊",
      },
    },
    embudoConversion: [
      { step: "Registro", value: 1250, fill: "#4f46e5" },
      { step: "Solicitud", value: 580, fill: "#6366f1" },
      { step: "Viaje Atendido", value: 490, fill: "#818cf8" },
    ],
    tasaInteraccion: {
      opens: 15000,
      interactions: 6500,
    },
    aperturaPorFranja: [
      { franja: "Madrugada (00-06)", usuarios: 1100 },
      { franja: "Mañana (06-12)", usuarios: 2150 },
      { franja: "Tarde (12-18)", usuarios: 1800 },
      { franja: "Noche (18-24)", usuarios: 3900 },
    ],
    canalesAdquisicion: [
      { channel: "Facebook Ads", nuevosUsuarios: 450, cac: 6.5 },
      { channel: "Google Search", nuevosUsuarios: 350, cac: 8.2 },
      { channel: "Referidos", nuevosUsuarios: 300, cac: 1.5 },
      { channel: "Orgánico", nuevosUsuarios: 150, cac: 0.5 },
    ],
    cacHistorico: [
      { date: "Ene", cac: 8.5 },
      { date: "Feb", cac: 9.2 },
      { date: "Mar", cac: 7.8 },
      { date: "Abr", cac: 7.5 },
      { date: "May", cac: 6.9 },
      { date: "Jun", cac: 5.75 },
    ],
    tendenciaRetencion7d: [
      { mes: "Ene", retencion: 35 },
      { mes: "Feb", retencion: 38 },
      { mes: "Mar", retencion: 42 },
      { mes: "Abr", retencion: 40 },
      { mes: "May", retencion: 45 },
      { mes: "Jun", retencion: 48 },
    ],
  };
}
export async function getSalesData(
  _filters?: FilterOptions
): Promise<SalesUsageData> {
  // Datos basados en la imagen de KPIs de Ventas y Uso
  return {
    kpis: {
      usuariosActivos: {
        title: "Usuarios Activos",
        value: 8750,
        description: "Usuarios con al menos 1 acción en el período.",
        icon: "🚶‍♂️",
      },
      solicitudesAtendidas: {
        title: "Solicitudes Atendidas",
        value: 15230,
        description: "Viajes completados exitosamente.",
        icon: "✅",
      },
      ticketPromedio: {
        title: "Ticket Promedio por Viaje",
        value: 3.5,
        description: "Valor promedio en USD por cada viaje.",
        icon: "💲",
      },
      efectividadVentas: {
        title: "Efectividad de Ventas",
        value: 85,
        description: "% de solicitudes que terminan en viajes exitosos.",
        gauge: 85,
      },
    },
    ventasPorCanal: [
      { name: "App", ventas: 12500 },
      { name: "Aeropuerto", ventas: 1800 },
      { name: "Presencial", ventas: 930 },
    ],
    topHorasDemanda: [
      { hora: "08:00", solicitudes: 1100 },
      { hora: "12:00", solicitudes: 950 },
      { hora: "18:00", solicitudes: 1450 },
      { hora: "22:00", solicitudes: 1800 },
    ],
    topZonas: [
      { name: "Centro Histórico", viajes: 2300 },
      { name: "La Mariscal", viajes: 1980 },
      { name: "Cumbayá", viajes: 1540 },
      { name: "Parque La Carolina", viajes: 1200 },
      { name: "González Suárez", viajes: 950 },
    ],
  };
}
export async function getExecutiveData(
  _filters?: FilterOptions
): Promise<ExecutiveDashboardData> {
  return {
    kpis: {
      ingresosTotales: {
        title: "Ingresos Totales",
        value: 2850000,
        description: "Ingresos consolidados del período",
        trend: {
          direction: "up",
          value: "12.5%",
        },
      },
      usuariosActivos: {
        title: "Usuarios Activos",
        value: 45200,
        description: "Usuarios con actividad en el período",
        trend: {
          direction: "up",
          value: "8.3%",
        },
      },
      roi: {
        title: "ROI",
        value: 24.8,
        description: "Retorno sobre la inversión",
        trend: {
          direction: "up",
          value: "3.2%",
        },
      },
      eficienciaOperativa: {
        title: "Eficiencia Operativa",
        value: 87.5,
        description: "Índice de eficiencia general",
        trend: {
          direction: "up",
          value: "2.1%",
        },
      },
    },
    businessMetrics: [
      {
        name: "Crecimiento de Ingresos",
        value: 12.5,
        target: 15.0,
        achievement: 83.3,
        category: "revenue",
      },
      {
        name: "Adquisición de Usuarios",
        value: 8.3,
        target: 10.0,
        achievement: 83.0,
        category: "growth",
      },
      {
        name: "Eficiencia Operativa",
        value: 87.5,
        target: 85.0,
        achievement: 102.9,
        category: "efficiency",
      },
      {
        name: "Satisfacción del Cliente",
        value: 4.2,
        target: 4.0,
        achievement: 105.0,
        category: "satisfaction",
      },
      {
        name: "Retención de Usuarios",
        value: 78.5,
        target: 80.0,
        achievement: 98.1,
        category: "growth",
      },
      {
        name: "Margen de Contribución",
        value: 32.1,
        target: 30.0,
        achievement: 107.0,
        category: "revenue",
      },
    ],
    profitabilityAnalysis: [
      {
        period: "Ene 2025",
        revenue: 2200000,
        costs: 1650000,
        profit: 550000,
        margin: 25.0,
      },
      {
        period: "Feb 2025",
        revenue: 2350000,
        costs: 1720000,
        profit: 630000,
        margin: 26.8,
      },
      {
        period: "Mar 2025",
        revenue: 2500000,
        costs: 1800000,
        profit: 700000,
        margin: 28.0,
      },
      {
        period: "Abr 2025",
        revenue: 2650000,
        costs: 1880000,
        profit: 770000,
        margin: 29.1,
      },
      {
        period: "May 2025",
        revenue: 2750000,
        costs: 1950000,
        profit: 800000,
        margin: 29.1,
      },
      {
        period: "Jun 2025",
        revenue: 2850000,
        costs: 2020000,
        profit: 830000,
        margin: 29.1,
      },
    ],
    strategicTrends: [
      {
        date: "Ene 2025",
        revenue: 2200000,
        users: 38500,
        efficiency: 82.1,
        satisfaction: 3.9,
      },
      {
        date: "Feb 2025",
        revenue: 2350000,
        users: 40200,
        efficiency: 84.3,
        satisfaction: 4.0,
      },
      {
        date: "Mar 2025",
        revenue: 2500000,
        users: 41800,
        efficiency: 85.7,
        satisfaction: 4.1,
      },
      {
        date: "Abr 2025",
        revenue: 2650000,
        users: 43100,
        efficiency: 86.2,
        satisfaction: 4.1,
      },
      {
        date: "May 2025",
        revenue: 2750000,
        users: 44300,
        efficiency: 86.8,
        satisfaction: 4.2,
      },
      {
        date: "Jun 2025",
        revenue: 2850000,
        users: 45200,
        efficiency: 87.5,
        satisfaction: 4.2,
      },
    ],
    regionalPerformance: [
      {
        region: "Quito",
        revenue: 1140000,
        users: 18080,
        growth: 15.2,
        marketShare: 42.3,
      },
      {
        region: "Guayaquil",
        revenue: 969000,
        users: 15364,
        growth: 12.8,
        marketShare: 38.1,
      },
      {
        region: "Cuenca",
        revenue: 427500,
        users: 6780,
        growth: 8.9,
        marketShare: 28.7,
      },
      {
        region: "Otras Ciudades",
        revenue: 313500,
        users: 4976,
        growth: 6.2,
        marketShare: 22.1,
      },
    ],
    satisfactionMetrics: {
      customerSatisfaction: 4.2,
      nps: 68,
      serviceQuality: 89,
      responseTime: 3.2,
    },
  };
}