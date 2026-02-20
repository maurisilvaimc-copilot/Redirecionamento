import React, { useEffect } from 'react';
import { Layout } from "@/components/Layout";
import { LeftPanel } from "@/components/LeftPanel";
import { WorkArea } from "@/components/WorkArea";
import { BottomPanel } from "@/components/BottomPanel";
import { useIDRStore } from "@/hooks/useIDRStore";
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import { ProgressModal } from "@/components/Modals";

/**
 * Workspace principal da aplicação IDR Web Edition.
 * Esta página organiza a interface em painéis redimensionáveis e gerencia 
 * os atalhos de teclado globais que replicam a experiência do IDR original (F1-F11).
 */
export default function IDRWorkspace() {
  const {
    setActiveTab,
    setActiveLeftTab,
    isDecompiling,
    isCompiling
  } = useIDRStore();

  /**
   * Configuração de atalhos de teclado globais conforme o legado do Delphi IDR.
   * Permite navegação rápida entre abas de descompilação.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Lista de teclas de função para navegação
      const functionKeys = ['F1', 'F2', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11'];
      
      if (functionKeys.includes(e.key)) {
        e.preventDefault();
        
        switch (e.key) {
          case 'F1':
            // Ajuda / Manual
            break;
          case 'F2':
            setActiveLeftTab('units');
            break;
          case 'F4':
            setActiveLeftTab('types');
            break;
          case 'F5':
            setActiveLeftTab('forms');
            setActiveTab('forms');
            break;
          case 'F6':
            setActiveTab('code');
            break;
          case 'F7':
            setActiveTab('class');
            break;
          case 'F8':
            setActiveTab('strings');
            break;
          case 'F9':
            setActiveTab('names');
            break;
          case 'F10':
            setActiveTab('source');
            break;
          case 'F11':
            setActiveTab('map');
            break;
        }
      }

      // Atalhos de Editor e Ferramentas
      if (e.ctrlKey) {
        // Salvar Projeto
        if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          // Trigger save project action
        }
        // Recompilar Binário
        if (e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          // Trigger recompile action
        }
        // Buscar
        if (e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          // Trigger search in active tab
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab, setActiveLeftTab]);

  return (
    <Layout>
      <div className="flex h-full w-full flex-col overflow-hidden bg-background">
        {/* Estrutura de Painéis Redimensionáveis Profissional */}
        <ResizablePanelGroup 
          direction="vertical" 
          className="flex-1 h-full min-h-0"
        >
          {/* Área Principal (Topo): Painel Esquerdo + Visualizador Central */}
          <ResizablePanel 
            defaultSize={75} 
            minSize={30} 
            className="flex flex-col"
          >
            <ResizablePanelGroup direction="horizontal" className="h-full">
              {/* Painel Esquerdo: Árvore de Unidades, Tipos RTTI e Formulários DFM */}
              <ResizablePanel 
                defaultSize={20} 
                minSize={15} 
                className="bg-sidebar/40 border-r border-border overflow-hidden"
              >
                <LeftPanel />
              </ResizablePanel>
              
              <ResizableHandle 
                withHandle 
                className="w-1.5 bg-border/20 hover:bg-primary/40 transition-colors cursor-col-resize"
              />
              
              {/* Área de Trabalho Central: Visualizadores de Código, Classes, Strings e Editor Source */}
              <ResizablePanel 
                defaultSize={80} 
                className="bg-background overflow-hidden relative"
              >
                <WorkArea />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          
          <ResizableHandle 
            withHandle 
            className="h-1.5 bg-border/20 hover:bg-primary/40 transition-colors cursor-row-resize"
          />
          
          {/* Painel Inferior: Itens da Unidade Selecionada / Console de Log */}
          <ResizablePanel 
            defaultSize={25} 
            minSize={10} 
            className="bg-sidebar/30 border-t border-border overflow-hidden"
          >
            <BottomPanel />
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Modais de Progresso de Operações Longas */}
        {(isDecompiling || isCompiling) && <ProgressModal />}
      </div>
    </Layout>
  );
}
