const fs = require('fs');
const path = require('path');

// Configuration
const performanceFiles = [
  {
    path: './playwright/Ag-grid/performance-results/performance-data.json',
    gridName: 'AG Grid',
    gridKey: 'ag-grid'
  },
  {
    path: './playwright/Wijmo-grid/performance-results/performance-data.json',
    gridName: 'Wijmo Grid',
    gridKey: 'wijmo'
  },
  {
    path: './playwright/RevoGrid/performance-results/performance-data.json',
    gridName: 'RevoGrid',
    gridKey: 'revogrid'
  },
  {
    path: './playwright/Tabulator-grid/performance-results/performance-data.json',
    gridName: 'Tabulator Grid',
    gridKey: 'tabulator'
  }
];

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
        gridKey: config.gridKey
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
    console.log(`\n📈 Summary by Grid:`);

    // Print summary
    const summary = {};
    allData.forEach(record => {
      if (!summary[record.grid]) {
        summary[record.grid] = { count: 0, operations: {} };
      }
      summary[record.grid].count++;
      
      if (!summary[record.grid].operations[record.operation]) {
        summary[record.grid].operations[record.operation] = 0;
      }
      summary[record.grid].operations[record.operation]++;
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
