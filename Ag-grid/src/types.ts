// ============================================
// TypeScript Types en Interfaces
// ============================================

// AG Grid types (AG Grid wordt via CDN geladen)
export interface RowNode {
  data?: any;
  group?: boolean;
  groupData?: boolean;
  rowPinned?: string;
  level?: number;
  allChildrenCount?: number;
  childrenAfterGroup?: RowNode[];
  [key: string]: any;
}

export interface ICellRendererParams {
  node: RowNode;
  value: any;
  data?: any;
  [key: string]: any;
}

export interface GridOptions {
  columnDefs?: any[];
  rowData?: any[];
  defaultColDef?: any;
  groupDefaultExpanded?: number;
  groupDisplayType?: string;
  autoGroupColumnDef?: any;
  isGroupOpenByDefault?: (params: any) => boolean;
  getRowStyle?: (params: any) => any;
  pagination?: boolean;
  rowSelection?: string;
  animateRows?: boolean;
  enableRangeSelection?: boolean;
  onSelectionChanged?: () => void;
  onCellValueChanged?: (params: any) => void;
  pinnedBottomRowData?: any[];
  api?: any;
  [key: string]: any;
}

export interface FormulaColumn {
  field: string;
  formula: string;
}

export interface TotalsRow {
  _rowCount: number;
  _isTotalRow: boolean;
  [key: string]: number | boolean;
}

export interface CustomCellRendererParams extends ICellRendererParams {
  node: RowNode;
  value: any;
  data?: any;
}

export type CustomGridOptions = GridOptions & {
  api?: any;
};

