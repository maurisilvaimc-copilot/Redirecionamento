import React, { useState, useMemo } from 'react';
import {
  Search,
  Copy,
  Edit3,
  Eye,
  Filter,
  List,
  MoreHorizontal
} from 'lucide-react';
import { useIDRStore } from '@/hooks/useIDRStore';
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
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Componente de Painel Inferior
 * Exibe itens detalhados (funções, procedimentos, variáveis) da unidade selecionada.
 */
export function BottomPanel() {
  const {
    selectedUnitId,
    units,
    names,
    activeTab,
    progressMessage,
    isDecompiling
  } = useIDRStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Busca a unidade selecionada no estado global
  const selectedUnit = useMemo(() => {
    return units.find((u) => u.id === selectedUnitId);
  }, [units, selectedUnitId]);

  // Filtra itens baseados na unidade selecionada e busca
  // Como o AppState não tem uma lista explícita de itens por unidade,
  // simulamos a extração de nomes vinculados à unidade ou endereços próximos.
  const unitItems = useMemo(() => {
    if (!selectedUnit) return [];

    // Em um cenário real, filtraríamos símbolos que pertencem ao intervalo de endereços da unit
    // Para demonstração, filtramos por nomes que possam estar relacionados ou apenas listamos os nomes identificados
    const filtered = names.filter(name => 
      name.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Mapeamos para a estrutura de exibição do painel inferior
    return filtered.map(item => ({
      id: item.id,
      address: item.address,
      type: item.name.startsWith('T') ? 'Class/Type' : (item.name.includes('.') ? 'Method' : 'Procedure'),
      name: item.name,
      size: Math.floor(Math.random() * 500) + 20, // Mock de tamanho para visualização
    }));
  }, [selectedUnit, names, searchQuery]);

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div className="flex flex-col h-full bg-sidebar border-t border-border">
      {/* Cabeçalho do Painel Inferior */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Itens da Unidade
            </span>
          </div>
          {selectedUnit && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {selectedUnit.name}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 w-48 pl-8 text-xs bg-background/50"
            />
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Filter className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Área de Conteúdo / Tabela */}
      <div className="flex-1 overflow-auto">
        {!selectedUnit ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
            <List className="w-12 h-12 mb-2" />
            <p className="text-sm font-medium">Nenhuma unidade selecionada</p>
            <p className="text-xs">Selecione uma unidade no painel esquerdo (F2) para ver seus itens.</p>
          </div>
        ) : unitItems.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-xs italic">Nenhum item encontrado nesta unidade.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="sticky top-0 bg-sidebar z-10">
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="w-[120px] h-8 text-[11px] font-bold uppercase text-muted-foreground">Endereço</TableHead>
                <TableHead className="w-[120px] h-8 text-[11px] font-bold uppercase text-muted-foreground">Tipo</TableHead>
                <TableHead className="h-8 text-[11px] font-bold uppercase text-muted-foreground">Nome</TableHead>
                <TableHead className="w-[100px] h-8 text-[11px] font-bold uppercase text-muted-foreground text-right">Tamanho</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unitItems.map((item) => (
                <ContextMenu key={item.id}>
                  <ContextMenuTrigger asChild>
                    <TableRow className="group h-7 border-none hover:bg-accent/50 cursor-default">
                      <TableCell className="py-0 font-mono text-[11px] text-chart-1">
                        {item.address}
                      </TableCell>
                      <TableCell className="py-0">
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded",
                          item.type === 'Procedure' ? "bg-blue-500/10 text-blue-400" : 
                          item.type === 'Method' ? "bg-purple-500/10 text-purple-400" : 
                          "bg-emerald-500/10 text-emerald-400"
                        )}>
                          {item.type}
                        </span>
                      </TableCell>
                      <TableCell className="py-0 font-mono text-[11px] truncate">
                        {item.name}
                      </TableCell>
                      <TableCell className="py-0 text-[11px] text-muted-foreground text-right">
                        {item.size} bytes
                      </TableCell>
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-56">
                    <ContextMenuItem onClick={() => handleCopyAddress(item.address)} className="text-xs">
                      <Copy className="w-3.5 h-3.5 mr-2" />
                      Copiar Endereço
                    </ContextMenuItem>
                    <ContextMenuItem className="text-xs">
                      <Edit3 className="w-3.5 h-3.5 mr-2" />
                      Editar Protótipo
                    </ContextMenuItem>
                    <ContextMenuItem className="text-xs">
                      <Eye className="w-3.5 h-3.5 mr-2" />
                      Ver Referências Cruzadas (XRefs)
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem className="text-xs">
                      <MoreHorizontal className="w-3.5 h-3.5 mr-2" />
                      Ver Todos os Detalhes
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Mini Status Integrado no Painel Inferior */}
      <div className="h-6 flex items-center px-4 bg-muted/20 border-t border-border text-[10px] text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Total de itens: <strong>{unitItems.length}</strong></span>
          {isDecompiling && (
            <span className="flex items-center gap-1.5 animate-pulse text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              {progressMessage || 'Processando...'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
