import { NextRequest, NextResponse } from 'next/server';

// Datos de ejemplo para diferentes tablas
const mockData = {
    marketing: [
        {
            id: 1,
            fecha: '2025-01-08',
            aplicativo: 'Clipp',
            pais: 'Ecuador',
            ciudad: 'Riobamba',
            usuarios_activos: 1250,
            nuevos_usuarios: 45,
            campanas_activas: 8,
            ctr: 3.2,
            conversion_rate: 2.1,
            costo_adquisicion: 12.50,
            valor_vida_cliente: 180.00
        },
        {
            id: 2,
            fecha: '2025-01-07',
            aplicativo: 'Clipp',
            pais: 'Ecuador',
            ciudad: 'Riobamba',
            usuarios_activos: 1180,
            nuevos_usuarios: 38,
            campanas_activas: 7,
            ctr: 2.9,
            conversion_rate: 1.8,
            costo_adquisicion: 13.20,
            valor_vida_cliente: 175.00
        }
    ],
    finanzas: [
        {
            id: 1,
            fecha: '2025-01-08',
            aplicativo: 'Clipp',
            pais: 'Ecuador',
            ciudad: 'Riobamba',
            ingresos_totales: 45600,
            ingresos_brutos: 52000,
            comisiones: 6400,
            gastos_operativos: 8200,
            margen_bruto: 0.875,
            roi: 0.156,
            transacciones: 2840,
            ticket_promedio: 16.05
        },
        {
            id: 2,
            fecha: '2025-01-07',
            aplicativo: 'Clipp',
            pais: 'Ecuador',
            ciudad: 'Riobamba',
            ingresos_totales: 42300,
            ingresos_brutos: 48500,
            comisiones: 6200,
            gastos_operativos: 7800,
            margen_bruto: 0.872,
            roi: 0.142,
            transacciones: 2650,
            ticket_promedio: 15.96
        }
    ],
    df_operativos_prueba: [
        {
            id: 1,
            fecha: '2025-01-08',
            aplicativo: 'Clipp',
            pais: 'Ecuador',
            ciudad: 'Riobamba',
            viajes_completados: 2840,
            viajes_cancelados: 156,
            tiempo_espera_promedio: 4.2,
            tiempo_viaje_promedio: 12.8,
            conductores_activos: 180,
            eficiencia_operativa: 0.875,
            satisfaccion_cliente: 4.6,
            distancia_promedio: 5.2
        },
        {
            id: 2,
            fecha: '2025-01-07',
            aplicativo: 'Clipp',
            pais: 'Ecuador',
            ciudad: 'Riobamba',
            viajes_completados: 2650,
            viajes_cancelados: 142,
            tiempo_espera_promedio: 4.5,
            tiempo_viaje_promedio: 13.1,
            conductores_activos: 175,
            eficiencia_operativa: 0.869,
            satisfaccion_cliente: 4.5,
            distancia_promedio: 5.4
        }
    ],
    df_ventas_prueba: [
        {
            id: 1,
            fecha: '2025-01-08',
            aplicativo: 'Clipp',
            pais: 'Ecuador',
            ciudad: 'Riobamba',
            ventas_totales: 45600,
            unidades_vendidas: 2840,
            precio_promedio: 16.05,
            descuentos_aplicados: 2280,
            promociones_activas: 5,
            conversion_rate: 0.68,
            abandono_carrito: 0.32,
            valor_pedido_promedio: 16.05
        },
        {
            id: 2,
            fecha: '2025-01-07',
            aplicativo: 'Clipp',
            pais: 'Ecuador',
            ciudad: 'Riobamba',
            ventas_totales: 42300,
            unidades_vendidas: 2650,
            precio_promedio: 15.96,
            descuentos_aplicados: 2120,
            promociones_activas: 4,
            conversion_rate: 0.65,
            abandono_carrito: 0.35,
            valor_pedido_promedio: 15.96
        }
    ]
};

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Obtener parámetros
        const tabla = searchParams.get('tabla');
        const fecha = searchParams.get('fecha');
        const anio = searchParams.get('anio');
        const mes = searchParams.get('mes');
        const dia = searchParams.get('dia');
        const pais = searchParams.get('pais');
        const ciudad = searchParams.get('ciudad');
        const aplicativo = searchParams.get('aplicativo');

        // Validar tabla obligatoria
        if (!tabla) {
            return NextResponse.json(
                { error: 'El parámetro "tabla" es obligatorio' },
                { status: 400 }
            );
        }

        // Validar que la tabla existe
        if (!mockData[tabla as keyof typeof mockData]) {
            return NextResponse.json(
                { error: `Tabla "${tabla}" no encontrada. Tablas disponibles: ${Object.keys(mockData).join(', ')}` },
                { status: 404 }
            );
        }

        // Obtener datos de la tabla
        let data = mockData[tabla as keyof typeof mockData];

        // Aplicar filtros si están presentes
        if (fecha) {
            data = data.filter(item => item.fecha === fecha);
        }

        if (anio) {
            data = data.filter(item => item.fecha.startsWith(anio));
        }

        if (mes && anio) {
            const mesStr = mes.padStart(2, '0');
            data = data.filter(item => item.fecha.startsWith(`${anio}-${mesStr}`));
        }

        if (pais) {
            data = data.filter(item => item.pais?.toLowerCase() === pais.toLowerCase());
        }

        if (ciudad) {
            data = data.filter(item => item.ciudad?.toLowerCase() === ciudad.toLowerCase());
        }

        if (aplicativo) {
            data = data.filter(item => item.aplicativo?.toLowerCase() === aplicativo.toLowerCase());
        }

        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 100));

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error en API /datos:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}