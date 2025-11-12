# PowerShell script to build WASM module
# Requires: Rust and wasm-pack installed

Write-Host "Building WASM data generator..." -ForegroundColor Green

cd wasm-data-generator

# Check if wasm-pack is installed
if (-not (Get-Command wasm-pack -ErrorAction SilentlyContinue)) {
    Write-Host "Error: wasm-pack not found. Install it with: cargo install wasm-pack" -ForegroundColor Red
    exit 1
}

# Build WASM module
wasm-pack build --target web --release

if ($LASTEXITCODE -eq 0) {
    Write-Host "WASM build successful!" -ForegroundColor Green
    Write-Host "Files are in: wasm-data-generator/pkg" -ForegroundColor Yellow
    
    # Copy to a location accessible by the web app
    if (Test-Path "../wasm") {
        Remove-Item -Recurse -Force "../wasm"
    }
    Copy-Item -Recurse "pkg" "../wasm"
    Write-Host "WASM files copied to: wasm/" -ForegroundColor Green
} else {
    Write-Host "WASM build failed!" -ForegroundColor Red
    exit 1
}

cd ..





