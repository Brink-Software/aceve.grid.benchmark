# Canvas Grid

Een custom canvas-gebaseerde grid implementatie voor hoge performance met grote datasets.

## Features

- ✅ 200.000 rijen × 500 kolommen
- ✅ Canvas-gebaseerde rendering voor optimale performance
- ✅ Virtualisatie (alleen zichtbare cellen worden gerenderd)
- ✅ Rij selectie (klik op rij)
- ✅ Rij verwijderen (Delete toets of button)
- ✅ Cel bewerken (dubbelklik op cel)
- ✅ Kolom sommen boven de tabel
- ✅ Rij toevoegen (button)
- ✅ Smooth scrollen (muiswiel of sleep)
- ✅ Keyboard navigatie (pijltjestoetsen)

## Gebruik

### Navigatie

- **Muiswiel**: Verticaal scrollen
- **Shift + Muiswiel**: Horizontaal scrollen
- **Sleep**: Scroll door te slepen met de muis
- **Pijltjestoetsen**: Navigeer tussen rijen

### Interactie

- **Klik**: Selecteer een rij
- **Dubbelklik**: Bewerk een cel
- **Delete toets**: Verwijder geselecteerde rij
- **Rij Toevoegen button**: Voeg nieuwe rij toe
- **Rij Verwijderen button**: Verwijder geselecteerde rij

## Technische Details

### Architectuur

- **Canvas Rendering**: Direct tekenen op HTML5 Canvas voor maximale performance
- **Virtualisatie**: Alleen zichtbare cellen worden gerenderd
- **Event Handling**: Efficiënte event listeners voor interactie
- **Data Management**: In-memory data met snelle updates

### Performance Optimalisaties

- Alleen zichtbare rijen en kolommen worden gerenderd
- Efficiënte scroll handling met debouncing
- Column sums worden gecached en alleen herberekend bij data wijzigingen
- Minimale DOM manipulatie

### Bestanden

- `src/data-generator.ts`: Data generatie logic
- `src/canvas-grid.ts`: Core grid implementatie
- `src/app.ts`: Applicatie initialisatie en event handling
- `index.html`: HTML structuur
- `styles.css`: Styling
- `tsconfig.json`: TypeScript configuratie

## Build

Vanuit de root directory:

```bash
npm run build
```

Dit compileert de TypeScript files naar JavaScript in de `dist/Canvas-grid` directory.

## Performance

De canvas-gebaseerde implementatie biedt:

- Snelle rendering (< 20ms voor zichtbare cellen)
- Efficiënt geheugengebruik door virtualisatie
- Smooth scrolling ook bij 200.000 rijen
- Directe cel updates zonder volledige re-render

## Browser Compatibiliteit

- Chrome/Edge: ✅ Volledig ondersteund
- Firefox: ✅ Volledig ondersteund
- Safari: ✅ Volledig ondersteund
