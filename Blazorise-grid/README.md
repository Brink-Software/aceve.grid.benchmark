# Blazorise DataGrid - Performance Benchmark

Een Blazor WebAssembly applicatie met Blazorise DataGrid component voor het testen van grid performance met grote datasets.

## Features

- **10.000 rijen × 500 kolommen** met virtualisatie
- **CRUD operaties**: Toevoegen en verwijderen van rijen
- **Performance meting**: Gedetailleerde metingen van data generatie, grid initialisatie en CRUD operaties
- **Multi-row selection**: Selecteer meerdere rijen tegelijk
- **Loading indicators**: Progress indicator tijdens data generatie
- **Responsive design**: Bootstrap 5 styling
- **Performance indicators**: Real-time feedback na elke operatie

## Technologie Stack

- **.NET 10.0** - Latest .NET framework
- **Blazor WebAssembly** - Client-side Blazor
- **Blazorise 1.6.2** - Component library
- **Bootstrap 5** - UI framework
- **Font Awesome** - Icons

## Project Structuur

```
Blazorise-grid/
├── Models/
│   ├── Employee.cs           # Data model met 500 properties
│   └── PerformanceMetric.cs  # Performance metric model
├── Services/
│   ├── DataGenerationService.cs  # Genereert test data
│   └── PerformanceService.cs     # Meet performance
├── Pages/
│   └── Index.razor               # Hoofdpagina met DataGrid
├── wwwroot/
│   ├── css/
│   │   └── app.css              # Custom styling
│   └── index.html               # HTML met performance scripts
├── Program.cs                    # Application startup
├── App.razor                     # Root component
└── _Imports.razor               # Global imports
```

## Installatie & Uitvoeren

### Vereisten

- .NET 10.0 SDK of hoger

### Stappen

1. **Installeer dependencies**:

```bash
cd Blazorise-grid
dotnet restore
```

2. **Start de applicatie**:

```bash
dotnet run
```

3. **Open browser**:
   - Navigeer naar: `http://localhost:5003`

## Performance Metingen

De applicatie meet automatisch:

1. **Data Generation**: Tijd om 10.000 Employee objecten te genereren
2. **Grid Init**: Tijd om de grid te initialiseren en renderen
3. **Add Row**: Tijd om een nieuwe rij toe te voegen
4. **Delete Rows**: Tijd om geselecteerde rijen te verwijderen

Alle metingen worden in de browser console gelogd en visueel weergegeven via performance indicators.

## Data Model

### Employee (500 kolommen)

- **Core fields** (10): Id, Name, Email, Department, Team, Role, Salary, Experience, Projects, Performance
- **Numeric fields** (490): Num_1 t/m Num_490 met random waarden

## Blazorise DataGrid Features

- **Virtualisatie**: Rendert alleen zichtbare rijen voor optimale performance
- **Fixed Header**: Header blijft zichtbaar tijdens scrollen
- **Multi-selection**: Selecteer meerdere rijen via checkboxes
- **Responsive**: Past zich aan aan verschillende schermformaten
- **Striped & Hoverable**: Verbeterde visuele feedback

## Vergelijking met andere implementaties

Deze Blazorise implementatie is gebaseerd op:

- **AgGrid**: 3.000 rijen × 40 kolommen (JavaScript)
- **MudBlazor**: 10.000 rijen × 500 kolommen (Blazor)

Blazorise gebruikt dezelfde schaal als MudBlazor voor een faire vergelijking van Blazor grid libraries.

## Browser Compatibiliteit

- Chrome/Edge: ✅ Volledig ondersteund
- Firefox: ✅ Volledig ondersteund
- Safari: ✅ Volledig ondersteund

## Troubleshooting

### Grid laadt niet

- Check browser console voor errors
- Zorg dat alle NuGet packages correct zijn geïnstalleerd
- Clear browser cache en herlaad

### Slow performance

- Virtualisatie is ingeschakeld voor optimale performance
- Check browser console voor performance metingen
- Gebruik Chrome DevTools Performance tab voor profiling

## License

Dit project maakt deel uit van een grid performance benchmark suite.
