import React, { useState, useEffect } from 'react';
import { 
  Box, 
  FileCode, 
  Shapes, 
  Search, 
  SortAsc, 
  Download, 
  Edit3, 
  Info 
} from 'lucide-react';
import { useIDRStore } from '@/hooks/useIDRStore';
import { Unit, RTTIType, DFMForm, UNIT_TYPES } from '@/lib/index';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';

export function LeftPanel() {
  const {
    units,
    types,
    forms,
    activeLeftTab,
    setActiveLeftTab,
    selectedUnitId,
    setSelectedUnitId,
    setSelectedFormId
  } = useIDRStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Atalhos de teclado F2, F4, F5
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setActiveLeftTab('units');
      } else if (e.key === 'F4') {
        e.preventDefault();
        setActiveLeftTab('types');
      } else if (e.key === 'F5') {
        e.preventDefault();
        setActiveLeftTab('forms');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveLeftTab]);

  const filteredUnits = units.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTypes = types.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.kind.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredForms = forms.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUnitColorClass = (type: string) => {
    switch (type) {
      case UNIT_TYPES.STANDARD: return 'bg-chart-1/10 border-l-chart-1 text-chart-1-foreground';
      case UNIT_TYPES.USER: return 'bg-chart-2/10 border-l-chart-2 text-chart-2-foreground';
      case UNIT_TYPES.TRIVIAL: return 'bg-chart-3/10 border-l-chart-3 text-chart-3-foreground';
      case UNIT_TYPES.UNKNOWN: return 'bg-chart-4/10 border-l-chart-4 text-chart-4-foreground';
      default: return 'bg-muted/50 border-l-transparent';
    }
  };

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <Tabs 
        value={activeLeftTab} 
        onValueChange={(v) => setActiveLeftTab(v as any)} 
        className="flex flex-col h-full"
      >
        <div className="p-2 border-b border-sidebar-border">
          <TabsList className="grid grid-cols-3 w-full h-8">
            <TabsTrigger value="units" className="text-[11px] px-1">
              Unidades (F2)
            </TabsTrigger>
            <TabsTrigger value="types" className="text-[11px] px-1">
              Tipos (F4)
            </TabsTrigger>
            <TabsTrigger value="forms" className="text-[11px] px-1">
              Forms (F5)
            </TabsTrigger>
          </TabsList>
          
          <div className="relative mt-2">
            <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 pl-8 text-xs bg-sidebar-accent border-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="units" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-1 space-y-px">
                {filteredUnits.map((unit) => (
                  <ContextMenu key={unit.id}>
                    <ContextMenuTrigger>
                      <div
                        onClick={() => setSelectedUnitId(unit.id)}
                        className={cn(
                          "group flex items-center gap-2 px-2 py-1.5 cursor-default text-xs border-l-2 transition-colors",
                          getUnitColorClass(unit.type),
                          selectedUnitId === unit.id ? "ring-1 ring-primary/30 z-10 shadow-sm" : "hover:bg-sidebar-accent"
                        )}
                      >
                        <FileCode className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        <span className="font-mono opacity-60 text-[10px] tabular-nums shrink-0">{unit.address}</span>
                        <span className="truncate font-medium">{unit.name}</span>
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-48">
                      <ContextMenuItem onClick={() => {}} className="gap-2">
                        <Edit3 className="h-3.5 w-3.5" /> Renomear Unit
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => {}} className="gap-2">
                        <Search className="h-3.5 w-3.5" /> Buscar Referências
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuSub>
                        <ContextMenuSubTrigger className="gap-2">
                          <SortAsc className="h-3.5 w-3.5" /> Ordenar por
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                          <ContextMenuItem>Endereço</ContextMenuItem>
                          <ContextMenuItem>Ordem de Inicialização</ContextMenuItem>
                          <ContextMenuItem>Nome</ContextMenuItem>
                        </ContextMenuSubContent>
                      </ContextMenuSub>
                      <ContextMenuSeparator />
                      <ContextMenuItem onClick={() => {}} className="gap-2">
                        <Download className="h-3.5 w-3.5" /> Salvar Lista de Units
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="types" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-1 space-y-px">
                {filteredTypes.map((type) => (
                  <ContextMenu key={type.id}>
                    <ContextMenuTrigger>
                      <div className="flex items-center gap-2 px-2 py-1.5 cursor-default text-xs hover:bg-sidebar-accent transition-colors">
                        <Shapes className="h-3.5 w-3.5 shrink-0 text-primary opacity-70" />
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] opacity-50">{type.address}</span>
                            <span className="truncate font-medium">{type.name}</span>
                          </div>
                          <span className="text-[10px] opacity-40 uppercase">{type.kind}</span>
                        </div>
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-48">
                      <ContextMenuItem className="gap-2"><Search className="h-3.5 w-3.5" /> Buscar Tipo</ContextMenuItem>
                      <ContextMenuItem className="gap-2"><Info className="h-3.5 w-3.5" /> Ver TypeInfo</ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="forms" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-1 space-y-px">
                {filteredForms.map((form) => (
                  <div
                    key={form.id}
                    onClick={() => setSelectedFormId(form.id)}
                    className="flex items-center gap-2 px-2 py-1.5 cursor-default text-xs hover:bg-sidebar-accent transition-colors"
                  >
                    <Box className="h-3.5 w-3.5 shrink-0 text-chart-5 opacity-70" />
                    <span className="truncate font-medium">{form.name}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
