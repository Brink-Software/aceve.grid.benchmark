# Continuous Test Runner Script
# Builds the project, starts the server, and runs Playwright tests in a loop

Write-Host "Starting Continuous Test Runner..." -ForegroundColor Green
Write-Host ""

# Step 1: Build the project
Write-Host "Building project..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Exiting..." -ForegroundColor Red
    exit 1
}
Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host ""

# Step 2: Check if server is already running
Write-Host "Checking for existing server..." -ForegroundColor Cyan
$existingServer = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*serve*" -or $_.MainWindowTitle -like "*serve*"
}

$serverStarted = $false
$serverProcess = $null

if ($existingServer) {
    Write-Host "Server is already running (PID: $($existingServer.Id))" -ForegroundColor Green
}
else {
    # Start the server in the background
    Write-Host "Starting development server..." -ForegroundColor Cyan
    $serverProcess = Start-Process -FilePath "npm" -ArgumentList "run", "serve" -PassThru -WindowStyle Hidden
    $serverStarted = $true
    
    # Wait for server to be ready
    Write-Host "Waiting for server to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    Write-Host "Server started!" -ForegroundColor Green
}
Write-Host ""

# Step 3: Run tests continuously
Write-Host "Starting continuous test execution..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

$testCount = 0

try {
    while ($true) {
        $testCount++
        Write-Host "================================================" -ForegroundColor Magenta
        Write-Host "Test Run #$testCount - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Magenta
        Write-Host "================================================" -ForegroundColor Magenta
        Write-Host ""
        
        # Run Playwright tests
        Set-Location -Path ".\playwright"
        npx playwright test --workers=1 --headed
        $testExitCode = $LASTEXITCODE
        Set-Location -Path ".."
        
        if ($testExitCode -eq 0) {
            Write-Host ""
            Write-Host "Test Run #$testCount completed successfully!" -ForegroundColor Green
        }
        else {
            Write-Host ""
            Write-Host "Test Run #$testCount completed with errors (Exit Code: $testExitCode)" -ForegroundColor Yellow
        }
        
        # Merge performance data after each test run
        Write-Host ""
        Write-Host "Merging performance data..." -ForegroundColor Cyan
        npm run merge-performance | Out-Null
        
        Write-Host ""
        Write-Host "Waiting 5 seconds before next run..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
        Write-Host ""
    }
}
catch {
    Write-Host ""
    Write-Host "Test execution interrupted" -ForegroundColor Yellow
}
finally {
    # Cleanup: Stop the server if we started it
    if ($serverStarted -and $serverProcess) {
        Write-Host ""
        Write-Host "Stopping development server..." -ForegroundColor Cyan
        Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
        Write-Host "Server stopped" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Test runner stopped. Total runs: $testCount" -ForegroundColor Green
}
