# RevoGrid Implementatie

## Overzicht

Deze implementatie toont RevoGrid met 200.000 rijen en 500 kolommen, inclusief CRUD functionaliteit.

## Features

- ✅ **200.000 Rijen**: Grote dataset voor performance testing
- ✅ **500 Kolommen**: Brede dataset met diverse datatypes
- ✅ **Row Grouping**: Grouperen op department en team
- ✅ **Virtual Scrolling**: Efficiënte rendering van grote datasets
- ✅ **CRUD Operaties**:
  - Rijen toevoegen
  - Cellen bewerken
  - Rijen verwijderen
- ✅ **Performance Metingen**: Real-time performance indicatoren
- ✅ **CDN Setup**: Geen NPM installatie nodig, direct te gebruiken

## Technologie Stack

- **RevoGrid**: Via CDN (v4.14.3)
- **TypeScript**: Voor type-veilige code
- **Fluent UI**: Voor consistente styling

## Gebruik

### Lokaal Draaien

1. Start de development server:

```bash
npm run serve
```

2. Open browser op `http://localhost:8000/RevoGrid/index.html`

### Build

Compileer TypeScript bestanden:

```bash
npm run build
```

## Kolommen

De implementatie bevat 500 kolommen:

### Vaste Kolommen

- **Actions**: Verwijder knop per rij
- **ID**: Unieke identifier
- **Naam**: Medewerker naam
- **Email**: Email adres
- **Afdeling**: Afdelingsnaam (voor grouping)
- **Team**: Teamnaam (voor grouping)
- **Rol**: Functie/rol
- **Salaris**: Salaris in euro's
- **Ervaring**: Jaren ervaring
- **Projecten**: Aantal voltooide projecten
- **Performance**: Performance score
- **Training**: Training uren
- **Start Datum**: Startdatum

### Dynamische Kolommen

- **400 Numerieke kolommen**: `num_1` tot `num_400`
- **90 Tekst kolommen**: `text_1` tot `text_90`

## Performance

De applicatie meet en toont:

- Data generatie tijd
- Grid initialisatie tijd
- CRUD operatie tijden
- Memory gebruik (indien beschikbaar)

## RevoGrid Specifieke Features

- **Web Component**: RevoGrid is een web component (`<revo-grid>`)
- **Virtual DOM**: Efficiënte rendering door virtual DOM
- **Row Grouping**: Ingebouwde ondersteuning voor row grouping met `grid.grouping = { props: ['department', 'team'] }`
- **Range Selection**: Selecteer cellen, rijen en kolommen
- **Clipboard**: Copy/paste ondersteuning
- **Themes**: Aanpasbaar met CSS custom properties

## Row Grouping Implementatie

RevoGrid ondersteunt row grouping via de `grouping` property:

```javascript
grid.grouping = {
  props: ["department", "team"],
};
```

Dit groepeert de data op basis van de `department` en `team` kolommen, waarbij je geneste groepen krijgt.

## Belangrijke Opmerkingen

### CDN Setup

Deze implementatie gebruikt de RevoGrid CDN:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@revolist/revogrid@4.14.3/dist/revo-grid/revo-grid.css"
/>
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@revolist/revogrid@4.14.3/dist/revo-grid/revo-grid.esm.js"
></script>
```

## Vergelijking met andere Grids

| Feature           | RevoGrid | AG-Grid | Tabulator | Wijmo |
| ----------------- | -------- | ------- | --------- | ----- |
| Virtual Scrolling | ✅       | ✅      | ✅        | ✅    |
| Row Grouping      | ✅       | ✅      | ✅        | ✅    |
| Cell Editing      | ✅       | ✅      | ✅        | ✅    |
| Custom Templates  | ✅       | ✅      | ✅        | ✅    |
| CDN Setup         | ✅       | ✅      | ✅        | ❌    |
| Web Component     | ✅       | ❌      | ❌        | ❌    |

## Documentatie

- [RevoGrid Documentatie](https://revolist.github.io/revogrid/)
- [RevoGrid GitHub](https://github.com/revolist/revogrid)
- [RevoGrid Examples](https://revolist.github.io/revogrid.demo.js/)

## Licentie

RevoGrid is open source onder MIT licentie.
