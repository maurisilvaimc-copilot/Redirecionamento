import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { MotionConfig } from "framer-motion";
import { ROUTE_PATHS } from "@/lib/index";
import Home from "@/pages/Home";
import IDRWorkspace from "@/pages/IDRWorkspace";

/**
 * Cliente para gerenciamento de estado assíncrono e cache de dados
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
});

/**
 * Componente Raiz da Aplicação IDR Web Edition
 * 
 * Responsável pela configuração de:
 * - Roteamento (React Router)
 * - Gerenciamento de Dados (React Query)
 * - Feedback de UI (Toasters e Tooltips)
 * - Configurações de Animação (Framer Motion)
 * 
 * @copyright 2026 IDR Web Edition
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300}>
        <MotionConfig reducedMotion="user">
          <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
            <BrowserRouter>
              <Routes>
                {/* Rota Inicial: Landing Page e Apresentação */}
                <Route 
                  path={ROUTE_PATHS.HOME} 
                  element={<Home />} 
                />
                
                {/* Rota do Workspace: Ambiente de Decompilação e Edição */}
                <Route 
                  path={ROUTE_PATHS.WORKSPACE} 
                  element={<IDRWorkspace />} 
                />

                {/* Fallback para rotas não encontradas */}
                <Route 
                  path="*" 
                  element={<Home />} 
                />
              </Routes>
            </BrowserRouter>

            {/* Componentes de Feedback Global */}
            <Toaster />
            <Sonner 
              position="bottom-right" 
              theme="dark" 
              expand={false} 
              richColors 
              closeButton
            />
          </div>
        </MotionConfig>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
