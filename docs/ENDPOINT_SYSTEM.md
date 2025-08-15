# Sistema de Consulta de Endpoints

## Descripción

Este sistema implementa un flujo de consulta bajo demanda para los endpoints de datos, eliminando las consultas en tiempo real continuas y optimizando el rendimiento.

## Componentes Principales

### 1. Hook `useEndpointData`

Hook personalizado que maneja las consultas a los endpoints de manera eficiente.

```typescript
import { useEndpointData } from '@/hooks/useEndpointData';

const { marketing, finanzas, operativos, ventas, fetchData, isLoading } = useEndpointData();
```

#### Características:
- **Consultas paralelas**: Ejecuta todas las consultas simultáneamente
- **Manejo de errores**: Captura y reporta errores por endpoint
- **Estados de carga**: Indica el estado de cada consulta individualmente
- **Filtros flexibles**: Permite aplicar filtros dinámicos a las consultas

### 2. Componente `FloatingSystemStatus`

Botón flotante que muestra el estado del sistema y permite verificar endpoints.

```typescript
<FloatingSystemStatus 
    endpointData={{
        marketing,
        finanzas,
        operativos,
        ventas
    }}
    onCheckEndpoints={handleCheckEndpoints}
/>
```

#### Características:
- **Estado visual**: Botón que cambia de color según el estado general
- **Overlay informativo**: Muestra detalles de cada endpoint
- **Verificación manual**: Permite consultar endpoints bajo demanda
- **Métricas en tiempo real**: Muestra registros totales y estado de conexión

## Flujo de Trabajo

### 1. Consulta Inicial
```typescript
const handleInitialLoad = async () => {
    await fetchData(); // Sin filtros para carga inicial
};
```

### 2. Aplicación de Filtros
```typescript
const handleApplyFilters = async () => {
    await fetchData(filters); // Con filtros específicos
};
```

### 3. Verificación de Endpoints
```typescript
const handleCheckEndpoints = async () => {
    await fetchData(filters); // Usar filtros actuales
};
```

## Filtros Disponibles

```typescript
interface EndpointFilters {
  tabla: string;           // Tabla a consultar (automático)
  fecha?: string;          // Fecha exacta (YYYY-MM-DD)
  anio?: number;           // Año (4 dígitos)
  mes?: number;            // Mes (1-12)
  dia_semana?: string;     // Día de la semana en español
  pais?: string;           // Nombre del país
  ciudad?: string;         // Nombre de la ciudad
  aplicativo?: string;     // Nombre del aplicativo
}
```

## Endpoints Configurados

| Endpoint | Tabla | Descripción |
|----------|-------|-------------|
| Marketing | `marketing` | Datos de campañas y adquisición |
| Finanzas | `finanzas` | Datos de ingresos y rentabilidad |
| Operaciones | `df_operativos_prueba` | Datos de procesos y eficiencia |
| Ventas | `df_ventas_prueba` | Datos de rendimiento comercial |

## Ejemplo de Uso Completo

```typescript
"use client";

import React, { useState } from 'react';
import FloatingSystemStatus from '@/components/ui/FloatingSystemStatus';
import { useEndpointData, EndpointFilters } from '@/hooks/useEndpointData';

export default function Dashboard() {
    const { marketing, finanzas, operativos, ventas, fetchData, isLoading } = useEndpointData();
    const [filters, setFilters] = useState<Partial<EndpointFilters>>({});

    const handleInitialLoad = async () => {
        await fetchData();
    };

    const handleApplyFilters = async () => {
        await fetchData(filters);
    };

    const handleCheckEndpoints = async () => {
        await fetchData(filters);
    };

    return (
        <div>
            {/* Controles de filtros */}
            <div>
                <select 
                    value={filters.pais || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, pais: e.target.value || undefined }))}
                >
                    <option value="">Todos los países</option>
                    <option value="Ecuador">Ecuador</option>
                </select>
                
                <button onClick={handleInitialLoad} disabled={isLoading}>
                    Carga Inicial
                </button>
                
                <button onClick={handleApplyFilters} disabled={isLoading}>
                    Aplicar Filtros
                </button>
            </div>

            {/* Mostrar datos */}
            <div>
                <h3>Marketing: {marketing.data?.length || 0} registros</h3>
                {marketing.loading && <p>Cargando...</p>}
                {marketing.error && <p>Error: {marketing.error}</p>}
            </div>

            {/* Botón flotante de estado */}
            <FloatingSystemStatus 
                endpointData={{ marketing, finanzas, operativos, ventas }}
                onCheckEndpoints={handleCheckEndpoints}
            />
        </div>
    );
}
```

## Ventajas del Sistema

1. **Rendimiento optimizado**: No hay consultas continuas en segundo plano
2. **Control total**: El usuario decide cuándo consultar datos
3. **Manejo de errores robusto**: Cada endpoint maneja sus errores independientemente
4. **Filtros flexibles**: Permite combinaciones complejas de filtros
5. **Estado visual claro**: El botón flotante indica el estado general del sistema
6. **Consultas paralelas**: Todas las consultas se ejecutan simultáneamente

## Configuración del Servidor

Asegúrate de que el servidor backend esté configurado para:

1. **CORS**: Permitir requests desde `http://localhost:3000`
2. **Endpoints**: Responder en `http://localhost:8000/datos`
3. **Parámetros**: Aceptar los filtros como query parameters
4. **Timeout**: Responder dentro de 10 segundos

## Estados del Sistema

- **🟢 Verde**: Todos los endpoints funcionando correctamente
- **🟡 Amarillo**: Algunos endpoints con problemas o respuestas lentas
- **🔴 Rojo**: Endpoints sin conexión o con errores
- **🔵 Azul**: Consultas en progreso