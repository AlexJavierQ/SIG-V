// src/lib/types.ts
import type { RankingData } from "@/components/charts/RankingChart"; // 1. Importamos el tipo unificado

// Esta es la nueva interfaz unificada para todos los KPIs que se mostrarán en un MetricCard.
// Reemplaza a la antigua interfaz 'Kpi' y sus múltiples extensiones.
export interface Metric {
  title: string;
  value: string | number;
  description: string;
  // Propiedades opcionales para las variantes de MetricCard
  icon?: string;
  iconColor?: string;
  progress?: number;
  badge?: "danger" | "warning" | "success";
  trend?: {
    direction: "up" | "down";
    value: string;
  };
  gauge?: number;
}

// Actualizamos FilterOptions para incluir fechas de inicio y fin
export interface FilterOptions {
  aplicativo: string;
  pais: string;
  ciudad: string;
  fechaInicio: string; // Formato YYYY-MM-DD
  fechaFin: string; // Formato YYYY-MM-DD
  establecimiento?: string;
  // --- Nueva propiedad ---
  transaccional: boolean;
}
export interface MonitoredDriver {
  id: number;
  name: string;
  city: string;
  assignedTrips: number;
  cancellationRate: number;
}

// Interfaz para los datos específicos del DonutChart de solicitudes
export interface DonutChartData {
  title: string;
  description: string;
  correctas: number;
  erroneas: number;
}

export interface OperationalData {
  kpis: { [key: string]: Metric };
  solicitudesDonut: DonutChartData;
  monitoredDrivers: MonitoredDriver[];
  // 2. Usamos RankingData para ambos rankings
  viajesPorConductorData: RankingData[];
  kpiHistory: {
    date: string;
    solicitudes: number;
    activos: number;
    eficiencia: number;
  }[];
  // 3. Usamos RankingData aquí también
  driverRevenueRanking: RankingData[];
}

export interface FinancialData {
  kpis: { [key: string]: Metric };
  evolutionData: { mes: string; ingresos: number; churn: number }[];
}

export interface MarketingData {
  kpis: { [key: string]: Metric };
  funnelData: { step: string; value: number }[];
}

export interface SalesData {
  kpis: { [key: string]: Metric };
  topZonas: { name: string; viajes: number }[];
  topHoras: { name: string; solicitudes: number }[];
}
// Añadimos una interfaz para el nuevo ranking por ingresos
export interface DriverRevenue {
  name: string;
  ingresos: number;
}

export interface FinancialDashboardData {
  kpis: {
    ingresosTotales: Metric;
    ingresosPorConductor: ComplexMetric;
    recargaPromedio: ComplexMetric;
    cacConductor: Metric;
    cacCliente: Metric;
    churnRateConductores: Metric;
    churnRateClientes: Metric;
    tiempoUsoCliente: Metric;
  };
  // --- Propiedades para los nuevos gráficos ---
  ingresosPorCanal: { name: string; ingresos: number }[];
  distribucionRecargas: { name: string; value: number }[];
  ingresoPromedioHistorico: { date: string; promedio: number }[];
  rendimientoConductores: { name: string; viajes: number; ingresos: number }[];
  comisionesPorSegmento: {
    ciudad: string;
    regular: number;
    ejecutivo: number;
    vip: number;
  }[];
  conductoresConPaquetes: RechargePackageData[];
  cacDetallado: CacDetailData[];
  clientesLeales: LoyalCustomerData[];
}
// Interfaz para un KPI complejo con un valor secundario o chip
export interface ComplexMetric extends Metric {
  subValue?: string;
  chip?: string;
}

// Nueva interfaz para los datos de la tabla de paquetes
export interface RechargePackageData {
  id: number;
  nombre: string;
  tipoPaquete: "Básico" | "Plus" | "Pro";
  monto: number;
  frecuencia: "Diaria" | "Semanal" | "Mensual";
  ultimaRecarga: string;
}

export interface CacDetailData {
  actividad: string;
  costo: number;
  fecha: string;
  responsable: string;
}

export interface LoyalCustomerData {
  id: number;
  cliente: string;
  ciudad: string;
  primerUso: string;
  ultimoUso: string;
  diasDeUso: number;
}

// --- Tipos para la Vista de Marketing ---
export interface MarketingDashboardData {
  kpis: {
    registradosTotales: Metric;
    registradosNuevos: Metric;
    cac: Metric;
    abrenYNoPiden: Metric;
    efectividadNuevos: Metric;
    efectividadUsuariosActivos: Metric;
    retencion7dias: Metric;
    retencion30dias: Metric;
    inversionTotalMarketing: Metric;
  };
  embudoConversion: { step: string; value: number; fill: string }[];
  tasaInteraccion: { opens: number; interactions: number };
  aperturaPorFranja: { franja: string; usuarios: number }[];
  canalesAdquisicion: {
    channel: string;
    nuevosUsuarios: number;
    cac: number;
  }[];
  cacHistorico: { date: string; cac: number }[];
  tendenciaRetencion7d: { mes: string; retencion: number }[];
}

export interface SegmentDataPoint {
  metrica: string; // ej. 'Tasa de Conversión', 'CAC', 'LTV'
  Nuevos: number;
  Activos: number;
  Leales: number;
}
export interface SalesUsageData {
  kpis: {
    usuariosActivos: Metric;
    solicitudesAtendidas: Metric;
    ticketPromedio: Metric;
    efectividadVentas: Metric;
  };
  ventasPorCanal: { name: string; ventas: number }[];
  topHorasDemanda: { hora: string; solicitudes: number }[];
  topZonas: { name: string; viajes: number }[];
}
