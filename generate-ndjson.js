// Script om data te genereren in NDJSON format (newline-delimited JSON)
// Dit is veel efficiënter voor grote datasets
const fs = require('fs');
const path = require('path');
const dataModule = require('./dist/src/data.js');

console.log('Starting NDJSON generation...');
console.log('Target: 200,000 rows with 500 columns');
console.log('Format: NDJSON (one JSON object per line)');
console.log('');

const startTime = Date.now();
const outputPath = path.join(__dirname, 'organization-data.ndjson');

const writeStream = fs.createWriteStream(outputPath, { 
  encoding: 'utf8',
  highWaterMark: 1024 * 1024 // 1MB buffer
});

let count = 0;
const targetRows = 200000;
let id = 1;

const departments = dataModule.departments;
const teams = dataModule.teams;
const roles = dataModule.roles;

console.log('Generating and writing data...');

function writeNextBatch() {
  let ok = true;
  let shouldStop = false;
  
  while (count < targetRows && ok && !shouldStop) {
    for (const dept of departments) {
      if (count >= targetRows || shouldStop) break;

      const deptTeams = teams[dept.name] || [];

      for (const team of deptTeams) {
        if (count >= targetRows || shouldStop) break;

        const teamRoles = roles[dept.name] || [];
        const employeesPerTeam = Math.floor(Math.random() * 50) + 20;

        for (let i = 0; i < employeesPerTeam && count < targetRows; i++) {
          const role = teamRoles[Math.floor(Math.random() * teamRoles.length)];
          const employee = dataModule.generateEmployee(id++, dept.name, team, role);
          
          // Write as NDJSON (one JSON object per line)
          ok = writeStream.write(JSON.stringify(employee) + '\n');
          count++;
          
          if (count % 10000 === 0) {
            console.log(`  Generated: ${count.toLocaleString()} rows...`);
          }
          
          if (!ok) {
            shouldStop = true;
            break;
          }
        }
      }
    }
  }
  
  if (count >= targetRows) {
    writeStream.end();
  } else if (!ok) {
    // Wait for drain event
    writeStream.once('drain', writeNextBatch);
  } else {
    // Continue in next tick
    setImmediate(writeNextBatch);
  }
}

writeStream.on('finish', () => {
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;

  console.log('');
  console.log('Data generation completed!');
  console.log(`Time taken: ${duration.toFixed(2)} seconds`);
  console.log(`Rows generated: ${count.toLocaleString()}`);
  console.log('');

  const fileSize = fs.statSync(outputPath).size;
  const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);

  console.log('✓ NDJSON file created successfully!');
  console.log(`  File: organization-data.ndjson`);
  console.log(`  Size: ${fileSizeMB} MB`);
  console.log('');
  console.log('To convert to JSON array, use:');
  console.log('  node convert-ndjson-to-json.js');
  console.log('');
  console.log('To read in JavaScript:');
  console.log('  const lines = fs.readFileSync("organization-data.ndjson", "utf8").split("\\n");');
  console.log('  const data = lines.filter(l => l).map(l => JSON.parse(l));');
  console.log('');
});

writeStream.on('error', (err) => {
  console.error('Error writing file:', err);
  process.exit(1);
});

// Start writing
writeNextBatch();
