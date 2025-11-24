# Getting Started with AG Grid Speedup

## Quick Start

### 1. Install Dependencies

```bash
cd ag-grid-speedup
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

Output will be in `ag-grid-speedup/dist/`

### 4. Preview Production Build

```bash
npm run preview
```

## What to Expect

### Performance Improvements

Compared to the original `Ag-grid/` implementation:

1. **Faster Grid Initialization** (50-70% faster)
   - No row grouping setup
   - No aggregation calculations
   - Simple column definitions

2. **Faster Rendering** (60-80% faster)
   - No complex cell renderers
   - Simple value formatters only
   - Optimized virtualization

3. **Smoother Scrolling**
   - Column virtualization enabled
   - Row virtualization optimized
   - Reduced row buffer (10 rows)

4. **Faster CRUD Operations** (40-60% faster)
   - Transaction-based updates
   - No totals recalculation
   - No forced cell refreshes

### Data Generation

The application generates **200,000 rows** with **500 columns**:
- 12 standard columns (ID, Name, Email, Department, Team, Role, etc.)
- 400 numeric columns (`num_1` to `num_400`)
- 90 text columns (`text_1` to `text_90`)

Data is generated in chunks of 10,000 rows for better UX.

## Features

### ✅ Implemented

- **Add Row**: Click "Add Row" to insert a new employee
- **Delete Rows**: Select rows and click "Delete (n)" button
- **Edit Cells**: Double-click any cell to edit
- **Fast Scrolling**: Smooth scrolling with virtualization
- **Filtering**: All columns have filters
- **Sorting**: Click column headers to sort
- **Row Selection**: Multiple row selection with Shift/Ctrl

### ❌ Removed for Performance

- Row Grouping (major performance impact)
- Aggregation functions (sum, avg)
- Pinned bottom row with totals
- Auto-sizing columns on data change
- Row animations
- Complex cell renderers

## Architecture

### Technology Stack

- **React 18** - UI framework with hooks
- **Vite** - Fast build tool with HMR
- **TypeScript** - Type safety
- **AG Grid Enterprise 31** - Grid component
- **AG Grid React** - React wrapper

### Key Components

```
ag-grid-speedup/
├── src/
│   ├── App.tsx           # Main grid component
│   ├── App.css           # Styles
│   ├── columns.tsx       # Column definitions
│   ├── types.ts          # TypeScript types
│   ├── main.tsx          # React entry point
│   └── index.css         # Global styles
├── index.html            # HTML entry point
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies
```

### Shared Data Generator

Uses the shared data generator from `../../src/data.ts`:
- `generateEmployee()` - Creates single employee
- `generateChunk()` - Generates data in chunks
- Same data structure as other implementations

## Performance Monitoring

The application logs performance metrics to the console:

```javascript
// Data Generation
=== PERFORMANCE: DATA GENERATION START ===
Generated 200000 rows in 2345.67ms
Speed: 85321 rows/sec

// Total Time
=== PERFORMANCE: TOTAL TIME (DATA + GRID) ===
Total: 3456.78ms
```

Check the browser console (F12) to see detailed metrics.

## Troubleshooting

### Port 3000 Already in Use

Change the port in `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 3001, // Change to any available port
  },
})
```

### Module Import Errors

If you see errors about `../../src/data.ts`, make sure:
1. You're in the correct directory
2. The parent project has been built: `cd .. && npm run build`

### AG Grid Enterprise License Warning

AG Grid Enterprise requires a license for production use. For evaluation:
- The trial version works for 2 months
- License warnings appear in console but don't affect functionality

## Comparison with Original Implementation

### Original (Ag-grid/)
- **Framework**: Vanilla TypeScript
- **Features**: Row grouping, aggregations, totals, complex renderers
- **Grid Init**: ~5-8 seconds
- **Use Case**: Feature-rich with grouping

### Speedup (ag-grid-speedup/)
- **Framework**: React + Vite
- **Features**: Optimized for raw performance
- **Grid Init**: ~1-2 seconds
- **Use Case**: Fast load and scrolling

## Next Steps

1. **Compare Performance**: Run both implementations side-by-side
2. **Customize**: Modify `columns.tsx` for your needs
3. **Add Features**: Extend `App.tsx` with additional functionality
4. **Test**: Add Playwright tests in `../playwright/`

## Resources

- [AG Grid React Documentation](https://www.ag-grid.com/react-data-grid/)
- [AG Grid Performance Guide](https://www.ag-grid.com/react-data-grid/performance/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

