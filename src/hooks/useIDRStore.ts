import { create } from 'zustand';
import {
  AppState,
  Unit,
  DFMForm,
  DecompiledString,
  ClassNode,
  RTTIType,
  MapEntry,
  NameEntry,
  SourceFile,
  Modification,
  DelphiVersion,
  FontConfig,
  RecentFile
} from '@/lib/index';

interface IDRActions {
  setLoadedFile: (file: AppState['loadedFile']) => void;
  setUnits: (units: Unit[]) => void;
  setTypes: (types: RTTIType[]) => void;
  setForms: (forms: DFMForm[]) => void;
  setStrings: (strings: DecompiledString[]) => void;
  setNames: (names: NameEntry[]) => void;
  setSourceCode: (sourceCode: SourceFile[]) => void;
  setMapEntries: (mapEntries: MapEntry[]) => void;
  setClassTree: (classTree: ClassNode[]) => void;
  setActiveTab: (tab: AppState['activeTab']) => void;
  setActiveLeftTab: (tab: AppState['activeLeftTab']) => void;
  setSelectedUnitId: (id: string | null) => void;
  setSelectedFormId: (id: string | null) => void;
  addModification: (mod: Modification) => void;
  setDecompiling: (status: boolean) => void;
  setCompiling: (status: boolean) => void;
  setProgress: (progress: number, message: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setFont: (font: FontConfig) => void;
  addRecentFile: (file: RecentFile) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

const initialState: AppState = {
  loadedFile: null,
  units: [],
  types: [],
  forms: [],
  strings: [],
  names: [],
  sourceCode: [],
  mapEntries: [],
  classTree: [],
  activeTab: 'code',
  activeLeftTab: 'units',
  selectedUnitId: null,
  selectedFormId: null,
  modifications: [],
  isDirty: false,
  historyIndex: -1,
  isDecompiling: false,
  isCompiling: false,
  progress: 0,
  progressMessage: '',
  font: { family: 'JetBrains Mono', size: 14 },
  recentFiles: [],
  theme: 'dark',
};

export const useIDRStore = create<AppState & IDRActions>((set) => ({
  ...initialState,

  setLoadedFile: (loadedFile) => set({ loadedFile }),

  setUnits: (units) => set({ units }),

  setTypes: (types) => set({ types }),

  setForms: (forms) => set({ forms }),

  setStrings: (strings) => set({ strings }),

  setNames: (names) => set({ names }),

  setSourceCode: (sourceCode) => set({ sourceCode }),

  setMapEntries: (mapEntries) => set({ mapEntries }),

  setClassTree: (classTree) => set({ classTree }),

  setActiveTab: (activeTab) => set({ activeTab }),

  setActiveLeftTab: (activeLeftTab) => set({ activeLeftTab }),

  setSelectedUnitId: (selectedUnitId) => set({ selectedUnitId }),

  setSelectedFormId: (selectedFormId) => set({ selectedFormId }),

  addModification: (mod) =>
    set((state) => {
      const newModifications = state.modifications.slice(0, state.historyIndex + 1);
      return {
        modifications: [...newModifications, mod],
        isDirty: true,
        historyIndex: newModifications.length,
      };
    }),

  setDecompiling: (isDecompiling) => set({ isDecompiling }),

  setCompiling: (isCompiling) => set({ isCompiling }),

  setProgress: (progress, progressMessage) => set({ progress, progressMessage }),

  setTheme: (theme) => set({ theme }),

  setFont: (font) => set({ font }),

  addRecentFile: (file) =>
    set((state) => ({
      recentFiles: [
        file,
        ...state.recentFiles.filter((f) => f.path !== file.path),
      ].slice(0, 10),
    })),

  undo: () =>
    set((state) => {
      if (state.historyIndex < 0) return state;
      const newIndex = state.historyIndex - 1;
      return {
        historyIndex: newIndex,
        isDirty: newIndex >= 0,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.historyIndex >= state.modifications.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        historyIndex: newIndex,
        isDirty: true,
      };
    }),

  reset: () => set(initialState),
}));
