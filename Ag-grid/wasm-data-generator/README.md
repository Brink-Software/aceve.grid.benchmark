# WASM Data Generator

Rust-based WebAssembly module for high-performance data generation.

## Prerequisites

1. Install Rust: https://rustup.rs/
2. Install wasm-pack: `cargo install wasm-pack`

## Build

```bash
wasm-pack build --target web --release
```

This will create a `pkg` directory with the compiled WebAssembly module.

## Usage

The generated files in `pkg` should be copied to your web project and imported in TypeScript/JavaScript.





