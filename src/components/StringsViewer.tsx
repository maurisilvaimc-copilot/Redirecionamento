import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Copy, 
  Edit2, 
  ExternalLink, 
  Hash,
  ArrowRight
} from 'lucide-react';
import { useIDRStore } from '@/hooks/useIDRStore';
import { 
  DecompiledString, 
  MODIFICATION_TYPES 
} from '@/lib/index';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function StringsViewer() {
  const { strings, addModification, modifications } = useIDRStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStringId, setSelectedStringId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Filtragem de strings baseada na busca
  const filteredStrings = useMemo(() => {
    if (!searchQuery) return strings;
    const query = searchQuery.toLowerCase();
    return strings.filter(
      (s) =>
        s.value.toLowerCase().includes(query) ||
        s.address.toLowerCase().includes(query)
    );
  }, [strings, searchQuery]);

  const selectedString = useMemo(
    () => strings.find((s) => s.id === selectedStringId),
    [strings, selectedStringId]
  );

  // Verifica se uma string foi modificada para aplicar highlight
  const getModification = (stringId: string) => {
    return modifications.find(
      (m) => m.type === MODIFICATION_TYPES.STRING && m.targetId === stringId
    );
  };

  const handleDoubleClick = (s: DecompiledString) => {
    setEditingId(s.id);
    setEditValue(getModification(s.id)?.newValue || s.value);
  };

  const handleSaveEdit = (s: DecompiledString) => {
    if (editValue !== s.value) {
      addModification({
        id: crypto.randomUUID(),
        type: MODIFICATION_TYPES.STRING,
        targetId: s.id,
        originalValue: s.value,
        newValue: editValue,
        timestamp: Date.now(),
      });
    }
    setEditingId(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Barra de Busca */}
      <div className="p-2 border-b border-border bg-card/50 flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar strings ou endereços..."
            className="pl-9 h-8 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-xs text-muted-foreground ml-auto">
          Total: {filteredStrings.length} strings encontradas
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Painel de Strings */}
        <div className="flex-[3] border-r border-border flex flex-col">
          <ScrollArea className="flex-1">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[120px] font-mono text-xs">Endereço</TableHead>
                  <TableHead className="font-mono text-xs">Valor</TableHead>
                  <TableHead className="w-[80px] text-right font-mono text-xs">Tam.</TableHead>
                  <TableHead className="w-[80px] text-center font-mono text-xs">XRefs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStrings.map((s) => {
                  const mod = getModification(s.id);
                  const isSelected = selectedStringId === s.id;
                  
                  return (
                    <ContextMenu key={s.id}>
                      <ContextMenuTrigger asChild>
                        <TableRow
                          className={cn(
                            "cursor-default group",
                            isSelected && "bg-accent/50",
                            mod && "bg-chart-4/10 hover:bg-chart-4/20"
                          )}
                          onClick={() => setSelectedStringId(s.id)}
                          onDoubleClick={() => handleDoubleClick(s)}
                        >
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {s.address}
                          </TableCell>
                          <TableCell className="font-mono text-xs break-all max-w-md">
                            {editingId === s.id ? (
                              <Input
                                autoFocus
                                className="h-6 py-0 px-1 font-mono text-xs bg-background border-primary"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={() => handleSaveEdit(s)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveEdit(s);
                                  if (e.key === 'Escape') setEditingId(null);
                                }}
                              />
                            ) : (
                              <span className={cn(mod && "text-chart-4 font-semibold")}>
                                {mod ? mod.newValue : s.value}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs text-muted-foreground">
                            {s.length}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-mono">
                              {s.xrefs.length}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </ContextMenuTrigger>
                      <ContextMenuContent className="w-56">
                        <ContextMenuItem onClick={() => handleCopy(mod?.newValue || s.value)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copiar Valor
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => handleCopy(s.address)}>
                          <Hash className="mr-2 h-4 w-4" />
                          Copiar Endereço
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem onClick={() => handleDoubleClick(s)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Editar String
                        </ContextMenuItem>
                        <ContextMenuItem>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Ir para XRef Principal
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {/* Painel de Referências Cruzadas (XRefs) */}
        <div className="flex-1 bg-card/30 flex flex-col">
          <div className="p-2 border-b border-border bg-card font-semibold text-xs flex items-center gap-2">
            <ArrowRight className="h-3 w-3" />
            Referências Cruzadas (XRefs)
          </div>
          <ScrollArea className="flex-1">
            {selectedString ? (
              <div className="p-3 space-y-1">
                {selectedString.xrefs.length > 0 ? (
                  selectedString.xrefs.map((xref, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 p-1.5 rounded hover:bg-accent cursor-pointer group transition-colors"
                    >
                      <code className="text-[11px] bg-muted px-1 rounded text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                        {xref}
                      </code>
                      <span className="text-[10px] text-muted-foreground truncate">
                        chamada em procedure no endereço {xref}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-muted-foreground text-xs">
                    Nenhuma referência cruzada identificada.
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 text-center">
                <Hash className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-xs">Selecione uma string para ver suas referências no código.</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
