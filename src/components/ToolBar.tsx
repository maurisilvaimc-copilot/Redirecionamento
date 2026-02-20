import {
  FolderOpen,
  FileArchive,
  Save,
  Code,
  Target,
  ArrowLeft,
  ArrowRight,
  Zap,
  FileCheck,
  Binary,
  Download,
  Type,
  Settings
} from "lucide-react";
import { useIDRStore } from "@/hooks/useIDRStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Componente de botão utilitário para a barra de ferramentas com Tooltip integrado
 */
interface ToolBarButtonProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "ghost" | "outline" | "secondary";
}

function ToolBarButton({ 
  icon: Icon, 
  label, 
  onClick, 
  disabled = false, 
  className, 
  variant = "ghost" 
}: ToolBarButtonProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size="icon"
            className={cn("h-8 w-8 transition-all hover:bg-accent/50", className)}
            onClick={onClick}
            disabled={disabled}
          >
            <Icon className="h-4 w-4" />
            <span className="sr-only">{label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-popover text-popover-foreground border-border">
          <p className="text-xs font-medium">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Barra de ferramentas principal da aplicação IDR Web Edition
 * Oferece atalhos rápidos para as principais funções de descompilação e edição
 */
export function ToolBar() {
  const {
    isDirty,
    setActiveTab,
    isDecompiling,
    isCompiling
  } = useIDRStore();

  const handleDecompileSrc = () => {
    setActiveTab('source');
  };

  return (
    <div className="flex items-center gap-1 h-10 px-2 bg-secondary/30 border-b border-border shrink-0 overflow-x-auto no-scrollbar">
      {/* Grupo: Arquivo */}
      <div className="flex items-center gap-0.5">
        <ToolBarButton 
          icon={FolderOpen} 
          label="Abrir EXE/DLL" 
          disabled={isDecompiling} 
        />
        <ToolBarButton 
          icon={FileArchive} 
          label="Abrir Projeto (.idp)" 
          disabled={isDecompiling} 
        />
        <ToolBarButton 
          icon={Save} 
          label="Salvar Projeto" 
          disabled={!isDirty || isDecompiling} 
        />
        <ToolBarButton 
          icon={Code} 
          label="Salvar Projeto Delphi" 
          disabled={isDecompiling} 
        />
      </div>

      <Separator orientation="vertical" className="h-5 mx-1 opacity-50" />

      {/* Grupo: Navegação de Código */}
      <div className="flex items-center gap-0.5">
        <ToolBarButton icon={Target} label="Ir para Entry Point (EP)" />
        <ToolBarButton icon={ArrowLeft} label="Sub-rotina Anterior" />
        <ToolBarButton icon={ArrowRight} label="Sub-rotina Seguinte" />
        <ToolBarButton 
          icon={Zap} 
          label="Decompile Src (F10)" 
          className="text-chart-1"
          onClick={handleDecompileSrc}
        />
      </div>

      <Separator orientation="vertical" className="h-5 mx-1 opacity-50" />

      {/* Grupo: Edição e Recompilação */}
      <div className="flex items-center gap-0.5">
        <ToolBarButton 
          icon={FileCheck} 
          label="Salvar Edições" 
          className={cn(isDirty ? "text-chart-2" : "text-muted-foreground")}
          disabled={!isDirty}
        />
        <ToolBarButton 
          icon={Binary} 
          label="Recompilar Executável (Ctrl+B)" 
          className="text-primary"
          disabled={isCompiling}
        />
        <ToolBarButton 
          icon={Download} 
          label="Exportar Projeto Delphi Completo" 
        />
      </div>

      <div className="ml-auto flex items-center gap-0.5">
        <ToolBarButton icon={Type} label="Configurações de Fontes" />
        <ToolBarButton icon={Settings} label="Configurações Gerais" />
      </div>
    </div>
  );
}
