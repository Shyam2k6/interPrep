import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getCareerProfile, updateCareerProfile, enhanceRoadmap, resetCareerProfile } from "../services/careerService";
import { getOccupations, getOccupationById } from "../services/occupationService";
import { getCareerExplanation, getRoadmapSuggestion } from "../services/aiService";
import { useNavigate } from "react-router-dom";

function CareerIntelligenceLayout() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState("profile"); // profile, impact, portfolio, gap, readiness

  // Data states
  const [profile, setProfile] = useState(null);
  const [occupations, setOccupations] = useState([]);
  const [selectedOccupationName, setSelectedOccupationName] = useState("");
  const [currentOccDetails, setCurrentOccDetails] = useState(null);

  // Form states
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [educationLevel, setEducationLevel] = useState("");
  const [location, setLocation] = useState("");

  // AI & Q&A states
  const [aiCoachReply, setAiCoachReply] = useState("");
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [qaQuery, setQaQuery] = useState("");

  // Roadmap Enhancer checked skills
  const [checkedSkills, setCheckedSkills] = useState({});
  const [enhancing, setEnhancing] = useState(false);

  // General Status states
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Load initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      // 1. Fetch Occupations List
      const occRes = await getOccupations(token);
      let loadedOccs = [];
      if (occRes.status === "success") {
        loadedOccs = occRes.data.occupations;
        setOccupations(loadedOccs);
      }

      // 2. Fetch User Profile
      const profileRes = await getCareerProfile(token);
      if (profileRes.status === "success" && profileRes.data.profile) {
        const uProfile = profileRes.data.profile;
        setProfile(uProfile);
        const careerName = uProfile.chosenCareer || uProfile.currentOccupation;
        setSelectedOccupationName(careerName || "");
        setYearsOfExperience(uProfile.yearsOfExperience || 0);
        setEducationLevel(uProfile.educationLevel || "");
        setLocation(uProfile.location || "");

        // Find detail for chosen career
        if (careerName) {
          const occObj = loadedOccs.find((o) => o.name === careerName);
          if (occObj) {
            const detailRes = await getOccupationById(occObj._id, token);
            if (detailRes.status === "success") {
              setCurrentOccDetails(detailRes.data.occupation);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to synchronize career intelligence metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Handle setting chosen career profile
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    if (!selectedOccupationName) {
      setErrorMsg("Please select your targeted career goal.");
      return;
    }

    try {
      setSavingProfile(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await updateCareerProfile(
        {
          chosenCareer: selectedOccupationName,
          currentOccupation: selectedOccupationName,
          yearsOfExperience,
          educationLevel,
          location,
        },
        token
      );

      if (res.status === "success") {
        setSuccessMsg("Career profile configured successfully.");
        setProfile(res.data.profile);
        
        // Load details of the selected career
        const occObj = occupations.find((o) => o.name === selectedOccupationName);
        if (occObj) {
          const detailRes = await getOccupationById(occObj._id, token);
          if (detailRes.status === "success") {
            setCurrentOccDetails(detailRes.data.occupation);
          }
        }
        
        // Reset checkboxed selections
        setCheckedSkills({});
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save career target config.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Adjust self-assessed skill levels via sliders
  const handleSliderChange = (skillName, val) => {
    if (!profile) return;
    const updatedSkills = profile.skills.map((s) => {
      if (s.name.toLowerCase() === skillName.toLowerCase()) {
        return { ...s, proficiency: Number(val) };
      }
      return s;
    });
    setProfile({ ...profile, skills: updatedSkills });
  };

  // Persist skill levels
  const handleSaveSliderLevels = async () => {
    try {
      setSavingProfile(true);
      setErrorMsg("");
      setSuccessMsg("");
      const res = await updateCareerProfile({ skills: profile.skills }, token);
      if (res.status === "success") {
        setSuccessMsg("Proficiency levels updated.");
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save proficiency updates.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Inject selected AI modules into active InterPrep Roadmap
  const handleEnhanceRoadmap = async () => {
    const selectedList = Object.keys(checkedSkills).filter((k) => checkedSkills[k]);
    if (selectedList.length === 0) {
      setErrorMsg("Please choose at least one AI skill module.");
      return;
    }

    try {
      setEnhancing(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await enhanceRoadmap(selectedList, token);
      if (res.status === "success") {
        setSuccessMsg(`🎉 Successfully added ${res.data.stepsAdded.length} modules to your active Roadmap!`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to integrate modules into roadmap.");
    } finally {
      setEnhancing(false);
    }
  };

  // Ask Q&A Coach
  const handleAskCoach = async (prebuiltText = "") => {
    const queryText = prebuiltText || qaQuery;
    if (!queryText.trim()) return;

    try {
      setLoadingCoach(true);
      setAiCoachReply("");

      const gapNames = currentOccDetails
        ? (currentOccDetails.emergingSkills || []).join(", ")
        : "AI Skills";

      const res = await getCareerExplanation(
        {
          currentRole: selectedOccupationName,
          targetRole: selectedOccupationName,
          fitScore: profile?.aiReadinessScore || 50,
          distanceLabel: queryText,
          gaps: [gapNames],
        },
        token
      );

      if (res.status === "success") {
        setAiCoachReply(res.data.explanation);
      } else {
        setAiCoachReply(`Coach advice for ${selectedOccupationName}: Focus on core software fundamentals while learning ${queryText}. Ensure to build project evidence.`);
      }
    } catch (err) {
      console.error(err);
      setAiCoachReply(`To stay competitive as a ${selectedOccupationName}, you should balance strong domain expertise (databases, designs) with LLM APIs and prompt structuring. Build working prototypes to validate your competence.`);
    } finally {
      setLoadingCoach(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset your career configurations?")) {
      try {
        setLoading(true);
        await resetCareerProfile(token);
        setProfile(null);
        setCurrentOccDetails(null);
        setSelectedOccupationName("");
        setSuccessMsg("Profile reset successfully.");
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to reset profile.");
      } finally {
        setLoading(false);
      }
    }
  };

  const getProjectRecommendations = () => {
    if (!selectedOccupationName) return [];
    if (selectedOccupationName.toLowerCase().includes("develop") || selectedOccupationName.toLowerCase().includes("engineer")) {
      return [
        { title: "AI-Powered Feedback Tool", description: "Build a mock feedback application in React using Node.js and LLM API integrations.", skills: ["React", "Node.js", "LLM APIs"] },
        { title: "Local Documentation RAG Search", description: "Construct a search database using Python, vector embeddings, and MongoDB vector store.", skills: ["RAG", "Python", "Vector Databases"] },
        { title: "LLM Outputs Diagnostics Board", description: "Build a diagnostics dashboard tracking accuracy, cost, and hallucination bounds.", skills: ["AI Evaluation", "Dashboard APIs"] }
      ];
    }
    return [
      { title: "Context-Aware Search Pipeline", description: "Optimize database index queries using text parsing models.", skills: ["Vector Search", "SQL"] },
      { title: "Interactive BI Analytics Bot", description: "Connect database charts to conversational Natural Language interfaces.", skills: ["AI Analytics Tools", "Data Interpretation"] }
    ];
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 px-4 sm:px-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#eae6db] pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0f0f11] tracking-tight">
            💼 Career Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Analyze AI-era career evolution trends, check your skill gaps, and enhance your roadmaps to remain competitive.
          </p>
        </div>
        {profile && (
          <button
            onClick={handleReset}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 transition bg-rose-50 hover:bg-rose-100/50 rounded-xl px-4 py-2 border border-rose-100 cursor-pointer"
          >
            Reset Target
          </button>
        )}
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-950 p-4 rounded-2xl text-xs font-semibold animate-scaleUp">
          🎉 {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl text-xs font-semibold animate-scaleUp">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Profile check: If user hasn't set up career profile */}
      {!profile ? (
        <div className="bg-white border border-[#eae6db] rounded-3xl p-8 max-w-xl mx-auto shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-5xl">🎯</span>
            <h2 className="text-xl font-extrabold text-slate-900">Define Your Career Path</h2>
            <p className="text-xs text-slate-400">
              Select your targeted career to get started. We'll identify how AI is changing your field.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Targeted Career Goal</label>
              <select
                value={selectedOccupationName}
                onChange={(e) => setSelectedOccupationName(e.target.value)}
                className="w-full bg-[#fdfdfc] border border-slate-200 rounded-2xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#e2583e]"
              >
                <option value="">-- Choose Target Career --</option>
                {occupations.map((o) => (
                  <option key={o._id} value={o.name}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Years of Experience</label>
                <input
                  type="number"
                  min="0"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                  className="w-full bg-[#fdfdfc] border border-slate-200 rounded-2xl p-3 text-xs font-bold focus:outline-none focus:border-[#e2583e]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Education Level</label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full bg-[#fdfdfc] border border-slate-200 rounded-2xl p-3 text-xs font-bold focus:outline-none focus:border-[#e2583e]"
                >
                  <option value="Self-Taught">Self-Taught</option>
                  <option value="Bachelors Degree">Bachelor's Degree</option>
                  <option value="Masters Degree">Master's Degree</option>
                  <option value="Bootcamp Graduate">Bootcamp Graduate</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location / Region</label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#fdfdfc] border border-slate-200 rounded-2xl p-3 text-xs font-bold focus:outline-none focus:border-[#e2583e]"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full bg-[#e2583e] hover:bg-[#c8452d] text-white rounded-2xl py-3 text-xs font-bold transition shadow-md active:scale-[0.98] cursor-pointer"
            >
              {savingProfile ? "Configuring Path..." : "Set Career Target"}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#eae6db] rounded-3xl p-5 shadow-sm flex items-center space-x-4">
              <div className="text-3xl bg-orange-50 p-3 rounded-2xl">🎯</div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Chosen Goal Path</span>
                <h4 className="text-sm font-black text-slate-900 mt-0.5">{profile.chosenCareer}</h4>
              </div>
            </div>
            <div className="bg-white border border-[#eae6db] rounded-3xl p-5 shadow-sm flex items-center space-x-4">
              <div className="text-3xl bg-blue-50 p-3 rounded-2xl">⚡</div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">AI Readiness Index</span>
                <h4 className="text-sm font-black text-slate-900 mt-0.5">{profile.aiReadinessScore} / 100</h4>
              </div>
            </div>
            <div className="bg-white border border-[#eae6db] rounded-3xl p-5 shadow-sm flex items-center space-x-4">
              <div className="text-3xl bg-emerald-50 p-3 rounded-2xl">📈</div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Career Evolution Risk</span>
                <h4 className="text-sm font-black text-zinc-950 mt-0.5">HIGH IMPACT</h4>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#eae6db] overflow-x-auto gap-2">
            {[
              { id: "profile", label: "⚙️ Profile & Skills" },
              { id: "impact", label: "📊 AI Task Impact" },
              { id: "portfolio", label: "📋 Skill Portfolio" },
              { id: "gap", label: "⚠️ Your Skill Gap" },
              { id: "readiness", label: "🤖 AI Readiness" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-5 text-xs font-extrabold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#e2583e] text-[#e2583e]"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Profile & Skills setup */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Config Profile */}
              <div className="lg:col-span-1 bg-white border border-[#eae6db] rounded-3xl p-6 shadow-sm space-y-4 h-fit">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Configure Parameters</h3>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Chosen Career</label>
                    <select
                      value={selectedOccupationName}
                      onChange={(e) => setSelectedOccupationName(e.target.value)}
                      className="w-full bg-[#fdfdfc] border border-slate-200 rounded-2xl p-2.5 text-xs font-bold focus:outline-none"
                    >
                      {occupations.map((o) => (
                        <option key={o._id} value={o.name}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Years of Experience</label>
                    <input
                      type="number"
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                      className="w-full bg-[#fdfdfc] border border-slate-200 rounded-2xl p-2.5 text-xs font-bold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-[#fdfdfc] border border-slate-200 rounded-2xl p-2.5 text-xs font-bold focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="w-full bg-[#e2583e] hover:bg-[#c8452d] text-white rounded-2xl py-2.5 text-xs font-bold transition shadow"
                  >
                    {savingProfile ? "Saving..." : "Update Profile"}
                  </button>
                </form>
              </div>

              {/* Right Column: Skill Levels Sliders */}
              <div className="lg:col-span-2 bg-white border border-[#eae6db] rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">🎚️ Calibrate Skill Levels</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Adjust parameters to represent your current expertise level for each skill.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveSliderLevels}
                    disabled={savingProfile}
                    className="bg-[#0f0f11] hover:bg-slate-800 text-white rounded-2xl px-4 py-2 text-xs font-bold transition"
                  >
                    {savingProfile ? "Saving..." : "✓ Save Slider Levels"}
                  </button>
                </div>

                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <div key={index} className="border border-slate-100 rounded-2xl p-3.5 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-extrabold text-slate-800">{skill.name}</span>
                          <span className="font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md">
                            {skill.proficiency}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skill.proficiency}
                          onChange={(e) => handleSliderChange(skill.name, e.target.value)}
                          className="w-full accent-[#e2583e] cursor-pointer"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic text-center py-8">
                      No skills seeded. Set a career goal above to auto-populate default skill models.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI Task Impact */}
          {activeTab === "impact" && (
            <div className="bg-white border border-[#eae6db] rounded-3xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">📊 Task-Level AI Analysis</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  See how tasks within the <strong>{selectedOccupationName}</strong> career are affected by technology.
                </p>
              </div>

              <div className="space-y-6">
                {currentOccDetails && currentOccDetails.tasks && currentOccDetails.tasks.length > 0 ? (
                  currentOccDetails.tasks.map((task, i) => (
                    <div key={i} className="border border-slate-100 rounded-3xl p-5 hover:bg-slate-50/30 transition space-y-4">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{task.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{task.description}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          task.aiImpact >= 75
                            ? "bg-rose-50 border-rose-100 text-rose-700"
                            : task.aiImpact >= 45
                            ? "bg-amber-50 border-amber-100 text-amber-700"
                            : "bg-emerald-50 border-emerald-100 text-emerald-700"
                        }`}>
                          AI Impact: {task.aiImpact >= 75 ? "High" : task.aiImpact >= 45 ? "Medium" : "Low"}
                        </span>
                      </div>

                      {/* Gauges Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">AI Replacement (Automation)</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-[#e2583e] h-2 rounded-full" style={{ width: `${task.automationPotential}%` }} />
                            </div>
                            <span className="text-xs font-extrabold text-slate-700">{task.automationPotential}%</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">AI Support (Augmentation)</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${task.augmentationPotential}%` }} />
                            </div>
                            <span className="text-xs font-extrabold text-slate-700">{task.augmentationPotential}%</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Human Element (AI-Resistant)</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${task.humanImportance}%` }} />
                            </div>
                            <span className="text-xs font-extrabold text-slate-700">{task.humanImportance}%</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Future Importance</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${task.futureImportance}%` }} />
                            </div>
                            <span className="text-xs font-extrabold text-slate-700">{task.futureImportance}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Explanation */}
                      <p className="text-[11px] text-slate-600 bg-slate-50 border border-slate-100 rounded-2xl p-3 leading-relaxed italic">
                        "{task.explanation}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-10">No tasks data found for chosen career.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Skill Portfolio */}
          {activeTab === "portfolio" && (
            <div className="space-y-6">
              {/* Evolution Timeline */}
              <div className="bg-white border border-[#eae6db] rounded-3xl p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">⏳ How Your Career Is Evolving</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Careers evolve rather than simply disappear. View the historical timeline.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {currentOccDetails?.timeline?.map((t, idx) => (
                    <div key={idx} className="relative border border-slate-100 bg-[#fdfdfc] rounded-2xl p-4 space-y-1">
                      <span className="text-[9px] font-black text-white bg-[#e2583e] rounded-full px-2 py-0.5 absolute -top-2.5 left-4">
                        Phase {idx + 1}
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-800 pt-1">{t.phaseName}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{t.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Classification tabs */}
              <div className="bg-white border border-[#eae6db] rounded-3xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">📋 Skill Classification Portfolio</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Explore standard skill splits categorized for the AI era.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Core Skills */}
                  <div className="bg-[#fcfaf7] border border-orange-100 rounded-3xl p-4 space-y-3">
                    <h4 className="text-xs font-black text-[#e2583e] uppercase tracking-wider">🔒 Core Skills (Retain)</h4>
                    <p className="text-[10px] text-slate-400">Essential foundation skills you must continue developing.</p>
                    <ul className="space-y-1.5 pt-2">
                      {currentOccDetails?.coreSkills?.map((s, idx) => (
                        <li key={idx} className="text-xs font-bold text-slate-700 bg-white border border-slate-100 rounded-xl px-3 py-1.5">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Augmented */}
                  <div className="bg-blue-50/20 border border-blue-100 rounded-3xl p-4 space-y-3">
                    <h4 className="text-xs font-black text-blue-700 uppercase tracking-wider">⚡ AI-Augmented Workflow</h4>
                    <p className="text-[10px] text-slate-400">Skills where AI tools speed up delivery and assist manual tasks.</p>
                    <ul className="space-y-1.5 pt-2">
                      {currentOccDetails?.aiAugmentedSkills?.map((s, idx) => (
                        <li key={idx} className="text-xs font-bold text-slate-700 bg-white border border-slate-100 rounded-xl px-3 py-1.5">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Emerging */}
                  <div className="bg-purple-50/20 border border-purple-100 rounded-3xl p-4 space-y-3">
                    <h4 className="text-xs font-black text-purple-700 uppercase tracking-wider">✨ Emerging AI Skills</h4>
                    <p className="text-[10px] text-slate-400">New tools and APIs you should add to remain relevant.</p>
                    <ul className="space-y-1.5 pt-2">
                      {currentOccDetails?.emergingSkills?.map((s, idx) => (
                        <li key={idx} className="text-xs font-bold text-slate-700 bg-white border border-slate-100 rounded-xl px-3 py-1.5">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Human Centric */}
                  <div className="bg-emerald-50/20 border border-emerald-100 rounded-3xl p-4 space-y-3">
                    <h4 className="text-xs font-black text-emerald-700 uppercase tracking-wider">🤝 Human-Centric (Resistant)</h4>
                    <p className="text-[10px] text-slate-400">Logic, strategy, and empathy skills resistant to automated scripts.</p>
                    <ul className="space-y-1.5 pt-2">
                      {currentOccDetails?.humanCentricSkills?.map((s, idx) => (
                        <li key={idx} className="text-xs font-bold text-slate-700 bg-white border border-slate-100 rounded-xl px-3 py-1.5">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Your Skill Gap & Roadmap Enhancer */}
          {activeTab === "gap" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Panel: Compare Gaps */}
              <div className="lg:col-span-2 bg-white border border-[#eae6db] rounded-3xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">⚠️ AI-Era Skill Gap Analysis</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Compare your current proficiency sliders against target thresholds (75%).
                  </p>
                </div>

                <div className="space-y-4">
                  {currentOccDetails?.emergingSkills?.map((skillName, index) => {
                    const matchedUserSkill = profile.skills.find(
                      (us) => us.name.toLowerCase() === skillName.toLowerCase()
                    );
                    const userProf = matchedUserSkill ? matchedUserSkill.proficiency : 0;
                    const reqProf = 75;
                    const gap = Math.max(0, reqProf - userProf);

                    return (
                      <div key={index} className="border border-slate-100 rounded-2xl p-4 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-extrabold text-slate-800">{skillName}</span>
                          <span className="font-bold text-slate-600">
                            Your Level: {userProf}% / Target: {reqProf}%
                          </span>
                        </div>

                        {/* Comparative progress bar */}
                        <div className="w-full bg-slate-100 h-2.5 rounded-full relative overflow-hidden">
                          <div className="absolute bg-slate-300 h-2.5 rounded-full" style={{ width: `${reqProf}%` }} />
                          <div
                            className={`absolute h-2.5 rounded-full transition-all duration-500 ${
                              userProf >= reqProf ? "bg-emerald-500" : "bg-[#e2583e]"
                            }`}
                            style={{ width: `${userProf}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-[10px]">
                          <span className={`font-bold ${userProf >= reqProf ? "text-emerald-700" : "text-[#e2583e]"}`}>
                            {userProf >= reqProf ? "✓ Target Met" : `Gap: ${gap}%`}
                          </span>
                          <button
                            onClick={() => navigate("/skills")}
                            className="text-[#e2583e] hover:text-[#c8452d] font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            📝 Adjust Level &rarr;
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Panel: Add to Roadmap Enhancer */}
              <div className="lg:col-span-1 bg-white border border-[#eae6db] rounded-3xl p-6 shadow-sm space-y-5 h-fit">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">🚀 Add to Roadmap</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select recommended AI modules to inject them into your learning roadmap.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {currentOccDetails?.emergingSkills?.map((skillName, index) => (
                    <label key={index} className="flex items-center space-x-3 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!checkedSkills[skillName]}
                        onChange={(e) => setCheckedSkills({ ...checkedSkills, [skillName]: e.target.checked })}
                        className="rounded accent-[#e2583e] h-4 w-4 cursor-pointer"
                      />
                      <span>{skillName}</span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={handleEnhanceRoadmap}
                  disabled={enhancing}
                  className="w-full bg-[#0f0f11] hover:bg-slate-800 text-white rounded-2xl py-3 text-xs font-bold transition shadow active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {enhancing ? "Injecting Modules..." : "Add to Active Roadmap"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: AI Readiness Score Breakdown */}
          {activeTab === "readiness" && (
            <div className="space-y-6">
              {/* Readiness formula cards */}
              <div className="bg-white border border-[#eae6db] rounded-3xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">⚡ AI Readiness Score Breakdown</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Deterministic score out of 100 computed from 6 weighted readiness factors.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { key: "coreCareerSkills", label: "Core Foundation", weight: "30%" },
                    { key: "aiAssistedWorkflow", label: "AI Workflow", weight: "20%" },
                    { key: "aiApplicationSkills", label: "AI Integration", weight: "20%" },
                    { key: "aiEvaluation", label: "AI Evaluation", weight: "10%" },
                    { key: "aiSecurity", label: "AI Security", weight: "10%" },
                    { key: "projects", label: "AI Projects", weight: "10%" },
                  ].map((item, idx) => {
                    const val = profile.aiReadinessBreakdown ? profile.aiReadinessBreakdown[item.key] || 0 : 0;
                    return (
                      <div key={idx} className="border border-slate-100 bg-[#fdfdfc] rounded-2xl p-4 text-center space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase block tracking-wider">
                          {item.label}
                        </span>
                        <div className="text-2xl font-black text-slate-800">{val}%</div>
                        <span className="text-[9px] text-slate-400 block font-bold">Weight: {item.weight}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Projects & AI Q&A Coach */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Projects */}
                <div className="lg:col-span-2 bg-white border border-[#eae6db] rounded-3xl p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">🛠️ Practical Project Recommendations</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Practice your skills and boost your project index by building demo-ready portfolios.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {getProjectRecommendations().map((p, idx) => (
                      <div key={idx} className="border border-slate-100 rounded-2xl p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-slate-800">{p.title}</h4>
                          <div className="flex gap-1.5 flex-wrap">
                            {p.skills.map((s, i) => (
                              <span key={i} className="text-[9px] font-bold bg-orange-50 border border-orange-100 text-[#e2583e] rounded-md px-1.5 py-0.5">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Q&A Coach Drawer */}
                <div className="lg:col-span-1 bg-white border border-[#eae6db] rounded-3xl p-6 shadow-sm space-y-5 h-fit">
                  <div>
                    <h3 className="text-base font-extrabold text-[#e2583e]">🤖 AI Career Coach</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Have questions about your evolution? Query the O*NET data assistant.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleAskCoach(`Why is RAG important for ${selectedOccupationName}?`)}
                      className="w-full text-left text-[11px] text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl p-2.5 font-bold transition border border-slate-100 cursor-pointer"
                    >
                      💡 Why RAG is crucial for me?
                    </button>
                    <button
                      onClick={() => handleAskCoach(`What are AI security concerns in my role?`)}
                      className="w-full text-left text-[11px] text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl p-2.5 font-bold transition border border-slate-100 cursor-pointer"
                    >
                      💡 Tell me about AI security threats
                    </button>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <input
                      type="text"
                      placeholder="Ask the coach custom advice..."
                      value={qaQuery}
                      onChange={(e) => setQaQuery(e.target.value)}
                      className="w-full bg-[#fdfdfc] border border-slate-200 rounded-2xl p-2.5 text-xs focus:outline-none focus:border-[#e2583e]"
                    />
                    <button
                      onClick={() => handleAskCoach()}
                      disabled={loadingCoach}
                      className="w-full bg-[#e2583e] hover:bg-[#c8452d] text-white rounded-2xl py-2.5 text-xs font-bold transition"
                    >
                      {loadingCoach ? "Asking Coach..." : "Ask Coach"}
                    </button>
                  </div>

                  {aiCoachReply && (
                    <div className="mt-3 text-[11px] text-slate-600 bg-[#fcfaf7] border border-slate-100 rounded-xl p-3 leading-relaxed italic animate-fadeIn">
                      "{aiCoachReply}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CareerIntelligenceLayout;
