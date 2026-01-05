using System.Diagnostics;
using System.Text.Json;
using Microsoft.JSInterop;
using MudBlazor_grid.Models;

namespace MudBlazor_grid.Services;

public class PerformanceService
{
    private readonly IJSRuntime _jsRuntime;
    private readonly List<PerformanceMetric> _metrics = new();
    private Stopwatch? _currentStopwatch;

    public PerformanceService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }

    public void StartMeasurement()
    {
        _currentStopwatch = Stopwatch.StartNew();
    }

    public async Task<double> StopMeasurementAsync(string operation)
    {
        if (_currentStopwatch == null)
            return 0;

        _currentStopwatch.Stop();
        var timeMs = _currentStopwatch.Elapsed.TotalMilliseconds;

        var metric = new PerformanceMetric
        {
            Operation = operation,
            Time = $"{timeMs:F2} ms",
            TimeMs = timeMs,
            Timestamp = DateTime.UtcNow,
            TestFile = "mudblazor-grid"
        };

        _metrics.Add(metric);

        // Show performance indicator via JS
        try
        {
            await _jsRuntime.InvokeVoidAsync("showPerformanceIndicator",
                operation,
                metric.Time,
                GetDataTestAttribute(operation));
        }
        catch
        {
            // JS interop might not be ready yet
        }

        Console.WriteLine($"=== PERFORMANCE: {operation} ===");
        Console.WriteLine($"TIME: {timeMs:F2} ms");

        _currentStopwatch = null;
        return timeMs;
    }

    // Start measurement using browser's Performance API
    public async Task StartBrowserMeasurementAsync(string name)
    {
        try
        {
            await _jsRuntime.InvokeVoidAsync("gridPerformance.startMeasure", name);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Warning: Could not start browser measurement: {ex.Message}");
        }
    }

    // Stop measurement using browser's Performance API
    public async Task<double> StopBrowserMeasurementAsync(string name)
    {
        try
        {
            var timeMs = await _jsRuntime.InvokeAsync<double>("gridPerformance.stopMeasure", name);
            
            var metric = new PerformanceMetric
            {
                Operation = name,
                Time = $"{timeMs:F2} ms",
                TimeMs = timeMs,
                Timestamp = DateTime.UtcNow,
                TestFile = "mudblazor-grid"
            };

            _metrics.Add(metric);

            Console.WriteLine($"=== PERFORMANCE (Browser): {name} ===");
            Console.WriteLine($"TIME: {timeMs:F2} ms");

            return timeMs;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Warning: Could not stop browser measurement: {ex.Message}");
            return 0;
        }
    }

    // Wait for grid to render and measure the time
    public async Task<double> WaitForGridRenderAsync(string gridId, int maxWaitMs = 10000)
    {
        try
        {
            var timeMs = await _jsRuntime.InvokeAsync<double>("gridPerformance.waitForGridRender", gridId, maxWaitMs);
            
            var metric = new PerformanceMetric
            {
                Operation = "Grid Render Complete",
                Time = $"{timeMs:F2} ms",
                TimeMs = timeMs,
                Timestamp = DateTime.UtcNow,
                TestFile = "mudblazor-grid"
            };

            _metrics.Add(metric);

            Console.WriteLine($"=== PERFORMANCE: Grid Render Complete ===");
            Console.WriteLine($"TIME: {timeMs:F2} ms");

            return timeMs;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error waiting for grid render: {ex.Message}");
            return 0;
        }
    }

    private string GetDataTestAttribute(string operation)
    {
        return operation.ToLower()
            .Replace(" ", "-")
            .Replace("(", "")
            .Replace(")", "");
    }

    public List<PerformanceMetric> GetMetrics() => _metrics;

    public string ExportMetricsJson()
    {
        var options = new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        return JsonSerializer.Serialize(_metrics, options);
    }

    public async Task<long> GetMemoryUsageAsync()
    {
        try
        {
            // Try to get memory usage via JS interop
            var memory = await _jsRuntime.InvokeAsync<long>("getMemoryUsage");
            return memory;
        }
        catch
        {
            return 0;
        }
    }
}
