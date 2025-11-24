# AG Grid Speedup - Plain JavaScript Version

This is a plain JavaScript conversion of the React-based AG Grid Speedup implementation. It provides the same optimized performance for rendering 200,000 rows × 500 columns without React overhead.

## Features

- **No React** - Pure JavaScript implementation
- **200,000 rows** - Large dataset support
- **500 columns** - Wide table support
- **No Row Grouping** - Flat structure for better performance
- **No Aggregations** - Minimal overhead
- **Simple Formatters** - Fast rendering
- **Transaction API** - Optimized CRUD operations
- **Column & Row Virtualization** - Only visible cells are rendered
- **No Animations** - Instant updates

## Performance Optimizations

1. **No grouping**: Flat data structure eliminates grouping overhead
2. **Simple formatters**: Minimal processing in cell rendering
3. **Transaction API**: Efficient add/delete operations
4. **Virtualization**: Both columns and rows are virtualized
5. **No animations**: Instant UI updates
6. **Minimal AG Grid config**: Only essential features enabled

## Files

- `index.html` - Main HTML page
- `styles.css` - Styling
- `src/app.js` - Main application logic
- `src/columns.js` - Column definitions
- `tsconfig.json` - TypeScript config (for building)

## How to Run

1. Make sure the root project is built:

   ```bash
   npm run build
   ```

2. Start the dev server:

   ```bash
   npm run serve
   ```

3. Navigate to: `http://localhost:8000/ag-grid-speedup-js`

## Comparison with Original AG Grid Implementation

| Feature         | Original          | Speedup    |
| --------------- | ----------------- | ---------- |
| Row Grouping    | ✅ Yes (2 levels) | ❌ No      |
| Aggregations    | ✅ Yes            | ❌ No      |
| Formatters      | Complex           | Simple     |
| Animations      | ✅ Yes            | ❌ No      |
| Framework       | Vanilla JS        | Vanilla JS |
| Transaction API | ❌ No             | ✅ Yes     |

## Expected Performance

- **Data Generation**: ~2-3 seconds
- **Grid Initialization**: ~1-2 seconds (vs 25-40s with grouping)
- **Add Row**: <100ms
- **Delete Row**: <100ms

## Notes

- This implementation shares the data generation utilities from `src/data.js`
- No TypeScript compilation needed (pure JavaScript)
- AG Grid Community & Enterprise loaded via CDN
- Memory efficient with virtualization
