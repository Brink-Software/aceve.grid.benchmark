# Grid Benchmark Projecten

Welkom bij de Grid Benchmark projecten collectie. Dit project vergelijkt de prestaties van verschillende grid componenten met grote datasets (200.000+ rijen, 500 kolommen).

## 📁 Projecten

### Ag-grid

**Locatie**: `/Ag-grid`  
**URL**: `http://localhost:8000/Ag-grid/index.html`

Een geavanceerde AG Grid tabel met row grouping voor organisatie data.

**Quick Start**:

```bash
# 1. Ga naar Ag-grid directory
cd Ag-grid

# 2. Installeer dependencies (eerste keer)
npm install

# 3. Compileer TypeScript
npm run build

# 4. Ga terug naar root directory
cd ..

# 5. Start server vanuit ROOT directory
npx serve -l 8000
```

**Belangrijk**: Start de server vanuit de **ROOT directory**, niet vanuit Ag-grid!

Ga naar: http://localhost:8000/Ag-grid/index.html

Zie [Ag-grid/README.md](Ag-grid/README.md) voor meer details.

### AG Grid Speedup (Optimized)

**Locatie**: `/ag-grid-speedup`  
**URL**: `http://localhost:3000`

Een geoptimaliseerde React-implementatie van AG Grid zonder row grouping en aggregaties voor maximale performance.

**Quick Start**:

```bash
# 1. Ga naar ag-grid-speedup directory
cd ag-grid-speedup

# 2. Installeer dependencies (eerste keer)
npm install

# 3. Start Vite dev server
npm run dev
```

**Performance Optimizations**:

- ✅ No row grouping (major performance boost)
- ✅ No aggregation functions
- ✅ Simple value formatters (no complex cell renderers)
- ✅ Column & row virtualization optimized
- ✅ Transaction-based updates
- ✅ React with Vite (fast HMR)

Ga naar: http://localhost:3000

Zie [ag-grid-speedup/README.md](ag-grid-speedup/README.md) voor meer details.

### Wijmo-grid

**Locatie**: `/Wijmo-grid`  
**URL**: `http://localhost:8000/Wijmo-grid/index.html`

Een Wijmo Grid implementatie met dezelfde functionaliteit als Ag-grid voor performance vergelijking.

**Quick Start**:

```bash
# 1. Compileer TypeScript (vanuit root directory)
npm run build

# 2. Start server vanuit ROOT directory
npx serve -l 8000
```

Ga naar: http://localhost:8000/Wijmo-grid/index.html

### MudBlazor-grid

**Locatie**: `/MudBlazor-grid`  
**URL**: `http://localhost:8001`

Een Blazor WebAssembly implementatie met MudBlazor DataGrid. Dit is de enige .NET/C# implementatie in het benchmark project, alle andere zijn JavaScript-gebaseerd.

**Quick Start**:

```bash
# 1. Ga naar MudBlazor-grid directory
cd MudBlazor-grid

# 2. Restore NuGet packages (eerste keer)
dotnet restore

# 3. Build project
dotnet build

# 4. Run project
dotnet run
```

**Technologie**:

- ✅ Blazor WebAssembly (.NET 10)
- ✅ MudBlazor DataGrid v7.8.0
- ✅ Virtualisatie enabled
- ✅ 100.000 rijen × 500 kolommen

**Performance**:

- Verwacht 15-35 seconden load tijd (WASM overhead)
- 3-10x langzamer dan JavaScript grids (acceptabel voor .NET)
- Memory usage: 300MB-600MB

Ga naar: http://localhost:8001

Zie [MudBlazor-grid/README.md](MudBlazor-grid/README.md) voor meer details.

### Playwright Tests

**Locatie**: `/playwright`  
**Beschrijving**: Centrale Playwright test setup voor alle projecten.

**Quick Start**:

```bash
# 1. Ga naar playwright directory
cd playwright

# 2. Installeer dependencies (eerste keer)
npm install

# 3. Voer tests uit
npm test

# Of vanuit root directory:
npm test
```

Zie [playwright/README.md](playwright/README.md) voor meer details.

## 🚀 Server Starten

**⚠️ BELANGRIJK**: Start de server vanuit de **ROOT directory** (waar deze README staat), niet vanuit de subdirectories!

```bash
# Vanuit ROOT directory
npx serve -l 8000

# Of met npm script (vanuit ROOT directory)
npm run serve

# Of met Python (vanuit ROOT directory)
python -m http.server 8000

# Of met PHP (vanuit ROOT directory)
php -S localhost:8000
```

## 📋 Project Structuur

```
aceve.grid.benchmark/     # ROOT directory (start server hier!)
├── Ag-grid/              # AG Grid project
│   ├── src/             # TypeScript source
│   ├── dist/            # Gecompileerde JavaScript
│   ├── index.html       # Main HTML file
│   └── README.md        # Project documentatie
├── ag-grid-speedup/      # AG Grid Speedup (React optimized)
│   ├── src/             # React + TypeScript source
│   ├── index.html       # Entry point
│   ├── vite.config.ts   # Vite configuration
│   └── README.md        # Project documentatie
├── Wijmo-grid/           # Wijmo Grid project
│   ├── src/             # TypeScript source
│   ├── index.html       # Main HTML file
│   └── styles.css       # CSS styling
├── playwright/           # Playwright tests
│   ├── Ag-grid/         # AG Grid tests
│   ├── playwright.config.ts
│   └── README.md        # Test documentatie
├── index.html            # Home pagina met project navigatie
└── README.md             # Deze file
```

## 🔗 URLs

- **Home**: http://localhost:8000/
- **Ag-grid**: http://localhost:8000/Ag-grid/index.html
- **AG Grid Speedup**: http://localhost:3000/ (separate Vite dev server)
- **Wijmo-grid**: http://localhost:8000/Wijmo-grid/index.html

**Let op**:

- AG Grid Speedup runs on its own dev server (port 3000)
- Other grids use the static file server (port 8000)
- Gebruik `index.html` (met 'l'), niet `index.htm`!

## 📝 Toevoegen van Nieuwe Projecten

Om een nieuw project toe te voegen:

1. Maak een nieuwe directory: `mkdir NieuwProject`
2. Plaats je project bestanden in die directory
3. Compileer TypeScript: `npm run build` (vanuit root)
4. Update `index.html` met een link naar het nieuwe project
5. Update deze README.md met het nieuwe project
6. Start de server in de root directory

## 🛠️ Vereisten

- **Node.js** (voor npm scripts en dependencies)
- **TypeScript** (voor TypeScript projecten)
- **Web server** (voor het serveren van de bestanden)
- **npm** of **yarn** (voor package management)

## 🧪 Tests Uitvoeren

### Alle tests

```bash
npm test
```

### Met UI mode

```bash
npm run test:ui
```

### Met zichtbare browser (headed)

```bash
npm run test:headed
```

Zie [playwright/README.md](playwright/README.md) voor meer test opties.

## 📚 Documentatie

Elk project heeft zijn eigen README.md met specifieke instructies.

## 🔧 Troubleshooting

### 404 Not Found?

1. **Check URL**: Gebruik `index.html` (met 'l'), niet `index.htm`
2. **Server locatie**: Start server vanuit ROOT directory, niet vanuit subdirectories
3. **Check bestand**: Zorg dat de `index.html` bestanden bestaan in de project directories
4. **Check dist folder**: Zorg dat `dist/` folders bestaan (run `npm run build` vanuit root directory)
5. **Check TypeScript compilatie**: Voer `npm run build` uit vanuit root directory

### Server werkt niet?

```bash
# Vanuit ROOT directory
npx serve -l 8000

# Check of server draait op poort 8000
# Open browser: http://localhost:8000
```
