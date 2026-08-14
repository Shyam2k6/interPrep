// Deterministic service for Career Intelligence scoring, gap analysis, and AI Readiness calculations

/**
 * Calculates the skill gaps between user skills and career skills
 * @param {Array} userSkills - Array of { name, proficiency }
 * @param {Array} careerSkills - Array of skill names (strings)
 * @returns {Object} - Detailed gaps and average gap percentage
 */
exports.calculateSkillGap = (userSkills = [], careerSkills = []) => {
  const userSkillMap = {};
  userSkills.forEach((s) => {
    userSkillMap[s.name.toLowerCase()] = s.proficiency;
  });

  const gaps = careerSkills.map((skillName) => {
    const userProf = userSkillMap[skillName.toLowerCase()] || 0;
    const requiredProf = 75; // Standard targeted threshold
    const gap = Math.max(0, requiredProf - userProf);

    return {
      name: skillName,
      required: requiredProf,
      current: userProf,
      gap,
    };
  });

  const totalGapsVal = gaps.reduce((sum, g) => sum + g.gap, 0);
  const averageGap = gaps.length > 0 ? Math.round(totalGapsVal / gaps.length) : 0;

  return {
    gaps,
    averageGap,
  };
};

/**
 * Deterministically calculates a prioritized next-steps ranking
 * @param {Number} gap - Skill gap value
 * @returns {String} - "HIGH", "MEDIUM", or "LOW"
 */
exports.calculateSkillPriority = (gap) => {
  if (gap >= 50) return "HIGH";
  if (gap >= 20) return "MEDIUM";
  return "LOW";
};

/**
 * Calculates 6-factor AI Readiness Score out of 100
 * @param {Object} profile - User CareerProfile
 * @param {Object} occupationDetails - Curated Occupation dataset details
 * @param {Number} roadmapProgress - Active transition roadmap progress (0-100)
 * @param {Number} completedProjectsCount - Count of relevant projects built
 * @param {Number} quizAverage - Average quiz assessment score
 * @returns {Object} - readinessScore and breakdowns
 */
exports.calculateAIReadiness = (profile, occupationDetails, roadmapProgress = 0, completedProjectsCount = 0, quizAverage = 0) => {
  if (!profile || !occupationDetails) {
    return {
      aiReadinessScore: 0,
      aiReadinessBreakdown: {
        coreCareerSkills: 0,
        aiAssistedWorkflow: 0,
        aiApplicationSkills: 0,
        aiEvaluation: 0,
        aiSecurity: 0,
        projects: 0,
      },
    };
  }

  const userSkillMap = {};
  profile.skills.forEach((s) => {
    userSkillMap[s.name.toLowerCase()] = s.proficiency;
  });

  const averageProficiency = (skillsList) => {
    if (!skillsList || skillsList.length === 0) return 30; // Baseline default
    const sum = skillsList.reduce((acc, name) => acc + (userSkillMap[name.toLowerCase()] || 0), 0);
    return Math.round(sum / skillsList.length);
  };

  // 1. Core Career Foundation (30% weight)
  const coreVal = averageProficiency(occupationDetails.coreSkills || []);

  // 2. AI-Assisted Workflow (20% weight)
  const assistedVal = averageProficiency(occupationDetails.aiAugmentedSkills || []);

  // 3. AI Integration Skills (20% weight)
  const integrationVal = averageProficiency(
    (occupationDetails.emergingSkills || []).filter(
      (name) => !name.toLowerCase().includes("security") && !name.toLowerCase().includes("eval")
    )
  );

  // 4. AI Evaluation & Reliability (10% weight)
  // Look for evaluation/testing skills in emerging list or average of assessment score
  const evalSkills = (occupationDetails.emergingSkills || []).filter((name) =>
    name.toLowerCase().includes("eval") || name.toLowerCase().includes("test")
  );
  const evalVal = evalSkills.length > 0 ? averageProficiency(evalSkills) : quizAverage || 40;

  // 5. AI Security (10% weight)
  const secSkills = (occupationDetails.emergingSkills || []).filter((name) =>
    name.toLowerCase().includes("security") || name.toLowerCase().includes("safety")
  );
  const secVal = secSkills.length > 0 ? averageProficiency(secSkills) : 35;

  // 6. AI Projects (10% weight)
  // Scale with project counts and roadmap completion progress
  const projectsVal = Math.min(100, (completedProjectsCount * 30) + (roadmapProgress * 0.4));

  // Compute weighted sum
  const aiReadinessScore = Math.round(
    (coreVal * 0.30) +
    (assistedVal * 0.20) +
    (integrationVal * 0.20) +
    (evalVal * 0.10) +
    (secVal * 0.10) +
    (projectsVal * 0.10)
  );

  return {
    aiReadinessScore: Math.min(100, Math.max(0, aiReadinessScore)),
    aiReadinessBreakdown: {
      coreCareerSkills: coreVal,
      aiAssistedWorkflow: assistedVal,
      aiApplicationSkills: integrationVal,
      aiEvaluation: Math.round(evalVal),
      aiSecurity: Math.round(secVal),
      projects: Math.round(projectsVal),
    },
  };
};
