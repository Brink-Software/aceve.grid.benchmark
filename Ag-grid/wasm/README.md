# WASM Data Generator

Deze directory bevat de gecompileerde WASM module voor data generatie.

## Structuur

- `data-generator.wasm` - De gecompileerde WASM module
- `data-generator.js` - JavaScript glue code (optioneel, als je wasm-bindgen gebruikt)

## Gebruik

De applicatie probeert automatisch de WASM module te laden vanuit deze directory.
Als de WASM module niet beschikbaar is, wordt automatisch de JavaScript fallback gebruikt.

## WASM Module Toevoegen

Om een WASM module toe te voegen:

1. Compileer je WASM module naar `data-generator.wasm`
2. Plaats het bestand in deze `wasm/` directory
3. De WASM module moet de volgende exports hebben:
   - `generateEmployee(id: i32, ...)` - Genereer een enkele employee
   - (Optioneel) `generateData(count: i32)` - Genereer meerdere employees

## Fallback

Als de WASM module niet beschikbaar is, gebruikt de applicatie automatisch de JavaScript implementatie in `src/data.ts`.

