# Test AG Grid Projecten

Welkom bij de AG Grid test projecten collectie.

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

**Belangrijk**: Start de server vanuit de **ROOT directory** (test.AgGrid), niet vanuit Ag-grid!

Ga naar: http://localhost:8000/Ag-grid/index.html

Zie [Ag-grid/README.md](Ag-grid/README.md) voor meer details.

## 🚀 Server Starten

**⚠️ BELANGRIJK**: Start de server vanuit de **ROOT directory** (waar deze README staat), niet vanuit Ag-grid!

```bash
# Vanuit ROOT directory (test.AgGrid)
npx serve -l 8000

# Of met Python (vanuit ROOT directory)
python -m http.server 8000

# Of met PHP (vanuit ROOT directory)
php -S localhost:8000
```

## 📋 Project Structuur

```
test.AgGrid/              # ROOT directory (start server hier!)
├── Ag-grid/              # AG Grid organisatie project
│   ├── src/             # TypeScript source
│   ├── dist/            # Gecompileerde JavaScript
│   ├── index.html       # Main HTML file
│   └── README.md        # Project documentatie
└── README.md            # Deze file
```

## 🔗 URLs

- **Ag-grid**: http://localhost:8000/Ag-grid/index.html

**Let op**: Gebruik `index.html` (met 'l'), niet `index.htm`!

## 📝 Toevoegen van Nieuwe Projecten

Om een nieuw project toe te voegen:

1. Maak een nieuwe directory: `mkdir NieuwProject`
2. Plaats je project bestanden in die directory
3. Update deze README.md met het nieuwe project
4. Start de server in de root directory

## 🛠️ Vereisten

- Node.js (voor npm scripts)
- TypeScript (voor TypeScript projecten)
- Web server (voor het serveren van de bestanden)

## 📚 Documentatie

Elk project heeft zijn eigen README.md met specifieke instructies.

## 🔧 Troubleshooting

### 404 Not Found?

1. **Check URL**: Gebruik `index.html` (met 'l'), niet `index.htm`
2. **Server locatie**: Start server vanuit ROOT directory, niet vanuit Ag-grid/
3. **Check bestand**: Zorg dat `Ag-grid/index.html` bestaat
4. **Check dist folder**: Zorg dat `Ag-grid/dist/app.js` bestaat (run `npm run build` in Ag-grid/)

### Server werkt niet?

```bash
# Vanuit ROOT directory
npx serve -l 8000

# Check of server draait op poort 8000
# Open browser: http://localhost:8000
```
