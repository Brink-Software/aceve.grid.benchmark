const fs = require('fs');
const path = require('path');

// Configuration
const datasetSizes = [
  { size: '200000', fileName: 'performance-data.json', label: '200K Rijen' },
  { size: '10000', fileName: 'performance-data-10000Rijen.json', label: '10K Rijen' },
  { size: '3000', fileName: 'performance-data-3000Rijen.json', label: '3K Rijen' }
];

const gridConfigs = [
  { gridName: 'AG Grid', gridKey: 'ag-grid', folder: 'Ag-grid' },
  { gridName: 'Wijmo Grid', gridKey: 'wijmo', folder: 'Wijmo-grid' },
  { gridName: 'RevoGrid', gridKey: 'revogrid', folder: 'RevoGrid' },
  { gridName: 'Tabulator Grid', gridKey: 'tabulator', folder: 'Tabulator-grid' },
  { gridName: 'MudBlazor DataGrid', gridKey: 'mudblazor-grid', folder: 'MudBlazor-grid' }
];

// Generate performance files for all combinations
const performanceFiles = [];
gridConfigs.forEach(grid => {
  datasetSizes.forEach(dataset => {
    performanceFiles.push({
      path: `./playwright/${grid.folder}/performance-results/${dataset.fileName}`,
      gridName: grid.gridName,
      gridKey: grid.gridKey,
      datasetSize: dataset.size,
      datasetLabel: dataset.label
    });
  });
});

const outputFile = './performance-data-merged.json';

// Main function
function mergePerformanceData() {
  console.log('🔄 Starting merge of performance data files...\n');
  
  let allData = [];
  let totalFiles = 0;
  let totalRecords = 0;

  performanceFiles.forEach(config => {
    const filePath = path.resolve(__dirname, config.path);
    
    try {
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  File not found: ${config.path}`);
        return;
      }

      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);

      if (!Array.isArray(data)) {
        console.warn(`⚠️  File ${config.path} does not contain an array`);
        return;
      }

      // Add grid information to each record
      const enrichedData = data.map(record => ({
        ...record,
        grid: config.gridName,
        gridKey: config.gridKey,
        datasetSize: config.datasetSize,
        datasetLabel: config.datasetLabel
      }));

      allData.push(...enrichedData);
      totalFiles++;
      totalRecords += enrichedData.length;

      console.log(`✅ Loaded ${enrichedData.length} records from ${config.gridName}`);

    } catch (error) {
      console.error(`❌ Error reading ${config.path}:`, error.message);
    }
  });

  // Sort by timestamp (newest first)
  allData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Write merged data to output file
  const outputPath = path.resolve(__dirname, outputFile);
  try {
    fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2), 'utf8');
    console.log(`\n📊 Successfully merged ${totalRecords} records from ${totalFiles} files`);
    console.log(`📁 Output file: ${outputFile}`);
    console.log(`\n📈 Summary by Grid and Dataset Size:`);

    // Print summary
    const summary = {};
    allData.forEach(record => {
      const key = `${record.grid} (${record.datasetLabel})`;
      if (!summary[key]) {
        summary[key] = { count: 0, operations: {} };
      }
      summary[key].count++;
      
      if (!summary[key].operations[record.operation]) {
        summary[key].operations[record.operation] = 0;
      }
      summary[key].operations[record.operation]++;
    });

    Object.entries(summary).forEach(([grid, stats]) => {
      console.log(`\n  ${grid}: ${stats.count} total records`);
      Object.entries(stats.operations).forEach(([op, count]) => {
        console.log(`    - ${op}: ${count}`);
      });
    });

    console.log('\n✨ Merge completed successfully!');

  } catch (error) {
    console.error(`❌ Error writing output file:`, error.message);
    process.exit(1);
  }
}

// Run the merge
if (require.main === module) {
  mergePerformanceData();
}

module.exports = { mergePerformanceData };
