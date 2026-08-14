const mongoose = require("mongoose");
const Occupation = require("../models/Occupation");
const Skill = require("../models/Skill");

const seedSkillsData = [
  { name: "Coding/Logic", category: "Technical", demandTrend: "increasing", aiRelevance: "AI automates syntax, making logical structuring and debugging skills more crucial." },
  { name: "System Design", category: "Technical", demandTrend: "increasing", aiRelevance: "Critical human-complementary design to structure complex systems." },
  { name: "Git/GitHub", category: "Digital", demandTrend: "stable", aiRelevance: "Version control scripts are automated, code conflicts resolved by humans." },
  { name: "API Integration", category: "Technical", demandTrend: "stable", aiRelevance: "Standardized tasks fit LLM generation well, human validation still required." },
  { name: "Debugging", category: "Technical", demandTrend: "stable", aiRelevance: "AI detects bugs rapidly, humans solve complex state race conditions." },
  { name: "REST APIs", category: "Technical", demandTrend: "stable", aiRelevance: "Boilerplate endpoint code is generated; security and business logic are human." },
  { name: "SQL", category: "Technical", demandTrend: "increasing", aiRelevance: "SQL code is highly automated, but query optimization and schema design remain key human skills." },
  { name: "Data Visualization", category: "Analytical", demandTrend: "increasing", aiRelevance: "Creating visuals is automated; aligning visualizations with corporate stories is human." },
  { name: "Statistics", category: "Analytical", demandTrend: "stable", aiRelevance: "AI executes models instantly, humans must critique model validity." },
  { name: "Excel", category: "Digital", demandTrend: "decreasing", aiRelevance: "Copilot automates formulas; auditing outputs is human." },
  { name: "Data Interpretation", category: "Analytical", demandTrend: "increasing", aiRelevance: "Highly resistant human cognitive task to decode business meanings." },
  { name: "Communication", category: "Communication", demandTrend: "increasing", aiRelevance: "High-value human skill resistant to automation." },
  { name: "Python", category: "Technical", demandTrend: "increasing", aiRelevance: "High AI relevance; scripting is automated, architecture is manual." },
  { name: "Database Design", category: "Technical", demandTrend: "increasing", aiRelevance: "Logical schema matching demands business context reasoning." },
  { name: "Cloud Infrastructure", category: "Technical", demandTrend: "increasing", aiRelevance: "Infrastructure-as-code templates are generated, architecture needs audit." },
  { name: "ETL Pipelines", category: "Technical", demandTrend: "stable", aiRelevance: "Pipeline scripts are easily generated; scheduling fits AI." },
  { name: "UI Design", category: "Creative", demandTrend: "stable", aiRelevance: "Figma UI options are generated, layouts need aesthetic human review." },
  { name: "UX Research", category: "Analytical", demandTrend: "increasing", aiRelevance: "Empathy interviews and observational user tests are fully human." },
  { name: "Figma", category: "Digital", demandTrend: "stable", aiRelevance: "Design system management tools assist humans." },
  { name: "Prototyping", category: "Creative", demandTrend: "stable", aiRelevance: "Rapid prototyping is aided by AI layout tools." },
  { name: "User Empathy", category: "Creative", demandTrend: "increasing", aiRelevance: "Highly resistant soft skill; AI cannot feel empathy." },
  { name: "Visual Design", category: "Creative", demandTrend: "stable", aiRelevance: "Aesthetics are generated, branding strategy checks are human." },
  { name: "Accounting Principles", category: "Domain", demandTrend: "stable", aiRelevance: "System checks are automated, bookkeeping audits need accountant review." },
  { name: "Tax Regulation", category: "Domain", demandTrend: "stable", aiRelevance: "Rule databases are indexed, tax strategies are negotiated by humans." },
  { name: "Auditing", category: "Analytical", demandTrend: "increasing", aiRelevance: "Compliance checks require trust and accountability standards." },
  { name: "Financial Reporting", category: "Domain", demandTrend: "stable", aiRelevance: "Reports are compiled automatically, interpretations need humans." },
  { name: "Conflict Resolution", category: "Communication", demandTrend: "increasing", aiRelevance: "Requires high emotional intelligence and interpersonal de-escalation." },
  { name: "Product Support", category: "Domain", demandTrend: "decreasing", aiRelevance: "Bot answers FAQs; troubleshooting custom errors needs humans." },
  { name: "Requirement Gathering", category: "Analytical", demandTrend: "increasing", aiRelevance: "Uncovering corporate needs requires human interview skills." },
  { name: "Process Mapping", category: "Analytical", demandTrend: "stable", aiRelevance: "Drafting charts is automated, process design needs logic checks." },
  { name: "Agile Methodologies", category: "Management", demandTrend: "stable", aiRelevance: "Filing sprints is automated, scrum facilitation is human." },
  { name: "Stakeholder Management", category: "Management", demandTrend: "increasing", aiRelevance: "Building executive trust and alignments is human-only." },
  { name: "SEO", category: "Technical", demandTrend: "stable", aiRelevance: "Keyword data is aggregated, search content quality is manual." },
  { name: "Content Strategy", category: "Creative", demandTrend: "increasing", aiRelevance: "Requires custom brand voice definition and cultural hooks." },
  { name: "Google Analytics", category: "Digital", demandTrend: "stable", aiRelevance: "Data pulls are automated; choosing campaign directions is manual." },
  { name: "Copywriting", category: "Creative", demandTrend: "decreasing", aiRelevance: "Basic text variations are generated, editing is human." },
  { name: "Campaign Management", category: "Management", demandTrend: "stable", aiRelevance: "Ad budgets auto-optimize; choosing target channels needs humans." }
];

const seedOccupationsData = [
  {
    name: "Software Developer",
    description: "Design, build, and deploy custom software applications and systems.",
    industry: "Technology",
    skills: ["Coding/Logic", "System Design", "Git/GitHub", "API Integration", "Debugging", "REST APIs", "Communication"],
    technologies: ["JavaScript", "Python", "Docker", "Node.js", "AWS"],
    transferableSkills: ["Problem Solving", "System Design", "Logic", "Documentation"],
    relatedOccupations: ["Data Engineer", "UI/UX Designer", "Business Analyst"],
    tasks: [
      {
        name: "Writing code blocks",
        description: "Writing structural frontend and backend logic in target languages.",
        importance: 85,
        requiredSkills: ["Coding/Logic", "REST APIs"],
        aiAutomationPotential: 75,
        aiAugmentationPotential: 85,
        humanValue: 40,
        evidenceConfidence: 90,
        explanation: "AI generates function code segments instantly. The developer's value shifts to system design, review, and integration."
      },
      {
        name: "System architecture design",
        description: "Designing application structure, data relationships, and deployment environments.",
        importance: 90,
        requiredSkills: ["System Design"],
        aiAutomationPotential: 20,
        aiAugmentationPotential: 50,
        humanValue: 85,
        evidenceConfidence: 85,
        explanation: "Designing structures involves matching business targets to technologies, requiring complex human context."
      },
      {
        name: "Debugging and troubleshooting",
        description: "Tracing errors, resolving performance bottlenecks, and fixing logical flaws.",
        importance: 80,
        requiredSkills: ["Debugging", "Coding/Logic"],
        aiAutomationPotential: 60,
        aiAugmentationPotential: 80,
        humanValue: 60,
        evidenceConfidence: 90,
        explanation: "AI quickly proposes bug fixes from stack traces, but debugging deep logical race conditions still demands human oversight."
      },
      {
        name: "API Integration",
        description: "Connecting databases, external services, and internal APIs.",
        importance: 75,
        requiredSkills: ["API Integration", "REST APIs"],
        aiAutomationPotential: 70,
        aiAugmentationPotential: 80,
        humanValue: 35,
        evidenceConfidence: 85,
        explanation: "Standardized request/response formats fit LLM generation capabilities very well."
      },
      {
        name: "Team alignment and code reviews",
        description: "Aligning team members and auditing code quality standards.",
        importance: 70,
        requiredSkills: ["Communication", "Git/GitHub"],
        aiAutomationPotential: 25,
        aiAugmentationPotential: 40,
        humanValue: 80,
        evidenceConfidence: 80,
        explanation: "Requires consensus building, mentoring, and code policy checks that AI cannot facilitate."
      }
    ]
  },
  {
    name: "Data Analyst",
    description: "Analyze database records, build reports, and present business intelligence insights.",
    industry: "Data Analytics",
    skills: ["SQL", "Data Visualization", "Statistics", "Excel", "Data Interpretation", "Communication"],
    technologies: ["Power BI", "Python", "Tableau", "SQL Server", "Pandas"],
    transferableSkills: ["Analytical Thinking", "Communication", "Problem Solving", "Data Interpretation"],
    relatedOccupations: ["Data Engineer", "Software Developer", "Business Analyst"],
    tasks: [
      {
        name: "Writing SQL queries",
        description: "Writing queries to pull database details.",
        importance: 80,
        requiredSkills: ["SQL"],
        aiAutomationPotential: 80,
        aiAugmentationPotential: 90,
        humanValue: 30,
        evidenceConfidence: 90,
        explanation: "Natural language query generators generate standard joins and queries with high accuracy."
      },
      {
        name: "Data cleaning and formatting",
        description: "Cleaning null values and formatting strings.",
        importance: 75,
        requiredSkills: ["Excel", "Python"],
        aiAutomationPotential: 85,
        aiAugmentationPotential: 70,
        humanValue: 20,
        evidenceConfidence: 90,
        explanation: "AI models clean, format, and structure dataset records reliably."
      },
      {
        name: "Statistical data analysis",
        description: "Executing regressions and statistical checks.",
        importance: 70,
        requiredSkills: ["Statistics", "Data Interpretation"],
        aiAutomationPotential: 50,
        aiAugmentationPotential: 80,
        humanValue: 60,
        evidenceConfidence: 80,
        explanation: "AI runs analytical computations instantly, but choosing control variables demands human analyst inputs."
      },
      {
        name: "Building BI dashboards",
        description: "Creating dashboard layouts and visual metrics.",
        importance: 85,
        requiredSkills: ["Data Visualization", "Excel"],
        aiAutomationPotential: 45,
        aiAugmentationPotential: 75,
        humanValue: 70,
        evidenceConfidence: 85,
        explanation: "Layout options are generated, but aligning visualization triggers with executive strategy requires human validation."
      },
      {
        name: "Stakeholder presentation",
        description: "Explaining reports to corporate leaders.",
        importance: 90,
        requiredSkills: ["Communication", "Data Interpretation"],
        aiAutomationPotential: 15,
        aiAugmentationPotential: 30,
        humanValue: 90,
        evidenceConfidence: 90,
        explanation: "Persuading executives and navigating team priorities is a critical human competency."
      }
    ]
  },
  {
    name: "Data Engineer",
    description: "Build scalable data pipelines, data warehouses, and ETL infrastructures.",
    industry: "Data Analytics",
    skills: ["Python", "SQL", "Database Design", "Cloud Infrastructure", "ETL Pipelines", "Communication"],
    technologies: ["Airflow", "AWS", "Spark", "PostgreSQL", "Snowflake"],
    transferableSkills: ["System Design", "Problem Solving", "Logic"],
    relatedOccupations: ["Data Analyst", "Software Developer"],
    tasks: [
      {
        name: "Designing database schemas",
        description: "Structuring indexes, schemas, and relational models.",
        importance: 90,
        requiredSkills: ["Database Design"],
        aiAutomationPotential: 30,
        aiAugmentationPotential: 60,
        humanValue: 80,
        evidenceConfidence: 85,
        explanation: "Aligning schemas with business transactional behaviors is a high-reasoning task."
      },
      {
        name: "Writing ETL pipeline scripts",
        description: "Writing extract, transform, load scripts.",
        importance: 85,
        requiredSkills: ["Python", "ETL Pipelines"],
        aiAutomationPotential: 70,
        aiAugmentationPotential: 85,
        humanValue: 40,
        evidenceConfidence: 90,
        explanation: "AI generates standard scheduler scripts, but error handling and custom schemas demand data engineers."
      },
      {
        name: "Cloud resource provisioning",
        description: "Deploying data warehouses and virtual cloud configurations.",
        importance: 70,
        requiredSkills: ["Cloud Infrastructure"],
        aiAutomationPotential: 60,
        aiAugmentationPotential: 80,
        humanValue: 40,
        evidenceConfidence: 85,
        explanation: "Terraform and IaC template generation is highly automated."
      }
    ]
  },
  {
    name: "UI/UX Designer",
    description: "Create user interfaces, user flows, and interactive mockups.",
    industry: "Design",
    skills: ["UI Design", "UX Research", "Figma", "Prototyping", "User Empathy", "Visual Design", "Communication"],
    technologies: ["Figma", "Sketch", "Adobe XD", "HTML/CSS"],
    transferableSkills: ["User Empathy", "Visual Design", "Creative Thinking", "Communication"],
    relatedOccupations: ["Software Developer", "Digital Marketer"],
    tasks: [
      {
        name: "Wireframe layout generation",
        description: "Designing interface drafts and blueprints.",
        importance: 75,
        requiredSkills: ["UI Design", "Figma"],
        aiAutomationPotential: 70,
        aiAugmentationPotential: 80,
        humanValue: 40,
        evidenceConfidence: 90,
        explanation: "AI layouts are generated instantly, human designers curate styling to match branding."
      },
      {
        name: "User persona research",
        description: "Researching target user profiles and journeys.",
        importance: 90,
        requiredSkills: ["UX Research", "User Empathy"],
        aiAutomationPotential: 15,
        aiAugmentationPotential: 40,
        humanValue: 90,
        evidenceConfidence: 85,
        explanation: "Requires interviews and observing micro-frustrations, demanding deep human empathy."
      },
      {
        name: "Usability testing analysis",
        description: "Testing mockups and analyzing user click flows.",
        importance: 80,
        requiredSkills: ["UX Research", "Communication"],
        aiAutomationPotential: 30,
        aiAugmentationPotential: 50,
        humanValue: 80,
        evidenceConfidence: 80,
        explanation: "Understanding why users abandon flows requires qualitative cognitive mapping."
      }
    ]
  },
  {
    name: "Accountant",
    description: "Reconcile corporate invoices, file taxes, and ensure ledger accuracy.",
    industry: "Finance",
    skills: ["Accounting Principles", "Excel", "Tax Regulation", "Auditing", "Financial Reporting", "Communication"],
    technologies: ["QuickBooks", "Excel", "SAP", "Xero"],
    transferableSkills: ["Analytical Thinking", "Attention to Detail", "Excel", "Auditing"],
    relatedOccupations: ["Business Analyst", "Financial Analyst", "Data Analyst"],
    tasks: [
      {
        name: "Data entry & ledger logging",
        description: "Logging invoices and receipts into system databases.",
        importance: 70,
        requiredSkills: ["Excel", "Accounting Principles"],
        aiAutomationPotential: 90,
        aiAugmentationPotential: 95,
        humanValue: 10,
        evidenceConfidence: 95,
        explanation: "OCR readers and classification systems automate invoice records mapping with high accuracy."
      },
      {
        name: "Bank reconciliation statement",
        description: "Balancing cash ledgers against bank records.",
        importance: 75,
        requiredSkills: ["Excel"],
        aiAutomationPotential: 85,
        aiAugmentationPotential: 90,
        humanValue: 20,
        evidenceConfidence: 90,
        explanation: "Reconciliation software auto-matches transactions and highlights discrepancies."
      },
      {
        name: "Tax audit preparation",
        description: "Compiling records and assuring compliance with legal standards.",
        importance: 85,
        requiredSkills: ["Tax Regulation", "Auditing"],
        aiAutomationPotential: 40,
        aiAugmentationPotential: 75,
        humanValue: 70,
        evidenceConfidence: 85,
        explanation: "Audit reviews depend on custom legal interpretations and negotiations that need accountants."
      },
      {
        name: "Strategic corporate budgeting",
        description: "Designing annual budgets for team departments.",
        importance: 90,
        requiredSkills: ["Financial Reporting", "Communication"],
        aiAutomationPotential: 20,
        aiAugmentationPotential: 50,
        humanValue: 90,
        evidenceConfidence: 90,
        explanation: "Aligning team resource allocations and risk policies is a collaborative human exercise."
      }
    ]
  },
  {
    name: "Customer Support Specialist",
    description: "Handle customer support inquiries, debug client issues, and ensure client satisfaction.",
    industry: "Customer Success",
    skills: ["Communication", "Conflict Resolution", "User Empathy", "Problem Solving", "Product Support"],
    technologies: ["Zendesk", "Intercom", "Jira", "Excel"],
    transferableSkills: ["Communication", "User Empathy", "Conflict Resolution", "Problem Solving"],
    relatedOccupations: ["Business Analyst", "UI/UX Designer"],
    tasks: [
      {
        name: "Answering FAQs",
        description: "Handling routine user support questions.",
        importance: 70,
        requiredSkills: ["Product Support"],
        aiAutomationPotential: 90,
        aiAugmentationPotential: 95,
        humanValue: 10,
        evidenceConfidence: 95,
        explanation: "AI search engines handle standard documentation lookups with minimal error."
      },
      {
        name: "De-escalating angry customers",
        description: "De-escalating customer complaints.",
        importance: 90,
        requiredSkills: ["Communication", "Conflict Resolution", "User Empathy"],
        aiAutomationPotential: 15,
        aiAugmentationPotential: 30,
        humanValue: 95,
        evidenceConfidence: 90,
        explanation: "Requires emotional connection, trust, and human de-escalation skills."
      }
    ]
  },
  {
    name: "Business Analyst",
    description: "Gather business requirements, analyze processes, and draft functional specifications.",
    industry: "Management",
    skills: ["Requirement Gathering", "Process Mapping", "Communication", "Agile Methodologies", "Stakeholder Management"],
    technologies: ["Jira", "Visio", "Excel", "Confluence", "Miro"],
    transferableSkills: ["Communication", "Analytical Thinking", "Stakeholder Management", "Problem Solving"],
    relatedOccupations: ["Data Analyst", "Software Developer", "Accountant"],
    tasks: [
      {
        name: "Documenting user stories",
        description: "Drafting developer-ready user stories.",
        importance: 75,
        requiredSkills: ["Agile Methodologies", "Process Mapping"],
        aiAutomationPotential: 75,
        aiAugmentationPotential: 85,
        humanValue: 35,
        evidenceConfidence: 85,
        explanation: "AI generates functional story templates easily, but scoping requires analyst review."
      },
      {
        name: "Stakeholder interviews",
        description: "Gathering requirement feedback from business leaders.",
        importance: 95,
        requiredSkills: ["Requirement Gathering", "Communication", "Stakeholder Management"],
        aiAutomationPotential: 15,
        aiAugmentationPotential: 30,
        humanValue: 95,
        evidenceConfidence: 90,
        explanation: "Navigating corporate relationships and eliciting business needs is a human-only task."
      }
    ]
  },
  {
    name: "Digital Marketer",
    description: "Build search optimization models, create advertising copy, and run email marketing operations.",
    industry: "Marketing",
    skills: ["SEO", "Content Strategy", "Google Analytics", "Copywriting", "Campaign Management", "Communication"],
    technologies: ["Google Ads", "Mailchimp", "SEMrush", "Google Analytics"],
    transferableSkills: ["Creative Thinking", "Communication", "Data Interpretation", "User Empathy"],
    relatedOccupations: ["UI/UX Designer", "Business Analyst"],
    tasks: [
      {
        name: "Drafting ad copy & social posts",
        description: "Writing ad copy templates.",
        importance: 75,
        requiredSkills: ["Copywriting", "Content Strategy"],
        aiAutomationPotential: 80,
        aiAugmentationPotential: 90,
        humanValue: 30,
        evidenceConfidence: 95,
        explanation: "Generative AI produces copywriting choices, human editors select to ensure brand style compliance."
      },
      {
        name: "Brand strategy formulation",
        description: "Designing company positioning and brand strategy.",
        importance: 90,
        requiredSkills: ["Content Strategy", "Communication"],
        aiAutomationPotential: 15,
        aiAugmentationPotential: 40,
        humanValue: 90,
        evidenceConfidence: 85,
        explanation: "Constructing brand voices requires deep cultural contexts and long-term customer empathy."
      }
    ]
  }
];

const seedOccupations = async () => {
  try {
    console.log("[Seeder] Clearing old occupations and skills...");
    await Occupation.deleteMany({});
    await Skill.deleteMany({});

    console.log("[Seeder] Seeding Skill definitions...");
    await Skill.insertMany(seedSkillsData);

    console.log("[Seeder] Seeding Occupation dataset...");
    await Occupation.insertMany(seedOccupationsData);

    console.log("[Seeder] Seed process completed successfully.");
  } catch (err) {
    console.error("[Seeder] Seed failed:", err);
  }
};

module.exports = seedOccupations;
