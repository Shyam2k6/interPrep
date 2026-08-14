const Roadmap = require("../models/Roadmap");
const groq = require("./groq");

const estimateStudyTime = (title) => {
  if (!title) return 30;
  const lowerTitle = title.toLowerCase();
  const highKeywords = ["build", "implement", "master", "advanced", "configure", "deploy", "design", "architecture", "deep", "optimize", "structure", "custom", "testing", "security", "auth", "integration"];
  const lowKeywords = ["setup", "install", "intro", "introduction", "overview", "hello", "start", "basic", "basics", "prerequisites"];

  const hasHigh = highKeywords.some(keyword => lowerTitle.includes(keyword));
  const hasLow = lowKeywords.some(keyword => lowerTitle.includes(keyword));

  if (hasHigh) return 60;
  if (hasLow) return 15;
  return 30;
};

const enrichStepsWithAI = async (steps, roadmapTitle) => {
  if (!steps || !Array.isArray(steps) || steps.length === 0) return steps;

  try {
    const prompt = `
Given the learning roadmap title "${roadmapTitle}" and the following steps:
${JSON.stringify(steps.map((s) => ({ title: s.title })), null, 2)}

Provide descriptions, exactly 1 highly trusted official documentation resource URL, and estimated requiredTime in minutes for each step.
Return ONLY valid JSON matching this format:
[
  {
    "title": "Step Title (must match exactly)",
    "description": "Short explanation of what concepts should be studied",
    "requiredTime": 30,
    "resources": [
      {
        "title": "Official Documentation Name (e.g., MDN Web Docs, React Official Docs, Express API Reference)",
        "url": "Must be a stable, verified official documentation link or search query URL that NEVER 404s. Do NOT use deep sub-paths that can break. Prefer official landing pages (e.g. https://react.dev/reference/react) or search queries on the official documentation site (e.g. https://developer.mozilla.org/en-US/search?q=javascript+array+map or https://mongoosejs.com/docs/search.html). Do NOT link to blogs, video tutorials, or unofficial articles.",
        "type": "documentation"
      }
    ]
  }
]

Provide an estimated study duration in 'requiredTime' (integer in minutes). Calculate this based on the difficulty and complexity of the step's topic (e.g., 15 minutes for basic installations, setups, or intros; 30-45 minutes for standard core concepts/APIs; and 60-90 minutes for complex implementations, integrations, architectures, or debugging).
Do not include markdown or explanations.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert learning resources generator.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
    });

    let resContent = completion.choices[0].message.content;
    resContent = resContent
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const enriched = JSON.parse(resContent);

    const enrichedSteps = steps.map((step) => {
      const match = enriched.find(
        (e) => e.title.toLowerCase() === step.title.toLowerCase()
      );
      if (match) {
        return {
          title: step.title,
          completed: step.completed || false,
          description: match.description || step.description,
          resources: match.resources && match.resources.length > 0 ? match.resources : step.resources,
          timeSpent: step.timeSpent || 0,
          requiredTime: match.requiredTime || estimateStudyTime(step.title),
        };
      }
      return step;
    });

    const { verifyAndFilterResources } = require("./urlVerifier");
    return await verifyAndFilterResources(enrichedSteps);
  } catch (err) {
    console.error("Migration AI enrichment error:", err);
    return steps;
  }
};

const runMigration = async () => {
  try {
    console.log("[Migration] Checking for roadmaps missing verified stable resources...");
    const roadmaps = await Roadmap.find({ migratedResourcesV3: { $ne: true } });

    for (let roadmap of roadmaps) {
      console.log(`[Migration] Enriching roadmap "${roadmap.title}" with stable, verified official documentation resources and requiredTime...`);
      const enrichedSteps = await enrichStepsWithAI(roadmap.steps, roadmap.title);

      roadmap.steps = roadmap.steps.map((origStep, idx) => {
        const enrichedStep = enrichedSteps[idx];
        if (enrichedStep) {
          origStep.description = enrichedStep.description || origStep.description;
          origStep.resources =
            enrichedStep.resources && enrichedStep.resources.length > 0
              ? enrichedStep.resources
              : origStep.resources;
          origStep.requiredTime = enrichedStep.requiredTime || origStep.requiredTime || 15;
        }
        return origStep;
      });

      roadmap.migratedResourcesV3 = true;
      await roadmap.save();
      console.log(`[Migration] Successfully enriched and verified roadmap "${roadmap.title}"`);
    }
    console.log("[Migration] Check completed.");
    
    // Seed Career Intelligence dataset
    const seedCareerIntelligence = require("./seedCareerIntelligence");
    await seedCareerIntelligence();
  } catch (err) {
    console.error("[Migration] Failed to run database enrichment:", err);
  }
};

module.exports = { runMigration };
