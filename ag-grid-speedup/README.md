# AG Grid Speedup - Optimized Performance

High-performance AG Grid React implementation optimized for 200,000 rows and 500 columns.

## 🚀 Performance Optimizations

This implementation addresses the performance bottlenecks found in the original `Ag-grid/` implementation:

### Removed Features (for Performance)
- ❌ Row Grouping (major performance impact with 200k rows)
- ❌ Aggregation functions (sum, avg on columns)
- ❌ Pinned bottom row with totals
- ❌ Complex cell renderers
- ❌ Auto-sizing columns (expensive with large datasets)
- ❌ Row animations

### Optimizations Applied
- ✅ Column virtualization enabled
- ✅ Row virtualization enabled (default)
- ✅ Simple value formatters (lighter than cell renderers)
- ✅ Transaction-based updates for CRUD operations
- ✅ React useMemo/useCallback for column definitions
- ✅ Minimal column configuration
- ✅ Reduced row buffer (10 rows)
- ✅ No forced cell refreshes

## 🛠️ Setup

### Install Dependencies

```bash
cd ag-grid-speedup
npm install
```

### Development

```bash
npm run dev
```

This starts the Vite dev server on `http://localhost:3000`

### Build

```bash
npm run build
```

Builds to `ag-grid-speedup/dist/`

### Preview Production Build

```bash
npm run preview
```

## 📊 Features

- **200,000 rows** with **500 columns**
- **Add rows** - Click "Add Row" to insert a new row
- **Delete rows** - Select rows and click "Delete"
- **Edit cells** - Double-click any cell to edit
- **Fast scrolling** - Optimized virtualization for smooth scrolling
- **Fast filtering** - AG Grid filters on all columns
- **Fast sorting** - Click column headers to sort

## 🔬 Performance Comparison

Compare this implementation with the original `Ag-grid/` to see the performance improvements:

### Original Implementation
- **Location**: `/Ag-grid/index.html`
- **Framework**: Vanilla TypeScript
- **Features**: Row grouping, aggregations, totals, complex renderers

### Speedup Implementation
- **Location**: `/ag-grid-speedup/` (this folder)
- **Framework**: React + Vite
- **Features**: Optimized for raw performance

### Expected Improvements
- **Grid Initialization**: 50-70% faster
- **Rendering**: 60-80% faster
- **Scrolling**: Smoother, lower frame drops
- **CRUD Operations**: 40-60% faster

## 📝 Technical Details

### Stack
- **React 18** - UI framework
- **Vite** - Build tool (fast HMR)
- **TypeScript** - Type safety
- **AG Grid Enterprise 31** - Grid component
- **Shared data generator** - Uses `../../src/data.ts`

### Grid Configuration

```typescript
{
  animateRows: false,
  suppressColumnVirtualisation: false,
  suppressRowVirtualisation: false,
  rowBuffer: 10,
  debounceVerticalScrollbar: false,
  rowSelection: 'multiple',
  // No grouping, no aggregations
}
```

### Column Configuration

```typescript
{
  sortable: true,
  filter: true,
  resizable: true,
  editable: true,
  // Simple valueFormatter, no cellRenderer
}
```

## 🎯 Use Cases

This implementation is ideal for:
- Large datasets requiring fast initial load
- Applications where scrolling performance is critical
- Scenarios where row grouping is not needed
- High-frequency data updates
- Performance-critical dashboards

## 🔗 Links

- [AG Grid React Documentation](https://www.ag-grid.com/react-data-grid/)
- [AG Grid Performance Guide](https://www.ag-grid.com/react-data-grid/performance/)
- [Vite Documentation](https://vitejs.dev/)

