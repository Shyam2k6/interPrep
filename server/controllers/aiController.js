const groq = require("../utils/groq");
const asyncHandler = require("../utils/asyncHandler");

const Goal = require("../models/Goal");
const Roadmap = require("../models/Roadmap");
const AIChat = require("../models/AIChat");
const StudySession = require("../models/StudySession");

exports.chatWithAI = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      status: "fail",
      message: "Message is required",
    });
  }

  const userId = req.user._id;

  await AIChat.create({
    user: userId,
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
${JSON.stringify(roadmaps, null, 2)}

==========================
STUDY SESSIONS
==========================
${JSON.stringify(studySessions, null, 2)}

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
    model: "llama-3.3-70b-versatile",
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
    role: "assistant",
    message: aiResponse,
  });

  res.status(200).json({
    status: "success",
    response: aiResponse,
  });
});

exports.getChatHistory = asyncHandler(async (req, res) => {
  const chats = await AIChat.find({
    user: req.user._id,
  }).sort({ createdAt: 1 });

  res.status(200).json({
    status: "success",
    data: {
      chats,
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
Generate a learning roadmap for:

"${goal}"

Return ONLY valid JSON in this format:

{
  "title": "Roadmap Title",
  "steps": [
    {
      "title": "Step 1",
      "completed": false
    }
  ]
}

Do not include markdown or explanations.
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
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

  res.status(200).json({
    status: "success",
    roadmap: JSON.parse(roadmap),
  });
});
