# Playwright Tests

Centrale Playwright test setup voor alle projecten.

## Structuur

```
playwright/
├── playwright.config.ts    # Centrale configuratie
├── package.json              # Dependencies en scripts
├── Ag-grid/                  # AG Grid tests
│   └── example.spec.ts
└── [andere projecten]/       # Toekomstige project tests
```

## Installatie

```bash
cd playwright
npm install
```

## Tests Uitvoeren

### Alle tests
```bash
npm test
```

### AG Grid tests specifiek
```bash
npm run test:ag-grid
```

### Met UI mode
```bash
npm run test:ui
# of voor AG Grid specifiek:
npm run test:ag-grid:ui
```

### Met zichtbare browser (headed)
```bash
npm run test:headed
# of voor AG Grid specifiek:
npm run test:ag-grid:headed
```

## Vanuit Ag-grid project

Je kunt ook tests uitvoeren vanuit het Ag-grid project:

```bash
cd Ag-grid
npm test
```

## Configuratie

De centrale configuratie staat in `playwright.config.ts`:
- Test directory: `./Ag-grid` (kan uitgebreid worden voor meer projecten)
- Base URL: `http://localhost:8000`
- Web server start automatisch vanuit root directory

## Nieuwe Project Toevoegen

1. Maak een nieuwe directory: `playwright/NieuwProject/`
2. Voeg test files toe: `playwright/NieuwProject/*.spec.ts`
3. Update `playwright.config.ts` om meerdere test directories te ondersteunen (of gebruik projects)

