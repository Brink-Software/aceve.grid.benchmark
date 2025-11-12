#!/bin/bash
# Build script for WASM module
# Requires: Rust and wasm-pack installed

echo "Building WASM data generator..."

cd wasm-data-generator

# Check if wasm-pack is installed
if ! command -v wasm-pack &> /dev/null; then
    echo "Error: wasm-pack not found. Install it with: cargo install wasm-pack"
    exit 1
fi

# Build WASM module
wasm-pack build --target web --release

if [ $? -eq 0 ]; then
    echo "WASM build successful!"
    echo "Files are in: wasm-data-generator/pkg"
    
    # Copy to a location accessible by the web app
    if [ -d "../wasm" ]; then
        rm -rf "../wasm"
    fi
    cp -r pkg ../wasm
    echo "WASM files copied to: wasm/"
else
    echo "WASM build failed!"
    exit 1
fi

cd ..





