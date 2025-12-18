// ============================================
// TypeScript Types en Interfaces voor Wijmo Grid
// ============================================

export interface TotalsRow {
  _rowCount: number;
  _isTotalRow: boolean;
  [key: string]: number | boolean;
}

export interface WijmoColumn {
  binding: string;
  header: string;
  width?: number;
  format?: string;
  dataType?: any;
  isReadOnly?: boolean;
  aggregate?: any;
  [key: string]: any;
}




