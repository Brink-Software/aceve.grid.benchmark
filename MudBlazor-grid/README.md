# MudBlazor DataGrid - Performance Benchmark

Een Blazor WebAssembly implementatie met MudBlazor DataGrid voor performance testing met grote datasets.

## 📊 Specificaties

- **Framework**: Blazor WebAssembly (.NET 8)
- **Component**: MudBlazor DataGrid v7.8.0
- **Dataset**: 1.000 rijen × 500 kolommen = 500.000 cellen
- **Virtualisatie**: ✅ Enabled (`Virtualize="true"`)
- **Performance Tracking**: ✅ Geïntegreerd met JSON export

## 🚀 Quick Start

### Vereisten

- .NET 10 SDK of hoger
- Visual Studio 2022, VS Code, of Rider

### Installatie & Run

```bash
# 1. Ga naar de MudBlazor-grid directory
cd MudBlazor-grid

# 2. Restore NuGet packages
dotnet restore

# 3. Build project
dotnet build

# 4. Run project
dotnet run
```

De applicatie start op: **http://localhost:8001**

### Development Mode

```bash
# Watch mode (hot reload)
dotnet watch run
```

## 🎯 Features

### CRUD Operaties

- ✅ **Create**: Nieuwe rijen toevoegen
- ✅ **Read**: Data weergave met sorting/filtering
- ✅ **Update**: Inline editing (niet geïmplementeerd in v1)
- ✅ **Delete**: Single en bulk delete van geselecteerde rijen

### Grid Features

- ✅ **Virtualisatie**: Rendert alleen zichtbare rijen (~20-50)
- ✅ **Multi-selection**: Selecteer meerdere rijen tegelijk
- ✅ **Column filtering**: Filter per kolom
- ✅ **Multi-column sorting**: Sorteer op meerdere kolommen
- ✅ **Fixed header**: Header blijft zichtbaar bij scrollen

### Performance Tracking

- ✅ **Data Generation Time**: Meet C# data generatie snelheid
- ✅ **Grid Initialization Time**: Meet MudDataGrid render tijd
- ✅ **CRUD Operation Times**: Meet add/delete performance
- ✅ **Visual Indicators**: Toon performance metingen in UI
- ✅ **Console Logging**: Gedetailleerde performance logs

## 📂 Project Structuur

```
MudBlazor-grid/
├── Models/
│   ├── Employee.cs              # Employee model (500 properties)
│   └── PerformanceMetric.cs     # Performance tracking model
├── Services/
│   ├── DataGenerationService.cs # Data generatie (C# port van JS)
│   └── PerformanceService.cs    # Performance metingen
├── Pages/
│   └── Index.razor              # Main grid page
├── wwwroot/
│   ├── index.html               # HTML entry point
│   └── css/
│       └── app.css              # Custom styling
├── Program.cs                   # Blazor app configuration
├── App.razor                    # Root component
└── _Imports.razor               # Global using statements
```

## ⚙️ Technische Details

### Data Model

Employee class met **500 properties**:

- 10 core properties (Id, Name, Email, Department, Team, Role, Salary, etc.)
- 490 numeric properties (Num_1 t/m Num_490)

### Data Generatie

- **Chunked generation**: Data wordt in chunks van 10K rijen gegenereerd
- **Async operations**: UI blijft responsive tijdens generatie
- **Progress updates**: Real-time progress indicator
- **Memory efficient**: Chunks worden asynchroon verwerkt

### MudDataGrid Configuration

```csharp
<MudDataGrid
    T="Employee"
    Virtualize="true"              // Rendert alleen zichtbare rijen
    FixedHeader="true"             // Header blijft zichtbaar
    Height="calc(100vh - 350px)"   // Vaste hoogte (verplicht voor virtualisatie)
    MultiSelection="true"          // Meerdere rijen selecteren
    FilterMode="ColumnFilterRow"   // Filter per kolom
    SortMode="Multiple">           // Sorteer op meerdere kolommen
```

## 📈 Performance Verwachtingen

### Data Generation (C# in WASM)

- **1K rijen**: 0.2-0.5 seconden
- **Speed**: ~2000-5000 rijen/seconde

### Grid Initialization

- **Render time**: 0.5-2 seconden
- **Total load**: 1-3 seconden (generation + init)

### Memory Usage

- **Expected**: 50MB-150MB browser memory
- **Peak**: tijdens data generatie

### CRUD Operations (met virtualisatie)

- **Add Row**: 100-500ms
- **Delete Row**: 100-500ms
- **Scroll**: Smooth (virtualisatie werkt!)

## 🧪 Testing

### Manual Testing

1. Open http://localhost:8001
2. Wacht tot grid geladen is (30-60 sec)
3. Test CRUD operaties:
   - Klik "Nieuwe Rij Toevoegen"
   - Selecteer rijen en klik "Verwijder Geselecteerde"
   - Filter/sorteer kolommen

### Playwright E2E Tests

Zie `../playwright/MudBlazor-grid/` voor geautomatiseerde tests.

## ⚠️ Belangrijke Opmerkingen

### Virtualisatie is ESSENTIEEL

- Zonder `Virtualize="true"` kan de grid traag worden met 1K rijen × 500 kolommen
- Grid moet vaste hoogte hebben voor virtualisatie
- Alleen ~20-50 rijen worden tegelijk gerenderd

### Performance Verschillen met JavaScript Grids

- **3-10x trager** dan pure JavaScript grids (acceptabel)
- C# in WASM heeft overhead vs native JavaScript
- Data generatie in C# is trager dan TypeScript

### Browser Memory

- Monitor memory usage in browser DevTools
- 1K × 500 cellen = 500K cellen
- Chrome/Edge aanbevolen (betere WASM performance)

## 🔧 Configuration

### Aantal rijen aanpassen

In `Pages/Index.razor`:

```csharp
_employees = await DataService.GenerateDataAsync(
    targetRows: 1000,  // <-- Pas dit aan
    progressCallback: (count) => { ... },
    chunkSize: 10000
);
```

### Chunk size aanpassen

Grotere chunks = snellere generatie maar minder responsive UI:

```csharp
chunkSize: 10000  // 10K-20K aanbevolen
```

## 📦 Dependencies

- **MudBlazor** v7.8.0 - Material Design component library
- **Microsoft.AspNetCore.Components.WebAssembly** v10.0.0
- **.NET 10 Runtime** - Blazor WebAssembly runtime

## 🐛 Troubleshooting

### Grid laadt niet / blijft hangen

- Check browser console voor errors
- Verlaag aantal rijen (probeer 500 first)
- Check beschikbaar browser memory

### Out of Memory error

- 1K rijen zou stabiel moeten zijn
- Bij problemen, probeer 500 rijen
- Close andere browser tabs
- Herstart browser

### Trage performance

- Normal! WASM is trager dan native JS
- Check CPU usage in Task Manager
- Wacht tot grid volledig geladen is

## 📝 Performance Data Export

Performance metrics worden gelogd naar console. Voor JSON export:

```csharp
var json = PerfService.ExportMetricsJson();
Console.WriteLine(json);
```

## 🔗 Integratie met Benchmark Project

Dit project is onderdeel van het Grid Benchmark project:

- Performance data mergen: `npm run merge-performance`
- Vergelijk met andere grids in `/results/index.html`

## 📄 License

Deel van aceve.grid.benchmark project.
