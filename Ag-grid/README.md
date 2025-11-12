# AG Grid - 200.000 Rijen, 500 Kolommen met CRUD

Een krachtige AG Grid tabel met:
- ✅ **200.000+ rijen** data
- ✅ **500 kolommen** (10 default + 490 extra)
- ✅ **Row Grouping** (Afdeling → Team)
- ✅ **CRUD functionaliteit** (Toevoegen, Bewerken, Verwijderen)
- ✅ **TypeScript** voor type safety

## 📍 Locatie

Dit project bevindt zich in: `/Ag-grid`

**URL**: `http://localhost:8000/Ag-grid/index.html`

## 🚀 Quick Start

### 1. Navigeer naar de directory

```bash
cd Ag-grid
```

### 2. Installeer dependencies

```bash
npm install
```

### 3. Compileer TypeScript

```bash
npm run build
```

### 4. Start de web server (vanuit ROOT directory!)

```bash
# Ga terug naar root directory
cd ..

# Start server vanuit ROOT directory
npx serve -l 8000
```

**⚠️ BELANGRIJK**: Start de server vanuit de **ROOT directory** (test.AgGrid), niet vanuit Ag-grid!

### 5. Open in browser

Ga naar: **http://localhost:8000/Ag-grid/index.html**

## ✨ Features

### CRUD Operations

1. **➕ Nieuwe Rij Toevoegen**
   - Klik op "➕ Nieuwe Rij Toevoegen" button
   - Een nieuwe rij wordt automatisch gegenereerd en toegevoegd

2. **✏️ Waarde Wijzigen**
   - Dubbelklik op een cel om te bewerken
   - Druk op Enter om op te slaan
   - Alle kolommen zijn bewerkbaar (editable)

3. **🗑️ Rij Verwijderen**
   - **Enkele rij**: Klik op het 🗑️ icoon in de "Actions" kolom
   - **Meerdere rijen**: Selecteer rijen (checkbox) en klik op "🗑️ Verwijder Geselecteerde"

### Row Grouping

- Data is gegroepeerd per **Afdeling** en **Team**
- Gebruik "📂 Alles Uitklappen" / "📁 Alles Inklappen" buttons
- Subtotalen worden automatisch berekend per groep

### Kolommen

- **10 Default kolommen**: Actions, ID, Naam, Email, Afdeling, Team, Rol, Salaris, Ervaring, Projecten, Performance, Training, Start Datum
- **400 Numerieke kolommen**: `num_1` t/m `num_400` met verschillende ranges
- **90 Tekst kolommen**: `text_1` t/m `text_90` met sample data
- **Totaal: 500 kolommen**

## 📁 Project Structuur

```
Ag-grid/
├── src/                    # TypeScript source files
│   ├── types.ts           # Type definitions
│   ├── data.ts            # Data generatie (200.000+ rijen)
│   ├── columns.ts          # Kolom definities (500 kolommen)
│   └── app.ts             # Hoofd applicatie met CRUD
├── dist/                   # Gecompileerde JavaScript
├── index.html              # HTML template
├── styles.css              # CSS styling
├── tsconfig.json           # TypeScript configuratie
├── package.json            # Dependencies
└── README.md               # Deze file
```

## 🛠️ Scripts

- `npm run build` - Compileer TypeScript naar JavaScript
- `npm run watch` - Watch mode voor automatische compilatie
- `npm run serve` - Start lokale web server op poort 8000
- `npm run clean` - Verwijder dist folder

## 📋 Dependencies

- **ag-grid-community**: ^31.0.0
- **ag-grid-enterprise**: ^34.3.1 (voor Row Grouping)
- **typescript**: ^5.3.3

## ⚠️ Belangrijk

### AG Grid Enterprise Licentie

Dit project gebruikt **AG Grid Enterprise Edition** voor row grouping. 

- **Trial**: 30 dagen gratis trial beschikbaar
- **Licentie**: Vereist voor productie gebruik
- Meer info: https://www.ag-grid.com/license-pricing/

### Web Server Vereist

ES modules werken niet met `file://` protocol. Je **moet** een web server gebruiken:

```bash
# Vanuit ROOT directory
npx serve -l 8000
```

### Performance

Met 200.000+ rijen en 500 kolommen kan de grid traag zijn bij het eerste laden. AG Grid gebruikt virtual scrolling voor optimale performance.

## 🔧 Troubleshooting

### Geen data zichtbaar?

1. Open browser console (F12)
2. Check of module correct laadt
3. Zorg dat je een web server gebruikt (niet file://)
4. Check of `dist/` folder bestaat na `npm run build`
5. **Start server vanuit ROOT directory**, niet vanuit Ag-grid/

### CRUD werkt niet?

1. Check of `dist/app.js` bestaat
2. Check browser console voor errors
3. Zorg dat AG Grid Enterprise geladen is

### Row grouping werkt niet?

1. Check of AG Grid Enterprise geladen is in console
2. Zorg dat Enterprise script in HTML staat
3. Check licentie status (trial of licentie key)

## 📝 Development

### TypeScript Compilatie

```bash
# Eén keer compileren
npm run build

# Watch mode (automatisch bij wijzigingen)
npm run watch
```

### Code Structuur

- **src/app.ts** - Grid initialisatie, CRUD operations, event handlers
- **src/columns.ts** - Kolom definities met row grouping (500 kolommen)
- **src/data.ts** - Data generatie functies (200.000+ rijen)
- **src/types.ts** - TypeScript type definitions

## 🌐 URL Structuur

Dit project is beschikbaar op:

**http://localhost:8000/Ag-grid/index.html**

Voor meerdere projecten in dezelfde server:
- `/Ag-grid` - Dit project
- `/AnderProject` - Andere projecten kunnen hier worden toegevoegd

## 📚 Meer Informatie

- AG Grid Documentatie: https://www.ag-grid.com/
- TypeScript Documentatie: https://www.typescriptlang.org/
