const Assessment = require("../models/Assessment");
const CareerProfile = require("../models/CareerProfile");
const Roadmap = require("../models/Roadmap");
const { refreshReadiness } = require("./careerController");
const groq = require("../utils/groq");
const gemini = require("../utils/gemini");
const asyncHandler = require("../utils/asyncHandler");

// Helper to query AI with fallback
const getAIChatCompletion = async (prompt, systemInstruction = "You are a professional software engineering examiner.") => {
  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await gemini.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });
      return response.text;
    } catch (err) {
      console.warn("Gemini query failed, falling back to Groq:", err);
    }
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: prompt },
    ],
    temperature: 0.5,
  });
  return completion.choices[0].message.content;
};

// @desc    Generate a 5-question MCQ quiz for a specific skill
// @route   POST /api/assessments/generate
// @access  Private
exports.generateQuiz = asyncHandler(async (req, res) => {
  const { skillName } = req.body;
  if (!skillName) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify skillName to assess.",
    });
  }

  const prompt = `
Generate a multiple choice assessment quiz for the skill: "${skillName}".
Create exactly 5 questions testing conceptual and practical knowledge.
For each question, provide:
- "questionText": String (clear, technical scenario or conceptual question)
- "options": Array of exactly 4 strings
- "correctOptionIndex": Number (0 to 3)
- "explanation": String (Brief conceptual detail explaining the correct choice)

Return ONLY valid JSON in this format:
{
  "questions": [
    {
      "questionText": "Question description",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctOptionIndex": 1,
      "explanation": "Why Option B is correct"
    }
  ]
}
Do not use markdown blocks or formatting.
`;

  try {
    const aiResponseRaw = await getAIChatCompletion(prompt, "You are a professional technical examiner generating quizzes.");
    const cleanJSON = aiResponseRaw.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanJSON);

    const assessment = await Assessment.create({
      user: req.user._id,
      skillName,
      questions: result.questions,
      score: 0,
      completed: false,
    });

    // Hide correctOptionIndex from front-end check to prevent cheating
    const clientQuestions = assessment.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
    }));

    res.status(200).json({
      status: "success",
      data: {
        assessmentId: assessment._id,
        skillName: assessment.skillName,
        questions: clientQuestions,
      },
    });
  } catch (err) {
    console.error("Quiz generation failed:", err);
    res.status(500).json({
      status: "fail",
      message: "Failed to generate dynamic assessment quiz. Please try again.",
    });
  }
});

// @desc    Submit answers and grade quiz
// @route   POST /api/assessments/submit
// @access  Private
exports.submitQuiz = asyncHandler(async (req, res) => {
  const { assessmentId, answers } = req.body; // answers: [{ questionId, selectedIndex }]
  if (!assessmentId || !answers) {
    return res.status(400).json({
      status: "fail",
      message: "Missing assessmentId or answers array.",
    });
  }

  const assessment = await Assessment.findOne({ _id: assessmentId, user: req.user._id });
  if (!assessment) {
    return res.status(404).json({
      status: "fail",
      message: "Assessment template not found.",
    });
  }

  if (assessment.completed) {
    return res.status(400).json({
      status: "fail",
      message: "This assessment has already been graded.",
    });
  }

  let correctCount = 0;
  const questionsGraded = assessment.questions.map((q) => {
    const matchedAns = answers.find((a) => a.questionId.toString() === q._id.toString());
    const selectedIdx = matchedAns ? Number(matchedAns.selectedIndex) : -1;
    const isCorrect = selectedIdx === q.correctOptionIndex;

    if (isCorrect) correctCount++;

    // Mutate document
    q.selectedOptionIndex = selectedIdx;

    return {
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      correctOptionIndex: q.correctOptionIndex,
      selectedOptionIndex: selectedIdx,
      isCorrect,
      explanation: q.explanation,
    };
  });

  const finalScore = Math.round((correctCount / assessment.questions.length) * 100);
  assessment.score = finalScore;
  assessment.completed = true;
  await assessment.save();

  // Update proficiency in CareerProfile
  let profile = await CareerProfile.findOne({ user: req.user._id });
  let adaptationTriggered = false;
  let adaptationMessage = "";

  if (profile) {
    const matchedSkill = profile.skills.find(
      (s) => s.name.toLowerCase() === assessment.skillName.toLowerCase()
    );

    if (matchedSkill) {
      let adjustment = 0;
      if (finalScore >= 80) {
        adjustment = 15;
      } else if (finalScore >= 60) {
        adjustment = 5;
      } else {
        adjustment = -10;
      }

      matchedSkill.proficiency = Math.min(100, Math.max(0, matchedSkill.proficiency + adjustment));
      matchedSkill.source = "quiz";
      matchedSkill.lastAssessed = new Date();
    } else {
      // Add skill to profile list
      profile.skills.push({
        name: assessment.skillName,
        proficiency: finalScore,
        source: "quiz",
        lastAssessed: new Date(),
      });
    }

    await profile.save();

    // Trigger Adaptive Roadmap updates if score < 60%
    if (finalScore < 60 && profile.targetOccupation) {
      const activeRoadmap = await Roadmap.findOne({
        user: req.user._id,
        title: `Transition to ${profile.targetOccupation}`,
      });

      if (activeRoadmap) {
        const prerequisiteTitle = `Prerequisite Review: ${assessment.skillName} Fundamentals`;
        // Check if prerequisite step is already there
        const exists = activeRoadmap.steps.some(
          (s) => s.title.toLowerCase() === prerequisiteTitle.toLowerCase()
        );

        if (!exists) {
          activeRoadmap.steps.unshift({
            title: prerequisiteTitle,
            description: `AI detected conceptual weakness (<60% assessment score) in ${assessment.skillName}. Review basic ES6 or core fundamentals before proceeding.`,
            completed: false,
            requiredTime: 15,
            timeSpent: 0,
            resources: [
              {
                title: `${assessment.skillName} Core Reference Guide`,
                url: `https://www.google.com/search?q=${encodeURIComponent(
                  assessment.skillName + " official documentation fundamentals tutorial guide"
                )}`,
                type: "documentation",
              },
            ],
          });
          await activeRoadmap.save();
          adaptationTriggered = true;
          adaptationMessage = `Conceptual weakness detected in ${assessment.skillName}. Adaptive Prerequisite milestone step has been injected into your active Roadmap.`;
        }
      }
    }
  }

  // Refresh readiness index
  await refreshReadiness(req.user._id);

  res.status(200).json({
    status: "success",
    data: {
      score: finalScore,
      questions: questionsGraded,
      adaptationTriggered,
      adaptationMessage,
    },
  });
});

// @desc    Get assessment quiz history
// @route   GET /api/assessments/history
// @access  Private
exports.getQuizHistory = asyncHandler(async (req, res) => {
  const history = await Assessment.find({ user: req.user._id, completed: true })
    .select("skillName score takenAt")
    .sort({ takenAt: -1 });

  res.status(200).json({
    status: "success",
    results: history.length,
    data: { history },
  });
});
