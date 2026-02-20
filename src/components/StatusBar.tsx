import React from 'react';
import { useIDRStore } from '@/hooks/useIDRStore';
import { Progress } from '@/components/ui/progress';
import { FileIcon, Cpu, Activity, Hash, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Barra de status inferior da aplicação IDR Web Edition.
 * Exibe informações contextuais sobre o arquivo carregado, versão do Delphi,
 * progresso de operações assíncronas e estado atual do sistema.
 */
export function StatusBar() {
  // Seletores do estado global do Zustand
  const loadedFile = useIDRStore((state) => state.loadedFile);
  const isDecompiling = useIDRStore((state) => state.isDecompiling);
  const isCompiling = useIDRStore((state) => state.isCompiling);
  const progress = useIDRStore((state) => state.progress);
  const progressMessage = useIDRStore((state) => state.progressMessage);
  const selectedUnitId = useIDRStore((state) => state.selectedUnitId);
  const units = useIDRStore((state) => state.units);

  // Determinação dinâmica do status visual e textual
  let statusText = "Pronto";
  let StatusIcon = CheckCircle2;
  let statusColorClass = "text-emerald-500 dark:text-emerald-400";

  if (isDecompiling) {
    statusText = "Decompilando...";
    StatusIcon = Activity;
    statusColorClass = "text-blue-500 dark:text-blue-400";
  } else if (isCompiling) {
    statusText = "Compilando...";
    StatusIcon = Cpu;
    statusColorClass = "text-purple-500 dark:text-purple-400";
  }

  // Endereço mock ou derivado da unidade selecionada
  const currentAddress = React.useMemo(() => {
    if (selectedUnitId) {
      const unit = units.find(u => u.id === selectedUnitId);
      return unit?.address || "00401000";
    }
    return "00401000"; // Default Entry Point mock
  }, [selectedUnitId, units]);

  return (
    <footer className="h-7 bg-sidebar border-t border-sidebar-border flex items-center justify-between px-3 text-[11px] font-sans text-sidebar-foreground select-none shrink-0">
      <div className="flex items-center gap-4 h-full">
        {/* Seção: Informações do Arquivo Binário */}
        <div className="flex items-center gap-1.5 border-r border-sidebar-border pr-4 h-full">
          <FileIcon size={12} className="text-sidebar-primary opacity-80" />
          <span className="font-medium truncate max-w-[200px] text-foreground">
            {loadedFile ? loadedFile.name : "Nenhum arquivo carregado"}
          </span>
        </div>

        {/* Seção: Versão do Delphi Detectada */}
        <div className="flex items-center gap-1.5 border-r border-sidebar-border pr-4 h-full">
          <Cpu size={12} className="text-chart-2 opacity-80" />
          <span className="opacity-70">Versão:</span>
          <span className="font-medium text-foreground">
            {loadedFile ? loadedFile.delphiVersion : "---"}
          </span>
        </div>

        {/* Seção: Barra de Progresso (Exibida apenas durante processamento) */}
        {(isDecompiling || isCompiling) && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="italic opacity-80 whitespace-nowrap">{progressMessage}</span>
            <div className="w-32">
              <Progress value={progress} className="h-1.5" />
            </div>
            <span className="w-8 font-mono text-foreground">{Math.round(progress)}%</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 h-full">
        {/* Seção: Endereço de Memória Atual */}
        <div className="flex items-center gap-1.5 border-l border-sidebar-border pl-4 h-full">
          <Hash size={12} className="text-chart-4 opacity-80" />
          <span className="opacity-70">Endereço:</span>
          <span className="font-mono font-medium tracking-tight text-foreground">
            {currentAddress}
          </span>
        </div>

        {/* Seção: Status Operacional do Sistema */}
        <div className={cn(
          "flex items-center gap-1.5 pl-4 border-l border-sidebar-border h-full font-semibold transition-colors",
          statusColorClass
        )}>
          <StatusIcon 
            size={12} 
            className={cn(
              "transition-transform",
              (isDecompiling || isCompiling) && "animate-pulse"
            )} 
          />
          <span className="uppercase tracking-wider">{statusText}</span>
        </div>
      </div>
    </footer>
  );
}
