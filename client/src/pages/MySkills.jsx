import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getCareerProfile, updateCareerProfile } from "../services/careerService";
import { useNavigate } from "react-router-dom";

const SKILL_CATEGORIES = [
  "Technical",
  "Analytical",
  "Communication",
  "Domain",
  "Management",
  "Digital",
  "AI",
  "Creative",
];

function MySkills() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // Data states
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Technical");
  const [newSkillProficiency, setNewSkillProficiency] = useState(30);

  // Status states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await getCareerProfile(token);
      if (res.status === "success" && res.data.profile) {
        setProfile(res.data.profile);
        setSkills(res.data.profile.skills || []);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to synchronize skills inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    // Check if skill already exists
    const exists = skills.some(
      (s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase()
    );
    if (exists) {
      setErrorMsg("Skill already exists in your inventory.");
      return;
    }

    const updatedSkills = [
      ...skills,
      {
        name: newSkillName.trim(),
        proficiency: Number(newSkillProficiency),
        source: "self-assessed",
        lastAssessed: new Date(),
      },
    ];

    try {
      setSaving(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await updateCareerProfile({ skills: updatedSkills }, token);
      if (res.status === "success") {
        setSuccessMsg(`Skill "${newSkillName.trim()}" added to inventory.`);
        setNewSkillName("");
        setNewSkillProficiency(30);
        setSkills(res.data.profile.skills || []);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to add skill.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    const updatedSkills = skills.filter((s) => s._id !== skillId);

    try {
      setSaving(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await updateCareerProfile({ skills: updatedSkills }, token);
      if (res.status === "success") {
        setSuccessMsg("Skill removed from inventory.");
        setSkills(res.data.profile.skills || []);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to remove skill.");
    } finally {
      setSaving(false);
    }
  };

  const handleProficiencyChange = async (skillId, val) => {
    const updatedSkills = skills.map((s) =>
      s._id === skillId ? { ...s, proficiency: Number(val), source: "self-assessed" } : s
    );
    setSkills(updatedSkills);
  };

  const handleSaveProficiencies = async () => {
    try {
      setSaving(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await updateCareerProfile({ skills }, token);
      if (res.status === "success") {
        setSuccessMsg("Proficiency adjustments saved!");
        setSkills(res.data.profile.skills || []);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save proficiency updates.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e2583e]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-fadeIn px-2">
      {/* Header */}
      <div className="border-b border-[#eae6db] pb-5">
        <h1 className="text-3xl font-extrabold text-[#0f0f11] tracking-tight">
          My Skills Portfolio
        </h1>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed max-w-3xl">
          Manage your skills list. Adjust the sliders to match your current levels, or take a quick quiz to test your skills.
        </p>
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-900 p-4 rounded-2xl text-xs font-semibold animate-scaleUp">
          🎉 {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl text-xs font-semibold animate-scaleUp">
          ⚠️ {errorMsg}
        </div>
      )}

      {!profile ? (
        <div className="bg-white border border-[#eae6db] rounded-3xl p-8 text-center space-y-4 shadow-sm max-w-lg mx-auto">
          <div className="text-5xl">👤</div>
          <h3 className="text-lg font-black text-slate-900 leading-none">Set Up Profile First</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Please set up your job profile first to access your skills list.
          </p>
          <button
            onClick={() => navigate("/career")}
            className="bg-[#e2583e] hover:bg-[#c8452d] text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-md cursor-pointer"
          >
            Set Up Profile &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: Add Skill form */}
          <div className="lg:col-span-1 bg-white border border-[#eae6db] rounded-3xl p-5 shadow-sm space-y-4 h-fit">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              ➕ Add a New Skill
            </h3>
            
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1" htmlFor="skillName">
                  Skill Name
                </label>
                <input
                  id="skillName"
                  type="text"
                  placeholder="e.g. SQL, Power BI, Figma"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-[#faf7f2] px-4 py-2.5 text-xs outline-none focus:border-[#e2583e] transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1" htmlFor="skillCategory">
                  Category
                </label>
                <select
                  id="skillCategory"
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-[#faf7f2] px-4 py-2.5 text-xs outline-none focus:border-[#e2583e] transition"
                >
                  {SKILL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Proficiency (Self-Assessed): {newSkillProficiency}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newSkillProficiency}
                  onChange={(e) => setNewSkillProficiency(e.target.value)}
                  className="w-full accent-[#e2583e] cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#e2583e] hover:bg-[#c8452d] text-white rounded-2xl py-3 text-xs font-bold transition shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {saving ? "Processing..." : "Add to My Skills"}
              </button>
            </form>
          </div>

          {/* Right Panel: Skills List */}
          <div className="lg:col-span-2 bg-white border border-[#eae6db] rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  📋 My Skills List ({skills.length})
                </h3>
                <p className="text-[11px] text-slate-400">
                  Adjust the sliders below to set your skill levels, or take a quiz to test them.
                </p>
              </div>
              <div>
                <button
                  onClick={handleSaveProficiencies}
                  disabled={saving}
                  className="bg-[#0f0f11] hover:bg-slate-800 text-white rounded-2xl px-4 py-2 text-xs font-bold transition cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : "✓ Save Slider Levels"}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <div
                    key={skill._id}
                    className="border border-slate-100 rounded-2xl p-4 space-y-3 hover:bg-slate-50/20 transition flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-black text-slate-800 leading-none">{skill.name}</h4>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 inline-block">
                          Source: {skill.source}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate("/assessment", { state: { skillName: skill.name } })}
                          className="bg-orange-50 text-[#e2583e] border border-orange-100 hover:bg-orange-100/50 rounded-xl px-3 py-1 text-[10px] font-bold transition cursor-pointer"
                        >
                          📝 Take Quiz
                        </button>
                        <button
                          onClick={() => handleRemoveSkill(skill._id)}
                          disabled={saving}
                          className="text-slate-300 hover:text-rose-600 transition text-sm p-1 cursor-pointer"
                          title="Remove skill"
                        >
                          🗑
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>Self Calibration:</span>
                        <span>{skill.proficiency}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.proficiency}
                        onChange={(e) => handleProficiencyChange(skill._id, e.target.value)}
                        className="w-full accent-[#e2583e] cursor-pointer"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400 italic">
                  Your skills inventory is currently empty. Use the left configuration console to add your competencies.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MySkills;
