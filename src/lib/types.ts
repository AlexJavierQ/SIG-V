// src/lib/types.ts
import type { LucideIcon } from "lucide-react";

// Interfaz genérica para que el gráfico acepte diferentes tipos de datos
export interface RankingData {
  name: string;
  [key: string]: string | number;
}

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

// Enhanced FilterOptions for landing page requirements
export interface FilterOptions {
  aplicativo: string;
  pais: string;
  ciudad: string;
  fechaInicio: string; // Formato YYYY-MM-DD
  fechaFin: string; // Formato YYYY-MM-DD
  establecimiento?: string;
  transaccional: boolean;
  // New properties for enhanced filtering (Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6)
  serviceIds?: string[];
  metricTypes?: string[];

}

// Enhanced filter state interface for the filter system
export interface FilterState {
  filters: FilterOptions;
  isRefreshing: boolean;
  lastUpdated: Date;
  selectedServices: string[];
  selectedTemporal: string;
}

// Service filter option interface
export interface ServiceFilterOption {
  id: string;
  name: string;
  color: string;
  icon?: string;

}

// Temporal filter option interface
export interface TemporalFilterOption {
  id: string;
  name: string;
  shortName: string;
}

// Date preset interface for quick date selection
export interface DatePreset {
  id: string;
  name: string;
  icon?: string;
  days: number | 'currentMonth' | 'lastMonth';
}

// ===== NAVIGATION TYPES =====

// Breadcrumb navigation interface (Requirements 3.2, 6.1, 7.1)
export interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

// Navigation state interface for routing management
export interface NavigationState {
  currentRoute: string;
  previousRoute?: string;
  serviceId?: string;
  filters?: FilterOptions;
  timestamp: number;
}

// ===== LANDING PAGE ANALYTICS TYPES =====

// GlobalKPI interface for consolidated KPIs (Requirements 1.1, 1.2, 1.3, 1.4, 1.5)
export interface GlobalKPI {
  title: string;
  value: number;
  trend: number;
  format: 'currency' | 'number' | 'percentage';
  status: 'excellent' | 'good' | 'warning' | 'critical';
  period: string;
  category: 'critical' | 'important' | 'monitoring';
  description: string;
}

// Service color scheme definitions (Requirements 3.1, 3.4, 4.2)
export interface ServiceColorScheme {
  gradient: string;
  background: string;
  border: string;
  accent: string;

}

// Service metrics for service cards (Requirements 3.1, 3.2, 3.5)
export interface ServiceMetrics {
  revenue: number;
  effectiveness: number;
  totalRegistrations: number;
  activeDrivers: number;
  growth: number;
}

// ServiceCard interface for service navigation (Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6)
export interface ServiceCard {
  id: string;
  name: string;
  icon: LucideIcon;
  colorScheme: ServiceColorScheme;
  metrics: ServiceMetrics;
  path: string;
}



// Service configuration for system setup (Requirements 3.1, 4.2)
export interface ServiceConfiguration {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  colorScheme: ServiceColorScheme;
  routes: {
    controlCenter: string;
    dashboard: string;
  };
  kpiDefinitions: KPIDefinition[];
  chartDefinitions: ChartDefinition[];
}

// KPI definition for service configuration
export interface KPIDefinition {
  id: string;
  title: string;
  description: string;
  calculation: string;
  format: 'currency' | 'number' | 'percentage';
  category: 'critical' | 'important' | 'monitoring';
  thresholds: {
    excellent: number;
    good: number;
    warning: number;
    critical: number;
  };
}

// Chart definition for service configuration
export interface ChartDefinition {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'donut' | 'area';
  dataSource: string;
  height: number;
}

// Top services ranking interface (Requirements 5.1, 5.2, 5.3, 5.4, 5.5)
export interface TopServicesRanking {
  services: ServiceCard[];
  sortBy: 'growth' | 'revenue' | 'effectiveness';
}

// Real-time update interface (Requirements 9.1, 9.2, 9.3, 9.4, 9.5)
export interface RealTimeUpdate {
  timestamp: Date;
  type: 'kpi' | 'service_status';
  serviceId?: string;
  data: GlobalKPI | ServiceCard | Record<string, unknown>;
  priority: 'high' | 'medium' | 'low';
}

// WebSocket message interface for real-time updates
export interface WebSocketMessage {
  event: string;
  data: RealTimeUpdate;
  clientId: string;
}

// ===== CONTROL CENTER TYPES =====

// Service KPI interface for control centers (Requirements 6.1, 6.2)
export interface ServiceKPI {
  id: string;
  title: string;
  value: number;
  trend: number;
  format: 'currency' | 'number' | 'percentage';
  status: 'excellent' | 'good' | 'warning' | 'critical';
  period: string;
  category: 'critical' | 'important' | 'monitoring';
  description: string;
  serviceId: string;
}

// Quick chart interface for control centers (Requirements 6.3)
export interface QuickChart {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'donut' | 'area';
  data: Record<string, unknown>[];
  height: number;
  serviceId: string;
}

// Top variable interface for control centers (Requirements 6.5)
export interface TopVariable {
  category: string;
  items: TopVariableItem[];
}

export interface TopVariableItem {
  name: string;
  value: number;
  trend?: number;
  rank: number;
}

// Control center summary props interface
export interface ControlCenterSummaryProps {
  kpis: ServiceKPI[];
  quickCharts: QuickChart[];
  topVariables: TopVariable[];
  serviceId: string;
  colorScheme: ServiceColorScheme;
}

// Service control center props interface
export interface ServiceControlCenterProps {
  serviceId: string;
  serviceName: string;
  colorScheme: ServiceColorScheme;
}

// ===== DETAILED DASHBOARD TYPES =====

// Detailed KPI interface for dashboard KPI zone (Requirements 7.1, 7.2, 7.3)
export interface DetailedKPI extends GlobalKPI {
  subMetrics?: SubMetric[];
  comparison?: ComparisonData;
}

export interface SubMetric {
  title: string;
  value: number;
  format: 'currency' | 'number' | 'percentage';
  trend?: number;
}

export interface ComparisonData {
  previousPeriod: number;
  benchmark?: number;
  target?: number;
}

// Interactive chart interface for expandable charts (Requirements 7.4, 7.5)
export interface InteractiveChart extends QuickChart {
  expandable: true;
  interpretation?: string;
  recommendations?: string[];
  filters?: ChartFilter[];
}

export interface ChartFilter {
  id: string;
  name: string;
  type: 'select' | 'dateRange' | 'multiSelect';
  options?: FilterOption[];
  value?: string | string[] | DateRange;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface DateRange {
  start: string;
  end: string;
}

// Expandable table interface for dashboard tables (Requirements 7.6, 7.7, 7.8)
export interface ExpandableTable {
  id: string;
  title: string;
  data: Record<string, unknown>[];
  columns: TableColumn[];
  filters: TableFilter[];
  sortable: boolean;
  expandable: boolean;
  rankingSupport: boolean;
}

export interface TableColumn {
  id: string;
  header: string;
  accessor: string;
  type: 'text' | 'number' | 'currency' | 'percentage' | 'date';
  sortable?: boolean;
  width?: string;
}

export interface TableFilter {
  id: string;
  name: string;
  type: 'select' | 'dateRange' | 'multiSelect' | 'search';
  column: string;
  options?: FilterOption[];
  value?: string | string[] | DateRange;
}

// Dashboard layout props interfaces
export interface DashboardLayoutProps {
  serviceId: string;
  children: React.ReactNode;
}

export interface KPIZoneProps {
  kpis: DetailedKPI[];
  layout: 'grid' | 'horizontal';
  isLoading?: boolean;
}

export interface InteractiveChartsZoneProps {
  charts: InteractiveChart[];
  onChartExpand: (chartId: string) => void;
  isLoading?: boolean;
}

export interface ExpandableTablesZoneProps {
  tables: ExpandableTable[];
  isLoading?: boolean;
}

// Chart expansion overlay props
export interface ChartExpansionOverlayProps {
  chart: InteractiveChart;
  isOpen: boolean;
  onClose: () => void;
}

// ===== END DETAILED DASHBOARD TYPES =====

// ===== END CONTROL CENTER TYPES =====

// ===== END LANDING PAGE ANALYTICS TYPES =====
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
// --- Tipos para la Vista Ejecutiva ---
export interface ExecutiveDashboardData {
  kpis: {
    ingresosTotales: Metric;
    usuariosActivos: Metric;
    roi: Metric;
    eficienciaOperativa: Metric;
  };
  businessMetrics: BusinessMetric[];
  profitabilityAnalysis: ProfitabilityData[];
  strategicTrends: StrategicTrendData[];
  regionalPerformance: RegionalPerformanceData[];
  satisfactionMetrics: SatisfactionMetrics;
}

export interface BusinessMetric {
  name: string;
  value: number;
  target: number;
  achievement: number;
  category: 'revenue' | 'growth' | 'efficiency' | 'satisfaction';
}

export interface ProfitabilityData {
  period: string;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
}

export interface StrategicTrendData {
  date: string;
  revenue: number;
  users: number;
  efficiency: number;
  satisfaction: number;
}

export interface RegionalPerformanceData {
  region: string;
  revenue: number;
  users: number;
  growth: number;
  marketShare: number;
}

export interface SatisfactionMetrics {
  customerSatisfaction: number;
  nps: number;
  serviceQuality: number;
  responseTime: number;
}