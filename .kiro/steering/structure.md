# Project Structure & Organization

## Root Directory Structure

```
├── .kiro/                     # Kiro AI configuration and steering
├── docs/                      # Project documentation
├── public/                    # Static assets (SVGs, images)
├── src/                       # Source code
├── tests/                     # E2E tests (Playwright)
├── test-results/              # Test execution results
└── playwright-report/         # Test reports
```

## Source Code Organization (`/src`)

### Core Application (`/src/app`)
- **App Router Structure**: Next.js 15 app directory pattern
- **Layout**: Root layout with providers and sidebar
- **Pages**: Route-based page components
- **API Routes**: Backend API endpoints in `/api`

### Component Architecture (`/src/components`)
```
components/
├── ui/                        # Reusable UI components
├── dashboard/                 # Dashboard-specific components
├── dashboards/                # Service-specific dashboard views
├── charts/                    # Chart components (Recharts)
└── examples/                  # Example/demo components
```

### Business Logic (`/src/lib`)
- **types.ts**: Comprehensive TypeScript interfaces
- **constants.ts**: Application constants and configuration
- **utils.ts**: Utility functions and helpers
- **api-service.ts**: API communication layer
- **data.ts**: Mock data and data transformations
- **design-system.ts**: Design system utilities
- **performance-utils.ts**: Performance optimization utilities

### State Management (`/src/contexts`)
- **FiltersContext.tsx**: Global filter state management
- **SidebarContext.tsx**: Sidebar collapse/expand state
- **ThemeProvider.tsx**: Dark/light theme management

### Custom Hooks (`/src/hooks`)
- **Data Hooks**: `useApiData`, `useDashboardData`, `useExecutiveDashboard`
- **UI Hooks**: `useLoadingState`, `useNotifications`, `usePersistentState`
- **Business Logic**: `useAdvancedFilters`, `usePerformanceOptimization`
- **Styling**: `useUnifiedStyles`

### Utilities (`/src/utils`)
- **dataCache.ts**: Data caching and performance optimization

### Configuration (`/src/config`)
- **navigation.ts**: Navigation structure and routing configuration

## Design System Implementation

### CSS Architecture
- **globals.css**: Global styles, CSS variables, unified design system
- **Tailwind Config**: Custom breakpoints, animations, color schemes
- **Component Classes**: Unified CSS classes for consistent styling

### Theme System
- **CSS Variables**: Dynamic theming with HSL color space
- **Dark Mode**: Class-based theme switching (`dark` class)
- **Responsive Design**: Mobile-first with custom breakpoints

## Testing Structure

### E2E Tests (`/tests`)
- **Playwright Tests**: Comprehensive user flow testing
- **Test Data**: Uses `data-testid` attributes for reliable selectors
- **Multi-Browser**: Chrome, Firefox, Safari, Mobile testing

### Test Patterns
- **Page Object Model**: Structured test organization
- **Accessibility Testing**: Integrated a11y checks
- **Performance Testing**: Lighthouse integration
- **Visual Regression**: Screenshot comparison capabilities

## File Naming Conventions

- **Components**: PascalCase (e.g., `MetricCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useApiData.ts`)
- **Utilities**: camelCase (e.g., `dataCache.ts`)
- **Types**: Interfaces in PascalCase, files in camelCase
- **Tests**: `.spec.ts` suffix for test files

## Import Organization

```typescript
// External libraries
import React from 'react';
import { NextPage } from 'next';

// Internal utilities and types
import { Metric, FilterOptions } from '@/lib/types';
import { cn } from '@/lib/utils';

// Components (UI first, then specific)
import { Button } from '@/components/ui/Button';
import { MetricCard } from '@/components/dashboard/MetricCard';

// Hooks and contexts
import { useFilters } from '@/contexts/FiltersContext';
import { useApiData } from '@/hooks/useApiData';
```

## Documentation Standards

- **Component Documentation**: JSDoc comments for complex components
- **Type Documentation**: Comprehensive interface documentation
- **API Documentation**: Endpoint documentation in `/docs`
- **Design System**: Unified design system documentation