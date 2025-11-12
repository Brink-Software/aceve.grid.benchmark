/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * assembly/data-generator/generateEmployeeData
 * @param count `i32`
 * @param baseSalary `f64`
 * @param seedOffset `i32`
 * @returns `~lib/array/Array<f64>`
 */
export declare function generateEmployeeData(count: number, baseSalary: number, seedOffset: number): Array<number>;
