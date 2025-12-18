using MudBlazor_grid.Models;

namespace MudBlazor_grid.Services;

public class DataGenerationService
{
    private static readonly string[] Departments = new[]
    {
        "Engineering", "Marketing", "Sales", "HR",
        "Finance", "IT", "Operations", "Research"
    };

    private static readonly Dictionary<string, string[]> Teams = new()
    {
        { "Engineering", new[] { "Frontend Team", "Backend Team", "DevOps Team", "QA Team" } },
        { "Marketing", new[] { "Digital Marketing", "Content Marketing", "Social Media" } },
        { "Sales", new[] { "Enterprise Sales", "SMB Sales", "Inside Sales" } },
        { "HR", new[] { "Recruitment", "Talent Development", "Compensation" } },
        { "Finance", new[] { "Accounting", "Financial Planning", "Audit" } },
        { "IT", new[] { "Infrastructure", "Security", "Support" } },
        { "Operations", new[] { "Supply Chain", "Logistics", "Facilities" } },
        { "Research", new[] { "Product Research", "Market Research", "Innovation" } }
    };

    private static readonly Dictionary<string, string[]> Roles = new()
    {
        { "Engineering", new[] { "Senior Developer", "Developer", "Junior Developer", "Tech Lead", "Architect" } },
        { "Marketing", new[] { "Marketing Manager", "Marketing Specialist", "Content Creator", "SEO Specialist" } },
        { "Sales", new[] { "Sales Manager", "Account Executive", "Sales Representative", "Business Development" } },
        { "HR", new[] { "HR Manager", "Recruiter", "HR Business Partner", "Talent Acquisition" } },
        { "Finance", new[] { "Finance Manager", "Accountant", "Financial Analyst", "Controller" } },
        { "IT", new[] { "IT Manager", "System Administrator", "Security Specialist", "Help Desk" } },
        { "Operations", new[] { "Operations Manager", "Operations Coordinator", "Supply Chain Analyst" } },
        { "Research", new[] { "Research Manager", "Research Analyst", "Data Scientist", "Innovation Lead" } }
    };

    private static readonly string[] FirstNames = new[]
    {
        "Jan", "Piet", "Klaas", "Anna", "Maria", "Peter", "Lisa", "Tom",
        "Emma", "David", "Sophie", "Mark", "Laura", "Paul", "Sarah", "Mike",
        "Julia", "Rick", "Nina", "Kevin", "Sanne", "Tim", "Eva", "Lucas",
        "Noa", "Max", "Lotte", "Daan", "Fleur", "Sem", "Iris", "Bram",
        "Roos", "Finn", "Saar", "Luuk", "Mila", "Jesse", "Evi", "Thijs",
        "Lynn", "Ruben", "Sofie", "Joris", "Lieke"
    };

    private static readonly string[] LastNames = new[]
    {
        "de Vries", "Jansen", "Bakker", "Visser", "Smit", "Meijer",
        "de Boer", "Mulder", "de Groot", "Bos", "Vos", "Peters",
        "Hendriks", "van Leeuwen", "Dekker", "Brouwer", "de Wit",
        "van Dijk", "Smits", "de Graaf", "van den Berg", "Koning",
        "Jacobs", "de Haan", "Vermeulen", "van der Meer"
    };

    private static readonly Dictionary<string, decimal> BaseSalary = new()
    {
        { "Senior Developer", 75000 }, { "Developer", 55000 }, { "Junior Developer", 35000 },
        { "Tech Lead", 90000 }, { "Architect", 100000 }, { "Marketing Manager", 65000 },
        { "Marketing Specialist", 45000 }, { "Content Creator", 40000 }, { "SEO Specialist", 42000 },
        { "Sales Manager", 70000 }, { "Account Executive", 50000 }, { "Sales Representative", 40000 },
        { "Business Development", 45000 }, { "HR Manager", 60000 }, { "Recruiter", 38000 },
        { "HR Business Partner", 55000 }, { "Talent Acquisition", 40000 }, { "Finance Manager", 70000 },
        { "Accountant", 45000 }, { "Financial Analyst", 50000 }, { "Controller", 75000 },
        { "IT Manager", 75000 }, { "System Administrator", 50000 }, { "Security Specialist", 65000 },
        { "Help Desk", 35000 }, { "Operations Manager", 65000 }, { "Operations Coordinator", 40000 },
        { "Supply Chain Analyst", 45000 }, { "Research Manager", 80000 }, { "Research Analyst", 50000 },
        { "Data Scientist", 75000 }, { "Innovation Lead", 85000 }
    };

    private readonly Random _random = new Random();
    private int _nextId = 1;

    public Employee GenerateEmployee(string department, string team, string role)
    {
        var firstName = FirstNames[_random.Next(FirstNames.Length)];
        var lastName = LastNames[_random.Next(LastNames.Length)];

        var baseSalary = BaseSalary.GetValueOrDefault(role, 45000);
        var salaryVariation = baseSalary * 0.2m;
        var finalSalary = Math.Round(baseSalary + (decimal)(_random.NextDouble() * (double)salaryVariation * 2 - (double)salaryVariation));

        var employee = new Employee
        {
            Id = _nextId++,
            Name = $"{firstName} {lastName}",
            Email = $"{firstName.ToLower()}.{lastName.ToLower().Replace(" ", "")}@company.com",
            Department = department,
            Team = team,
            Role = role,
            Salary = finalSalary,
            Experience = _random.Next(1, 16),
            Projects = _random.Next(5, 55),
            Performance = Math.Round(_random.NextDouble() * 30 + 70, 1)
        };

        // Generate 490 numeric columns using reflection
        SetNumericProperties(employee);

        return employee;
    }

    private void SetNumericProperties(Employee employee)
    {
        var type = typeof(Employee);

        for (int i = 1; i <= 490; i++)
        {
            var propName = $"Num_{i}";
            var property = type.GetProperty(propName);

            if (property != null)
            {
                double value;
                if (i <= 163)
                    value = Math.Round(_random.NextDouble() * 1000, 2);
                else if (i <= 326)
                    value = Math.Round(_random.NextDouble() * 10000, 2);
                else
                    value = Math.Round(_random.NextDouble() * 100000, 2);

                property.SetValue(employee, value);
            }
        }
    }

    public async Task<List<Employee>> GenerateDataAsync(
        int targetRows,
        Action<int> progressCallback,
        int chunkSize = 10000)
    {
        var data = new List<Employee>(targetRows);

        while (data.Count < targetRows)
        {
            var chunkStart = data.Count;
            var chunkTarget = Math.Min(chunkStart + chunkSize, targetRows);

            // Generate chunk
            while (data.Count < chunkTarget)
            {
                foreach (var dept in Departments)
                {
                    if (data.Count >= chunkTarget) break;

                    var deptTeams = Teams.GetValueOrDefault(dept, Array.Empty<string>());

                    foreach (var team in deptTeams)
                    {
                        if (data.Count >= chunkTarget) break;

                        var teamRoles = Roles.GetValueOrDefault(dept, Array.Empty<string>());
                        var employeesPerTeam = _random.Next(20, 71);

                        for (int i = 0; i < employeesPerTeam && data.Count < chunkTarget; i++)
                        {
                            var role = teamRoles[_random.Next(teamRoles.Length)];
                            var employee = GenerateEmployee(dept, team, role);
                            data.Add(employee);

                            // Update progress every 1000 rows
                            if (data.Count % 1000 == 0)
                            {
                                progressCallback?.Invoke(data.Count);
                            }
                        }
                    }
                }
            }

            // Yield to UI thread after each chunk
            progressCallback?.Invoke(data.Count);
            await Task.Delay(1);
        }

        return data;
    }
}
