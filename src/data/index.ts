import { 
  Unit, 
  DFMForm, 
  DecompiledString, 
  ClassNode, 
  RTTIType, 
  SourceFile, 
  MapEntry, 
  NameEntry,
  UNIT_TYPES
} from '../lib/index';

/**
 * Mock de Unidades (Units) detectadas no binário
 */
export const mockUnits: Unit[] = [
  {
    id: 'unit-1',
    address: '00401000',
    name: 'System',
    type: UNIT_TYPES.STANDARD,
    flags: { hasInitialization: true, hasFinalization: false }
  },
  {
    id: 'unit-2',
    address: '0045A200',
    name: 'SysUtils',
    type: UNIT_TYPES.STANDARD,
    flags: { hasInitialization: true, hasFinalization: true }
  },
  {
    id: 'unit-3',
    address: '0052B000',
    name: 'UPrincipal',
    type: UNIT_TYPES.USER,
    flags: { hasInitialization: true, hasFinalization: false }
  },
  {
    id: 'unit-4',
    address: '0053F000',
    name: 'UDataModule',
    type: UNIT_TYPES.USER,
    flags: { hasInitialization: true, hasFinalization: true }
  },
  {
    id: 'unit-5',
    address: '00405000',
    name: 'TrivialFuncs',
    type: UNIT_TYPES.TRIVIAL,
    flags: { hasInitialization: false, hasFinalization: false }
  },
  {
    id: 'unit-6',
    address: '00600000',
    name: 'Unknown_600000',
    type: UNIT_TYPES.UNKNOWN,
    flags: { hasInitialization: false, hasFinalization: false }
  }
];

/**
 * Mock de Formulários DFM
 */
export const mockForms: DFMForm[] = [
  {
    id: 'form-1',
    name: 'frmMain',
    content: `object frmMain: TfrmMain\n  Left = 250\n  Top = 150\n  Caption = 'Sistema de Gestão 2026'\n  ClientHeight = 400\n  ClientWidth = 600\n  Color = clBtnFace\n  Font.Charset = DEFAULT_CHARSET\n  Font.Color = clWindowText\n  Font.Height = -11\n  Font.Name = 'Tahoma'\n  Font.Style = []\n  OldCreateOrder = False\n  PixelsPerInch = 96\n  TextHeight = 13\n  object btnProcessar: TButton\n    Left = 24\n    Top = 24\n    Width = 75\n    Height = 25\n    Caption = 'Processar'\n    TabOrder = 0\n    OnClick = btnProcessarClick\n  end\nend`,
    structure: {
      type: 'TfrmMain',
      name: 'frmMain',
      properties: {
        Caption: 'Sistema de Gestão 2026',
        Width: 600,
        Height: 400,
        Color: 'clBtnFace'
      },
      children: [
        {
          type: 'TButton',
          name: 'btnProcessar',
          properties: {
            Left: 24,
            Top: 24,
            Width: 75,
            Height: 25,
            Caption: 'Processar'
          },
          children: []
        }
      ]
    }
  },
  {
    id: 'form-2',
    name: 'frmLogin',
    content: `object frmLogin: TfrmLogin\n  Caption = 'Autenticação'\n  object edtUser: TEdit\n    Text = ''\n  end\n  object btnOk: TButton\n    Caption = 'Entrar'\n  end\nend`,
    structure: {
      type: 'TfrmLogin',
      name: 'frmLogin',
      properties: { Caption: 'Autenticação' },
      children: [
        { type: 'TEdit', name: 'edtUser', properties: { Text: '' }, children: [] },
        { type: 'TButton', name: 'btnOk', properties: { Caption: 'Entrar' }, children: [] }
      ]
    }
  }
];

/**
 * Mock de Strings extraídas
 */
export const mockStrings: DecompiledString[] = [
  { id: 'str-1', address: '0055A010', value: 'Software Licenciado para Pesquisa Acadêmica', length: 44, xrefs: ['0052B120', '0052B145'] },
  { id: 'str-2', address: '0055A040', value: 'Erro crítico ao inicializar banco de dados', length: 43, xrefs: ['0053F050'] },
  { id: 'str-3', address: '0055A080', value: 'C:\\Program Files\\Delphi\\Projects\\IDR\\', length: 39, xrefs: ['0052B900'] },
  { id: 'str-4', address: '0055A0C0', value: 'Admin', length: 5, xrefs: ['0052C100'] },
  { id: 'str-5', address: '0055A100', value: 'v3.1.2026', length: 10, xrefs: ['00401050'] }
];

/**
 * Mock da Árvore de Classes (VMT)
 */
export const mockClasses: ClassNode[] = [
  {
    id: 'class-1',
    name: 'TObject',
    address: '004010CC',
    methods: [
      { address: '004010D0', name: 'Create', type: 'virtual' },
      { address: '004010E0', name: 'Free', type: 'virtual' },
      { address: '004010F0', name: 'Destroy', type: 'virtual' }
    ],
    children: [
      {
        id: 'class-2',
        name: 'TPersistent',
        address: '00402000',
        parent: 'TObject',
        methods: [
          { address: '00402010', name: 'Assign', type: 'virtual' }
        ],
        children: [
          {
            id: 'class-3',
            name: 'TComponent',
            address: '00403000',
            parent: 'TPersistent',
            methods: [
              { address: '00403050', name: 'FindComponent', type: 'virtual' }
            ],
            children: []
          }
        ]
      }
    ]
  }
];

/**
 * Mock de Tipos RTTI
 */
export const mockTypes: RTTIType[] = [
  {
    id: 'type-1',
    address: '0040A100',
    name: 'TModalResult',
    kind: 'tkEnumeration',
    definition: 'TModalResult = (mrNone, mrOk, mrCancel, mrAbort, mrRetry, mrIgnore, mrYes, mrNo, mrAll, mrNoToAll, mrYesToAll);'
  },
  {
    id: 'type-2',
    address: '0040A200',
    name: 'TAlignment',
    kind: 'tkEnumeration',
    definition: 'TAlignment = (taLeftJustify, taRightJustify, taCenter);'
  }
];

/**
 * Mock de Arquivos de Código Fonte
 */
export const mockSourceFiles: SourceFile[] = [
  {
    id: 'src-1',
    unitId: 'unit-3',
    name: 'UPrincipal.pas',
    language: 'pascal',
    content: `unit UPrincipal;\n\ninterface\n\nuses\n  Windows, Messages, SysUtils, Classes, Graphics, Controls, Forms, Dialogs,\n  StdCtrls;\n\ntype\n  TfrmMain = class(TForm)\n    btnProcessar: TButton;\n    procedure btnProcessarClick(Sender: TObject);\n  private\n    { Private declarations }\n  public\n    { Public declarations }\n  end;\n\nvar\n  frmMain: TfrmMain;\n\nimplementation\n\n{$R *.DFM}\n\nprocedure TfrmMain.btnProcessarClick(Sender: TObject);\nbegin\n  ShowMessage('Processamento iniciado em ' + DateTimeToStr(Now));\n  // TODO: Implementar lógica de análise binária\nend;\n\nend.`
  },
  {
    id: 'src-2',
    unitId: 'unit-3',
    name: 'UPrincipal.asm',
    language: 'asm',
    content: `UPrincipal.btnProcessarClick:\n0052B120   55                     push    ebp\n0052B121   8BEC                   mov     ebp, esp\n0052B123   6A 00                  push    0\n0052B125   53                     push    ebx\n0052B126   8BD8                   mov     ebx, eax\n0052B128   33C0                   xor     eax, eax\n0052B12A   55                     push    ebp\n0052B12B   6870B15200             push    offset loc_0052B170\n0052B130   64FF30                 push    dword ptr fs:[eax]\n0052B133   648920                 mov     fs:[eax], esp\n...`
  }
];

/**
 * Mock de Entradas do Mapa de Memória
 */
export const mockMapEntries: MapEntry[] = [
  { id: 'map-1', address: '00401000', segment: 'CODE', name: 'System' },
  { id: 'map-2', address: '0045A000', segment: 'CODE', name: 'SysUtils' },
  { id: 'map-3', address: '00500000', segment: 'DATA', name: 'VMTs' },
  { id: 'map-4', address: '00550000', segment: 'DATA', name: 'Strings' },
  { id: 'map-5', address: '00600000', segment: 'BSS', name: 'GlobalVars' }
];

/**
 * Mock de Nomes/Símbolos Identificados
 */
export const mockNames: NameEntry[] = [
  { id: 'name-1', address: '00401000', name: 'EntryPoint', xrefs: [] },
  { id: 'name-2', address: '0052B120', name: 'TfrmMain.btnProcessarClick', xrefs: ['0052B450'] },
  { id: 'name-3', address: '0053F100', name: 'TDataModule.AfterConnect', xrefs: [] },
  { id: 'name-4', address: '004010E0', name: 'TObject.Free', xrefs: ['0052B180', '0053F200'] }
];
