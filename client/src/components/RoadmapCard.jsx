import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import StudyFocusTimer from "./StudyFocusTimer";

function RoadmapCard({ roadmap, onToggleStep, onDelete, onRoadmapUpdate }) {
  const { token } = useAuth();
  const [expandedStepId, setExpandedStepId] = useState(null);
  const [activeStudyStep, setActiveStudyStep] = useState(null);

  const steps = roadmap.steps || [];
  const progress = roadmap.progress || 0;
  const completedCount = steps.filter((step) => step.completed).length;

  const handleToggleExpand = (stepId) => {
    setExpandedStepId(expandedStepId === stepId ? null : stepId);
  };

  const getResourceTypeIcon = (type) => {
    switch (type) {
      case "video":
        return "🎥";
      case "article":
        return "📄";
      case "documentation":
        return "📚";
      case "exercise":
        return "🧠";
      default:
        return "🔗";
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {roadmap.title}
          </h3>
          {roadmap.goal && (
            <div className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-indigo-650 bg-indigo-50/50 border border-indigo-100 rounded-full px-2.5 py-0.5 w-fit">
              <span>🔗</span> Linked Goal: {roadmap.goal.title}
            </div>
          )}
          <p className="mt-2 text-sm text-slate-500">
            {completedCount}/{steps.length} steps completed
          </p>
        </div>
        <div className="text-sm font-semibold text-slate-900">{progress}%</div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
          <span>Completion</span>
          <strong className="text-slate-900">{progress}%</strong>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-900 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Accordion List of Steps */}
      <div className="mt-5 space-y-2.5">
        {steps.map((step) => {
          const isExpanded = expandedStepId === step._id;
          return (
            <div
              key={step._id}
              className={`rounded-2xl border transition-all ${
                step.completed
                  ? "border-emerald-200 bg-emerald-50/10"
                  : "border-slate-200 bg-slate-50/50"
              }`}
            >
              {/* Step Header Toggle */}
              <div
                className="flex items-center justify-between p-3.5 cursor-pointer select-none"
                onClick={() => handleToggleExpand(step._id)}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={step.completed}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggleStep(roadmap._id, step._id);
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                  <span
                    className={`text-sm font-semibold ${
                      step.completed
                        ? "text-emerald-700 line-through opacity-75"
                        : "text-slate-900"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xxs font-bold text-slate-500 bg-slate-200/50 rounded-full px-2 py-0.5">
                    ⏱ {step.timeSpent || 0}/{step.requiredTime || 15}m
                  </span>
                  <span className="text-slate-400 text-xs transition-transform duration-200">
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {/* Expanded Area */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-[#faf7f2] p-4 rounded-b-2xl space-y-4 animate-fadeIn">
                  {step.description && (
                    <div className="text-xs text-slate-500 leading-relaxed">
                      <p className="font-bold text-slate-700 mb-1">
                        About this milestone:
                      </p>
                      <p>{step.description}</p>
                    </div>
                  )}

                  {/* Resources */}
                  <div className="space-y-2">
                    <p className="text-xxs font-bold uppercase tracking-wider text-slate-500">
                      Learning Resources
                    </p>
                    {step.resources && step.resources.length > 0 ? (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {step.resources.map((res, rIdx) => (
                          <a
                            key={res._id || rIdx}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white p-2 hover:border-[#e2583e] transition text-left cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="text-base">
                              {getResourceTypeIcon(res.type)}
                            </span>
                            <div className="overflow-hidden">
                              <p className="text-xs font-semibold text-slate-800 truncate">
                                {res.title}
                              </p>
                              <span className="text-xxs text-slate-400 capitalize">
                                {res.type || "documentation"}
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        No resources loaded.
                      </p>
                    )}
                  </div>

                  {/* Study Button */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveStudyStep(step);
                      }}
                      className="flex-1 rounded-xl bg-[#e2583e] px-4 py-2 text-xs font-bold text-white hover:bg-[#c8452d] transition text-center cursor-pointer active:scale-95 shadow-sm"
                    >
                      ⏱ Start Study Focus Timer
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onDelete(roadmap._id)}
        className="mt-5 rounded-full border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 cursor-pointer"
      >
        Delete roadmap
      </button>

      {/* Study Focus Timer Modal */}
      {activeStudyStep && (
        <StudyFocusTimer
          roadmapId={roadmap._id}
          stepId={activeStudyStep._id}
          stepTitle={activeStudyStep.title}
          stepDescription={activeStudyStep.description}
          resources={activeStudyStep.resources}
          requiredTime={activeStudyStep.requiredTime}
          timeSpent={activeStudyStep.timeSpent}
          token={token}
          onClose={() => setActiveStudyStep(null)}
          onSessionLogged={(updatedRoadmap) => {
            if (onRoadmapUpdate) {
              onRoadmapUpdate(updatedRoadmap);
            }
          }}
        />
      )}
    </div>
  );
}

export default RoadmapCard;
