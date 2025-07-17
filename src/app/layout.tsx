import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import Sidebar from "@/components/ui/Sidebar";
// --- 1. Importa el nuevo componente ---
import ScriptLoader from "@/components/common/ScriptLoader";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Clipp Dashboard",
  description: "Dashboard de métricas de Clipp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-slate-50 dark:bg-slate-900 transition-colors duration-300`}
      >
        <ThemeProvider>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </ThemeProvider>

        {/* --- 2. Usa el nuevo componente aquí --- */}
        <ScriptLoader />
      </body>
    </html>
  );
}
