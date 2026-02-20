import React, { useState, useEffect, useRef } from 'react';
import { useIDRStore } from '@/hooks/useIDRStore';
import { MODIFICATION_TYPES, SourceFile } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Save, 
  Search, 
  RotateCcw, 
  RotateCw, 
  FileCode, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/assets/images';

/**
 * Componente de Editor de Código-Fonte (Pascal/ASM)
 * Editor de texto com syntax highlighting básico para Pascal
 */
export function SourceEditor() {
  const {
    selectedUnitId,
    sourceCode,
    font,
    addModification,
    undo,
    redo,
    isDirty
  } = useIDRStore();

  const [currentFile, setCurrentFile] = useState<SourceFile | null>(null);
  const [editorValue, setEditorValue] = useState<string>('');
  const [isModifiedLocally, setIsModifiedLocally] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Carrega o arquivo selecionado
  useEffect(() => {
    const file = sourceCode.find(f => f.unitId === selectedUnitId);
    if (file) {
      setCurrentFile(file);
      setEditorValue(file.content);
      setIsModifiedLocally(false);
    } else {
      setCurrentFile(null);
      setEditorValue('');
    }
  }, [selectedUnitId, sourceCode]);

  const handleEditorChange = (value: string) => {
    setEditorValue(value);
    setIsModifiedLocally(true);
  };

  const handleSave = () => {
    if (currentFile && isModifiedLocally) {
      addModification({
        id: Date.now().toString(),
        type: MODIFICATION_TYPES.CODE,
        targetId: currentFile.unitId,
        originalValue: currentFile.content,
        newValue: editorValue,
        timestamp: Date.now()
      });
      setIsModifiedLocally(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm && editorRef.current) {
      const content = editorRef.current.value;
      const index = content.toLowerCase().indexOf(searchTerm.toLowerCase());
      if (index !== -1) {
        editorRef.current.focus();
        editorRef.current.setSelectionRange(index, index + searchTerm.length);
      }
    }
  };

  const getLineNumbers = (content: string) => {
    const lines = content.split('\n');
    return lines.map((_, index) => index + 1);
  };

  if (!currentFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <img 
            src={IMAGES.CODE_EDITOR_PREVIEW_20260220_015613_2} 
            alt="Editor de Código" 
            className="w-64 h-64 mx-auto opacity-50 rounded-lg"
          />
          <div className="text-muted-foreground">
            <FileCode className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg font-medium">Nenhum arquivo selecionado</p>
            <p className="text-sm">Selecione uma unidade no painel esquerdo para editar o código</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Barra de Ferramentas do Editor */}
      <div className="flex items-center gap-2 p-2 border-b bg-card">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={!isModifiedLocally}
            className="text-xs"
          >
            <Save className="w-4 h-4 mr-1" />
            Salvar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            className="text-xs"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Desfazer
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            className="text-xs"
          >
            <RotateCw className="w-4 h-4 mr-1" />
            Refazer
          </Button>
        </div>

        <div className="flex-1" />

        {/* Busca */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="px-2 py-1 text-xs border rounded bg-background"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSearch}
            className="text-xs"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isModifiedLocally && (
            <div className="flex items-center gap-1 text-accent">
              <AlertCircle className="w-3 h-3" />
              Modificado
            </div>
          )}
          {isDirty && (
            <div className="flex items-center gap-1 text-primary">
              <CheckCircle2 className="w-3 h-3" />
              Alterações pendentes
            </div>
          )}
        </div>
      </div>

      {/* Informações do Arquivo */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b">
        <FileCode className="w-4 h-4 text-primary" />
        <span className="font-medium text-sm">{currentFile.name}</span>
        <span className="text-xs text-muted-foreground">
          Unit: {currentFile.name}
        </span>
        <span className="text-xs text-muted-foreground">
          (Pascal)
        </span>
      </div>

      {/* Editor de Código */}
      <div className="flex-1 flex">
        {/* Números de Linha */}
        <div className="w-12 bg-muted/30 border-r flex flex-col text-xs text-muted-foreground font-mono">
          <div className="p-2 border-b bg-muted/50 text-center font-medium">
            #
          </div>
          <div className="flex-1 overflow-hidden">
            {getLineNumbers(editorValue).map((lineNum) => (
              <div
                key={lineNum}
                className="px-2 py-0.5 text-right leading-5 hover:bg-muted/50"
              >
                {lineNum}
              </div>
            ))}
          </div>
        </div>

        {/* Área de Edição */}
        <div className="flex-1 relative">
          <Textarea
            ref={editorRef}
            value={editorValue}
            onChange={(e) => handleEditorChange(e.target.value)}
            className={cn(
              "w-full h-full resize-none border-0 rounded-none",
              "font-mono text-sm leading-5",
              "focus:ring-0 focus:outline-none",
              "bg-background text-foreground",
              "p-2"
            )}
            style={{
              fontFamily: font?.family || 'JetBrains Mono, Consolas, monospace',
              fontSize: font?.size || '14px'
            }}
            placeholder="// Código Pascal será exibido aqui após a descompilação..."
          />
          
          {/* Indicador de Modificação */}
          {isModifiedLocally && (
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* Rodapé com Estatísticas */}
      <div className="flex items-center justify-between px-3 py-1 bg-muted/50 border-t text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Linhas: {editorValue.split('\n').length}</span>
          <span>Caracteres: {editorValue.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Pascal</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
}