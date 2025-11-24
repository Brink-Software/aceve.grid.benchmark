// Employee data structure
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
  [key: string]: string | number; // For dynamic num_* and text_* fields
}

// Data generation types (from shared data.ts)
export interface NextIdState {
  value: number;
  getValue(): number;
  setValue(value: number): void;
  increment(): number;
}

export type ProgressCallback = (count: number) => void;

