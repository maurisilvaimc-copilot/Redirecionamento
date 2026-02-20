import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Copy, 
  Hash, 
  Link as LinkIcon, 
  MousePointer2,
  ExternalLink
} from 'lucide-react';
import { useIDRStore } from '@/hooks/useIDRStore';
import { NameEntry } from '@/lib/index';
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
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export function NamesViewer() {
  const names = useIDRStore((state) => state.names);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredNames = useMemo(() => {
    return names.filter((n) =>
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [names, searchQuery]);

  const selectedEntry = useMemo(() => 
    names.find(n => n.id === selectedId), 
    [names, selectedId]
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Barra de Busca */}
      <div className="p-2 border-b bg-muted/30 flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar nome ou endereço..."
            className="pl-9 h-9 bg-background font-sans"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-xs text-muted-foreground ml-auto">
          Total: <span className="font-mono">{filteredNames.length}</span> símbolos
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Tabela de Nomes */}
        <div className="flex-1 border-r flex flex-col min-w-0">
          <ScrollArea className="flex-1">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[150px] font-semibold text-xs">Endereço</TableHead>
                  <TableHead className="font-semibold text-xs">Símbolo / Nome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNames.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-10 text-muted-foreground">
                      Nenhum símbolo encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNames.map((entry) => (
                    <ContextMenu key={entry.id}>
                      <ContextMenuTrigger asChild>
                        <TableRow
                          className={`cursor-pointer hover:bg-accent/50 transition-colors ${selectedId === entry.id ? 'bg-primary/10' : ''}`}
                          onClick={() => setSelectedId(entry.id)}
                        >
                          <TableCell className="font-mono text-xs py-2">
                            <span className="text-chart-1">{entry.address}</span>
                          </TableCell>
                          <TableCell className="font-mono text-xs py-2 truncate">
                            {entry.name}
                          </TableCell>
                        </TableRow>
                      </ContextMenuTrigger>
                      <ContextMenuContent className="w-56">
                        <ContextMenuItem onClick={() => handleCopy(entry.address)}>
                          <Hash className="mr-2 h-4 w-4 text-muted-foreground" />
                          Copiar Endereço
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => handleCopy(entry.name)}>
                          <MousePointer2 className="mr-2 h-4 w-4 text-muted-foreground" />
                          Copiar Nome
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem onClick={() => handleCopy(`${entry.address} - ${entry.name}`)}>
                          <Copy className="mr-2 h-4 w-4 text-muted-foreground" />
                          Copiar Tudo
                        </ContextMenuItem>
                        <ContextMenuItem>
                          <ExternalLink className="mr-2 h-4 w-4 text-muted-foreground" />
                          Ir para Endereço
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {/* Painel XRefs */}
        <div className="w-80 flex flex-col bg-muted/10 shrink-0">
          <div className="p-3 border-b bg-muted/20">
            <h3 className="text-xs font-semibold flex items-center gap-2 text-foreground">
              <LinkIcon className="h-3.5 w-3.5 text-primary" />
              Referências Cruzadas (XRefs)
            </h3>
          </div>
          
          <ScrollArea className="flex-1">
            {selectedEntry ? (
              <div className="p-2 space-y-1">
                {selectedEntry.xrefs && selectedEntry.xrefs.length > 0 ? (
                  selectedEntry.xrefs.map((xref, idx) => (
                    <motion.div
                      key={`${selectedEntry.id}-xref-${idx}`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group flex items-center justify-between p-2 rounded hover:bg-accent cursor-pointer border border-transparent hover:border-border"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-mono text-chart-2">{xref}</span>
                        <span className="text-[10px] text-muted-foreground">Referenciado por instrução</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(xref);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-primary/20 rounded transition-all"
                      >
                        <Copy className="h-3 w-3 text-primary" />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground opacity-50">
                    <LinkIcon className="h-8 w-8 mb-2 stroke-1" />
                    <span className="text-xs">Nenhuma referência encontrada</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 text-center">
                <MousePointer2 className="h-8 w-8 mb-4 opacity-20" />
                <p className="text-xs leading-relaxed">
                  Selecione um símbolo na lista para visualizar suas referências cruzadas no binário.
                </p>
              </div>
            )}
          </ScrollArea>

          {selectedEntry && (
            <div className="p-3 border-t bg-muted/20">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Detalhes do Símbolo</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[10px] bg-background">
                    {selectedEntry.address}
                  </Badge>
                  <span className="text-xs font-mono truncate text-foreground">
                    {selectedEntry.name}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
