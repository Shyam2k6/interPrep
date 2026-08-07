import { useState, useEffect, useRef } from "react";
import { studyStep } from "../services/roadmapService";

function StudyFocusTimer({
  roadmapId,
  stepId,
  stepTitle,
  stepDescription,
  resources = [],
  requiredTime = 15,
  timeSpent = 0,
  token,
  onClose,
  onSessionLogged,
}) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const elapsedBeforePauseRef = useRef(0);

  useEffect(() => {
    if (isActive && !success) {
      // Record when this start/resume occurred
      startTimeRef.current = Date.now() - (elapsedBeforePauseRef.current * 1000);
      
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setSeconds(elapsed);
      }, 250); // Check frequently (every 250ms) for responsive updates
    } else {
      clearInterval(intervalRef.current);
      if (startTimeRef.current) {
        // Save the elapsed time up to this point
        elapsedBeforePauseRef.current = Math.floor((Date.now() - startTimeRef.current) / 1000);
      }
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, success]);

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, "0");

    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const handleToggleTimer = () => {
    if (isActive) {
      // Pausing: save current elapsed seconds into the ref before state changes
      if (startTimeRef.current) {
        elapsedBeforePauseRef.current = Math.floor((Date.now() - startTimeRef.current) / 1000);
      }
    } else {
      // Resuming: set the startTimeRef based on current elapsed
      startTimeRef.current = Date.now() - (elapsedBeforePauseRef.current * 1000);
    }
    setIsActive(!isActive);
  };

  const handleFinishSession = async () => {
    // Calculate duration in minutes (minimum 1 minute to satisfy schema validation)
    const durationInMinutes = Math.max(1, Math.round(seconds / 60));

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response = await studyStep(
        roadmapId,
        stepId,
        {
          duration: durationInMinutes,
          notes: notes.trim() || `Studied milestone: ${stepTitle}`,
        },
        token,
      );

      setSuccess(true);
      setTimeout(() => {
        if (onSessionLogged) {
          onSessionLogged(response.data.roadmap);
        }
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message || "Failed to log study session. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingMins = Math.max(0, requiredTime - timeSpent);
  const sessionMins = Math.max(1, Math.round(seconds / 60));
  const newCumulativeTime = timeSpent + sessionMins;

  // Minimized Widget Rendering
  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed top-6 right-6 z-[9999] flex items-center gap-3 rounded-2xl bg-[#e2583e] hover:bg-[#c8452d] text-white px-4 py-3 shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 group border border-[#c8452d]"
      >
        {/* Pulsing state indicator */}
        <span className="relative flex h-3 w-3">
          {isActive && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-3 w-3 ${isActive ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
        </span>
        
        <div className="flex flex-col text-left">
          <span className="text-[9px] font-bold uppercase tracking-wider text-orange-100">
            {isActive ? "Active Study Time" : "Paused"}
          </span>
          <span className="font-mono text-base font-extrabold leading-none tracking-wider">{formatTime(seconds)}</span>
        </div>

        {/* Expand Icon */}
        <div className="text-white/80 hover:text-white text-xs ml-1 bg-white/10 rounded-full h-5 w-5 flex items-center justify-center font-bold">
          🗖
        </div>

        {/* Hover details card */}
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#faf7f2] border border-slate-200 p-3 shadow-xl text-slate-800 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-50 text-xs">
          <p className="font-bold text-slate-900 truncate mb-0.5">{stepTitle}</p>
          <p className="text-slate-500 line-clamp-2 mb-2">{stepDescription || "Focus session in progress."}</p>
          <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-1.5">
            <span>Progress: {timeSpent}/{requiredTime}m</span>
            <span className="text-[#e2583e] font-semibold">Click to expand &rarr;</span>
          </div>
        </div>
      </div>
    );
  }

  // Full Expanded Modal Dashboard
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-[#faf7f2] shadow-2xl p-5 space-y-4 animate-scaleUp scrollbar-thin">
        
        {/* Controls: Minimize & Close */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            disabled={isSubmitting || success}
            className="text-slate-400 hover:text-slate-900 transition h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer active:scale-90"
            title="Minimize to floating widget"
          >
            —
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting || success}
            className="text-slate-400 hover:text-slate-900 transition h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer active:scale-90"
            title="Close session"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-[#e2583e] text-3xl shadow-md border border-emerald-100">
              ✓
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Session Logged!
            </h2>
            <p className="text-xs text-slate-500 text-center max-w-sm">
              Your study time of <strong>{sessionMins} minute(s)</strong> has been successfully tracked.
              {newCumulativeTime >= requiredTime ? (
                <span className="block mt-1 text-emerald-700 font-semibold">🎉 Milestone completed!</span>
              ) : (
                <span className="block mt-1">Total: {newCumulativeTime}/{requiredTime} minutes studied.</span>
              )}
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="pr-16">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                ⚡ Active Study Session
              </span>
              <h2 className="mt-2 text-xl font-extrabold text-slate-900 tracking-tight">
                {stepTitle}
              </h2>
              {stepDescription && (
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {stepDescription}
                </p>
              )}
            </div>

            {/* Threshold Goal Info */}
            <div className="rounded-2xl bg-amber-50/50 border border-amber-100 p-3 text-xs text-amber-900 space-y-1">
              <div className="flex justify-between items-center font-bold">
                <span>🎯 Milestone Goal</span>
                <span className="bg-amber-100 text-amber-900 rounded-full px-2 py-0.5 font-bold">
                  {timeSpent}/{requiredTime} mins studied
                </span>
              </div>
              <p className="leading-relaxed">
                {timeSpent >= requiredTime ? (
                  <span className="text-emerald-700 font-semibold">✓ You have studied the minimum required duration. Milestone completed!</span>
                ) : (
                  <span>
                    Study for at least <strong>{remainingMins} more minute(s)</strong> (accumulated across sessions) to automatically mark this milestone as completed.
                  </span>
                )}
              </p>
            </div>

            {/* Timer Visualizer */}
            <div className="flex flex-col items-center justify-center py-4 rounded-2xl bg-slate-50 border border-slate-155 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid opacity-[0.1] pointer-events-none" />
              
              <div
                className={`absolute w-24 h-24 rounded-full bg-[#e2583e]/5 transition-transform duration-1000 ${
                  isActive ? "scale-150 animate-ping" : "scale-100"
                }`}
              />

              <div className="relative text-4xl font-mono font-bold tracking-widest text-slate-900">
                {formatTime(seconds)}
              </div>
              <p className="text-[10px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                {isActive ? "Timer Active" : "Timer Paused"}
              </p>

              {/* Controls */}
              <div className="flex items-center gap-4 mt-3 relative z-10">
                <button
                  type="button"
                  onClick={handleToggleTimer}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "bg-[#e2583e] text-white hover:bg-[#c8452d]"
                  }`}
                >
                  {isActive ? "⏸ Pause" : "▶ Resume"}
                </button>
              </div>
            </div>

            {/* Learning Resources */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                📚 Official Documentation
              </h3>
              {resources.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No resources listed for this step.</p>
              ) : (
                <div className="space-y-1">
                  {resources.map((res, index) => (
                    <a
                      key={res._id || index}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5 hover:border-[#e2583e] hover:bg-orange-50/20 transition shadow-sm group text-left cursor-pointer"
                    >
                      <span className="text-lg">📚</span>
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-slate-900 truncate group-hover:text-[#e2583e] transition">
                          {res.title}
                        </p>
                        <p className="text-[10px] text-slate-400 capitalize">
                          Official Reference Guide &rarr;
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Session Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                ✍️ Session Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="What key concepts did you learn or write down?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-[#e2583e] transition"
              />
            </div>

            {errorMessage && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3">
                {errorMessage}
              </p>
            )}

            {/* Finish Session */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-1/3 rounded-full border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinishSession}
                disabled={isSubmitting}
                className="w-2/3 rounded-full bg-[#e2583e] py-2.5 text-xs font-bold text-white hover:bg-[#c8452d] transition shadow-md shadow-orange-500/10 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Logging study time..." : "✓ Finish & Log Session"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StudyFocusTimer;
