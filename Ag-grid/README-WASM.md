# WebAssembly Data Generator Setup

Dit project gebruikt Rust/WebAssembly voor snellere data generatie.

## Vereisten

1. **Rust installeren**: https://rustup.rs/
   ```bash
   # Windows (PowerShell)
   Invoke-WebRequest https://win.rustup.rs/x86_64 -OutFile rustup-init.exe
   .\rustup-init.exe
   
   # Linux/Mac
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **wasm-pack installeren**:
   ```bash
   cargo install wasm-pack
   ```

## Build WASM Module

### Windows (PowerShell):
```bash
npm run build:wasm
```

### Linux/Mac:
```bash
npm run build:wasm:unix
```

### Of handmatig:
```bash
cd wasm-data-generator
wasm-pack build --target web --release
cd ..
# Kopieer pkg naar wasm directory
cp -r wasm-data-generator/pkg wasm
```

## Gebruik

Na het builden van de WASM module, zal de applicatie automatisch proberen WASM te gebruiken voor data generatie. Als WASM niet beschikbaar is, valt het terug op de JavaScript implementatie.

## Performance

WASM (Rust) is typisch **5-10x sneller** dan JavaScript voor data generatie, vooral bij grote datasets (200.000+ rijen).

## Troubleshooting

- **"WASM module not found"**: Zorg dat je `npm run build:wasm` hebt uitgevoerd
- **"wasm-pack not found"**: Installeer wasm-pack met `cargo install wasm-pack`
- **Build errors**: Zorg dat Rust up-to-date is: `rustup update`





