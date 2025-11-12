async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.assign(Object.create(globalThis), imports.env || {}, {
      abort(message, fileName, lineNumber, columnNumber) {
        // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
        message = __liftString(message >>> 0);
        fileName = __liftString(fileName >>> 0);
        lineNumber = lineNumber >>> 0;
        columnNumber = columnNumber >>> 0;
        (() => {
          // @external.js
          throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
        })();
      },
    }),
  };
  const wasmInstance = await WebAssembly.instantiate(module, adaptedImports);
  const exports = wasmInstance.exports;
  const memory = exports.memory || imports.env.memory;
  
  // Check of generateEmployeeData bestaat in exports
  if (!exports.generateEmployeeData || typeof exports.generateEmployeeData !== "function") {
    console.error("WASM exports:", Object.keys(exports));
    console.error("generateEmployeeData type:", typeof exports.generateEmployeeData);
    throw new Error("generateEmployeeData is not exported from WASM module. Available exports: " + Object.keys(exports).join(", "));
  }
  
  // Sla de WASM functie op voor gebruik in de wrapper
  const wasmGenerateEmployeeData = exports.generateEmployeeData;
  
  const adaptedExports = Object.setPrototypeOf({
    generateEmployeeData(count, baseSalary, seedOffset) {
      // assembly/data-generator/generateEmployeeData(i32, f64, i32) => ~lib/array/Array<f64>
      if (!wasmGenerateEmployeeData || typeof wasmGenerateEmployeeData !== "function") {
        throw new Error("wasmGenerateEmployeeData is not a function");
      }
      return __liftArray(__getF64, 3, wasmGenerateEmployeeData(count, baseSalary, seedOffset) >>> 0);
    },
  }, exports);
  function __liftString(pointer) {
    if (!pointer) return null;
    const
      end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1,
      memoryU16 = new Uint16Array(memory.buffer);
    let
      start = pointer >>> 1,
      string = "";
    while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
    return string + String.fromCharCode(...memoryU16.subarray(start, end));
  }
  function __liftArray(liftElement, align, pointer) {
    if (!pointer) return null;
    const
      dataStart = __getU32(pointer + 4),
      length = __dataview.getUint32(pointer + 12, true),
      values = new Array(length);
    for (let i = 0; i < length; ++i) values[i] = liftElement(dataStart + (i << align >>> 0));
    return values;
  }
  let __dataview = new DataView(memory.buffer);
  function __getU32(pointer) {
    try {
      return __dataview.getUint32(pointer, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      return __dataview.getUint32(pointer, true);
    }
  }
  function __getF64(pointer) {
    try {
      return __dataview.getFloat64(pointer, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      return __dataview.getFloat64(pointer, true);
    }
  }
  return adaptedExports;
}
export const {
  memory,
  generateEmployeeData,
} = await (async url => instantiate(
  await (async () => {
    const isNodeOrBun = typeof process != "undefined" && process.versions != null && (process.versions.node != null || process.versions.bun != null);
    if (isNodeOrBun) { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
    else { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
  })(), {
  }
))(new URL("data-generator.wasm", import.meta.url));
