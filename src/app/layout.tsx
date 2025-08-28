'use client';

// Importa clsx al inicio del archivo
import clsx from 'clsx';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { FiltersProvider } from '@/contexts/FiltersContext';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import Sidebar from '@/components/ui/Sidebar';
import './globals.css';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    // Contenedor principal que gestiona la disposición
    <div className="flex min-h-screen">
      <Sidebar />
      {/* - Transición más suave con 'ease-in-out'.
        - Se usa `clsx` para un manejo de clases más limpio.
        - Se añade un padding generoso y responsivo (p-4, sm:p-6, lg:p-8) para que el contenido respire.
      */}
      <main
        className={clsx(
          'flex-1 transition-all duration-300 ease-in-out',
          { 'lg:ml-20': isCollapsed, 'lg:ml-64': !isCollapsed }
        )}
      >
        {children}
      </main>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>Clipp Dashboard | CLIPP Analytics</title>
        <meta name="description" content="Dashboard de métricas y análisis estratégico para Clipp" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <FiltersProvider>
            <SidebarProvider>
              <LayoutContent>
                {children}
              </LayoutContent>
            </SidebarProvider>
          </FiltersProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}