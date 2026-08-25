const groq = require("../utils/groq");
const asyncHandler = require("../utils/asyncHandler");

const Goal = require("../models/Goal");
const Roadmap = require("../models/Roadmap");
const AIChat = require("../models/AIChat");
const StudySession = require("../models/StudySession");
const Conversation = require("../models/Conversation");

exports.chatWithAI = asyncHandler(async (req, res) => {
  const { message, conversationId } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      status: "fail",
      message: "Message is required",
    });
  }

  const userId = req.user._id;

  let activeConversation = conversationId;

  if (!activeConversation) {
    const conversation = await Conversation.create({
      user: userId,
      title: message.substring(0, 40),
    });

    activeConversation = conversation._id;
  }

  await AIChat.create({
    user: userId,
    conversationId: activeConversation,
    role: "user",
    message,
  });

  // Fetch user's data
  const goals = await Goal.find({ user: userId })
    .select("title category status progress deadline")
    .lean();

  const roadmaps = await Roadmap.find({ user: userId })
    .select("title progress steps")
    .lean();

  const studySessions = await StudySession.find({ user: userId })
    .populate("goal", "title")
    .select("duration notes studiedAt goal")
    .lean();

  // Simplify data to reduce tokens and prevent exceeding rate limits
  const simplifiedRoadmaps = roadmaps.map((r) => ({
    title: r.title,
    progress: r.progress,
    incompleteSteps: r.steps
      .filter((s) => !s.completed)
      .map((s) => s.title),
  }));

  const simplifiedStudySessions = studySessions.map((s) => ({
    goal: s.goal ? s.goal.title : null,
    duration: s.duration,
    studiedAt: s.studiedAt,
  }));

  // Build prompt
  const prompt = `
You are InterPrep AI, an intelligent study coach.

You have access to the user's learning data.

==========================
GOALS
==========================
${JSON.stringify(goals, null, 2)}

==========================
ROADMAPS
==========================
${JSON.stringify(simplifiedRoadmaps, null, 2)}

==========================
STUDY SESSIONS
==========================
${JSON.stringify(simplifiedStudySessions, null, 2)}

==========================
USER QUESTION
==========================
${message}

Instructions:
- Answer using the user's actual data.
- Recommend unfinished goals first.
- Recommend incomplete roadmap steps.
- Consider recent study sessions.
- Keep the answer practical and encouraging.
- Format the answer nicely using bullet points when appropriate.
`;

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content:
          "You are InterPrep AI, a professional study mentor that helps students plan and track their learning.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const aiResponse = completion.choices[0].message.content;

  await AIChat.create({
    user: userId,
    conversationId: activeConversation,
    role: "assistant",
    message: aiResponse,
  });

  await Conversation.findByIdAndUpdate(
    activeConversation,
    {
      lastMessage: aiResponse,
    },
    {
      timestamps: true,
    },
  );

  res.status(200).json({
    status: "success",
    response: aiResponse,
    conversationId: activeConversation,
  });
});

exports.getChatHistory = asyncHandler(async (req, res) => {
  const { conversationId } = req.query;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: req.user._id,
  });

  if (!conversation) {
    return res.status(404).json({
      status: "fail",
      message: "Conversation not found",
    });
  }

  const chats = await AIChat.find({
    conversationId,
  }).sort({ createdAt: 1 });

  res.status(200).json({
    status: "success",
    data: {
      chats,
    },
  });
});

exports.getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    user: req.user._id,
  }).sort({ updatedAt: -1 });

  res.status(200).json({
    status: "success",
    data: {
      conversations,
    },
  });
});

exports.deleteConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!conversation) {
    return res.status(404).json({
      status: "fail",
      message: "Conversation not found",
    });
  }

  await AIChat.deleteMany({
    conversationId: conversation._id,
  });

  await conversation.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Conversation deleted successfully",
  });
});

exports.renameConversation = asyncHandler(async (req, res) => {
  const { title } = req.body;

  const conversation = await Conversation.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    {
      title,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!conversation) {
    return res.status(404).json({
      status: "fail",
      message: "Conversation not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      conversation,
    },
  });
});

exports.generateRoadmap = asyncHandler(async (req, res) => {
  const { goal } = req.body;

  if (!goal || !goal.trim()) {
    return res.status(400).json({
      status: "fail",
      message: "Goal is required",
    });
  }

  const prompt = `
Generate a detailed learning roadmap for:

"${goal}"

Return ONLY valid JSON in this format:

{
  "title": "Roadmap Title",
  "steps": [
    {
      "title": "Step Title (e.g., Master React Hooks)",
      "description": "Short explanation of what concepts should be studied in this step",
      "completed": false,
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
}

Ensure there are 4-8 steps. Each step must have exactly 1 highly trusted official documentation resource link.
Provide an estimated study duration in 'requiredTime' (integer in minutes). Calculate this based on the difficulty and complexity of the step's topic (e.g., 15 minutes for basic installations, setups, or intros; 30-45 minutes for standard core concepts/APIs; and 60-90 minutes for complex implementations, integrations, architectures, or debugging).
Do not include markdown blocks (like \`\`\`json) or any explanations outside the JSON.
`;

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: "You are an expert roadmap generator.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.5,
  });

  let roadmap = completion.choices[0].message.content;

  roadmap = roadmap
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsedRoadmap = JSON.parse(roadmap);
  if (parsedRoadmap && parsedRoadmap.steps) {
    const { verifyAndFilterResources } = require("../utils/urlVerifier");
    parsedRoadmap.steps = await verifyAndFilterResources(parsedRoadmap.steps);
  }

  res.status(200).json({
    status: "success",
    roadmap: parsedRoadmap,
  });
});

// Helper for AI completions in aiController
const getAIChat = async (prompt, systemInstruction = "You are a professional career strategist.") => {
  if (process.env.GEMINI_API_KEY) {
    try {
      const gemini = require("../utils/gemini");
      const response = await gemini.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: { systemInstruction }
      });
      return response.text;
    } catch (err) {
      console.warn("Gemini query failed, falling back to Groq:", err);
    }
  }

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: prompt },
    ],
    temperature: 0.5,
  });
  return completion.choices[0].message.content;
};

// @desc    Explain why a career is recommended and how AI affects current role
// @route   POST /api/ai/career-explanation
// @access  Private
exports.explainCareerTransition = asyncHandler(async (req, res) => {
  const { currentRole, targetRole, fitScore, distanceLabel, gaps } = req.body;

  if (!currentRole || !targetRole) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify currentRole and targetRole.",
    });
  }

  const prompt = `
A student is analyzing a transition from "${currentRole}" to "${targetRole}".
Our structured algorithms computed:
- Career Suitability Fit Score: ${fitScore}%
- Transition Difficulty: ${distanceLabel}
- Major Skill Gaps to build: ${JSON.stringify(gaps)}

Write a professional, personalized career guidance summary explaining:
1. Why this transition makes sense based on their transferable competencies.
2. How AI is transforming the tasks in their current role ("${currentRole}") and why building the gaps (${JSON.stringify(gaps)}) makes them more future-proof.
3. Maintain a supportive, evidence-grounded tone. Do not guarantee salaries, and do not make absolute predictions about job loss. Limit the response to 3-4 sentences.
`;

  try {
    const explanation = await getAIChat(prompt, "You are a professional career path strategist and technical recruiter.");
    res.status(200).json({
      status: "success",
      data: { explanation: explanation.trim() },
    });
  } catch (err) {
    console.error("Career explanation AI error:", err);
    res.status(500).json({
      status: "fail",
      message: "Failed to generate AI career explanation.",
    });
  }
});

// @desc    Suggest roadmap sequencing based on gaps
// @route   POST /api/ai/roadmap-suggestion
// @access  Private
exports.suggestRoadmap = asyncHandler(async (req, res) => {
  const { targetRole, gaps } = req.body;

  if (!targetRole || !gaps || gaps.length === 0) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify targetRole and a list of skill gaps.",
    });
  }

  const prompt = `
A student is preparing for a transition to "${targetRole}".
They have the following key skill gaps: ${JSON.stringify(gaps)}.

Suggest a high-level phase-by-phase learning sequence:
- Which skills to learn first as prerequisites.
- Which ones to learn later.
- Provide a brief, supportive reason why this sequence works.
- Maintain a concise, professional tone (under 4 sentences).
`;

  try {
    const suggestion = await getAIChat(prompt, "You are a structured technical curriculum designer.");
    res.status(200).json({
      status: "success",
      data: { suggestion: suggestion.trim() },
    });
  } catch (err) {
    console.error("Roadmap suggestion AI error:", err);
    res.status(500).json({
      status: "fail",
      message: "Failed to generate AI roadmap suggestion.",
    });
  }
});

