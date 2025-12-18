namespace MudBlazor_grid.Models;

public class PerformanceMetric
{
    public string Operation { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public double TimeMs { get; set; }
    public DateTime Timestamp { get; set; }
    public string TestFile { get; set; } = "mudblazor-grid";
}
