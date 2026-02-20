/**
 * Definições de rotas para navegação na aplicação
 */
export const ROUTE_PATHS = {
  HOME: '/',
  WORKSPACE: '/workspace',
} as const;

/**
 * Versões do Delphi suportadas pelo decompilador
 */
export type DelphiVersion = 
  | 'Auto' 
  | 'Delphi 2' | 'Delphi 3' | 'Delphi 4' | 'Delphi 5' | 'Delphi 6' | 'Delphi 7' 
  | 'Delphi 2005' | 'Delphi 2006' | 'Delphi 2007' | 'Delphi 2009' | 'Delphi 2010' 
  | 'Delphi XE1' | 'Delphi XE2' | 'Delphi XE3' | 'Delphi XE4';

export const DELPHI_VERSIONS: DelphiVersion[] = [
  'Auto',
  'Delphi 2', 'Delphi 3', 'Delphi 4', 'Delphi 5', 'Delphi 6', 'Delphi 7',
  'Delphi 2005', 'Delphi 2006', 'Delphi 2007', 'Delphi 2009', 'Delphi 2010',
  'Delphi XE1', 'Delphi XE2', 'Delphi XE3', 'Delphi XE4'
];

/**
 * Tipos de Units identificadas no binário
 */
export type UnitType = 'standard' | 'user' | 'trivial' | 'unknown';

export const UNIT_TYPES = {
  STANDARD: 'standard', // Azul (KB)
  USER: 'user',         // Verde
  TRIVIAL: 'trivial',   // Cinza
  UNKNOWN: 'unknown'    // Amarelo
} as const;

export interface Unit {
  id: string;
  address: string;
  name: string;
  type: UnitType;
  initializationAddress?: string;
  finalizationAddress?: string;
  flags?: {
    hasInitialization: boolean;
    hasFinalization: boolean;
  };
}

/**
 * Estrutura de componente DFM
 */
export interface DFMComponent {
  type: string;
  name: string;
  properties: Record<string, any>;
  children: DFMComponent[];
}

export interface DFMForm {
  id: string;
  name: string;
  content: string; // Conteúdo textual do DFM
  structure: DFMComponent; // Estrutura parseada para editor visual
}

/**
 * String extraída do binário
 */
export interface DecompiledString {
  id: string;
  address: string;
  value: string;
  length: number;
  xrefs: string[];
}

/**
 * Nó da árvore de classes (VMT)
 */
export interface ClassNode {
  id: string;
  name: string;
  address: string;
  parent?: string;
  methods: {
    address: string;
    name: string;
    type: 'virtual' | 'dynamic' | 'message';
  }[];
  children: ClassNode[];
}

/**
 * Tipo RTTI (Run-Time Type Information)
 */
export interface RTTIType {
  id: string;
  address: string;
  name: string;
  kind: string;
  definition: string;
}

/**
 * Entrada no mapa de memória
 */
export interface MapEntry {
  id: string;
  address: string;
  name: string;
  segment: string;
  size?: number;
}

/**
 * Nome/Símbolo identificado
 */
export interface NameEntry {
  id: string;
  address: string;
  name: string;
  xrefs: string[];
}

/**
 * Arquivo de código fonte (Pascal ou Assembly)
 */
export interface SourceFile {
  id: string;
  unitId: string;
  name: string;
  content: string;
  language: 'pascal' | 'asm';
}

/**
 * Tipos de modificações permitidas no editor
 */
export type ModificationType = 'code' | 'string' | 'dfm' | 'name' | 'type';

export const MODIFICATION_TYPES = {
  CODE: 'code',
  STRING: 'string',
  DFM: 'dfm',
  NAME: 'name',
  TYPE: 'type'
} as const;

export interface Modification {
  id: string;
  type: ModificationType;
  targetId: string; // ID do recurso modificado (unit, string address, etc)
  originalValue: string;
  newValue: string;
  timestamp: number;
}

/**
 * Histórico de arquivos recentes
 */
export interface RecentFile {
  name: string;
  path: string;
  lastOpened: number;
  delphiVersion?: DelphiVersion;
}

/**
 * Configurações de exibição
 */
export interface FontConfig {
  family: string;
  size: number;
}

/**
 * Estado global da aplicação
 */
export interface AppState {
  // Arquivo carregado
  loadedFile: {
    name: string;
    path: string;
    size: number;
    delphiVersion: DelphiVersion;
  } | null;

  // Dados decompilados
  units: Unit[];
  types: RTTIType[];
  forms: DFMForm[];
  strings: DecompiledString[];
  names: NameEntry[];
  sourceCode: SourceFile[];
  mapEntries: MapEntry[];
  classTree: ClassNode[];

  // Estado da UI
  activeTab: 'code' | 'class' | 'strings' | 'names' | 'source' | 'map' | 'forms';
  activeLeftTab: 'units' | 'types' | 'forms';
  selectedUnitId: string | null;
  selectedFormId: string | null;
  
  // Edições e alterações
  modifications: Modification[];
  isDirty: boolean;
  historyIndex: number;

  // Processamento
  isDecompiling: boolean;
  isCompiling: boolean;
  progress: number;
  progressMessage: string;

  // Configurações e Preferências
  font: FontConfig;
  recentFiles: RecentFile[];
  theme: 'dark' | 'light';
}
