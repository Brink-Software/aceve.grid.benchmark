# Grid Benchmark Project - Project Samenvatting voor Copilot

## 📋 Project Overzicht

Dit is een **Grid Benchmark** project dat de prestaties vergelijkt van verschillende JavaScript grid componenten (AG Grid en Wijmo Grid) met grote datasets. Het project bevat 200.000+ rijen data en 500 kolommen om de performance te testen.

**Project Type**: Performance Benchmark / Comparison Tool  
**Doel**: Vergelijken van AG Grid vs Wijmo Grid met grote datasets  
**Taal**: TypeScript, JavaScript, HTML, CSS  
**Build Tool**: TypeScript Compiler (tsc)

---

## 🏗️ Project Structuur

```
aceve.grid.benchmark/          # ROOT directory
├── Ag-grid/                   # AG Grid implementatie
│   ├── src/
│   │   ├── ag-grid-app.ts    # Hoofd applicatie logica
│   │   ├── columns.ts         # Kolom definities (500 kolommen)
│   │   └── types.ts          # TypeScript type definities
│   ├── index.html            # HTML entry point
│   ├── styles.css            # Styling
│   └── package.json          # AG Grid specifieke dependencies
│
├── Wijmo-grid/               # Wijmo Grid implementatie
│   ├── src/
│   │   ├── wijmo-grid-app.ts # Hoofd applicatie logica
│   │   ├── columns.ts        # Kolom definities
│   │   ├── types.ts         # TypeScript types
│   │   └── wijmo.d.ts       # Wijmo type definities (custom)
│   ├── index.html           # HTML entry point
│   └── styles.css           # Styling
│
├── src/                      # Gedeelde data generatie
│   └── data.ts              # Genereert 200.000+ rijen test data
│
├── playwright/               # E2E tests
│   ├── Ag-grid/
│   │   └── ag-grid.spec.ts  # AG Grid tests
│   └── playwright.config.ts # Test configuratie
│
├── dist/                    # Gecompileerde JavaScript (output)
├── index.html               # Home pagina met navigatie
├── package.json            # Root dependencies
├── tsconfig.json           # TypeScript configuratie
└── README.md              # Project documentatie
```

---

## 🛠️ Technologie Stack

### Core Dependencies
- **TypeScript**: ^5.3.3 (strict mode enabled)
- **AG Grid Community**: ^31.0.0
- **AG Grid Enterprise**: ^34.3.1 (voor row grouping)
- **Wijmo All**: ^5.20252.42 (@grapecity/wijmo.all)
- **Playwright**: ^1.40.0 (voor E2E testing)

### Build & Development
- **TypeScript Compiler**: Compileert naar ES2020 modules
- **Module System**: ES2020 modules (ESM)
- **Output Directory**: `./dist`
- **Source Maps**: Enabled voor debugging

### CDN Dependencies (Wijmo)
- Wijmo wordt geladen via CDN: `cdn.mescius.com/wijmo/5.latest/`
- Fallback naar unpkg/jsDelivr als alternatief

---

## 📊 Data Structuur

### Dataset Specificaties
- **Aantal rijen**: 200.000+
- **Aantal kolommen**: 500 totaal
  - 10 default kolommen (Actions, ID, Naam, Email, Afdeling, Team, Rol, Salaris, Ervaring, Projecten, Performance, Training, Start Datum)
  - 490 numerieke kolommen (`num_1` t/m `num_490`)
  - 90 tekst kolommen (`text_1` t/m `text_90`)

### Data Generatie
- **Locatie**: `src/data.ts`
- **Functies**: 
  - `generateEmployee()` - Genereert één employee record
  - `generateChunk()` - Genereert een chunk van employees
  - `generateChunkedData()` - Genereert alle data in chunks
- **Organisatie structuur**: 
  - Afdelingen (departments)
  - Teams (nested onder afdelingen)
  - Rollen (roles)

---

## 🎯 Belangrijke Features

### CRUD Functionaliteit
- ✅ **Toevoegen**: Nieuwe rijen toevoegen via button
- ✅ **Bewerken**: Dubbelklik op cel om te bewerken
- ✅ **Verwijderen**: 
  - Enkele rij via delete button in Actions kolom
  - Meerdere rijen via selectie + "Verwijder Geselecteerde" button

### Row Grouping
- ✅ Groepering op **Afdeling** (Department)
- ✅ Sub-groepering op **Team**
- ✅ Expand/Collapse alle groepen
- ✅ Automatische subtotalen per groep

### Performance Monitoring
- ✅ Performance metingen voor alle operaties
- ✅ Memory usage tracking
- ✅ Console logging van performance metrics
- ✅ Visual performance indicators

---

## 🔧 Build Process

### TypeScript Compilatie
```bash
npm run build        # Compileer alle TypeScript naar JavaScript
npm run watch        # Watch mode voor development
npm run dev          # Alias voor watch mode
```

### TypeScript Configuratie
- **Target**: ES2020
- **Module**: ES2020 (ESM)
- **Strict Mode**: Enabled (alle strict checks aan)
- **Output**: `./dist` directory
- **Source Maps**: Enabled
- **Includes**: 
  - `Ag-grid/src/**/*`
  - `Wijmo-grid/src/**/*`
  - `src/**/*`

### Server Starten
```bash
npm run serve        # Start server op poort 8000
# OF
npx serve -l 8000    # Vanuit ROOT directory
```

**⚠️ BELANGRIJK**: Server MOET vanuit ROOT directory gestart worden, niet vanuit subdirectories!

---

## 🧪 Testing

### Playwright Tests
- **Locatie**: `playwright/`
- **Config**: `playwright.config.ts`
- **Tests**: `playwright/Ag-grid/ag-grid.spec.ts`

### Test Commando's
```bash
npm test              # Voer alle tests uit
npm run test:ui       # UI mode
npm run test:headed   # Met zichtbare browser
```

---

## 🌐 URLs & Entry Points

- **Home**: `http://localhost:8000/`
- **AG Grid**: `http://localhost:8000/Ag-grid/index.html`
- **Wijmo Grid**: `http://localhost:8000/Wijmo-grid/index.html`

---

## 🔍 Belangrijke Code Patterns

### Wijmo Initialisatie (Speciale Aanpak)
Wijmo wordt geladen via CDN en heeft speciale handling nodig:

```typescript
// Wijmo wordt geladen via CDN, dus we moeten dynamisch zoeken naar constructors
const wijmo = (window as any).wijmo;

// CollectionView kan op verschillende locaties zitten
let CollectionViewClass = wijmo.CollectionView || 
                         wijmo.collections?.CollectionView || 
                         wijmo.core?.CollectionView;

// GroupDescription ook dynamisch zoeken
const GroupDescriptionClass = getGroupDescriptionClass(wijmo);
```

### Helper Functies
- `getGroupDescriptionClass(wijmo)`: Zoekt GroupDescription constructor op verschillende locaties

### Data Generatie Pattern
- Chunked generation voor grote datasets
- Progress callbacks voor UI updates
- Memory efficient (niet alles in één keer in memory)

---

## ⚠️ Bekende Issues & Oplossingen

### Wijmo CDN Issues
- **Probleem**: GrapeCity CDN geeft 403 errors
- **Oplossing**: Gebruik `cdn.mescius.com/wijmo/5.latest/` als primaire CDN
- **Fallback**: unpkg/jsDelivr als alternatief

### Wijmo Constructor Issues
- **Probleem**: `wijmo.CollectionView` en `wijmo.grid.GroupDescription` zijn niet altijd constructors
- **Oplossing**: Dynamische lookup functies die meerdere locaties proberen
- **Locaties geprobeerd**:
  - `wijmo.CollectionView`
  - `wijmo.collections.CollectionView`
  - `wijmo.core.CollectionView`
  - `wijmo.grid.GroupDescription`
  - `wijmo.grid.collections.GroupDescription`
  - `wijmo.collections.GroupDescription`

### TypeScript Strict Mode
- Alle strict checks zijn enabled
- `noUnusedLocals`: true
- `noUnusedParameters`: true
- Ongebruikte code wordt automatisch verwijderd tijdens build

---

## 📝 Code Conventies

### TypeScript
- Strict mode enabled
- ES2020 modules (import/export)
- Type definitions voor alle belangrijke objecten
- Custom type definitions voor Wijmo (`wijmo.d.ts`)

### Naming Conventies
- Functies: camelCase (`addNewRow`, `expandAllGroups`)
- Types/Interfaces: PascalCase (`Employee`, `TotalsRow`)
- Bestanden: kebab-case of camelCase (`ag-grid-app.ts`, `wijmo-grid-app.ts`)

### Error Handling
- Try-catch blocks rond kritieke operaties
- Console logging voor debugging
- User-friendly error messages

---

## 🚀 Development Workflow

1. **Wijzigingen maken** in TypeScript bestanden (`src/` directories)
2. **Build uitvoeren**: `npm run build`
3. **Server starten**: `npm run serve` (vanuit root)
4. **Testen** in browser: `http://localhost:8000/[project]/index.html`
5. **Tests uitvoeren**: `npm test`

---

## 📦 Dependencies Overzicht

### Root Dependencies
- `ag-grid-community`: ^31.0.0
- `ag-grid-enterprise`: ^34.3.1
- `@grapecity/wijmo.all`: ^5.20252.42

### Dev Dependencies
- `typescript`: ^5.3.3
- `@playwright/test`: ^1.40.0
- `@types/node`: ^20.10.0

---

## 🔗 Belangrijke Bestanden

### Configuratie Bestanden
- `tsconfig.json`: TypeScript compiler configuratie
- `package.json`: Dependencies en scripts
- `playwright.config.ts`: Playwright test configuratie

### Entry Points
- `index.html`: Home pagina met project navigatie
- `Ag-grid/index.html`: AG Grid applicatie
- `Wijmo-grid/index.html`: Wijmo Grid applicatie

### Core Source Files
- `src/data.ts`: Data generatie logica
- `Ag-grid/src/ag-grid-app.ts`: AG Grid applicatie logica
- `Wijmo-grid/src/wijmo-grid-app.ts`: Wijmo Grid applicatie logica
- `Wijmo-grid/src/wijmo.d.ts`: Wijmo type definities

---

## 💡 Tips voor Copilot

1. **Bij wijzigingen aan Wijmo code**: Check altijd of constructors beschikbaar zijn via de helper functies
2. **Bij data generatie wijzigingen**: Test met kleinere datasets eerst (pas `generateChunkedData` aan)
3. **Bij nieuwe features**: Zorg dat beide grids (AG Grid en Wijmo) dezelfde functionaliteit hebben voor eerlijke vergelijking
4. **Bij build errors**: Check altijd of TypeScript strict mode errors zijn (unused variables, etc.)
5. **Bij CDN issues**: Probeer eerst `cdn.mescius.com`, dan unpkg/jsDelivr als fallback

---

## 🎓 Project Doel

Dit project is gemaakt om:
- Performance te vergelijken tussen AG Grid en Wijmo Grid
- Te testen met realistische grote datasets (200.000+ rijen)
- CRUD functionaliteit te demonstreren op grote datasets
- Row grouping performance te meten
- Best practices te demonstreren voor beide grid libraries

---

**Laatste Update**: Project gebruikt TypeScript strict mode, ES2020 modules, en ondersteunt zowel AG Grid als Wijmo Grid met identieke functionaliteit voor eerlijke performance vergelijking.


