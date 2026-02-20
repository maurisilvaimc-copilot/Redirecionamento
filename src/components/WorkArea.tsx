import React, { useEffect } from 'react';
import { 
  Code2, 
  Binary, 
  Type, 
  FileCode, 
  Map as MapIcon, 
  Layout as LayoutIcon, 
  List 
} from 'lucide-react';
import { useIDRStore } from '@/hooks/useIDRStore';
import { AppState } from '@/lib/index';
import { CodeViewer } from '@/components/CodeViewer';
import { ClassViewer } from '@/components/ClassViewer';
import { StringsViewer } from '@/components/StringsViewer';
import { NamesViewer } from '@/components/NamesViewer';
import { SourceEditor } from '@/components/SourceEditor';
import { MapViewer } from '@/components/MapViewer';
import { FormEditor } from '@/components/FormEditor';
import { cn } from '@/lib/utils';

interface TabConfig {
  id: AppState['activeTab'];
  label: string;
  shortcut: string;
  icon: React.ElementType;
}

const TABS: TabConfig[] = [
  { id: 'code', label: 'Visualizador de Código', shortcut: 'F6', icon: Binary },
  { id: 'class', label: 'Visualizador de Classes', shortcut: 'F7', icon: List },
  { id: 'strings', label: 'Strings', shortcut: 'F8', icon: Type },
  { id: 'names', label: 'Nomes', shortcut: 'F9', icon: List },
  { id: 'source', label: 'Código-Fonte', shortcut: 'F10', icon: FileCode },
  { id: 'map', label: 'Mapa', shortcut: 'F11', icon: MapIcon },
  { id: 'forms', label: 'Formulários', shortcut: '', icon: LayoutIcon },
];

export function WorkArea() {
  const activeTab = useIDRStore((state) => state.activeTab);
  const setActiveTab = useIDRStore((state) => state.setActiveTab);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'F6':
          e.preventDefault();
          setActiveTab('code');
          break;
        case 'F7':
          e.preventDefault();
          setActiveTab('class');
          break;
        case 'F8':
          e.preventDefault();
          setActiveTab('strings');
          break;
        case 'F9':
          e.preventDefault();
          setActiveTab('names');
          break;
        case 'F10':
          e.preventDefault();
          setActiveTab('source');
          break;
        case 'F11':
          e.preventDefault();
          setActiveTab('map');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'code':
        return <CodeViewer />;
      case 'class':
        return <ClassViewer />;
      case 'strings':
        return <StringsViewer />;
      case 'names':
        return <NamesViewer />;
      case 'source':
        return <SourceEditor />;
      case 'map':
        return <MapViewer />;
      case 'forms':
        return <FormEditor />;
      default:
        return <div className="flex items-center justify-center h-full text-muted-foreground">Selecione uma aba para começar</div>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border-l border-border">
      {/* Tab Header */}
      <div className="flex items-center overflow-x-auto bg-muted/30 border-b border-border no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-medium border-r border-border transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "bg-background text-primary border-b-2 border-b-primary"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
            {tab.shortcut && (
              <span className="ml-1 text-[10px] opacity-50">({tab.shortcut})</span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {renderContent()}
      </div>
    </div>
  );
}
