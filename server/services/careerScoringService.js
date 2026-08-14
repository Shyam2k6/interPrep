// Scoring engine for SkillShift Career Transition Intelligence

// Configurable weights for Career Readiness Index (CRI)
const READINESS_WEIGHTS = {
  skillMastery: 0.35,
  transferableSkills: 0.15,
  projects: 0.15,
  assessment: 0.15,
  learningProgress: 0.10,
  interviewPrep: 0.10,
};

// Target proficiency level for required career skills
const TARGET_PROFICIENCY = 75;

/**
 * Calculates skill gaps between user skills and target required skills
 * @param {Array} userSkills - Array of { name: String, proficiency: Number }
 * @param {Array} requiredSkills - Array of Strings representing required skill names
 */
const calculateSkillGap = (userSkills = [], requiredSkills = []) => {
  if (!requiredSkills || requiredSkills.length === 0) {
    return { gaps: [], averageGap: 0 };
  }

  let totalGap = 0;
  const gaps = requiredSkills.map((reqSkillName) => {
    const matchedUserSkill = userSkills.find(
      (us) => us.name.toLowerCase() === reqSkillName.toLowerCase()
    );

    const userProf = matchedUserSkill ? matchedUserSkill.proficiency : 0;
    const gapVal = Math.max(0, TARGET_PROFICIENCY - userProf);
    totalGap += gapVal;

    return {
      name: reqSkillName,
      required: TARGET_PROFICIENCY,
      current: userProf,
      gap: gapVal,
    };
  });

  const averageGap = Math.round(totalGap / requiredSkills.length);
  return { gaps, averageGap };
};

/**
 * Calculates how many required skills the user already possesses (proficiency > 20)
 */
const calculateSkillOverlap = (userSkills = [], requiredSkills = []) => {
  if (!requiredSkills || requiredSkills.length === 0) return 0;

  const overlappingCount = requiredSkills.filter((reqSkillName) => {
    const matched = userSkills.find(
      (us) => us.name.toLowerCase() === reqSkillName.toLowerCase()
    );
    return matched && matched.proficiency > 20;
  }).length;

  return Math.round((overlappingCount / requiredSkills.length) * 100);
};

/**
 * Calculates the Career Fit Score (0-100)
 * Fit = (SkillOverlap * 0.6) + (InterestAlignment * 0.4)
 */
const calculateCareerFit = (
  userSkills = [],
  requiredSkills = [],
  userInterests = [],
  targetName = "",
  targetIndustry = ""
) => {
  const overlap = calculateSkillOverlap(userSkills, requiredSkills);

  // Calculate Interest Alignment
  let interestMatchCount = 0;
  if (userInterests && userInterests.length > 0) {
    userInterests.forEach((interest) => {
      const lowerInterest = interest.toLowerCase();
      if (
        targetName.toLowerCase().includes(lowerInterest) ||
        targetIndustry.toLowerCase().includes(lowerInterest)
      ) {
        interestMatchCount++;
      }
    });
  }

  const interestScore =
    userInterests.length > 0
      ? Math.round((interestMatchCount / userInterests.length) * 100)
      : 50; // Neutral fallback if no preferences set

  const fitScore = Math.round(overlap * 0.6 + interestScore * 0.4);
  return Math.min(100, Math.max(0, fitScore));
};

/**
 * Calculates Transition Distance (0-100) and maps to a label
 * Distance = (AverageSkillGap * 0.7) + (MissingPrerequisites * 0.3)
 */
const calculateTransitionDistance = (userSkills = [], requiredSkills = []) => {
  const { averageGap } = calculateSkillGap(userSkills, requiredSkills);
  
  // Estimate missing prerequisites (skills with 0 proficiency)
  const missingCount = requiredSkills.filter((reqSkillName) => {
    const matched = userSkills.find(
      (us) => us.name.toLowerCase() === reqSkillName.toLowerCase()
    );
    return !matched || matched.proficiency === 0;
  }).length;

  const missingRatioScore =
    requiredSkills.length > 0 ? (missingCount / requiredSkills.length) * 100 : 0;

  // Normalized distance score
  const distanceScore = Math.round(averageGap * 0.7 + missingRatioScore * 0.3);
  const normalizedScore = Math.min(100, Math.max(0, distanceScore));

  let label = "Moderate";
  if (normalizedScore <= 20) label = "Very Low";
  else if (normalizedScore <= 40) label = "Low";
  else if (normalizedScore <= 60) label = "Moderate";
  else if (normalizedScore <= 80) label = "High";
  else label = "Very High";

  return {
    score: normalizedScore,
    label,
  };
};

/**
 * Calculates the final Career Readiness index
 * Readiness = SkillMastery (35%) + TransferableSkills (15%) + Projects (15%) + Assessment (15%) + LearningProgress (10%) + InterviewPrep (10%)
 */
const calculateCareerReadiness = (
  userSkills = [],
  requiredSkills = [],
  roadmapProgress = 0,
  projectCount = 0,
  assessmentScore = 0,
  consistencyScore = 70, // defaults to neutral
  interviewPrepCount = 0
) => {
  // 1. Skill Mastery (average user proficiency of target required skills)
  let skillMasterySum = 0;
  if (requiredSkills.length > 0) {
    requiredSkills.forEach((skillName) => {
      const us = userSkills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
      skillMasterySum += us ? us.proficiency : 0;
    });
  }
  const skillMastery = requiredSkills.length > 0 ? Math.round(skillMasterySum / requiredSkills.length) : 0;

  // 2. Transferable skills overlap
  const transferableSkills = calculateSkillOverlap(userSkills, requiredSkills);

  // 3. Project Evidence score (scaled up to 100 based on project completion)
  const projects = Math.min(100, projectCount * 35); // 3 projects get 100%

  // 4. Assessment Score
  const assessment = Math.min(100, assessmentScore);

  // 5. Learning Progress
  const learningProgress = Math.min(100, roadmapProgress);

  // 6. Interview Prep Score
  const interviewPrep = Math.min(100, interviewPrepCount * 50); // 2 interview preps get 100%

  const finalReadiness = Math.round(
    skillMastery * READINESS_WEIGHTS.skillMastery +
      transferableSkills * READINESS_WEIGHTS.transferableSkills +
      projects * READINESS_WEIGHTS.projects +
      assessment * READINESS_WEIGHTS.assessment +
      learningProgress * READINESS_WEIGHTS.learningProgress +
      interviewPrep * READINESS_WEIGHTS.interviewPrep
  );

  return {
    readinessScore: Math.min(100, Math.max(0, finalReadiness)),
    subScores: {
      technicalSkills: skillMastery,
      domainKnowledge: Math.round(skillMastery * 1.1 > 100 ? 100 : skillMastery * 1.1), // Proxy for domain
      transferableSkills,
      projects,
      assessment,
      learningProgress,
      interviewPrep,
    },
  };
};

module.exports = {
  calculateSkillGap,
  calculateSkillOverlap,
  calculateCareerFit,
  calculateTransitionDistance,
  calculateCareerReadiness,
};
