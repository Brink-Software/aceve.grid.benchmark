// ============================================
// Organisatie Data Generatie
// ============================================

// Types die nodig zijn voor data generatie
export interface Department {
  name: string;
  color: string;
}

export interface TeamsMap {
  [department: string]: string[];
}

export interface RolesMap {
  [department: string]: string[];
}

export interface BaseSalaryMap {
  [role: string]: number;
}

export const departments: Department[] = [
  { name: "Engineering", color: "#4CAF50" },
  { name: "Marketing", color: "#2196F3" },
  { name: "Sales", color: "#FF9800" },
  { name: "HR", color: "#9C27B0" },
  { name: "Finance", color: "#F44336" },
  { name: "IT", color: "#00BCD4" },
  { name: "Operations", color: "#795548" },
  { name: "Research", color: "#E91E63" },
];

export const teams: TeamsMap = {
  Engineering: ["Frontend Team", "Backend Team", "DevOps Team", "QA Team"],
  Marketing: ["Digital Marketing", "Content Marketing", "Social Media"],
  Sales: ["Enterprise Sales", "SMB Sales", "Inside Sales"],
  HR: ["Recruitment", "Talent Development", "Compensation"],
  Finance: ["Accounting", "Financial Planning", "Audit"],
  IT: ["Infrastructure", "Security", "Support"],
  Operations: ["Supply Chain", "Logistics", "Facilities"],
  Research: ["Product Research", "Market Research", "Innovation"],
};

export const roles: RolesMap = {
  Engineering: [
    "Senior Developer",
    "Developer",
    "Junior Developer",
    "Tech Lead",
    "Architect",
  ],
  Marketing: [
    "Marketing Manager",
    "Marketing Specialist",
    "Content Creator",
    "SEO Specialist",
  ],
  Sales: [
    "Sales Manager",
    "Account Executive",
    "Sales Representative",
    "Business Development",
  ],
  HR: ["HR Manager", "Recruiter", "HR Business Partner", "Talent Acquisition"],
  Finance: ["Finance Manager", "Accountant", "Financial Analyst", "Controller"],
  IT: [
    "IT Manager",
    "System Administrator",
    "Security Specialist",
    "Help Desk",
  ],
  Operations: [
    "Operations Manager",
    "Operations Coordinator",
    "Supply Chain Analyst",
  ],
  Research: [
    "Research Manager",
    "Research Analyst",
    "Data Scientist",
    "Innovation Lead",
  ],
};

export const firstNames: string[] = [
  "Jan",
  "Piet",
  "Klaas",
  "Anna",
  "Maria",
  "Peter",
  "Lisa",
  "Tom",
  "Emma",
  "David",
  "Sophie",
  "Mark",
  "Laura",
  "Paul",
  "Sarah",
  "Mike",
  "Julia",
  "Rick",
  "Nina",
  "Kevin",
  "Sanne",
  "Tim",
  "Eva",
  "Lucas",
  "Noa",
  "Max",
  "Lotte",
  "Daan",
  "Fleur",
  "Sem",
  "Iris",
  "Bram",
  "Roos",
  "Finn",
  "Saar",
  "Luuk",
  "Mila",
  "Jesse",
  "Evi",
  "Thijs",
  "Lynn",
  "Ruben",
  "Sofie",
  "Joris",
  "Lieke",
];

export const lastNames: string[] = [
  "de Vries",
  "Jansen",
  "Bakker",
  "Visser",
  "Smit",
  "Meijer",
  "de Boer",
  "Mulder",
  "de Groot",
  "Bos",
  "Vos",
  "Peters",
  "Hendriks",
  "van Leeuwen",
  "Dekker",
  "Brouwer",
  "de Wit",
  "van Dijk",
  "Smits",
  "de Graaf",
  "van der Berg",
  "Koning",
  "van den Berg",
  "Jacobs",
  "de Haan",
  "Vermeulen",
  "van der Meer",
];

export const baseSalary: BaseSalaryMap = {
  "Senior Developer": 75000,
  Developer: 55000,
  "Junior Developer": 35000,
  "Tech Lead": 90000,
  Architect: 100000,
  "Marketing Manager": 65000,
  "Marketing Specialist": 45000,
  "Content Creator": 40000,
  "SEO Specialist": 42000,
  "Sales Manager": 70000,
  "Account Executive": 50000,
  "Sales Representative": 40000,
  "Business Development": 45000,
  "HR Manager": 60000,
  Recruiter: 38000,
  "HR Business Partner": 55000,
  "Talent Acquisition": 40000,
  "Finance Manager": 70000,
  Accountant: 45000,
  "Financial Analyst": 50000,
  Controller: 75000,
  "IT Manager": 75000,
  "System Administrator": 50000,
  "Security Specialist": 65000,
  "Help Desk": 35000,
  "Operations Manager": 65000,
  "Operations Coordinator": 40000,
  "Supply Chain Analyst": 45000,
  "Research Manager": 80000,
  "Research Analyst": 50000,
  "Data Scientist": 75000,
  "Innovation Lead": 85000,
};

// Sample data voor tekst kolommen
export const textSampleData = [
  "Actief",
  "Inactief",
  "Pending",
  "Goedgekeurd",
  "Afgewezen",
  "Hoog",
  "Gemiddeld",
  "Laag",
  "Kritiek",
  "Normaal",
  "Ja",
  "Nee",
  "Onbekend",
  "In behandeling",
  "Voltooid",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "Project Alpha",
  "Project Beta",
  "Project Gamma",
  "Project Delta",
  "Team A",
  "Team B",
  "Team C",
  "Team D",
  "Team E",
  "Regio Noord",
  "Regio Zuid",
  "Regio Oost",
  "Regio West",
  "Type 1",
  "Type 2",
  "Type 3",
  "Type 4",
  "Type 5",
  "Categorie A",
  "Categorie B",
  "Categorie C",
  "Categorie D",
];

export function generateEmployee(
  id: number,
  department: string,
  team: string,
  role: string
): any {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  const salary = baseSalary[role] || 45000;
  const salaryVariation = salary * 0.2;
  const finalSalary = Math.round(
    salary + Math.random() * salaryVariation * 2 - salaryVariation
  );

  const yearsExperience = Math.floor(Math.random() * 15) + 1;
  const projectsCompleted = Math.floor(Math.random() * 50) + 5;
  const performanceScore = Math.round((Math.random() * 30 + 70) * 10) / 10;
  const trainingHours = Math.floor(Math.random() * 100) + 20;

  const startDate = new Date(
    2020 + Math.floor(Math.random() * 4),
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1
  )
    .toISOString()
    .split("T")[0];

  const employee: any = {
    id: id,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName
      .toLowerCase()
      .replace(/\s+/g, "")}@company.com`,
    department: department,
    team: team,
    role: role,
    salary: finalSalary,
    yearsExperience: yearsExperience,
    projectsCompleted: projectsCompleted,
    performanceScore: performanceScore,
    trainingHours: trainingHours,
    startDate: startDate,
  };

  // Genereer 25 numerieke kolommen
  for (let i = 1; i <= 25; i++) {
    const fieldName = `num_${i}`;
    if (i <= 8) {
      employee[fieldName] = Math.round(Math.random() * 1000 * 100) / 100;
    } else if (i <= 16) {
      employee[fieldName] = Math.round(Math.random() * 10000 * 100) / 100;
    } else {
      employee[fieldName] = Math.round(Math.random() * 100000 * 100) / 100;
    }
  }

  // Genereer 5 tekst kolommen (totaal met defaults = 30 kolommen)
  for (let i = 1; i <= 5; i++) {
    const fieldName = `text_${i}`;
    employee[fieldName] =
      textSampleData[Math.floor(Math.random() * textSampleData.length)];
  }

  return employee;
}

// Type voor progress callback
export type ProgressCallback = (count: number) => void;

// Type voor nextId object (met getter/setter)
export interface NextIdState {
  value: number;
  getValue(): number;
  setValue(value: number): void;
  increment(): number;
}

// Genereer data in chunks voor betere UX
export async function generateChunk(
  rowData: any[],
  targetRows: number,
  nextIdState: NextIdState,
  updateProgress: ProgressCallback,
  chunkSize: number = 10000
): Promise<void> {
  return new Promise((resolve) => {
    const startTime = performance.now();
    let currentCount = 0;

    const generateChunkRecursive = (): void => {
      while (rowData.length < targetRows && currentCount < chunkSize) {
        // Genereer data
        departments.forEach((dept) => {
          if (rowData.length >= targetRows) return;

          const deptTeams = teams[dept.name] || [];
          deptTeams.forEach((team) => {
            if (rowData.length >= targetRows) return;

            const teamRoles = roles[dept.name] || [];
            const employeesPerTeam = Math.floor(Math.random() * 50) + 20;

            for (
              let i = 0;
              i < employeesPerTeam && rowData.length < targetRows;
              i++
            ) {
              const role =
                teamRoles[Math.floor(Math.random() * teamRoles.length)];
              const employee = generateEmployee(
                nextIdState.increment(),
                dept.name,
                team,
                role
              );
              rowData.push(employee);
              currentCount++;
            }
          });
        });

        // Update progress elke 1000 rijen
        if (rowData.length % 1000 === 0) {
          updateProgress(rowData.length);
        }

        // Check of we klaar zijn
        if (rowData.length >= targetRows) {
          updateProgress(rowData.length);
          resolve();
          return;
        }

        // Check elapsed time
        const elapsed = performance.now() - startTime;
        if (elapsed > 100) {
          // Te lang bezig, yield to UI
          currentCount = 0;
          updateProgress(rowData.length);
          setTimeout(() => {
            generateChunkRecursive();
          }, 0);
          return;
        }
      }

      currentCount = 0;
      updateProgress(rowData.length);

      if (rowData.length < targetRows) {
        setTimeout(() => {
          generateChunkRecursive();
        }, 0);
      } else {
        resolve();
      }
    };

    generateChunkRecursive();
  });
}

export function generateOrganizationData(): any[] {
  const data: any[] = [];
  let id = 1;
  const targetRows = 3000;

  while (data.length < targetRows) {
    departments.forEach((dept) => {
      if (data.length >= targetRows) return;

      const deptTeams = teams[dept.name] || [];

      deptTeams.forEach((team) => {
        if (data.length >= targetRows) return;

        const teamRoles = roles[dept.name] || [];
        const employeesPerTeam = Math.floor(Math.random() * 50) + 20;

        for (let i = 0; i < employeesPerTeam && data.length < targetRows; i++) {
          const role = teamRoles[Math.floor(Math.random() * teamRoles.length)];
          const employee = generateEmployee(id++, dept.name, team, role);
          data.push(employee);
        }
      });
    });
  }

  console.log(
    `Generated ${data.length} employees across ${departments.length} departments`
  );
  console.log(`Total columns: 10 default + 25 numeric + 5 text = 40 columns`);
  return data;
}
