import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layout, 
  Type, 
  Eye, 
  Code2, 
  Settings2, 
  Layers, 
  ChevronRight, 
  Box,
  Save,
  Undo2,
  Redo2
} from 'lucide-react';
import { useIDRStore } from '@/hooks/useIDRStore';
import { DFMForm, DFMComponent, Modification } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// --- Componente de Renderização Visual DFM ---

interface VisualComponentProps {
  component: DFMComponent;
  onSelect: (comp: DFMComponent) => void;
  selectedId: string | null;
}

const VisualComponent: React.FC<VisualComponentProps> = ({ component, onSelect, selectedId }) => {
  const { type, name, properties, children } = component;
  const isSelected = selectedId === `${name}:${type}`;

  // Estilos baseados em propriedades DFM comuns
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${properties.Left || 0}px`,
    top: `${properties.Top || 0}px`,
    width: `${properties.Width || 100}px`,
    height: `${properties.Height || 30}px`,
    backgroundColor: properties.Color === 'clBtnFace' ? 'var(--secondary)' : 
                    properties.Color === 'clWhite' ? '#ffffff' : 
                    properties.Color === 'clBlack' ? '#000000' : 'transparent',
    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
    zIndex: 10,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '11px',
    color: 'var(--foreground)',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(component);
  };

  // Renderização simplificada baseada no tipo Delphi
  const renderContent = () => {
    switch (type) {
      case 'TButton':
      case 'TBitBtn':
      case 'TSpeedButton':
        return (
          <div className="w-full h-full flex items-center justify-center bg-muted/50 border shadow-sm">
            {properties.Caption || name}
          </div>
        );
      case 'TLabel':
        return <div className="w-full h-full whitespace-nowrap">{properties.Caption || name}</div>;
      case 'TEdit':
      case 'TMemo':
        return <div className="w-full h-full bg-background border inset-shadow-sm px-1">{properties.Text || ''}</div>;
      case 'TPanel':
      case 'TGroupBox':
        return (
          <div className="w-full h-full border bg-muted/20 relative">
            <div className="absolute -top-2 left-2 bg-background px-1 text-[10px] font-bold opacity-70">
              {properties.Caption || ''}
            </div>
            {children.map((child, idx) => (
              <VisualComponent 
                key={`${child.name}-${idx}`} 
                component={child} 
                onSelect={onSelect} 
                selectedId={selectedId} 
              />
            ))}
          </div>
        );
      case 'TImage':
        return <div className="w-full h-full bg-accent/20 flex items-center justify-center"><Layout className="opacity-20" /></div>;
      case 'TCheckBox':
        return <div className="flex items-center gap-2"><div className="w-3 h-3 border" /> {properties.Caption || name}</div>;
      default:
        return (
          <div className="w-full h-full border border-dashed border-muted-foreground/30 flex items-center justify-center opacity-50">
            {type}
          </div>
        );
    }
  };

  return (
    <div 
      style={style} 
      onClick={handleClick}
      className={cn("transition-all cursor-pointer group", isSelected && "z-50 shadow-lg ring-2 ring-primary/20")}
    >
      {renderContent()}
      {isSelected && (
        <div className="absolute -top-5 left-0 bg-primary text-primary-foreground text-[9px] px-1 rounded">
          {type}: {name}
        </div>
      )}
    </div>
  );
};

// --- Componente Principal do Editor ---

export function FormEditor() {
  const { 
    forms, 
    selectedFormId, 
    setSelectedFormId, 
    addModification, 
    undo, 
    redo,
    isDirty
  } = useIDRStore();

  const [viewMode, setViewMode] = useState<'visual' | 'text'>('visual');
  const [selectedComponent, setSelectedComponent] = useState<DFMComponent | null>(null);
  const [localFormContent, setLocalFormContent] = useState<string>('');

  const activeForm = useMemo(() => 
    forms.find(f => f.id === selectedFormId) || forms[0], 
    [forms, selectedFormId]
  );

  useEffect(() => {
    if (activeForm) {
      setLocalFormContent(activeForm.content);
      setSelectedComponent(activeForm.structure);
    }
  }, [activeForm]);

  if (!activeForm) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground bg-background">
        <Layout size={48} className="mb-4 opacity-20" />
        <p>Nenhum formulário carregado no projeto.</p>
      </div>
    );
  }

  const handlePropertyChange = (key: string, value: any) => {
    if (!selectedComponent) return;

    const originalValue = String(selectedComponent.properties[key] || '');
    const newValue = String(value);

    const mod: Modification = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'dfm',
      targetId: `${activeForm.id}:${selectedComponent.name}:${key}`,
      originalValue,
      newValue,
      timestamp: Date.now(),
    };

    addModification(mod);
    
    // Em um cenário real, atualizaríamos a estrutura local e o conteúdo textual
    // Aqui simulamos a atualização da propriedade no componente selecionado
    setSelectedComponent({
      ...selectedComponent,
      properties: {
        ...selectedComponent.properties,
        [key]: value
      }
    });
  };

  return (
    <div className="h-full w-full flex flex-col bg-background overflow-hidden">
      {/* Barra de Ferramentas do Editor */}
      <div className="h-12 border-b bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2 h-8">
              <TabsTrigger value="visual" className="text-xs gap-2">
                <Eye size={14} /> Visual
              </TabsTrigger>
              <TabsTrigger value="text" className="text-xs gap-2">
                <Code2 size={14} /> Texto
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="h-6 w-[1px] bg-border mx-2" />

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={undo} className="h-8 w-8">
              <Undo2 size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={redo} className="h-8 w-8">
              <Redo2 size={16} />
            </Button>
            <Button variant="ghost" size="sm" className={cn("h-8 gap-2", isDirty && "text-amber-500")}>
              <Save size={16} /> {isDirty ? "Salvar Alterações" : "Salvo"}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Box size={14} />
          <span className="font-mono">{activeForm.name}.dfm</span>
        </div>
      </div>

      {/* Área Principal: Canvas + Inspetor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Lado Esquerdo: Área de Edição */}
        <div className="flex-1 relative bg-muted/30 overflow-hidden">
          <ScrollArea className="h-full w-full">
            {viewMode === 'visual' ? (
              <div className="p-8 min-w-[800px] min-h-[600px] flex items-start justify-start">
                <div 
                  className="bg-card border shadow-2xl relative transition-all"
                  style={{
                    width: `${activeForm.structure.properties.ClientWidth || activeForm.structure.properties.Width || 600}px`,
                    height: `${activeForm.structure.properties.ClientHeight || activeForm.structure.properties.Height || 400}px`,
                    backgroundColor: activeForm.structure.properties.Color === 'clBtnFace' ? 'var(--secondary)' : '#ffffff',
                  }}
                  onClick={() => setSelectedComponent(activeForm.structure)}
                >
                  {/* Título do Form (Simulado) */}
                  <div className="h-8 w-full bg-[#005a9e] text-white flex items-center px-3 justify-between select-none">
                    <div className="flex items-center gap-2">
                      <Layout size={14} />
                      <span className="text-xs font-semibold">{activeForm.structure.properties.Caption || activeForm.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-white/20" />
                      <div className="w-3 h-3 bg-white/20" />
                      <div className="w-3 h-3 bg-white/20" />
                    </div>
                  </div>

                  {/* Filhos do Formulário */}
                  <div className="relative w-full h-full">
                    {activeForm.structure.children.map((child, idx) => (
                      <VisualComponent 
                        key={`${child.name}-${idx}`} 
                        component={child} 
                        onSelect={setSelectedComponent} 
                        selectedId={selectedComponent ? `${selectedComponent.name}:${selectedComponent.type}` : null}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full w-full bg-[#1e1e2e] p-4 font-mono text-sm text-[#cdd6f4] leading-relaxed whitespace-pre">
                {localFormContent}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Lado Direito: Inspetor de Objetos */}
        <div className="w-80 border-l bg-card flex flex-col">
          <div className="p-3 border-b bg-muted/50 flex items-center gap-2">
            <Settings2 size={16} className="text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Inspetor de Objetos</h3>
          </div>

          <div className="p-4 border-b bg-accent/5">
            <div className="flex items-center gap-2 mb-1">
              <Layers size={14} className="text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground uppercase">Componente Selecionado</span>
            </div>
            <div className="text-sm font-bold font-mono text-primary truncate">
              {selectedComponent ? `${selectedComponent.name}: ${selectedComponent.type}` : 'Nenhum'}
            </div>
          </div>

          <ScrollArea className="flex-1">
            {selectedComponent ? (
              <div className="p-4 space-y-4">
                {Object.entries(selectedComponent.properties).map(([key, value]) => (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-[11px] font-mono text-muted-foreground">{key}</Label>
                      {key === 'Name' && <Type size={12} className="text-amber-500" />}
                    </div>
                    <Input 
                      value={String(value)}
                      onChange={(e) => handlePropertyChange(key, e.target.value)}
                      className="h-8 text-xs font-mono bg-background/50"
                    />
                  </div>
                ))}

                {/* Adicionar nova propriedade simulada */}
                <Button variant="outline" className="w-full h-8 text-xs mt-4 gap-2">
                  <ChevronRight size={14} /> Adicionar Propriedade
                </Button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground opacity-50">
                <Settings2 size={32} className="mb-2" />
                <p className="text-xs">Selecione um componente no editor visual para ver suas propriedades.</p>
              </div>
            )}
          </ScrollArea>

          {/* Rodapé do Inspetor */}
          <div className="p-3 border-t bg-muted/30">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Total de Componentes: {activeForm.structure.children.length + 1}</span>
              <span>v2.0.26</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Abas de Formulários (Inferior) */}
      <div className="h-8 border-t bg-muted/50 flex items-center px-2 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {forms.map((form) => (
            <button
              key={form.id}
              onClick={() => setSelectedFormId(form.id)}
              className={cn(
                "px-3 h-full flex items-center gap-2 text-[11px] transition-colors border-x border-transparent",
                selectedFormId === form.id 
                  ? "bg-background border-border text-primary font-bold shadow-inner" 
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Layout size={12} />
              {form.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
