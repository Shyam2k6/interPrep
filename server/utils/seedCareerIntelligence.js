const mongoose = require("mongoose");
const Occupation = require("../models/Occupation");
const Skill = require("../models/Skill");

const seedSkillsData = [
  // Core Skills
  { name: "Git/GitHub", category: "Digital", demandTrend: "stable", aiRelevance: "Essential version control tool. Co-authoring changes with AI still requires conflict resolution and manual commits." },
  { name: "Data Structures", category: "Technical", demandTrend: "stable", aiRelevance: "Coding logic structures are fully automated, but choosing optimal memory models is human engineering." },
  { name: "APIs", category: "Technical", demandTrend: "stable", aiRelevance: "AI scripts endpoint connections, but designing robust API architectures is resistant." },
  { name: "System Design", category: "Technical", demandTrend: "increasing", aiRelevance: "Extremely AI-resistant. Architects must align business constraints, scalability, and security." },
  { name: "JavaScript", category: "Programming", demandTrend: "stable", aiRelevance: "AI generates clean JS scripts, but developers audit memory leaks and state updates." },
  { name: "Python", category: "Programming", demandTrend: "increasing", aiRelevance: "Language of AI. Syntactic programming is automated, focus changes to library integration." },
  { name: "SQL", category: "Programming", demandTrend: "stable", aiRelevance: "AI writes queries instantly. Human DBA skills in index tuning and relational mapping are crucial." },
  { name: "Excel", category: "Digital", demandTrend: "decreasing", aiRelevance: "Copilots calculate formulas; humans audit sheet outputs." },
  { name: "Data Interpretation", category: "Analytical", demandTrend: "increasing", aiRelevance: "Synthesizing raw metrics into strategic business actions requires human context." },
  { name: "Statistics", category: "Analytical", demandTrend: "stable", aiRelevance: "AI fits regressions in seconds. Human analyst verifies model assumptions and bias." },
  { name: "Figma", category: "Digital", demandTrend: "stable", aiRelevance: "Design systems are auto-populated. Humans align components for aesthetic harmony." },
  { name: "UI Design", category: "Creative", demandTrend: "stable", aiRelevance: "AI constructs grid options; humans design visual hierarchies." },
  { name: "UX Research", category: "Analytical", demandTrend: "increasing", aiRelevance: "Highly resistant. Conducting user interviews requires empathy and active listening." },
  { name: "Prototyping", category: "Creative", demandTrend: "stable", aiRelevance: "Dynamic flow creation is assisted by layout copilots." },
  { name: "Bash", category: "Programming", demandTrend: "stable", aiRelevance: "Shell scripts are fully AI-generated; humans check security context." },
  { name: "Docker", category: "Digital", demandTrend: "stable", aiRelevance: "Containerizing services is automated; managing cluster environments remains manual." },
  { name: "Linux Administration", category: "Technical", demandTrend: "stable", aiRelevance: "Standard commands are automated, security patching and kernel tune-ups are human." },
  { name: "Google Analytics", category: "Digital", demandTrend: "stable", aiRelevance: "Metrics dashboards compile reports; humans formulate campaign adjustments." },
  { name: "SEO Fundamentals", category: "Digital", demandTrend: "stable", aiRelevance: "Keyword analysis is automated; creating culturally resonant content is human." },
  { name: "Campaign Budgeting", category: "Management", demandTrend: "stable", aiRelevance: "AI bid algorithms optimize budget, marketers align spend with strategic business goals." },

  // AI-Augmented Skills
  { name: "Code Generation", category: "AI", demandTrend: "increasing", aiRelevance: "Prompting code snippets to make programming faster." },
  { name: "Debugging", category: "Technical", demandTrend: "stable", aiRelevance: "AI analyzes error dumps instantly, but tracing complex race conditions is human." },
  { name: "Automated Testing", category: "Testing", demandTrend: "increasing", aiRelevance: "Test cases are AI-written, developers verify coverage boundaries." },
  { name: "Refactoring", category: "Technical", demandTrend: "stable", aiRelevance: "AI rewrites block functions for cleanliness; humans manage codebase scope changes." },
  { name: "Data Cleaning", category: "Data", demandTrend: "increasing", aiRelevance: "AI scripts handle standard null entries and data format parses." },
  { name: "Data Visualization", category: "Analytical", demandTrend: "increasing", aiRelevance: "Visual charts are generated; marking corporate story focus is manual." },
  { name: "Writing SQL Queries", category: "Programming", demandTrend: "stable", aiRelevance: "Copilots generate queries from natural language text." },
  { name: "Visual Layout Design", category: "Creative", demandTrend: "stable", aiRelevance: "Generating design options via prompt systems." },
  { name: "Design System Maintenance", category: "Digital", demandTrend: "stable", aiRelevance: "AI syncs vector tokens and styles across prototypes." },
  { name: "Writing IaC Scripts", category: "Technical", demandTrend: "increasing", aiRelevance: "Terraform/CloudFormation scripts are generated by coding copilots." },
  { name: "Automating Pipelines", category: "Technical", demandTrend: "stable", aiRelevance: "Standard CD script tasks are written by AI assistants." },
  { name: "Observability Alerts", category: "Technical", demandTrend: "stable", aiRelevance: "AI scans cluster metrics and dynamically sets alerts thresholds." },
  { name: "Ad Copywriting", category: "Creative", demandTrend: "decreasing", aiRelevance: "Large volumes of variations are auto-generated; humans review brand voice." },
  { name: "Keyword Matching", category: "Digital", demandTrend: "stable", aiRelevance: "AI selects optimal keywords for campaign setups." },
  { name: "Social Media Graphics", category: "Creative", demandTrend: "stable", aiRelevance: "Visual ad banners are generated by AI text-to-image systems." },

  // Emerging AI Skills
  { name: "LLM APIs", category: "AI", demandTrend: "increasing", aiRelevance: "Connecting applications to cloud models via structured endpoints." },
  { name: "RAG (Retrieval Augmentation)", category: "AI", demandTrend: "increasing", aiRelevance: "Grounding LLM reasoning using custom data store directories." },
  { name: "AI Application Architecture", category: "AI", demandTrend: "increasing", aiRelevance: "Designing systems utilizing agents, vector indexes, and LLM orchestration." },
  { name: "AI Evaluation", category: "AI", demandTrend: "increasing", aiRelevance: "Testing AI outputs for hallucinations, accuracy, and latency." },
  { name: "AI Security", category: "AI", demandTrend: "increasing", aiRelevance: "Preventing prompt injection attacks and securing LLM API keys." },
  { name: "AI-powered Analytics Tools", category: "AI", demandTrend: "increasing", aiRelevance: "Querying raw databases via natural language prompts." },
  { name: "Vector Database Indexing", category: "AI", demandTrend: "increasing", aiRelevance: "Formatting and managing high-dimensional data embeddings." },
  { name: "Retrieval pipelines", category: "AI", demandTrend: "increasing", aiRelevance: "Optimizing document search paths for prompt injections context." },
  { name: "Generative UI Tools", category: "AI", demandTrend: "increasing", aiRelevance: "Creating layout codes via prompt interfaces." },
  { name: "AI-assisted UX Analytics", category: "AI", demandTrend: "increasing", aiRelevance: "Analyzing user behavior records utilizing cluster tools." },
  { name: "Prompt-to-Prototype tools", category: "AI", demandTrend: "increasing", aiRelevance: "Drafting design components instantly via text instructions." },
  { name: "IaC Copilots", category: "AI", demandTrend: "increasing", aiRelevance: "Generating network configurations via visual copilots." },
  { name: "AI Observability & Log Auditing", category: "AI", demandTrend: "increasing", aiRelevance: "Scanning server crash dumps with contextual assistants." },
  { name: "Self-healing Systems", category: "AI", demandTrend: "increasing", aiRelevance: "Scripting systems that auto-recover using AI-driven alerts." },
  { name: "AI SEO Optimization", category: "AI", demandTrend: "increasing", aiRelevance: "Adapting markup copy for LLM search agents." },
  { name: "Generative Creative Tools", category: "AI", demandTrend: "increasing", aiRelevance: "Generating dynamic advertising banners on client sides." },
  { name: "Automated Ad Targeting", category: "AI", demandTrend: "increasing", aiRelevance: "AI-driven customer segmentation setups." },

  // Human-Centric Skills
  { name: "Problem Solving", category: "Problem Solving", demandTrend: "stable", aiRelevance: "Evaluating logic boundaries and reasoning through edge-case conflicts." },
  { name: "Requirements Gathering", category: "Analytical", demandTrend: "increasing", aiRelevance: "Understanding and extracting corporate goals via user interviews." },
  { name: "Communication", category: "Communication", demandTrend: "stable", aiRelevance: "Building team trust and aligning stakeholders." },
  { name: "Engineering Judgment", category: "Problem Solving", demandTrend: "increasing", aiRelevance: "Deciding engineering architectural trade-offs." },
  { name: "User Empathy", category: "Creative", demandTrend: "increasing", aiRelevance: "AI cannot feel; user relationship discovery is human-only." },
  { name: "Visual Aesthetics Review", category: "Creative", demandTrend: "stable", aiRelevance: "Critiquing UI styles for alignment with human tastes." },
  { name: "Design Ethics", category: "Domain", demandTrend: "increasing", aiRelevance: "Preventing deceptive layouts or dark pattern choices." },
  { name: "Product Strategy", category: "Management", demandTrend: "increasing", aiRelevance: "Grounded product positioning assessments." },
  { name: "System Reliability Judgment", category: "Problem Solving", demandTrend: "increasing", aiRelevance: "Deciding high-risk system scaling configurations." },
  { name: "Disaster Recovery Strategy", category: "Domain", demandTrend: "stable", aiRelevance: "Designing systems that survive hardware fails." },
  { name: "Architecture Security", category: "Security", demandTrend: "increasing", aiRelevance: "Enforcing zero-trust network setups." },
  { name: "Brand Strategy", category: "Creative", demandTrend: "increasing", aiRelevance: "Defining unique brand styles and values." },
  { name: "Emotional Messaging", category: "Communication", demandTrend: "increasing", aiRelevance: "Connecting with consumers via authentic messaging." },
  { name: "Cultural Resonance", category: "Creative", demandTrend: "stable", aiRelevance: "Checking ad styles against local behaviors." },
  { name: "Customer Insight", category: "Analytical", demandTrend: "increasing", aiRelevance: "Interpreting qualitative user responses." },
];

const seedOccupationsData = [
  {
    name: "Software Developer",
    description: "Design, build, deploy, and maintain custom applications and platforms.",
    industry: "Technology",
    coreSkills: ["Git/GitHub", "Data Structures", "APIs", "System Design", "JavaScript", "Python"],
    aiAugmentedSkills: ["Code Generation", "Debugging", "Automated Testing", "Refactoring"],
    emergingSkills: ["LLM APIs", "RAG (Retrieval Augmentation)", "AI Application Architecture", "AI Evaluation", "AI Security"],
    humanCentricSkills: ["System Design", "Problem Solving", "Requirements Gathering", "Communication", "Engineering Judgment"],
    technologies: ["Node.js", "React", "MongoDB", "Express", "Docker", "AWS"],
    timeline: [
      { phaseName: "Traditional Development", description: "Manual coding, focus on raw syntax, algorithms, and local computer build runs." },
      { phaseName: "Web & Cloud Era", description: "Focus on API connections, distributed servers, databases, and microservices." },
      { phaseName: "AI-Assisted Engineering", description: "Writing code alongside Copilot/ChatGPT; developers pivot to validation, safety, and AI API integrations." }
    ],
    tasks: [
      {
        name: "Writing Application Logic",
        description: "Writing boilerplate components, routes, and structural application code.",
        aiImpact: 85,
        automationPotential: 80,
        augmentationPotential: 90,
        humanImportance: 40,
        futureImportance: 50,
        explanation: "AI coding copilots easily generate boilerplate codes and simple logic routes. Software developers shift focus to code reviews, overall software reliability, and system integration.",
        confidence: "High"
      },
      {
        name: "Application System Design",
        description: "Designing the components relationships, databases schemas, and network interactions.",
        aiImpact: 45,
        automationPotential: 30,
        augmentationPotential: 75,
        humanImportance: 90,
        futureImportance: 95,
        explanation: "AI assistants suggest configurations, but human judgment remains essential for navigating trade-offs in scalability, network costs, and custom security requirements.",
        confidence: "High"
      },
      {
        name: "AI API Integration & RAG",
        description: "Connecting databases and files to LLM endpoints to build context-aware features.",
        aiImpact: 90,
        automationPotential: 20,
        augmentationPotential: 85,
        humanImportance: 80,
        futureImportance: 95,
        explanation: "Developing context retrieval systems (RAG) and model integrations is a high-growth field requiring developers to build custom retrieval logic.",
        confidence: "High"
      }
    ]
  },
  {
    name: "Data Analyst",
    description: "Inspect, clean, and model database statistics to discover business insights.",
    industry: "Business Intelligence",
    coreSkills: ["SQL", "Excel", "Data Interpretation", "Statistics"],
    aiAugmentedSkills: ["Data Cleaning", "Data Visualization", "Writing SQL Queries"],
    emergingSkills: ["AI-powered Analytics Tools", "Vector Database Indexing", "Retrieval pipelines"],
    humanCentricSkills: ["Critical Interpretation", "Communication", "Stakeholder Alignment"],
    technologies: ["Power BI", "Tableau", "Pandas", "PostgreSQL"],
    timeline: [
      { phaseName: "Ledger Sheets", description: "Physical ledgers and manual calculations." },
      { phaseName: "SQL & Visualization", description: "Databases, visualization dashboards (Tableau/Power BI), and automatic daily reports." },
      { phaseName: "Conversational Analytics", description: "AI handles database querying and charts; analysts explain business context, audit statistical biases, and direct strategies." }
    ],
    tasks: [
      {
        name: "Writing SQL Queries",
        description: "Extracting columns and metrics from database structures.",
        aiImpact: 85,
        automationPotential: 80,
        augmentationPotential: 85,
        humanImportance: 30,
        futureImportance: 40,
        explanation: "Natural language translation scripts generate standard SQL queries. Analysts focus on verifying data dictionary models and schema logic checks.",
        confidence: "High"
      },
      {
        name: "Strategic Insight Synthesis",
        description: "Explaining data trends and making recommendations to company executives.",
        aiImpact: 35,
        automationPotential: 20,
        augmentationPotential: 70,
        humanImportance: 95,
        futureImportance: 98,
        explanation: "AI identifies numerical correlations, but humans are required to separate noise from strategic business realities and explain choices to stakeholders.",
        confidence: "High"
      }
    ]
  },
  {
    name: "UI/UX Designer",
    description: "Create visual designs and user experience flows for software platforms.",
    industry: "Design",
    coreSkills: ["Figma", "UI Design", "UX Research", "Prototyping"],
    aiAugmentedSkills: ["Visual Layout Design", "Prototyping", "Design System Maintenance"],
    emergingSkills: ["Generative UI Tools", "AI-assisted UX Analytics", "Prompt-to-Prototype tools"],
    humanCentricSkills: ["User Empathy", "Visual Aesthetics Review", "Design Ethics", "Product Strategy"],
    technologies: ["Figma", "Adobe CC", "Miro", "Framer"],
    timeline: [
      { phaseName: "Print & Graphic Art", description: "Designing static graphic components in Photoshop or Illustrator." },
      { phaseName: "Component Systems", description: "Design systems, vector layouts, and responsive interaction mockups in Figma." },
      { phaseName: "AI Design Co-creation", description: "AI tools generate layouts from text prompts; designers focus on user testing, accessibility audits, and design psychology." }
    ],
    tasks: [
      {
        name: "Aesthetic Layout Mocking",
        description: "Arranging buttons, menus, and typography blocks inside design components.",
        aiImpact: 78,
        automationPotential: 70,
        augmentationPotential: 80,
        humanImportance: 45,
        futureImportance: 60,
        explanation: "Generative UI platforms create page layouts instantly. Designers act as directors, checking alignments and editing visual styles for branding cohesion.",
        confidence: "High"
      },
      {
        name: "User Empathy Interviews",
        description: "Conducting user focus interviews to map customer pain points and behaviors.",
        aiImpact: 20,
        automationPotential: 10,
        augmentationPotential: 50,
        humanImportance: 95,
        futureImportance: 98,
        explanation: "Discovering customer behaviors and feeling emotional pain points requires genuine human empathy. AI can transcribe and tag sentiment, but cannot build human rapport.",
        confidence: "High"
      }
    ]
  },
  {
    name: "DevOps Engineer",
    description: "Manage deployment pipelines, cloud servers, and application uptime.",
    industry: "Technology",
    coreSkills: ["Bash", "Docker", "Linux Administration", "Git/GitHub"],
    aiAugmentedSkills: ["Writing IaC Scripts", "Automating Pipelines", "Observability Alerts"],
    emergingSkills: ["IaC Copilots", "AI Observability & Log Auditing", "Self-healing Systems"],
    humanCentricSkills: ["System Reliability Judgment", "Disaster Recovery Strategy", "Architecture Security"],
    technologies: ["Terraform", "Kubernetes", "AWS", "GitHub Actions", "Prometheus"],
    timeline: [
      { phaseName: "Bare Metal Servers", description: "Installing operating systems on actual rack servers in local server rooms." },
      { phaseName: "Infrastructure as Code", description: "Virtual servers, AWS resources, and automated deployment script files." },
      { phaseName: "AI-driven Operations", description: "AI monitors cluster logs and scripts routine fixes; engineers design secure configurations and system rules." }
    ],
    tasks: [
      {
        name: "Writing Infrastructure Scripts",
        description: "Writing scripts to provision resources (like AWS S3 buckets or VPC networks).",
        aiImpact: 80,
        automationPotential: 75,
        augmentationPotential: 85,
        humanImportance: 45,
        futureImportance: 50,
        explanation: "Coding models generate standard IaC configuration scripts. Engineers review structural layouts and manage identity profiles.",
        confidence: "High"
      },
      {
        name: "Anomalous Debugging & Recovery",
        description: "Fixing system crashes during server alerts.",
        aiImpact: 50,
        automationPotential: 40,
        augmentationPotential: 80,
        humanImportance: 85,
        futureImportance: 90,
        explanation: "AI analyzes error dumps and recommends solutions, but engineers evaluate recovery strategies under high-stress business downtime.",
        confidence: "High"
      }
    ]
  },
  {
    name: "Digital Marketer",
    description: "Plan, run, and optimize online advertising campaigns to acquire customers.",
    industry: "Marketing",
    coreSkills: ["Google Analytics", "SEO Fundamentals", "Campaign Budgeting"],
    aiAugmentedSkills: ["Ad Copywriting", "Keyword Matching", "Social Media Graphics"],
    emergingSkills: ["AI SEO Optimization", "Generative Creative Tools", "Automated Ad Targeting"],
    humanCentricSkills: ["Brand Strategy", "Emotional Messaging", "Cultural Resonance", "Customer Insight"],
    technologies: ["Meta Ads Manager", "Google Ads", "GA4", "Mailchimp"],
    timeline: [
      { phaseName: "Print & TV Media", description: "Billboards, static copywriting, and physical layouts." },
      { phaseName: "Pay-Per-Click & SEO", description: "Keyword matching, bidding campaigns, and analytics metrics checking." },
      { phaseName: "Algorithmic & Generative Marketing", description: "AI auto-generates content calendars and bid optimization; marketers manage overall brand ethics and strategy." }
    ],
    tasks: [
      {
        name: "Ad Copywriting",
        description: "Writing short visual text copies for campaigns.",
        aiImpact: 88,
        automationPotential: 80,
        augmentationPotential: 90,
        humanImportance: 35,
        futureImportance: 40,
        explanation: "Language models generate thousands of ad hooks. Marketers edit suggestions to protect brand identity and authenticity.",
        confidence: "High"
      },
      {
        name: "Brand Integrity & Strategy",
        description: "Setting company brand guidelines and target audience focus.",
        aiImpact: 25,
        automationPotential: 15,
        augmentationPotential: 60,
        humanImportance: 95,
        futureImportance: 98,
        explanation: "Protecting company brand trust and designing creative campaign concepts require cultural insight and deep ethical judgment.",
        confidence: "High"
      }
    ]
  }
];

const seedCareerIntelligence = async () => {
  try {
    console.log("[Seeder] Connecting to database for Career Intelligence...");
    // Clear legacy collections
    await Occupation.deleteMany({});
    await Skill.deleteMany({});

    console.log("[Seeder] Inserting Curated AI-Era Skills Portfolio...");
    await Skill.insertMany(seedSkillsData);

    console.log("[Seeder] Inserting Curated Career Evolution Datasets...");
    await Occupation.insertMany(seedOccupationsData);

    console.log("[Seeder] Database successfully seeded with Career Intelligence records.");
  } catch (err) {
    console.error("[Seeder] Career Intelligence seed process failed:", err);
    throw err;
  }
};

module.exports = seedCareerIntelligence;
