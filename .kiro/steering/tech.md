# Technology Stack & Build System

## Core Technologies

- **Framework**: Next.js 15.4.1 with App Router
- **Runtime**: React 19.1.0 with TypeScript 5
- **Styling**: Tailwind CSS 3.4.17 with custom design system
- **State Management**: React Context (FiltersContext, SidebarContext, ThemeProvider)
- **Charts**: Recharts 3.1.0 for data visualization
- **Icons**: Lucide React 0.525.0
- **Utilities**: Lodash 4.17.21, clsx 2.1.1, tailwind-merge 3.3.1

## Testing Stack

- **Unit Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright with multi-browser support
- **Accessibility**: Axe Playwright for a11y testing
- **Performance**: Lighthouse CI for performance monitoring
- **Coverage**: Vitest coverage with v8 provider

## Development Tools

- **Linting**: ESLint 9 with Next.js configuration
- **Build Analysis**: Webpack Bundle Analyzer
- **Animation**: Anime.js 3.2.1 for advanced animations
- **Monitoring**: Vercel Speed Insights

## Common Commands

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Production build
npm run start                  # Start production server
npm run lint                   # Run ESLint

# Testing
npm run test                   # Run unit tests
npm run test:ui                # Run tests with UI
npm run test:coverage          # Run tests with coverage
npm run test:e2e               # Run Playwright E2E tests
npm run test:e2e:ui            # Run E2E tests with UI
npm run test:accessibility     # Run accessibility tests

# Performance & Analysis
npm run build:analyze          # Build with bundle analysis
npm run analyze                # Analyze bundle size
npm run performance:test       # Performance testing
npm run test:performance       # Lighthouse performance tests
```

## Build Configuration

- **TypeScript**: Strict mode with build error ignoring for development speed
- **ESLint**: Build errors ignored during development
- **Tailwind**: Custom breakpoints, animations, and design tokens
- **Dark Mode**: Class-based theme switching with CSS variables

## Architecture Patterns

- **Component-First**: Reusable UI components in `/src/components/ui/`
- **Hook-Based Logic**: Custom hooks for data fetching and state management
- **Context Providers**: Global state management for filters, sidebar, and theme
- **Type-Safe**: Comprehensive TypeScript interfaces in `/src/lib/types.ts`
- **Performance Optimized**: Bundle analysis, lazy loading, and caching strategies