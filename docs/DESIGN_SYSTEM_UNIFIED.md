# Sistema de Diseño Unificado

## Descripción
Este documento describe el sistema de diseño unificado implementado para mantener consistencia visual en todos los componentes y páginas de la aplicación, especialmente en el manejo de temas claro y oscuro.

## Problema Resuelto
- **Inconsistencias en fondos de sección**: La sección de "Servicios Disponibles" tenía un color de fondo diferente en modo oscuro
- **Falta de coherencia visual**: Diferentes componentes usaban estilos inconsistentes
- **Paleta de colores fragmentada**: No había un sistema centralizado de colores

## Clases CSS Unificadas

### Fondos de Sección
Todas las secciones ahora usan el mismo sistema de fondos:

```css
/* Modo Claro */
.section-bg-welcome, .section-bg-filters, .section-bg-metrics, 
.section-bg-services, .section-bg-analytics {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(226, 232, 240, 0.6);
  backdrop-filter: blur(8px);
}

/* Modo Oscuro */
.dark .section-bg-welcome, .dark .section-bg-filters, .dark .section-bg-metrics,
.dark .section-bg-services, .dark .section-bg-analytics {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid rgba(51, 65, 85, 0.6);
  backdrop-filter: blur(8px);
}
```

### Contenedores de Sección
```css
.section-container {
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Tarjetas Unificadas
```css
.unified-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 0.75rem;
  padding: 1.5rem;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
}
```

### Tarjetas de Servicios
```css
.service-card-unified {
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(226, 232, 240, 0.7);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Colores de Texto Unificados
```css
.text-primary-unified { color: #0f172a; }
.dark .text-primary-unified { color: #f8fafc; }

.text-secondary-unified { color: #475569; }
.dark .text-secondary-unified { color: #cbd5e1; }

.text-tertiary-unified { color: #64748b; }
.dark .text-tertiary-unified { color: #94a3b8; }
```

### Bordes Unificados
```css
.border-unified { border-color: rgba(226, 232, 240, 0.6); }
.dark .border-unified { border-color: rgba(51, 65, 85, 0.6); }
```

### Estados Hover Unificados
```css
.hover-unified:hover {
  background-color: rgba(248, 250, 252, 0.8);
  border-color: rgba(37, 99, 235, 0.2);
}
```

## Componentes Actualizados

### DashboardSection
- Usa `section-container` para estructura consistente
- Implementa `border-unified` para bordes consistentes
- Usa `text-primary-unified` y `text-secondary-unified` para colores de texto

### MetricCard
- Implementa `unified-card` y `hover-unified`
- Usa colores de texto unificados
- Mantiene efectos de hover consistentes

### Página Principal
- Las tarjetas de servicios usan `service-card-unified`
- Las tarjetas de dashboard analíticos usan `unified-card`
- Todos los elementos mantienen la misma estética

## Beneficios

1. **Consistencia Visual**: Todos los componentes siguen el mismo patrón de diseño
2. **Mantenimiento Simplificado**: Cambios centralizados en `globals.css`
3. **Mejor UX**: Transiciones y efectos uniformes en toda la aplicación
4. **Accesibilidad**: Soporte para `prefers-reduced-motion`
5. **Rendimiento**: Uso eficiente de `backdrop-filter` y transiciones CSS

## Uso

Para aplicar el sistema unificado en nuevos componentes:

```tsx
// Tarjeta básica
<div className="unified-card hover-unified">
  <h3 className="text-primary-unified">Título</h3>
  <p className="text-secondary-unified">Descripción</p>
</div>

// Sección con fondo
<section className="section-bg-services section-container">
  <div className="border-b border-unified">
    <h2 className="text-primary-unified">Título de Sección</h2>
  </div>
</section>
```

## Variables CSS Disponibles

El sistema utiliza las variables CSS definidas en `:root` para mantener consistencia:

- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--border`, `--ring`

## Soporte para Temas

El sistema soporta automáticamente modo claro y oscuro mediante:
- Clase `.dark` en el elemento raíz
- Variables CSS que cambian según el tema
- Transiciones suaves entre temas