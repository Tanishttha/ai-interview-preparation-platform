import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronRight, BookOpen, Clock, Settings, UserCheck } from 'lucide-react';
import { RoadmapItem } from '../types';
import { apiFetch } from '../lib/apiClient';

interface PersonalizedRoadmapProps {
  isDark?: boolean;
}

export default function PersonalizedRoadmap({ isDark = false }: PersonalizedRoadmapProps) {
  const [targetCompany, setTargetCompany] = useState('Google');
  const [targetRole, setTargetRole] = useState('Software Engineer I');
  const [currentSkills, setCurrentSkills] = useState('Basic Data Structures, Java');
  const [collegeYear, setCollegeYear] = useState('3rd Year');
  const [timeAvailable, setTimeAvailable] = useState('3 Months');
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Roadmap State
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);

  // -------------------------------------------------------------
  // Clean, Non-Mixed Theme Class Variables
  // -------------------------------------------------------------
  const bgMain = isDark ? 'bg-[#0B0F17]' : 'bg-white';
  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const borderPrimary = isDark ? 'border-slate-800' : 'border-slate-200';
  
  const cardBg = isDark ? 'bg-[#0F172A]' : 'bg-white';
  const subCardBg = isDark ? 'bg-[#161B22]' : 'bg-slate-50';
  const inputBg = isDark ? 'bg-[#161B22] text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 text-slate-900 placeholder:text-slate-400';

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/ai/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCompany,
          targetRole,
          currentSkills,
          collegeYear,
          timeAvailable
        })
      });

      if (!res.ok) {
        throw new Error('Failed to generate roadmap from AI service.');
      }

      const data = await res.json();
      setRoadmap(data);
      setGenerated(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during roadmap generation.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = (weekIndex: number, taskId: string) => {
    const updated = [...roadmap];
    const wk = updated[weekIndex];
    const task = wk.tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
    }
    // Calculate new week progress %
    const completedCount = wk.tasks.filter((t) => t.completed).length;
    wk.progress = Math.round((completedCount / wk.tasks.length) * 100);
    setRoadmap(updated);
  };

  const overallProgress = roadmap.length > 0
    ? Math.round(roadmap.reduce((sum, wk) => sum + wk.progress, 0) / roadmap.length)
    : 0;

  return (
    <div className={`p-6 space-y-6 min-h-screen transition-colors duration-300 ${bgMain} ${textPrimary}`}>
      {!generated ? (
        <div className={`max-w-2xl mx-auto p-6 sm:p-8 border rounded-3xl space-y-6 ${cardBg} ${borderPrimary}`}>
          <div className="space-y-1">
            <span className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-cyan-400' : 'text-blue-700'
            }`}>
              <Sparkles className="w-4 h-4" /> AI Prep Customizer
            </span>
            <h2 className={`text-xl font-bold ${textPrimary}`}>Configure Your AI Personalized Roadmap</h2>
            <p className={`text-xs font-medium ${textSecondary}`}>
              Our models parse your skill gaps against target company pipelines to produce custom, week-wise milestones.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl font-medium">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-4 text-xs font-medium">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={`font-bold block uppercase tracking-wider text-[10px] ${textSecondary}`}>Target Company</label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-500 transition-all ${inputBg} ${borderPrimary}`}
                />
              </div>
              <div className="space-y-1.5">
                <label className={`font-bold block uppercase tracking-wider text-[10px] ${textSecondary}`}>Target Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-500 transition-all ${inputBg} ${borderPrimary}`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`font-bold block uppercase tracking-wider text-[10px] ${textSecondary}`}>Current Skills / Tech Stack</label>
              <textarea
                value={currentSkills}
                onChange={(e) => setCurrentSkills(e.target.value)}
                placeholder="List major languages, framework familiarity, or past interns..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-500 resize-none transition-all ${inputBg} ${borderPrimary}`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={`font-bold block uppercase tracking-wider text-[10px] ${textSecondary}`}>College / Current Year</label>
                <select
                  value={collegeYear}
                  onChange={(e) => setCollegeYear(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-500 cursor-pointer transition-all ${inputBg} ${borderPrimary}`}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year / Graduate</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={`font-bold block uppercase tracking-wider text-[10px] ${textSecondary}`}>Time Available</label>
                <select
                  value={timeAvailable}
                  onChange={(e) => setTimeAvailable(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-500 cursor-pointer transition-all ${inputBg} ${borderPrimary}`}
                >
                  <option value="1 Month">1 Month</option>
                  <option value="2 Months">2 Months</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>Generating prep steps... <Sparkles className="w-4 h-4 animate-spin" /></>
              ) : (
                <>Generate AI Prep Roadmap <Sparkles className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dashboard Progress Header */}
          <div className={`p-6 border rounded-3xl relative overflow-hidden ${
            isDark 
              ? 'bg-[#0F172A] border-slate-800' 
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
              <div className="space-y-1">
                <p className={`text-xs font-mono font-bold flex items-center gap-1.5 uppercase ${
                  isDark ? 'text-cyan-400' : 'text-blue-700'
                }`}>
                  <Sparkles className="w-3.5 h-3.5" /> AI Custom Roadmap Active
                </p>
                <h3 className={`text-xl font-extrabold tracking-tight ${textPrimary}`}>
                  {targetCompany} {targetRole} Track
                </h3>
                <p className={`text-[10px] font-medium ${textSecondary}`}>Customized specifically for Mehak (College: {collegeYear})</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className={`text-[10px] uppercase tracking-wider block font-bold font-mono ${textSecondary}`}>Overall Progress</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 text-lg font-bold font-mono">{overallProgress}%</strong>
                </div>
                <button
                  onClick={() => setGenerated(false)}
                  className={`p-2 border rounded-xl transition-colors cursor-pointer ${
                    isDark ? 'border-slate-800 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Configure Roadmap Parameters"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Overall progress indicator bar */}
            <div className={`w-full h-2 rounded-full mt-6 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Week list */}
          <div className="space-y-6">
            {roadmap.map((week, wkIdx) => (
              <div
                key={week.week}
                className={`p-6 border rounded-3xl space-y-4 ${cardBg} ${borderPrimary}`}
              >
                <div className={`flex justify-between items-center pb-3 border-b ${borderPrimary}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 font-bold rounded-xl flex items-center justify-center text-xs border ${
                      isDark ? 'bg-blue-500/10 border-blue-500/20 text-cyan-400' : 'bg-blue-50 border-blue-100 text-blue-700'
                    }`}>
                      W{week.week}
                    </span>
                    <div>
                      <h4 className={`font-bold text-sm ${textPrimary}`}>{week.title}</h4>
                      <p className={`text-[10px] font-medium ${textSecondary}`}>Track tasks & earn dynamic XP multipliers</p>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-bold ${textSecondary}`}>{week.progress}% Done</span>
                </div>

                <div className="space-y-2.5">
                  {week.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(wkIdx, task.id)}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        task.completed
                          ? (isDark 
                              ? 'bg-blue-500/10 border-blue-500/20 text-slate-500 line-through' 
                              : 'bg-blue-50/60 border-blue-200 text-slate-400 line-through')
                          : (isDark 
                              ? 'bg-[#161B22] border-slate-800 text-slate-200 hover:border-slate-700' 
                              : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100')
                      }`}
                    >
                      <div className="flex items-center gap-3 text-xs font-medium">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {}} // Controlled by outer div click
                          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 border-slate-300 pointer-events-none"
                        />
                        <span>{task.text}</span>
                      </div>
                      <span className={`px-2 py-0.5 border rounded text-[9px] font-mono shrink-0 uppercase tracking-wider font-bold ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}>
                        {task.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}