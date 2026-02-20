import React from 'react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar';
import {
  FileText,
  FolderOpen,
  Save,
  LogOut,
  Settings,
  HelpCircle,
  Info,
  Layers,
  Code2,
  Play,
  RefreshCw,
  Undo2,
  Redo2,
  Hash,
  Type,
  Cpu,
  Network,
  FileCode,
  Package,
  History,
  Key,
  Palette,
} from 'lucide-react';
import { DELPHI_VERSIONS, ROUTE_PATHS } from '@/lib/index';
import { useIDRStore } from '@/hooks/useIDRStore';
import { useNavigate } from 'react-router-dom';

export function MenuBar() {
  const navigate = useNavigate();
  const {
    setActiveTab,
    setActiveLeftTab,
    recentFiles,
    undo,
    redo,
    isDirty,
    loadedFile,
    setDecompiling,
    setProgress,
  } = useIDRStore();

  const handleOpenLocalFile = () => {
    // Simulação de abertura de arquivo
    setDecompiling(true);
    setProgress(0, 'Iniciando análise de binário...');
    
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p, `Processando estruturas Delphi... ${p}%`);
      if (p >= 100) {
        clearInterval(interval);
        setDecompiling(false);
        navigate(ROUTE_PATHS.WORKSPACE);
      }
    }, 200);
  };

  return (
    <Menubar className="rounded-none border-b border-border bg-card px-2 lg:px-4 h-9">
      {/* Arquivo */}
      <MenubarMenu>
        <MenubarTrigger className="cursor-default">Arquivo</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>
              <FolderOpen className="mr-2 h-4 w-4" />
              Carregar Arquivo
            </MenubarSubTrigger>
            <MenubarSubContent className="max-h-[400px] overflow-y-auto">
              {DELPHI_VERSIONS.map((version) => (
                <MenubarItem key={version} onClick={handleOpenLocalFile}>
                  {version === 'Auto' ? 'Detectar Versão Automaticamente' : version}
                </MenubarItem>
              ))}
            </MenubarSubContent>
          </MenubarSub>
          <MenubarItem onClick={handleOpenLocalFile}>
            <Package className="mr-2 h-4 w-4" />
            Abrir Projeto (.idp)
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>
              <History className="mr-2 h-4 w-4" />
              Arquivos Recentes
            </MenubarSubTrigger>
            <MenubarSubContent>
              {recentFiles.length > 0 ? (
                recentFiles.map((file, i) => (
                  <MenubarItem key={i}>
                    {file.name}
                  </MenubarItem>
                ))
              ) : (
                <MenubarItem disabled>Nenhum arquivo recente</MenubarItem>
              )}
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem disabled={!loadedFile}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Projeto
            <MenubarShortcut>Ctrl+S</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled={!loadedFile}>
            <FileCode className="mr-2 h-4 w-4" />
            Salvar Projeto Delphi
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => navigate(ROUTE_PATHS.HOME)}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Ferramentas */}
      <MenubarMenu>
        <MenubarTrigger className="cursor-default">Ferramentas</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Cpu className="mr-2 h-4 w-4" />
            Dumper de Processo
          </MenubarItem>
          <MenubarItem>
            <Layers className="mr-2 h-4 w-4" />
            Gerador de Mapa (MAP)
          </MenubarItem>
          <MenubarItem>
            <FileText className="mr-2 h-4 w-4" />
            Gerador de Comentários
          </MenubarItem>
          <MenubarItem>
            <Code2 className="mr-2 h-4 w-4" />
            Gerador IDC
          </MenubarItem>
          <MenubarItem>
            <Hash className="mr-2 h-4 w-4" />
            Gerador HIEW
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Network className="mr-2 h-4 w-4" />
            Construtor de Árvore de Classes
          </MenubarItem>
          <MenubarItem>
            <Type className="mr-2 h-4 w-4" />
            Visualizador de TypeInfo (KB)
          </MenubarItem>
          <MenubarItem>
            <RefreshCw className="mr-2 h-4 w-4" />
            Conversor Hex→Double
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Abas */}
      <MenubarMenu>
        <MenubarTrigger className="cursor-default">Abas</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => setActiveLeftTab('units')}>
            Unidades
            <MenubarShortcut>F2</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => setActiveLeftTab('types')}>
            Tipos
            <MenubarShortcut>F4</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => setActiveLeftTab('forms')}>
            Formulários
            <MenubarShortcut>F5</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => setActiveTab('code')}>
            Visualizador de Código
            <MenubarShortcut>F6</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => setActiveTab('class')}>
            Visualizador de Classes
            <MenubarShortcut>F7</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => setActiveTab('strings')}>
            Strings
            <MenubarShortcut>F8</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => setActiveTab('names')}>
            Nomes
            <MenubarShortcut>F9</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => setActiveTab('source')}>
            Código-Fonte
            <MenubarShortcut>F10</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => setActiveTab('map')}>
            Mapa
            <MenubarShortcut>F11</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Editor */}
      <MenubarMenu>
        <MenubarTrigger className="cursor-default">Editor</MenubarTrigger>
        <MenubarContent>
          <MenubarItem disabled={!isDirty}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Edições
          </MenubarItem>
          <MenubarItem disabled={!loadedFile}>
            <Play className="mr-2 h-4 w-4" />
            Recompilar Executável
            <MenubarShortcut>Ctrl+B</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled={!loadedFile}>
            <FileCode className="mr-2 h-4 w-4" />
            Exportar Projeto Delphi
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={undo}>
            <Undo2 className="mr-2 h-4 w-4" />
            Desfazer
            <MenubarShortcut>Ctrl+Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={redo}>
            <Redo2 className="mr-2 h-4 w-4" />
            Refazer
            <MenubarShortcut>Ctrl+Y</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Plugins */}
      <MenubarMenu>
        <MenubarTrigger className="cursor-default">Plugins</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Package className="mr-2 h-4 w-4" />
            Gerenciar Plugins
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Programa */}
      <MenubarMenu>
        <MenubarTrigger className="cursor-default">Programa</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Info className="mr-2 h-4 w-4" />
            Sobre...
          </MenubarItem>
          <MenubarItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            Ajuda
            <MenubarShortcut>F1</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Palette className="mr-2 h-4 w-4" />
            Legenda
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>
                <Type className="mr-2 h-4 w-4" />
                Fontes
              </MenubarItem>
              <MenubarItem>
                <Key className="mr-2 h-4 w-4" />
                Integração com Shell
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
