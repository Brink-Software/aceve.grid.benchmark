// ============================================
// TypeScript Type Definities voor RevoGrid
// ============================================

export interface RevoGridColumn {
  prop: string;
  name: string;
  size?: number;
  sortable?: boolean;
  readonly?: boolean;
  cellTemplate?: (h: any, column: any, data: any) => any;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  team: string;
  role: string;
  salary: number;
  yearsExperience: number;
  projectsCompleted: number;
  performanceScore: number;
  trainingHours: number;
  startDate: string;
  [key: string]: any;
}
