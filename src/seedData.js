import { db } from "./db";

export const seedData = async () => {
  const jobsCount = await db.jobs.count();

  const jobs = [
    {
      id: "1",
      title: "Frontend Developer",
      slug: "frontend-developer",
      status: "active",
      requiredSkills: ["React", "JavaScript"],
      preferredSkills: ["TypeScript"],
      salary: "8 LPA",
      location: "Remote",
      workType: "Full-time",
      tags: ["frontend", "react"],
      candidates: 0,
    },
    {
      id: "2",
      title: "Backend Developer",
      slug: "backend-developer",
      status: "active",
      requiredSkills: ["Node.js", "Express"],
      preferredSkills: ["MongoDB"],
      salary: "10 LPA",
      location: "Bangalore",
      workType: "Full-time",
      tags: ["backend", "node"],
      candidates: 0,
    },
    {
      id: "3",
      title: "Fullstack Engineer",
      slug: "fullstack-engineer",
      status: "active",
      requiredSkills: ["React", "Node.js"],
      preferredSkills: ["GraphQL", "AWS"],
      salary: "12 LPA",
      location: "Delhi",
      workType: "Hybrid",
      tags: ["fullstack", "web"],
      candidates: 0,
    },
    {
      id: "4",
      title: "Mobile App Developer",
      slug: "mobile-app-developer",
      status: "active",
      requiredSkills: ["React Native", "JavaScript"],
      preferredSkills: ["Flutter"],
      salary: "9 LPA",
      location: "Mumbai",
      workType: "Full-time",
      tags: ["mobile", "react-native"],
      candidates: 0,
    },
    {
      id: "5",
      title: "DevOps Engineer",
      slug: "devops-engineer",
      status: "active",
      requiredSkills: ["AWS", "Docker"],
      preferredSkills: ["Kubernetes"],
      salary: "11 LPA",
      location: "Remote",
      workType: "Full-time",
      tags: ["devops", "cloud"],
      candidates: 0,
    },
    {
      id: "6",
      title: "Data Scientist",
      slug: "data-scientist",
      status: "active",
      requiredSkills: ["Python", "Machine Learning"],
      preferredSkills: ["Deep Learning"],
      salary: "14 LPA",
      location: "Hyderabad",
      workType: "Full-time",
      tags: ["data", "ml"],
      candidates: 0,
    },
    {
      id: "7",
      title: "Data Engineer",
      slug: "data-engineer",
      status: "active",
      requiredSkills: ["SQL", "ETL"],
      preferredSkills: ["BigQuery", "Spark"],
      salary: "13 LPA",
      location: "Pune",
      workType: "Full-time",
      tags: ["data", "pipeline"],
      candidates: 0,
    },
    {
      id: "8",
      title: "QA Engineer",
      slug: "qa-engineer",
      status: "active",
      requiredSkills: ["Selenium", "JavaScript"],
      preferredSkills: ["Cypress"],
      salary: "7 LPA",
      location: "Chennai",
      workType: "Full-time",
      tags: ["qa", "testing"],
      candidates: 0,
    },
    {
      id: "9",
      title: "UI/UX Designer",
      slug: "ui-ux-designer",
      status: "active",
      requiredSkills: ["Figma", "Adobe XD"],
      preferredSkills: ["Illustrator"],
      salary: "6 LPA",
      location: "Remote",
      workType: "Part-time",
      tags: ["design", "uiux"],
      candidates: 0,
    },
    {
      id: "10",
      title: "System Administrator",
      slug: "system-administrator",
      status: "active",
      requiredSkills: ["Linux", "Networking"],
      preferredSkills: ["Cloud"],
      salary: "8 LPA",
      location: "Bangalore",
      workType: "Full-time",
      tags: ["sysadmin", "infra"],
      candidates: 0,
    },
    {
      id: "11",
      title: "AI Engineer",
      slug: "ai-engineer",
      status: "active",
      requiredSkills: ["Python", "TensorFlow"],
      preferredSkills: ["PyTorch"],
      salary: "15 LPA",
      location: "Delhi",
      workType: "Hybrid",
      tags: ["ai", "ml"],
      candidates: 0,
    },
    {
      id: "12",
      title: "Product Manager",
      slug: "product-manager",
      status: "active",
      requiredSkills: ["Agile", "Scrum"],
      preferredSkills: ["Jira"],
      salary: "18 LPA",
      location: "Remote",
      workType: "Full-time",
      tags: ["pm", "management"],
      candidates: 0,
    },
    {
      id: "13",
      title: "Game Developer",
      slug: "game-developer",
      status: "active",
      requiredSkills: ["Unity", "C#"],
      preferredSkills: ["Blender"],
      salary: "10 LPA",
      location: "Mumbai",
      workType: "Full-time",
      tags: ["game", "unity"],
      candidates: 0,
    },
    {
      id: "14",
      title: "Blockchain Developer",
      slug: "blockchain-developer",
      status: "active",
      requiredSkills: ["Solidity", "Ethereum"],
      preferredSkills: ["Web3.js"],
      salary: "16 LPA",
      location: "Remote",
      workType: "Full-time",
      tags: ["blockchain", "crypto"],
      candidates: 0,
    },
    {
      id: "15",
      title: "Cybersecurity Analyst",
      slug: "cybersecurity-analyst",
      status: "active",
      requiredSkills: ["Security", "Penetration Testing"],
      preferredSkills: ["CEH"],
      salary: "13 LPA",
      location: "Hyderabad",
      workType: "Full-time",
      tags: ["security", "cyber"],
      candidates: 0,
    },
    {
      id: "16",
      title: "Cloud Architect",
      slug: "cloud-architect",
      status: "active",
      requiredSkills: ["AWS", "Azure"],
      preferredSkills: ["GCP"],
      salary: "20 LPA",
      location: "Bangalore",
      workType: "Full-time",
      tags: ["cloud", "infra"],
      candidates: 0,
    },
    {
      id: "17",
      title: "Database Administrator",
      slug: "database-administrator",
      status: "active",
      requiredSkills: ["MySQL", "PostgreSQL"],
      preferredSkills: ["Oracle"],
      salary: "12 LPA",
      location: "Pune",
      workType: "Full-time",
      tags: ["db", "sql"],
      candidates: 0,
    },
    {
      id: "18",
      title: "Technical Writer",
      slug: "technical-writer",
      status: "active",
      requiredSkills: ["Documentation", "Markdown"],
      preferredSkills: ["Confluence"],
      salary: "5 LPA",
      location: "Remote",
      workType: "Part-time",
      tags: ["writer", "docs"],
      candidates: 0,
    },
    {
      id: "19",
      title: "Business Analyst",
      slug: "business-analyst",
      status: "active",
      requiredSkills: ["Excel", "SQL"],
      preferredSkills: ["Power BI"],
      salary: "9 LPA",
      location: "Delhi",
      workType: "Hybrid",
      tags: ["ba", "analysis"],
      candidates: 0,
    },
    {
      id: "20",
      title: "Support Engineer",
      slug: "support-engineer",
      status: "active",
      requiredSkills: ["Customer Support", "Troubleshooting"],
      preferredSkills: ["SaaS"],
      salary: "6 LPA",
      location: "Chennai",
      workType: "Full-time",
      tags: ["support", "tech"],
      candidates: 0,
    },
    {
      id: "21",
      title: "SEO Specialist",
      slug: "seo-specialist",
      status: "active",
      requiredSkills: ["SEO", "Google Analytics"],
      preferredSkills: ["Content Marketing"],
      salary: "7 LPA",
      location: "Remote",
      workType: "Part-time",
      tags: ["seo", "marketing"],
      candidates: 0,
    },
    {
      id: "22",
      title: "Content Writer",
      slug: "content-writer",
      status: "active",
      requiredSkills: ["Writing", "Research"],
      preferredSkills: ["SEO"],
      salary: "5 LPA",
      location: "Mumbai",
      workType: "Full-time",
      tags: ["content", "writing"],
      candidates: 0,
    },
    {
      id: "23",
      title: "HR Manager",
      slug: "hr-manager",
      status: "active",
      requiredSkills: ["Recruitment", "Employee Engagement"],
      preferredSkills: ["Payroll"],
      salary: "8 LPA",
      location: "Delhi",
      workType: "Full-time",
      tags: ["hr", "people"],
      candidates: 0,
    },
    {
      id: "24",
      title: "Sales Executive",
      slug: "sales-executive",
      status: "active",
      requiredSkills: ["Communication", "Negotiation"],
      preferredSkills: ["CRM"],
      salary: "6 LPA",
      location: "Pune",
      workType: "Full-time",
      tags: ["sales", "bizdev"],
      candidates: 0,
    },
    {
      id: "25",
      title: "Operations Manager",
      slug: "operations-manager",
      status: "active",
      requiredSkills: ["Operations", "Leadership"],
      preferredSkills: ["Lean Management"],
      salary: "12 LPA",
      location: "Hyderabad",
      workType: "Full-time",
      tags: ["ops", "management"],
      candidates: 0,
    },
  ];

  if (jobsCount === 0) {
    for (let job of jobs) {
      await db.jobs.add(job);
    }
  }

  // ======================
  // Seed/Top-up Candidates to 1000
  // ======================
  const candidatesCount = await db.candidates.count();
  if (candidatesCount < 1000) {
    const allJobs = jobsCount === 0 ? jobs : await db.jobs.toArray();

    const firstNames = [
      "Aarav",
      "Vivaan",
      "Aditya",
      "Vihaan",
      "Arjun",
      "Sai",
      "Ayaan",
      "Krishna",
      "Ishaan",
      "Rohan",
      "Anaya",
      "Kiara",
      "Diya",
      "Myra",
      "Aadhya",
      "Saanvi",
      "Aarohi",
      "Pari",
      "Ira",
      "Avni",
    ];
    const lastNames = [
      "Sharma",
      "Verma",
      "Gupta",
      "Iyer",
      "Reddy",
      "Naidu",
      "Mehta",
      "Patel",
      "Kumar",
      "Singh",
      "Kapoor",
      "Bose",
      "Chopra",
      "Desai",
      "Ghosh",
      "Jain",
      "Joshi",
      "Nair",
      "Rao",
      "Saxena",
    ];
    const stages = [
      "Applied",
      "Screening",
      "Interview",
      "Assignment",
      "Completed",
      "Offered",
      "Hired",
      "Rejected",
    ];

    const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const toEmail = (name, index) =>
      `${name.toLowerCase().replace(/\s+/g, ".")}${index}@example.com`;

    const candidateRecords = [];
    let emailIndex = candidatesCount + 1;
    for (let i = candidatesCount; i < 1000; i++) {
      const first = randomChoice(firstNames);
      const last = randomChoice(lastNames);
      const name = `${first} ${last}`;
      const email = toEmail(`${first}.${last}`, emailIndex++);
      const job = randomChoice(allJobs);
      const stage = randomChoice(stages);

      candidateRecords.push({
        id: `${Date.now()}-${i}`,
        jobId: job.id,
        name,
        email,
        // Keeping both for compatibility across UI components
        stage,
        status: stage,
        createdAt: new Date().toISOString(),
      });
    }

    if (candidateRecords.length > 0) {
      await db.candidates.bulkAdd(candidateRecords);
    }

    // Optionally update candidate count per job (best-effort)
    const jobIdToCount = candidateRecords.reduce((acc, c) => {
      acc[c.jobId] = (acc[c.jobId] || 0) + 1;
      return acc;
    }, {});

    const existingJobs = jobsCount === 0 ? jobs : await db.jobs.toArray();
    const updatedJobs = existingJobs.map((j) => ({
      ...j,
      candidates: (j.candidates || 0) + (jobIdToCount[j.id] || 0),
    }));
    for (let uj of updatedJobs) await db.jobs.put(uj);
  }

  // ======================
  // Ensure at least 3 assessments exist (3 sections x 10 MCQs each)
  // Create for jobs missing an assessment until we reach 3 total
  // ======================
  const assessmentsCount = await db.assessments.count();
  if (assessmentsCount < 3) {
    const allJobs = await db.jobs.toArray();

    // Helper to generate 10+ MCQs per section
    const generateQuestions = (prefix) => {
      const questions = [];
      const total = 10; // per section
      for (let i = 1; i <= total; i++) {
        const correct = Math.floor(Math.random() * 4);
        questions.push({
          id: `${prefix}-q${i}`,
          text: `${prefix} Question ${i}`,
          options: [
            "Option A",
            "Option B",
            "Option C",
            "Option D",
          ],
          correctOptionIndex: correct,
        });
      }
      return questions;
    };

    let created = 0;
    for (const job of allJobs) {
      if (assessmentsCount + created >= 3) break;
      const exists = await db.assessments
        .where("jobId")
        .equals(job.id)
        .first();
      if (exists) continue;
      const sections = [
        {
          id: `${job.id}-sec1`,
          title: "Basics",
          questions: generateQuestions("Basics"),
        },
        {
          id: `${job.id}-sec2`,
          title: "Intermediate",
          questions: generateQuestions("Intermediate"),
        },
        {
          id: `${job.id}-sec3`,
          title: "Advanced",
          questions: generateQuestions("Advanced"),
        },
      ];

      await db.assessments.add({
        id: `${job.id}-assessment`,
        jobId: job.id,
        sections,
        createdAt: new Date().toISOString(),
      });
      created += 1;
    }
  }
};
