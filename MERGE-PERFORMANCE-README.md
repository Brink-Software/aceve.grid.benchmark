# Performance Data Merge Script

This script merges all performance-data.json files from different grid implementations into a single consolidated file.

## 📁 Files Merged

The script merges data from:

- `playwright/Ag-grid/performance-results/performance-data.json`
- `playwright/Wijmo-grid/performance-results/performance-data.json`
- `playwright/RevoGrid/performance-results/performance-data.json`
- `playwright/Tabulator-grid/performance-results/performance-data.json`

## 🚀 Usage

### Run the merge script:

```bash
npm run merge-performance
```

Or directly:

```bash
node merge-performance-data.js
```

## 📊 Output

The script creates `performance-data-merged.json` in the root directory containing:

- All performance records from all grids
- Each record enriched with `grid` and `gridKey` fields
- Records sorted by timestamp (newest first)
- Summary statistics by grid and operation type

### Example Output Structure:

```json
[
  {
    "operation": "Rij Toevoegen",
    "time": "3984.30 ms",
    "timeMs": 3984.3,
    "timestamp": "2025-11-18T15:00:21.504Z",
    "testFile": "ag-grid.spec.ts",
    "grid": "AG Grid",
    "gridKey": "ag-grid"
  },
  ...
]
```

## 📈 Console Output

The script provides detailed information:

- ✅ Records loaded per grid
- 📊 Total records and files merged
- 📈 Summary breakdown by grid type and operation

## 🔧 Customization

To add or modify grid sources, edit the `performanceFiles` array in `merge-performance-data.js`:

```javascript
const performanceFiles = [
  {
    path: "./path/to/performance-data.json",
    gridName: "My Grid",
    gridKey: "my-grid",
  },
];
```

## 💡 Use Cases

- Compare performance across all grid implementations
- Generate comprehensive reports
- Import into analysis tools
- Upload to the results page (`/results/index.html`)
- Archive performance data
