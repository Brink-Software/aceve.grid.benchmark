// ============================================
// AssemblyScript WASM Data Generator
// ============================================

// Random number generator (simpele LCG)
let seed: i32 = 12345;

function random(): f64 {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return <f64>seed / <f64>0x7fffffff;
}

// Genereer een random getal tussen min en max
function randomRange(min: f64, max: f64): f64 {
  return min + random() * (max - min);
}

// Genereer salary met variatie
function generateSalary(baseSalary: f64): i32 {
  const variation = baseSalary * 0.2;
  const finalSalary = baseSalary + randomRange(-variation, variation);
  return <i32>Math.round(finalSalary);
}

// Genereer years of experience
function generateYearsExperience(): i32 {
  return <i32>Math.floor(randomRange(1, 16));
}

// Genereer projects completed
function generateProjectsCompleted(): i32 {
  return <i32>Math.floor(randomRange(5, 55));
}

// Genereer performance score
function generatePerformanceScore(): f64 {
  return Math.round(randomRange(70, 100) * 10) / 10;
}

// Genereer training hours
function generateTrainingHours(): i32 {
  return <i32>Math.floor(randomRange(20, 120));
}

// Genereer start date components
function generateStartDateYear(): i32 {
  return <i32>Math.floor(randomRange(2020, 2024));
}

function generateStartDateMonth(): i32 {
  return <i32>Math.floor(randomRange(0, 12));
}

function generateStartDateDay(): i32 {
  return <i32>Math.floor(randomRange(1, 29));
}

// Genereer numerieke waarde voor een specifieke index
function generateNumericValue(index: i32): f64 {
  if (index <= 123) {
    return Math.round(randomRange(0, 1000) * 100) / 100;
  } else if (index <= 246) {
    return Math.round(randomRange(0, 10000) * 100) / 100;
  } else if (index <= 369) {
    return Math.round(randomRange(0, 100000) * 100) / 100;
  } else {
    return Math.round(randomRange(0, 1000000) * 100) / 100;
  }
}

// Genereer een lijst van employees
// Parameters:
// - count: aantal employees om te genereren
// - baseSalary: basis salaris voor alle employees
// - seedOffset: offset voor de seed (gebruik id * 12345)
//
// Retourneert een platte array met alle employee data:
// Per employee: [salary, yearsExp, projects, perfScore, trainingHours, startYear, startMonth, startDay, ...490 numeric values..., ...90 text indices...]
// Totaal per employee: 8 + 490 + 90 = 588 waarden
// Voor count employees: count * 588 waarden
export function generateEmployeeData(
  count: i32,
  baseSalary: f64,
  seedOffset: i32
): Array<f64> {
  // Set seed met offset
  seed = seedOffset;

  // Totaal aantal waarden: 8 (basis data) + 490 (numeric) + 90 (text indices) = 588 per employee
  const valuesPerEmployee: i32 = 8 + 490 + 90;
  const totalValues: i32 = count * valuesPerEmployee;
  const result = new Array<f64>(totalValues);

  let resultIndex: i32 = 0;

  for (let empIndex: i32 = 0; empIndex < count; empIndex++) {
    // Basis employee data (8 waarden)
    result[resultIndex++] = <f64>generateSalary(baseSalary);
    result[resultIndex++] = <f64>generateYearsExperience();
    result[resultIndex++] = <f64>generateProjectsCompleted();
    result[resultIndex++] = generatePerformanceScore();
    result[resultIndex++] = <f64>generateTrainingHours();
    result[resultIndex++] = <f64>generateStartDateYear();
    result[resultIndex++] = <f64>generateStartDateMonth();
    result[resultIndex++] = <f64>generateStartDateDay();

    // 490 numerieke waarden
    for (let i: i32 = 0; i < 490; i++) {
      const numIndex = i + 1; // 1-based index
      result[resultIndex++] = generateNumericValue(numIndex);
    }

    // 90 text indices
    for (let i: i32 = 0; i < 90; i++) {
      result[resultIndex++] = <f64>Math.floor(random() * 1000);
    }
  }

  return result;
}
