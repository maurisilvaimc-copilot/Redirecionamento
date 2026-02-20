import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIDRStore } from '@/hooks/useIDRStore';
import { Copy, FileText, MousePointer2 } from 'lucide-react';
import { toast } from 'sonner';

export function MapViewer() {
  const mapEntries = useIDRStore((state) => state.mapEntries);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleRowClick = (id: string, event: React.MouseEvent) => {
    const newSelected = new Set(selectedIds);
    if (event.ctrlKey || event.metaKey) {
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
    } else if (event.shiftKey && selectedIds.size > 0) {
      // Simple shift selection logic: from last selected to current
      const lastId = Array.from(selectedIds).pop();
      const lastIndex = mapEntries.findIndex((e) => e.id === lastId);
      const currentIndex = mapEntries.findIndex((e) => e.id === id);
      
      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);
      
      for (let i = start; i <= end; i++) {
        newSelected.add(mapEntries[i].id);
      }
    } else {
      newSelected.clear();
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleCopySelected = () => {
    const selectedRows = mapEntries.filter((entry) => selectedIds.has(entry.id));
    if (selectedRows.length === 0) return;

    const text = selectedRows
      .map((e) => `${e.address}\t${e.segment}\t${e.name}\t${e.size || 0}`)
      .join('\n');
    
    navigator.clipboard.writeText(text);
    toast.success(`${selectedRows.length} linhas copiadas`);
  };

  const handleCopyAll = () => {
    const text = mapEntries
      .map((e) => `${e.address}\t${e.segment}\t${e.name}\t${e.size || 0}`)
      .join('\n');
    
    navigator.clipboard.writeText(text);
    toast.success('Mapa de memória completo copiado');
  };

  return (
    <div className="h-full flex flex-col bg-background text-foreground font-mono">
      <div className="flex items-center justify-between p-2 border-b bg-muted/30">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <FileText size={14} />
          <span>MAPA DE MEMÓRIA</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <MousePointer2 size={10} />
            <span>Ctrl+Clique para multi-seleção</span>
          </div>
          <span>Total de Entradas: {mapEntries.length}</span>
        </div>
      </div>

      <ContextMenu>
        <ContextMenuTrigger className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="w-[120px] text-[11px] font-bold uppercase tracking-wider">Endereço</TableHead>
                  <TableHead className="w-[100px] text-[11px] font-bold uppercase tracking-wider">Segmento</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider">Nome do Símbolo</TableHead>
                  <TableHead className="w-[100px] text-right text-[11px] font-bold uppercase tracking-wider">Tamanho</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mapEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 text-muted-foreground italic">
                      Nenhum dado de mapa carregado
                    </TableCell>
                  </TableRow>
                ) : (
                  mapEntries.map((entry) => (
                    <TableRow
                      key={entry.id}
                      className={`cursor-default transition-colors border-none ${
                        selectedIds.has(entry.id)
                          ? 'bg-primary/20 hover:bg-primary/30'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={(e) => handleRowClick(entry.id, e)}
                    >
                      <TableCell className="py-1 text-primary font-bold">{entry.address}</TableCell>
                      <TableCell className="py-1 text-muted-foreground">{entry.segment}</TableCell>
                      <TableCell className="py-1 text-foreground">{entry.name}</TableCell>
                      <TableCell className="py-1 text-right text-chart-2">
                        {entry.size ? `${entry.size.toString(16).toUpperCase().padStart(4, '0')}h` : '0000h'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem onClick={handleCopySelected} disabled={selectedIds.size === 0}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copiar Linhas Selecionadas</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={handleCopyAll}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copiar Tudo para Área de Transferência</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <div className="p-1 border-t bg-muted/10 flex justify-end">
        <div className="text-[10px] text-muted-foreground">
          {selectedIds.size > 0 ? `${selectedIds.size} itens selecionados` : 'Nenhum item selecionado'}
        </div>
      </div>
    </div>
  );
}
