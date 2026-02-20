import React from 'react';
import { MenuBar } from '@/components/MenuBar';
import { ToolBar } from '@/components/ToolBar';
import { StatusBar } from '@/components/StatusBar';
import { useIDRStore } from '@/hooks/useIDRStore';
import { IMAGES } from '@/assets/images';

/**
 * Layout principal da aplicação IDR Web Edition.
 * 
 * Este componente serve como o 'shell' da aplicação, gerenciando as barras de topo (Menu e Ferramentas),
 * a área central de trabalho e a barra de status inferior. 
 * 
 * O design segue uma estética 'Cyber-Forensic Professional' com suporte total a temas claro/escuro,
 * otimizado para longas sessões de engenharia reversa e análise de binários.
 */

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const theme = useIDRStore((state) => state.theme);

  return (
    <div 
      className={`
        flex flex-col h-screen w-full overflow-hidden 
        bg-background text-foreground font-sans transition-colors duration-200
        ${theme === 'dark' ? 'dark' : ''}
      `}
    >
      {/* Topo da Aplicação: Barra de Marca, Menu e Ferramentas */}
      <header className="flex flex-col shrink-0 border-b border-border bg-card shadow-sm z-50">
        {/* Barra Superior Integrada: Logo + MenuBar */}
        <div className="flex items-center bg-muted/40 px-3 h-10 border-b border-border/50">
          <div className="flex items-center gap-2 mr-6 select-none shrink-0">
            <img 
              src={IMAGES.IDR_LOGO_20260220_015613_1} 
              alt="IDR Logo" 
              className="h-6 w-6 grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
              draggable={false}
            />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
                IDR Web
              </span>
              <span className="text-[9px] font-medium text-muted-foreground uppercase">
                Edition 2026
              </span>
            </div>
          </div>
          
          {/* Barra de Menu em Português do Brasil */}
          <div className="flex-1 h-full flex items-center overflow-hidden">
            <MenuBar />
          </div>
        </div>

        {/* Barra de Ferramentas de Acesso Rápido */}
        <ToolBar />
      </header>

      {/* 
        Área de Trabalho Principal (Workspace)
        Ocupa o espaço flexível entre o cabeçalho e o rodapé.
        Aqui são injetados os painéis redimensionáveis (LeftPanel, WorkArea, BottomPanel)
        através da propriedade children, conforme definido no Workspace da aplicação.
        O uso de overflow-hidden e min-h-0 é crucial para que os painéis redimensionáveis
        funcionem corretamente sem quebrar o layout da página.
      */}
      <main className="flex-1 relative flex flex-col min-h-0 overflow-hidden bg-background">
        {children}
      </main>

      {/* Rodapé: Barra de Status Contextual */}
      <footer className="shrink-0 border-t border-border bg-card z-50">
        <StatusBar />
      </footer>

      {/* Overlay de carregamento global para processos pesados (opcional) */}
      {useIDRStore.getState().isDecompiling && (
        <div className="fixed inset-0 z-[100] bg-background/20 backdrop-blur-[1px] pointer-events-none transition-all" />
      )}
    </div>
  );
}
