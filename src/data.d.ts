export interface Department {
    name: string;
    color: string;
}
export interface TeamsMap {
    [department: string]: string[];
}
export interface RolesMap {
    [department: string]: string[];
}
export interface BaseSalaryMap {
    [role: string]: number;
}
export declare const departments: Department[];
export declare const teams: TeamsMap;
export declare const roles: RolesMap;
export declare const firstNames: string[];
export declare const lastNames: string[];
export declare const baseSalary: BaseSalaryMap;
export declare const textSampleData: string[];
export declare function generateEmployee(id: number, department: string, team: string, role: string): any;
export type ProgressCallback = (count: number) => void;
export interface NextIdState {
    value: number;
    getValue(): number;
    setValue(value: number): void;
    increment(): number;
}
export declare function generateChunk(rowData: any[], targetRows: number, nextIdState: NextIdState, updateProgress: ProgressCallback, chunkSize?: number): Promise<void>;
export declare function generateOrganizationData(): any[];
//# sourceMappingURL=data.d.ts.map