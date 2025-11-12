# Playwright MCP Setup

Deze gids legt uit hoe je Playwright MCP (Model Context Protocol) configureert in Cursor.

## 📦 Installatie

1. **Installeer Playwright dependencies:**

   ```bash
   cd Ag-grid
   npm install
   npx playwright install
   ```

2. **Installeer Playwright browsers:**
   ```bash
   npx playwright install chromium firefox webkit
   ```

## 🔧 Cursor MCP Configuratie

Om Playwright MCP te gebruiken in Cursor, moet je de MCP server configureren in Cursor's instellingen:

### Stap 1: Open Cursor Settings

- Druk op `Ctrl+,` (of `Cmd+,` op Mac)
- Zoek naar "MCP" of "Model Context Protocol"

### Stap 2: Voeg Playwright MCP Server toe

Voeg de volgende configuratie toe aan je MCP settings:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp-server"],
      "env": {
        "PLAYWRIGHT_BROWSERS_PATH": "0"
      }
    }
  }
}
```

**Alternatief**: Als je de Playwright MCP server globaal hebt geïnstalleerd:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "playwright-mcp",
      "args": []
    }
  }
}
```

### Stap 3: Herstart Cursor

Na het toevoegen van de configuratie, herstart Cursor om de MCP server te activeren.

## 🧪 Playwright Tests Uitvoeren

### Test Commando's

```bash
# Alle tests uitvoeren
npm run test

# Tests met UI mode (interactief)
npm run test:ui

# Tests in headed mode (browser zichtbaar)
npm run test:headed

# Specifieke test uitvoeren
npx playwright test tests/example.spec.ts

# Tests in debug mode
npx playwright test --debug
```

### Test Structuur

Tests staan in de `tests/` directory:

- `example.spec.ts` - Basis AG Grid tests

## 📝 Playwright MCP Gebruik in Cursor

Zodra Playwright MCP is geconfigureerd, kun je in Cursor:

1. **Browser automatisering vragen**: "Kun je de AG Grid pagina testen met Playwright?"
2. **Screenshots maken**: "Maak een screenshot van de grid"
3. **Interacties automatiseren**: "Klik op de eerste rij en test de CRUD functionaliteit"

## 🔍 Handige Playwright Commands

```bash
# Test report bekijken
npx playwright show-report

# Code genereren van gebruikersacties
npx playwright codegen http://localhost:8000/Ag-grid/index.html

# Trace viewer (na test failure)
npx playwright show-trace trace.zip
```

## 📚 Meer Informatie

- [Playwright Documentatie](https://playwright.dev)
- [MCP Documentatie](https://modelcontextprotocol.io)
- [Playwright MCP Server](https://github.com/playwright-community/playwright-mcp)

## ⚠️ Troubleshooting

### MCP Server start niet

- Controleer of `@playwright/mcp-server` geïnstalleerd is: `npm list -g @playwright/mcp-server`
- Check Cursor logs voor foutmeldingen

### Tests falen

- Zorg dat de server draait: `npm run serve`
- Check of de URL correct is in `playwright.config.ts`
- Voer `npx playwright install` uit om browsers te installeren

### Browser niet gevonden

```bash
# Installeer browsers opnieuw
npx playwright install --force
```
