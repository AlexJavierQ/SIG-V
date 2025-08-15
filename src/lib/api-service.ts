/**
 * Servicio para construir URLs del endpoint /datos según la documentación
 */

export interface EndpointFilters {
    tabla: string; // Obligatorio: marketing, finanzas, df_operativos_prueba, df_ventas_prueba
    fecha?: string; // Formato yyyy-mm-dd
    anio?: number; // 4 dígitos
    mes?: number; // 1 a 12
    dia_semana?: string; // En español (minúsculas, tolera tildes)
    pais?: string; // Nombre del país
    ciudad?: string; // Nombre de la ciudad
    aplicativo?: string; // Nombre del aplicativo
}

export interface ApiResponse {
    data: any[];
    timestamp: number;
    filters: EndpointFilters;
}

export interface CacheEntry {
    data: any[];
    timestamp: number;
    expiresAt: number;
}

// Tipos específicos para evitar 'any'
export interface GlobalFilters {
    app: string;
    country: string;
    city: string;
    period: string;
    establishment: string;
    includeNonTransactional: boolean;
    isExpanded: boolean;
    lastUpdated: Date;
    fecha_exacta?: string;
    dia_semana?: string;
}

export class ApiService {
    private static readonly BASE_URL = 'http://localhost:8000/datos';
    private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos
    private static cache = new Map<string, CacheEntry>();

    /**
     * Construye la URL completa para el endpoint /datos
     */
    static buildDataUrl(filters: EndpointFilters): string {
        const url = new URL(this.BASE_URL);

        // Tabla es obligatorio
        url.searchParams.set('tabla', filters.tabla);

        // Agregar parámetros opcionales si están presentes
        if (filters.fecha) {
            url.searchParams.set('fecha', filters.fecha);
        }

        if (filters.anio) {
            url.searchParams.set('anio', filters.anio.toString());
        }

        if (filters.mes) {
            url.searchParams.set('mes', filters.mes.toString());
        }

        if (filters.dia_semana) {
            url.searchParams.set('dia', filters.dia_semana);
        }

        if (filters.pais) {
            url.searchParams.set('pais', filters.pais);
        }

        if (filters.ciudad) {
            url.searchParams.set('ciudad', filters.ciudad);
        }

        if (filters.aplicativo) {
            url.searchParams.set('aplicativo', filters.aplicativo);
        }

        return url.toString();
    }

    /**
     * Genera una clave única para el caché basada en los filtros
     */
    private static generateCacheKey(filters: EndpointFilters): string {
        return JSON.stringify(filters);
    }

    /**
     * Verifica si los datos en caché son válidos
     */
    private static isCacheValid(entry: CacheEntry): boolean {
        return Date.now() < entry.expiresAt;
    }

    /**
     * Obtiene datos del caché si están disponibles y válidos
     */
    private static getFromCache(filters: EndpointFilters): any[] | null {
        const key = this.generateCacheKey(filters);
        const entry = this.cache.get(key);

        if (entry && this.isCacheValid(entry)) {
            return entry.data;
        }

        // Limpiar entrada expirada
        if (entry) {
            this.cache.delete(key);
        }

        return null;
    }

    /**
     * Guarda datos en el caché
     */
    private static saveToCache(filters: EndpointFilters, data: any[]): void {
        const key = this.generateCacheKey(filters);
        const entry: CacheEntry = {
            data,
            timestamp: Date.now(),
            expiresAt: Date.now() + this.CACHE_DURATION
        };

        this.cache.set(key, entry);
    }

    /**
     * Limpia el caché completo
     */
    static clearCache(): void {
        this.cache.clear();
    }

    /**
     * Convierte los filtros del contexto global a filtros del endpoint
     */
    static convertGlobalFiltersToEndpoint(
        globalFilters: GlobalFilters,
        tabla: string
    ): EndpointFilters {
        const endpointFilters: EndpointFilters = {
            tabla
        };

        // Mapear aplicativo
        if (globalFilters.app && globalFilters.app !== 'Todos los aplicativos') {
            endpointFilters.aplicativo = globalFilters.app;
        }

        // Mapear país
        if (globalFilters.country && globalFilters.country !== 'Todos los países') {
            endpointFilters.pais = globalFilters.country;
        }

        // Mapear ciudad
        if (globalFilters.city && globalFilters.city !== 'Todas las ciudades') {
            endpointFilters.ciudad = globalFilters.city;
        }

        // Mapear período a fecha/año/mes
        if (globalFilters.period && globalFilters.period !== 'Este mes') {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            switch (globalFilters.period) {
                case 'Este año':
                    endpointFilters.anio = currentYear;
                    break;
                case 'Mes pasado':
                    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
                    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
                    endpointFilters.anio = lastMonthYear;
                    endpointFilters.mes = lastMonth;
                    break;
                case 'Mes siguiente':
                    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
                    const nextMonthYear = currentMonth === 12 ? currentYear + 1 : currentYear;
                    endpointFilters.anio = nextMonthYear;
                    endpointFilters.mes = nextMonth;
                    break;
            }
        }

        // Agregar día de semana si está presente
        if (globalFilters.dia_semana) {
            endpointFilters.dia_semana = globalFilters.dia_semana;
        }

        // Agregar fecha exacta si está presente
        if (globalFilters.fecha_exacta) {
            endpointFilters.fecha = globalFilters.fecha_exacta;
        }

        return endpointFilters;
    }

    /**
     * Realiza una llamada al endpoint y retorna los datos con caché
     */
    static async fetchData(filters: EndpointFilters): Promise<ApiResponse> {
        // Intentar obtener datos del caché primero
        const cachedData = this.getFromCache(filters);
        if (cachedData) {
            return {
                data: cachedData,
                timestamp: Date.now(),
                filters
            };
        }

        const url = this.buildDataUrl(filters);

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            // Guardar en caché
            this.saveToCache(filters, data);

            return {
                data,
                timestamp: Date.now(),
                filters
            };
        } catch (error) {
            console.error('Error fetching data from endpoint:', error);
            throw new Error(`Failed to fetch data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Obtiene datos para una tabla específica usando los filtros globales
     */
    static async getTableData(tabla: string, globalFilters: GlobalFilters): Promise<ApiResponse> {
        const endpointFilters = this.convertGlobalFiltersToEndpoint(globalFilters, tabla);
        return this.fetchData(endpointFilters);
    }
}

// Constantes para las tablas disponibles
export const AVAILABLE_TABLES = {
    MARKETING: 'marketing',
    FINANZAS: 'finanzas',
    OPERATIVOS: 'df_operativos_prueba',
    VENTAS: 'df_ventas_prueba'
} as const;

// Días de la semana en español (según documentación)
export const DIAS_SEMANA = [
    'lunes',
    'martes',
    'miércoles',
    'miercoles', // Sin tilde también
    'jueves',
    'viernes',
    'sábado',
    'sabado', // Sin tilde también
    'domingo'
] as const;