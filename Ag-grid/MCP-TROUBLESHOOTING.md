# MCP Server Troubleshooting Guide

## ✅ Probleem Opgelost

Je MCP configuratie is bijgewerkt naar het juiste package:
- **Oud**: `@playwright/mcp@latest` (had module errors)
- **Nieuw**: `@executeautomation/playwright-mcp-server` (werkend)

## 🔧 Configuratie

Je MCP configuratie staat in `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
    }
  }
}
```

## 🚀 Acties Na Update

1. **Herstart Cursor volledig**
   - Sluit Cursor volledig af
   - Start Cursor opnieuw op
   - Dit laadt de nieuwe MCP configuratie

2. **Verifieer MCP Server Status**
   - Open Cursor Settings (`Ctrl+,`)
   - Zoek naar "MCP" of "Model Context Protocol"
   - Controleer of "playwright" server zichtbaar is

3. **Test de MCP Server**
   - Vraag in Cursor: "Can you use Playwright to navigate to my AG Grid page?"
   - Of: "Take a screenshot of http://localhost:8000/Ag-grid/index.html"

## 🔍 Debugging

### Check Cursor Logs

1. Open Developer Tools: `Help → Toggle Developer Tools`
2. Ga naar de "Console" tab
3. Zoek naar MCP-gerelateerde errors

### Test MCP Server Handmatig

```bash
# Test of de MCP server werkt
npx -y @executeautomation/playwright-mcp-server
```

Als je "Shutdown signal received" ziet, werkt de server correct.

### Veelvoorkomende Problemen

#### 1. MCP Server start niet
- **Oplossing**: Herstart Cursor volledig
- **Check**: Zorg dat Node.js geïnstalleerd is (`node --version`)

#### 2. "Cannot find module" error
- **Oplossing**: 
  ```bash
  npm cache clean --force
  npx -y @executeautomation/playwright-mcp-server
  ```

#### 3. MCP Server niet zichtbaar in Cursor
- **Check**: Bestand `.cursor/mcp.json` bestaat en is correct geformatteerd
- **Check**: JSON syntax is correct (geen trailing commas)
- **Oplossing**: Herstart Cursor

#### 4. Playwright browsers niet geïnstalleerd
- **Oplossing**:
  ```bash
  cd Ag-grid
  npx playwright install
  ```

## 📝 Alternatieve Configuratie

Als de bovenstaande configuratie niet werkt, probeer deze alternatieven:

### Optie 1: Globale Installatie
```bash
npm install -g @executeautomation/playwright-mcp-server
```

Dan in `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "playwright-mcp-server"
    }
  }
}
```

### Optie 2: Met Environment Variables
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"],
      "env": {
        "PLAYWRIGHT_BROWSERS_PATH": "0"
      }
    }
  }
}
```

## 🆘 Nog Steeds Problemen?

1. **Check Node.js versie**: `node --version` (moet >= 18 zijn)
2. **Check npm versie**: `npm --version`
3. **Update Cursor**: Zorg dat je de nieuwste versie van Cursor gebruikt
4. **Check GitHub Issues**: 
   - [Playwright MCP Server Issues](https://github.com/executeautomation/mcp-playwright/issues)
   - [Cursor MCP Issues](https://github.com/getcursor/cursor/issues)

## ✅ Verificatie

Na herstart van Cursor, test of MCP werkt:

1. Open een nieuw chat in Cursor
2. Vraag: "Can you use Playwright to take a screenshot of http://localhost:8000/Ag-grid/index.html?"
3. Als het werkt, zou Cursor de browser moeten kunnen controleren

## 📚 Meer Informatie

- [Playwright MCP Server GitHub](https://github.com/executeautomation/mcp-playwright)
- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [Cursor MCP Documentation](https://docs.cursor.com)

