import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Box, 
  FileCode, 
  Info, 
  Layers, 
  Puzzle, 
  Terminal,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useIDRStore } from '@/hooks/useIDRStore';
import { 
  DFMComponent, 
  DecompiledString, 
  RTTIType,
  UNIT_TYPES 
} from '@/lib/index';

/**
 * Árvore de Componentes DFM (Recursivo)
 */
const DfmTreeNode = ({ node, level = 0 }: { node: DFMComponent; level?: number }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div 
        className="flex items-center gap-2 py-1 hover:bg-accent/50 cursor-pointer rounded px-2"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {hasChildren ? (
          isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Box className="w-4 h-4 text-primary" />
        )}
        <span className="font-mono text-sm">
          <span className="text-blue-400">{node.name}</span>
          <span className="text-muted-foreground">: </span>
          <span className="text-emerald-400">{node.type}</span>
        </span>
      </div>
      {isOpen && hasChildren && (
        <div>
          {node.children.map((child, idx) => (
            <DfmTreeNode key={`${child.name}-${idx}`} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export function DfmTreeModal({ isOpen, onOpenChange, structure }: { isOpen: boolean; onOpenChange: (open: boolean) => void; structure: DFMComponent | null }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Hierarquia de Componentes
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          {structure ? (
            <DfmTreeNode node={structure} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">Nenhum formulário selecionado</div>
          )}
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Legenda de Cores das Units
 */
export function LegendModal({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  const items = [
    { label: 'Unit Padrão (KB)', color: 'bg-[#1e3a5f]', desc: 'Unidades conhecidas da base de conhecimento do Delphi.' },
    { label: 'Unit do Usuário', color: 'bg-[#1e3a2f]', desc: 'Unidades específicas do projeto decompilado.' },
    { label: 'Unit Trivial', color: 'bg-[#2a2a3a]', desc: 'Unidades pequenas ou com funcionalidade padrão mínima.' },
    { label: 'Não Reconhecida', color: 'bg-[#3a3020]', desc: 'Áreas de código ou dados que não foram mapeados para uma unit.' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Legenda de Cores
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {items.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className={`w-4 h-4 mt-1 rounded shadow-sm ${item.color}`} />
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Entendi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Informações Detalhadas de String
 */
export function StringInfoModal({ isOpen, onOpenChange, stringData }: { isOpen: boolean; onOpenChange: (open: boolean) => void; stringData: DecompiledString | null }) {
  if (!stringData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            Detalhes da String
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-md font-mono text-sm break-all border">
            "{stringData.value}"
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block">Endereço:</span>
              <code className="text-primary">{stringData.address}</code>
            </div>
            <div>
              <span className="text-muted-foreground block">Tamanho:</span>
              <span>{stringData.length} bytes</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground text-sm block mb-2">Referências Cruzadas (XRefs):</span>
            <ScrollArea className="h-32 border rounded-md p-2 bg-background/50">
              {stringData.xrefs.length > 0 ? (
                stringData.xrefs.map((xref, idx) => (
                  <div key={idx} className="text-xs font-mono py-1 border-b last:border-0 hover:text-primary cursor-pointer">
                    {xref}
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground italic">Nenhuma referência encontrada.</div>
              )}
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Informações de Tipo RTTI
 */
export function TypeInfoModal({ isOpen, onOpenChange, typeData }: { isOpen: boolean; onOpenChange: (open: boolean) => void; typeData: RTTIType | null }) {
  if (!typeData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCode className="w-5 h-5" />
            Definição de Tipo: {typeData.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{typeData.kind}</Badge>
            <span className="text-xs font-mono text-muted-foreground">@{typeData.address}</span>
          </div>
          <ScrollArea className="h-64 border rounded-md p-4 bg-muted/30 font-mono text-sm leading-relaxed whitespace-pre">
            {typeData.definition}
          </ScrollArea>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
          <Button>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Gerenciador de Plugins
 */
export function PluginsModal({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  const plugins = [
    { id: '1', name: 'Decompiler Pro Pascal', version: '2.1.0', enabled: true },
    { id: '2', name: 'Advanced XRef Analysis', version: '1.0.5', enabled: false },
    { id: '3', name: 'DFM Visual Fixer', version: '0.9.0', enabled: true },
    { id: '4', name: 'Delphi XE Signature KB', version: '4.4.2', enabled: true },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Puzzle className="w-5 h-5" />
            Gerenciador de Plugins
          </DialogTitle>
          <DialogDescription>
            Habilite ou desabilite extensões de análise e descompilação.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          {plugins.map((plugin) => (
            <div key={plugin.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/30 transition-colors">
              <div className="flex flex-col">
                <span className="font-medium text-sm">{plugin.name}</span>
                <span className="text-xs text-muted-foreground">v{plugin.version}</span>
              </div>
              <Button 
                variant={plugin.enabled ? "default" : "secondary"}
                size="sm"
                className="h-8"
              >
                {plugin.enabled ? "Ativo" : "Ativar"}
              </Button>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Salvar e Reiniciar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Modal de Progresso (Descompilação / Recompilação)
 */
export function ProgressModal() {
  const { isDecompiling, isCompiling, progress, progressMessage } = useIDRStore();
  const isVisible = isDecompiling || isCompiling;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-card border shadow-2xl rounded-xl p-8 max-w-md w-full animate-in fade-in zoom-in duration-300">
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse mb-2">
              <Box className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">
              {isDecompiling ? 'Analisando Executável...' : 'Recompilando Binário...'}
            </h3>
            <p className="text-sm text-muted-foreground min-h-[20px]">
              {progressMessage}
            </p>
          </div>
          
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              <span>Status: {progress < 100 ? 'Processando' : 'Finalizado'}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="text-[10px] text-center text-muted-foreground/60">
              Por favor, não feche a aba durante este processo crítico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
