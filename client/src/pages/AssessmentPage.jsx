import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { generateQuiz, submitQuiz } from "../services/assessmentService";
import { getCareerProfile } from "../services/careerService";
import { useNavigate, useLocation } from "react-router-dom";

function AssessmentPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Skill name context (could be passed in from other dashboards)
  const [skillToAssess, setSkillToAssess] = useState("");

  // Quiz States
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [quizData, setQuizData] = useState(null); // contains { assessmentId, skillName, questions }
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: selectedIndex }
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Grading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradingResult, setGradingResult] = useState(null); // { score, questions, adaptationTriggered, adaptationMessage }

  const initializeQuiz = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      setGradingResult(null);
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);

      let targetSkill = location.state?.skillName || "";

      // Fallback: If no skill passed, fetch target career gaps
      if (!targetSkill) {
        const profileRes = await getCareerProfile(token);
        if (profileRes.status === "success" && profileRes.data.profile) {
          const profile = profileRes.data.profile;
          if (profile.targetOccupation && profile.skills.length > 0) {
            // Find a skill that is low in proficiency
            const weakSkill = profile.skills.sort((a, b) => a.proficiency - b.proficiency)[0];
            if (weakSkill) targetSkill = weakSkill.name;
          }
        }
      }

      if (!targetSkill) {
        setErrorMsg("Please select a skill from your inventory to launch an assessment.");
        setLoading(false);
        return;
      }

      setSkillToAssess(targetSkill);

      // Generate Quiz
      const quizRes = await generateQuiz(targetSkill, token);
      if (quizRes.status === "success" && quizRes.data) {
        setQuizData(quizRes.data);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to generate dynamic AI assessment quiz.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeQuiz();
  }, [token, location.state]);

  const handleSelectOption = (questionId, index) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: index,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    const unanswered = quizData.questions.some((q) => selectedAnswers[q._id] === undefined);
    if (unanswered) {
      setErrorMsg("Please answer all questions before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");

      const formattedAnswers = Object.entries(selectedAnswers).map(([qId, idx]) => ({
        questionId: qId,
        selectedIndex: idx,
      }));

      const res = await submitQuiz(quizData.assessmentId, formattedAnswers, token);
      if (res.status === "success") {
        setGradingResult(res.data);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to submit and grade assessment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e2583e]"></div>
        <p className="text-xs text-slate-400 italic animate-pulse">
          Generating personalized AI Skill Assessment based on your gaps...
        </p>
      </div>
    );
  }

  if (errorMsg && !quizData) {
    return (
      <div className="max-w-md mx-auto bg-white border border-[#eae6db] rounded-3xl p-6 text-center space-y-4 shadow-sm">
        <div className="text-4xl">⚠️</div>
        <h3 className="text-base font-black text-slate-900 leading-none">Assessment Unavailable</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{errorMsg}</p>
        <div className="pt-2 flex justify-center gap-2">
          <button
            onClick={() => navigate("/skills")}
            className="bg-[#0f0f11] hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            My Skills Inventory
          </button>
          <button
            onClick={() => navigate("/career")}
            className="bg-[#e2583e] hover:bg-[#c8452d] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Career Intelligence
          </button>
        </div>
      </div>
    );
  }

  // GRADING RESULT VIEW
  if (gradingResult) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fadeIn px-2">
        <div className="bg-white border border-[#eae6db] rounded-3xl p-6 shadow-sm text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-slate-50 border border-slate-100">
            <span className="text-3xl font-black text-[#e2583e]">
              {gradingResult.score}%
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 leading-none">
            {skillToAssess} Assessment Graded
          </h2>
          <p className="text-xs text-slate-400">
            Skill proficiency has been updated in your profile.
          </p>

          {gradingResult.adaptationTriggered && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-xs font-bold text-left max-w-lg mx-auto">
              ⚠️ {gradingResult.adaptationMessage}
            </div>
          )}

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => navigate("/career")}
              className="bg-[#0f0f11] hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-xs font-bold transition cursor-pointer"
            >
              Go to Career Hub
            </button>
            <button
              onClick={() => navigate("/skills")}
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-6 py-2.5 rounded-full text-xs font-bold transition cursor-pointer"
            >
              My Skills Inventory
            </button>
          </div>
        </div>

        {/* Detailed graded review questions */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pl-1">
            Question Review & Explanations
          </h3>

          {gradingResult.questions.map((q, idx) => (
            <div key={idx} className="bg-white border border-[#eae6db] rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Question {idx + 1}
                </span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    q.isCorrect
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : "bg-rose-50 text-rose-600 border border-rose-100"
                  }`}
                >
                  {q.isCorrect ? "Correct" : "Incorrect"}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 leading-relaxed">
                {q.questionText}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt, oIdx) => {
                  let optStyle = "border-slate-200 text-slate-600 bg-white";
                  if (oIdx === q.correctOptionIndex) {
                    optStyle = "border-emerald-500 bg-emerald-50/20 text-emerald-950 font-bold";
                  } else if (oIdx === q.selectedOptionIndex && !q.isCorrect) {
                    optStyle = "border-rose-500 bg-rose-50/20 text-rose-950 font-bold";
                  }

                  return (
                    <div key={oIdx} className={`border rounded-2xl p-2.5 text-xs ${optStyle}`}>
                      <span className="mr-1.5 font-bold">
                        {String.fromCharCode(65 + oIdx)}.
                      </span>{" "}
                      {opt}
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                <strong>Explanation:</strong> {q.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ACTIVE TEST PANELS
  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-fadeIn px-2">
      {/* Quiz Progress header */}
      <div className="bg-white rounded-3xl p-5 border border-[#eae6db] shadow-sm space-y-3">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-[#e2583e]">
            Question {currentQuestionIndex + 1} of {quizData.questions.length}
          </span>
          <span className="text-slate-400">Assessing: {quizData.skillName}</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#e2583e] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl text-xs font-semibold animate-scaleUp">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Current Question panel */}
      <div className="bg-white rounded-3xl p-6 border border-[#eae6db] shadow-sm space-y-5">
        <h2 className="text-sm font-black text-slate-900 leading-relaxed">
          {currentQuestion.questionText}
        </h2>

        <div className="space-y-2 pt-2">
          {currentQuestion.options.map((opt, oIdx) => {
            const isSelected = selectedAnswers[currentQuestion._id] === oIdx;
            return (
              <label
                key={oIdx}
                className={`flex items-center gap-3 border rounded-2xl p-3.5 text-xs cursor-pointer transition ${
                  isSelected
                    ? "border-[#e2583e] bg-orange-50/20 text-[#e2583e] font-bold"
                    : "border-slate-200 hover:bg-slate-50/50 text-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name={currentQuestion._id}
                  checked={isSelected}
                  onChange={() => handleSelectOption(currentQuestion._id, oIdx)}
                  className="accent-[#e2583e]"
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-2xl text-xs font-semibold hover:bg-slate-50 transition cursor-pointer disabled:opacity-30"
          >
            &larr; Previous
          </button>

          {currentQuestionIndex < quizData.questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 bg-[#0f0f11] hover:bg-slate-800 text-white rounded-2xl text-xs font-semibold transition cursor-pointer"
            >
              Next &rarr;
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#e2583e] hover:bg-[#c8452d] text-white rounded-2xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Grading..." : "✓ Submit Assessment"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssessmentPage;
