// Script om JSON data te genereren met streaming (compact format)
const fs = require('fs');
const path = require('path');

// Import de data module
const dataModule = require('./dist/src/data.js');

console.log('Starting JSON generation with streaming...');
console.log('Target: 200,000 rows with 500 columns');
console.log('');

const startTime = Date.now();
const outputPath = path.join(__dirname, 'organization-data.json');

// Create write stream
const writeStream = fs.createWriteStream(outputPath, { encoding: 'utf8' });

writeStream.write('[');

let count = 0;
const targetRows = 10000;
let id = 1;

const departments = dataModule.departments;
const teams = dataModule.teams;
const roles = dataModule.roles;

console.log('Generating and writing data...');

// Write in batches
const batchSize = 1000;
let batch = [];

while (count < targetRows) {
  departments.forEach((dept) => {
    if (count >= targetRows) return;

    const deptTeams = teams[dept.name] || [];

    deptTeams.forEach((team) => {
      if (count >= targetRows) return;

      const teamRoles = roles[dept.name] || [];
      const employeesPerTeam = Math.floor(Math.random() * 50) + 20;

      for (let i = 0; i < employeesPerTeam && count < targetRows; i++) {
        const role = teamRoles[Math.floor(Math.random() * teamRoles.length)];
        const employee = dataModule.generateEmployee(id++, dept.name, team, role);
        
        batch.push(employee);
        count++;
        
        // Write batch when it reaches batchSize
        if (batch.length >= batchSize) {
          const jsonBatch = batch.map(e => JSON.stringify(e)).join(',');
          if (count > batchSize) {
            writeStream.write(',' + jsonBatch);
          } else {
            writeStream.write(jsonBatch);
          }
          batch = [];
          
          // Progress update
          if (count % 10000 === 0) {
            console.log(`  Generated: ${count.toLocaleString()} rows...`);
          }
        }
      }
    });
  });
}

// Write remaining batch
if (batch.length > 0) {
  const jsonBatch = batch.map(e => JSON.stringify(e)).join(',');
  writeStream.write(',' + jsonBatch);
}

writeStream.write(']');
writeStream.end();

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

  console.log('✓ JSON file created successfully!');
  console.log(`  File: organization-data.json`);
  console.log(`  Size: ${fileSizeMB} MB`);
  console.log('');
});

writeStream.on('error', (err) => {
  console.error('Error writing file:', err);
});
