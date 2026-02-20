import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Search,
  Boxes,
  FileCode,
  Edit3,
  Eye,
  MinusSquare,
  PlusSquare,
  Code2
} from 'lucide-react';
import { ClassNode } from '@/lib/index';
import { useIDRStore } from '@/hooks/useIDRStore';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ClassTreeItemProps {
  node: ClassNode;
  depth: number;
  searchQuery: string;
  onEdit: (node: ClassNode) => void;
  onView: (node: ClassNode) => void;
}

const ClassTreeItem: React.FC<ClassTreeItemProps> = ({ node, depth, searchQuery, onEdit, onView }) => {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const hasChildren = node.children && node.children.length > 0;

  // Highlight search results
  const isMatch = searchQuery && node.name.toLowerCase().includes(searchQuery.toLowerCase());

  return (
    <div className="select-none">
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              "flex items-center py-1 px-2 hover:bg-accent/50 cursor-pointer rounded-sm group transition-colors",
              isMatch && "bg-primary/20 text-primary-foreground",
              "border-l-2 border-transparent"
            )}
            style={{ paddingLeft: `${depth * 16 + 4}px` }}
            onClick={() => hasChildren && setIsOpen(!isOpen)}
          >
            <span className="mr-1 w-4 h-4 flex items-center justify-center text-muted-foreground">
              {hasChildren ? (
                isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
              ) : (
                <div className="w-3 h-3" />
              )}
            </span>
            <Boxes className={cn("w-4 h-4 mr-2", isMatch ? "text-primary" : "text-chart-1")} />
            <span className="text-sm font-mono truncate">{node.name}</span>
            <span className="ml-auto text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 font-mono">
              {node.address}
            </span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuItem onClick={() => onView(node)}>
            <Eye className="mr-2 h-4 w-4" />
            <span>Ver Classe</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onEdit(node)}>
            <Edit3 className="mr-2 h-4 w-4" />
            <span>Editar Classe</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <Search className="mr-2 h-4 w-4" />
            <span>Buscar Referências</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {hasChildren && isOpen && (
        <div className="flex flex-col">
          {node.children.map((child) => (
            <ClassTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              searchQuery={searchQuery}
              onEdit={onEdit}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function ClassViewer() {
  const { classTree } = useIDRStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'full' | 'branch'>('full');
  const [selectedClass, setSelectedClass] = useState<ClassNode | null>(null);

  const filteredTree = useMemo(() => {
    if (!searchQuery) return classTree;
    
    const filterNodes = (nodes: ClassNode[]): ClassNode[] => {
      return nodes.reduce((acc: ClassNode[], node) => {
        const childrenMatch = filterNodes(node.children);
        const nameMatch = node.name.toLowerCase().includes(searchQuery.toLowerCase());

        if (nameMatch || childrenMatch.length > 0) {
          acc.push({
            ...node,
            children: childrenMatch,
          });
        }
        return acc;
      }, []);
    };

    return filterNodes(classTree);
  }, [classTree, searchQuery]);

  const handleViewClass = (node: ClassNode) => {
    setSelectedClass(node);
  };

  const handleEditClass = (node: ClassNode) => {
    // In a real app, this would open a renaming modal
    console.log('Editing class:', node.name);
  };

  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      {/* Toolbar Superior */}
      <div className="p-2 border-b border-border flex items-center justify-between gap-2 bg-muted/30">
        <div className="flex items-center gap-1">
          <Button 
            variant={viewMode === 'full' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="h-7 text-xs px-2"
            onClick={() => setViewMode('full')}
          >
            <Boxes className="w-3 h-3 mr-1" />
            Árvore Completa
          </Button>
          <Button 
            variant={viewMode === 'branch' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="h-7 text-xs px-2"
            onClick={() => setViewMode('branch')}
          >
            <Code2 className="w-3 h-3 mr-1" />
            Ramo
          </Button>
        </div>

        <div className="relative flex-1 max-w-[200px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            placeholder="Buscar classe..."
            className="h-7 pl-7 text-xs bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Recolher Tudo">
            <MinusSquare className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Expandir Tudo">
            <PlusSquare className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Painel da Árvore */}
        <div className={cn("flex-1 flex flex-col", selectedClass && "border-r border-border")}>
          <ScrollArea className="flex-1">
            <div className="p-1">
              {filteredTree.length > 0 ? (
                filteredTree.map((node) => (
                  <ClassTreeItem
                    key={node.id}
                    node={node}
                    depth={0}
                    searchQuery={searchQuery}
                    onEdit={handleEditClass}
                    onView={handleViewClass}
                  />
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  Nenhuma classe encontrada.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Painel de Detalhes (Métodos) */}
        {selectedClass && (
          <div className="w-1/3 flex flex-col bg-muted/10">
            <div className="p-2 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-chart-1" />
                <span className="text-sm font-semibold truncate">{selectedClass.name}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => setSelectedClass(null)}
              >
                <span className="sr-only">Fechar</span>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">
                  Métodos da Classe
                </h4>
                {selectedClass.methods.map((method, idx) => (
                  <ContextMenu key={`${selectedClass.id}-m-${idx}`}>
                    <ContextMenuTrigger>
                      <div className="flex items-center gap-2 p-1.5 hover:bg-accent rounded-sm group">
                        <FileCode className="w-3.5 h-3.5 text-chart-2" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-mono truncate">{method.name}</span>
                          <span className="text-[9px] text-muted-foreground font-mono">{method.address}</span>
                        </div>
                        <Badge variant="outline" className="ml-auto text-[9px] h-4 px-1 capitalize">
                          {method.type}
                        </Badge>
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Ver Implementação</span>
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => console.log('Rename method:', method.name)}>
                        <Edit3 className="mr-2 h-4 w-4" />
                        <span>Renomear Método</span>
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
                {selectedClass.methods.length === 0 && (
                  <div className="text-[11px] text-muted-foreground italic p-2">
                    Nenhum método identificado para esta VMT.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
