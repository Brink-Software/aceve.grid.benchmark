// ============================================
// TypeScript Types en Interfaces voor Tabulator Grid
// ============================================

export interface TabulatorColumn {
  title: string;
  field?: string;
  width?: number;
  sorter?: string | boolean;
  filter?: string | boolean;
  editor?: string | boolean;
  formatter?:
    | string
    | ((cell: any, formatterParams: any) => string | HTMLElement);
  formatterParams?: any;
  headerSort?: boolean;
  headerFilter?: boolean;
  frozen?: boolean;
  visible?: boolean;
  cssClass?: string;
  [key: string]: any;
}

export interface TotalsRow {
  _rowCount: number;
  _isTotalRow: boolean;
  [key: string]: number | boolean;
}

export interface TabulatorTableOptions {
  data?: any[];
  columns?: TabulatorColumn[];
  layout?: string;
  height?: string | number;
  selectable?: boolean | number;
  selectableCheck?: (row: any) => boolean;
  reactiveData?: boolean;
  renderVertical?: string;
  virtualDomBuffer?: number;
  [key: string]: any;
}

declare global {
  interface Window {
    Tabulator: any;
    addNewRow: () => void;
    deleteRow: (id: number) => void;
    deleteSelectedRows: () => void;
    expandAllGroups: () => void;
    collapseAllGroups: () => void;
  }
}
