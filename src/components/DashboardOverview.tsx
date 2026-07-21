import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { apiFetch } from '../lib/apiClient';

interface DashboardOverviewProps {
  onNavigate: (tab: any) => void;
  isDark: boolean;
}

export default function DashboardOverview({ onNavigate, isDark }: DashboardOverviewProps) {
  // Analytical Prediction State
  const [cgpa, setCgpa] = useState(8.2);
  const [branch, setBranch] = useState('Computer Science');
  const [targetCompany, setTargetCompany] = useState('Google');
  const [problemsSolved, setProblemsSolved] = useState(142);
  const [resumeScore, setResumeScore] = useState(89);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>({
    eligible: true,
    predicted_probability: 84,
    reasoning: "Your selection probability is based heavily on your high problem-solving throughput and core programming knowledge base.",
    gaps: [
      "Requires more advanced practice on Heap & Tries",
      "Missing low-level system design concurrency models"
    ]
  });

  // Streak & XP State
  const [streakDays, setStreakDays] = useState(5);
  const [userXp, setUserXp] = useState(2150);
  const [streakClaimed, setStreakClaimed] = useState(false);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  const candidateName =
    localStorage.getItem("userName") ||
    localStorage.getItem("displayName") ||
    "Candidate";

  // Load backend profile & metrics on mount
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        setIsDashboardLoading(true);
        const profileRes = await apiFetch('/api/user/profile');
        if (profileRes.ok) {
          const p = await profileRes.json();
          if (p) {
            if (p.cgpa !== undefined) setCgpa(p.cgpa);
            if (p.branch) setBranch(p.branch);
            if (p.problemsSolved !== undefined) setProblemsSolved(p.problemsSolved);
            if (p.resumeScore !== undefined) setResumeScore(p.resumeScore);
            if (p.targetCompany) setTargetCompany(p.targetCompany);
          }
        }

        const metricsRes = await apiFetch('/api/user/dashboard');
        if (metricsRes.ok) {
          const m = await metricsRes.json();
          if (m) {
            if (m.xp !== undefined) setUserXp(m.xp);
            if (m.dailyStreak !== undefined) setStreakDays(m.dailyStreak);
            if (m.streakClaimed !== undefined) setStreakClaimed(m.streakClaimed);
          }
        }
      } catch (err) {
        console.error("Dashboard mount backend synchronization failed:", err);
      } finally {
        setIsDashboardLoading(false);
      }
    };
    loadBackendData();
  }, []);

  const handlePredictEligibility = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    try {
      const res = await apiFetch('/api/ai/company/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cgpa,
          branch,
          skills: ['React', 'Node.js', 'System Design'],
          target_company_id: targetCompany,
          problemsSolved,
          resumeScore
        })
      });
      const resData = await res.json();
      setPredictionResult(resData);

      await apiFetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cgpa,
          branch,
          problemsSolved,
          resumeScore,
          targetCompany
        })
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsPredicting(false);
    }
  };

  // Reusable Card Style with High Contrast for Light Mode
  const cardStyle = isDark
    ? 'bg-gray-900/50 border-gray-800 rounded-3xl text-white'
    : 'bg-white border-slate-200 rounded-[28px] shadow-sm text-slate-900';

  const inputStyle = isDark
    ? 'bg-gray-950 border-gray-800 text-white focus:border-blue-500'
    : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10';

  const [heatmapDay, setHeatmapDay] = useState(() => new Date().toDateString());

  useEffect(() => {
    const updateAtMidnight = () => {
      setHeatmapDay(new Date().toDateString());
    };

    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);

    const timer = window.setTimeout(() => {
      updateAtMidnight();
      const interval = window.setInterval(updateAtMidnight, 24 * 60 * 60 * 1000);
      return () => window.clearInterval(interval);
    }, nextMidnight.getTime() - now.getTime());

    return () => window.clearTimeout(timer);
  }, []);

  // Backend practice history clean data source
  const practiceHistory: { date: string; solvedProblems: number }[] = [];

  const heatmapData = useMemo(() => {
    const days = [];
    const today = new Date(heatmapDay);

    // Map practiceHistory array into a fast lookup object (YYYY-MM-DD -> solved count)
    const historyMap: Record<string, number> = {};
    practiceHistory.forEach((item) => {
      if (item.date) {
        historyMap[item.date] = item.solvedProblems || 0;
      }
    });

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const key = date.toISOString().split('T')[0];
      const solved = historyMap[key] || 0;

      days.push({
        date,
        dateLabel: date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }),
        solved,
        level: solved === 0 ? 0 : solved === 1 ? 1 : solved <= 3 ? 2 : 3
      });
    }

    const padded = [...days];
    const firstDay = padded[0].date.getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < offset; i++) {
      padded.unshift(null);
    }

    while (padded.length % 7 !== 0) {
      padded.push(null);
    }

    const weeks: (typeof padded)[] = [];
    for (let i = 0; i < padded.length; i += 7) {
      weeks.push(padded.slice(i, i + 7));
    }

    return weeks;
  }, [heatmapDay]);

  const monthLabels = useMemo(() => {
    const labels: { month: string; week: number }[] = [];
    heatmapData.forEach((week, index) => {
      const first = week.find(Boolean) as any;
      if (first && first.date.getDate() <= 7) {
        labels.push({
          month: first.date.toLocaleDateString('en-US', { month: 'short' }),
          week: index
        });
      }
    });
    return labels;
  }, [heatmapData]);

  // Latest Notes Data Array
  const latestNotes = [
    {
      id: '1',
      title: 'Dynamic Programming Revision',
      updatedAt: 'Last updated 8 min ago',
      subject: 'DSA'
    },
    {
      id: '2',
      title: 'Operating System Deadlocks',
      updatedAt: 'Yesterday',
      subject: 'OS'
    },
    {
      id: '3',
      title: 'DBMS Normalization',
      updatedAt: '2 days ago',
      subject: 'DBMS'
    },
    {
      id: '4',
      title: 'System Design Basics',
      updatedAt: '5 days ago',
      subject: 'System'
    }
  ];

  // Weekdays mapping to indices (Mon=0, Wed=2, Fri=4) for alignment derivation
  const weekdayMap: Record<number, string> = {
    0: 'Mon',
    2: 'Wed',
    4: 'Fri'
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className={`md:col-span-12 p-6 md:p-8 ${
          isDark
            ? 'bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent border border-blue-500/10 rounded-3xl'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[28px] shadow-lg shadow-blue-500/20'
        } flex flex-col justify-center space-y-4 relative overflow-hidden`}>
          
          <div className="space-y-3 relative z-10">
            <span className={`text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider font-mono ${
              isDark ? 'text-blue-400' : 'text-blue-100 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/20'
            }`}>
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> High-Performance Active Mode
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              <span className="block">Hello, {candidateName}!</span>
              <span className="block text-xl md:text-2xl font-semibold mt-1">
                Ready to level up today?
              </span>
            </h2>
          </div>

          <div className="flex flex-col items-end justify-center gap-3 absolute right-8 top-1/2 -translate-y-1/2 z-10">
            <button
              onClick={() => onNavigate('mock-interview')}
              className={`px-5 py-3 rounded-2xl text-xs font-bold shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                isDark 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                  : 'bg-white text-blue-700 hover:bg-blue-50 font-bold'
              }`}
            >
              Start Live Voice Simulation
            </button>
            <button
              onClick={() => onNavigate('roadmap')}
              className={`px-5 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white/15 border border-white/30 text-white hover:bg-white/25'
              }`}
            >
              View Company Roadmaps
            </button>
          </div>
        </div>
      </div>

      {/* Daily Practice Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`lg:col-span-12 p-6 border ${cardStyle} space-y-5`}>
          <div>
            <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Daily Practice Heatmap
            </h3>
            <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              Last 365 Days of coding consistency
            </p>
          </div>

          <div className="overflow-x-auto pb-3">
            <div
              className="mx-auto"
              style={{ minWidth: `${heatmapData.length * 16 + 64}px` }}
            >
              <div className="ml-10 h-6 relative text-[11px] font-medium text-slate-500 dark:text-gray-400">
                {monthLabels.map((item) => (
                  <span key={`${item.month}-${item.week}`} className="absolute" style={{ left: `${item.week * 16}px` }}>
                    {item.month}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                {/* Weekday labels sharing the exact column/row flex structure as contribution columns */}
                <div className="flex flex-col gap-1 text-[10px] text-slate-500 dark:text-gray-400">
                  {[0, 1, 2, 3, 4, 5, 6].map((rowIndex) => (
                    <div key={rowIndex} className="h-3.5 flex items-center justify-start">
                      {weekdayMap[rowIndex] || ''}
                    </div>
                  ))}
                </div>

                <div className="flex gap-1">
                  {heatmapData.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.map((day: any, dayIndex: number) => {
                        if (!day) return <div key={dayIndex} className="w-3.5 h-3.5" />;

                        const colors = isDark
                          ? ['bg-gray-800', 'bg-blue-900', 'bg-blue-600', 'bg-blue-400']
                          : ['bg-slate-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-600'];

                        const isToday = day.date.toDateString() === new Date().toDateString();

                        return (
                          <div
                            key={dayIndex}
                            title={`${day.dateLabel}\n${day.solved} Problems Solved`}
                            className={`w-3.5 h-3.5 rounded-sm ${colors[day.level]} transition-all hover:scale-125 ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-gray-400">
            <span>Less</span>
            {[0, 1, 2, 3].map((level) => (
              <span key={level} className={`w-3.5 h-3.5 rounded-sm ${isDark ? ['bg-gray-800','bg-blue-900','bg-blue-600','bg-blue-400'][level] : ['bg-slate-100','bg-blue-200','bg-blue-400','bg-blue-600'][level]}`} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Calculator & Latest Notes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Selection Probability Form - AI Placement Readiness Analyzer */}
        <div className={`lg:col-span-12 p-7 border ${
          isDark
            ? 'bg-gray-900/60 border-gray-800 rounded-3xl shadow-md'
            : 'bg-white border-slate-200 rounded-3xl shadow-sm'
        } space-y-7 transition-all`}>
          <div
            className={`flex items-start justify-between pb-4 border-b gap-2 transition-all ${
              isDark
                ? 'border-gray-800'
                : 'border-slate-200'
            }`}
          >
            <div>
              <h3 className={`font-extrabold text-lg tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                🤖 AI Placement Readiness Analyzer
              </h3>
              <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                Get an AI-powered analysis of your placement readiness, hiring strengths, and personalized improvement roadmap.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              AI Powered
            </span>
          </div>

          <form onSubmit={handlePredictEligibility} className="space-y-7 text-xs font-medium">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <span className={`text-[10px] font-bold block uppercase tracking-wider ${isDark ? 'text-blue-200/80' : 'text-blue-900/70'}`}>CGPA</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={cgpa}
                  onChange={(e) => setCgpa(parseFloat(e.target.value) || 0)}
                  className={`w-full p-3 rounded-2xl md:rounded-3xl border outline-none font-semibold transition-all duration-200
                    ${isDark
                      ? 'bg-gray-950 border-gray-800 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 caret-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 caret-blue-600'
                    }
                    shadow-inner focus:outline-none`}
                />
              </div>
              <div className="space-y-2.5">
                <span className={`text-[10px] font-bold block uppercase tracking-wider ${isDark ? 'text-blue-200/80' : 'text-blue-900/70'}`}>DSA Solved</span>
                <input
                  type="number"
                  value={problemsSolved}
                  onChange={(e) => setProblemsSolved(parseInt(e.target.value) || 0)}
                  className={`w-full p-3 rounded-2xl md:rounded-3xl border outline-none font-semibold transition-all duration-200
                    ${isDark
                      ? 'bg-gray-950 border-gray-800 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 caret-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 caret-blue-600'
                    }
                    shadow-inner focus:outline-none`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <span className={`text-[10px] font-bold block uppercase tracking-wider ${isDark ? 'text-blue-200/80' : 'text-blue-900/70'}`}>Resume ATS</span>
                <input
                  type="number"
                  value={resumeScore}
                  onChange={(e) => setResumeScore(parseInt(e.target.value) || 0)}
                  className={`w-full p-3 rounded-2xl md:rounded-3xl border outline-none font-semibold transition-all duration-200
                    ${isDark
                      ? 'bg-gray-950 border-gray-800 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 caret-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 caret-blue-600'
                    }
                    shadow-inner focus:outline-none`}
                />
              </div>
              <div className="space-y-2.5">
                <span className={`text-[10px] font-bold block uppercase tracking-wider ${isDark ? 'text-blue-200/80' : 'text-blue-900/70'}`}>Target Company</span>
                <select
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className={`w-full p-3 rounded-2xl md:rounded-3xl border outline-none font-semibold transition-all duration-200 cursor-pointer
                    ${isDark
                      ? 'bg-gray-950 border-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 caret-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 caret-blue-600'
                    }
                    shadow-inner focus:outline-none`}
                >
                  <option value="Google">Google</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Uber">Uber</option>
                </select>
              </div>
            </div>

            {/* AI Insight Info Card */}
            <div className={`w-full px-4 py-3 rounded-2xl md:rounded-3xl border flex items-start gap-3
              ${isDark
                ? 'bg-blue-500/10 border-blue-500/20 text-gray-100'
                : 'bg-blue-50 border-blue-100 text-slate-800'
              } shadow-sm`}>
              <span className="text-blue-500 text-lg mr-1 mt-0.5">✨</span>
              <div>
                <div className="font-bold text-xs mb-0.5">AI Insight</div>
                <div className="text-xs leading-snug font-medium">
                  We'll compare your profile against hiring expectations, analyze your resume strength, coding profile and identify your biggest improvement opportunities.
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPredicting}
              className={`w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl md:rounded-3xl text-[12px] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg shadow-blue-500/15
                ${isPredicting ? 'opacity-80 cursor-wait' : ''}
              `}
            >
              {isPredicting
                ? (<><RefreshCw className="w-4 h-4 animate-spin" />Analyzing with AI...</>)
                : <>✨ Analyze with AI</>
              }
            </button>
          </form>

          {/* AI Analysis Result */}
          {predictionResult && (
            <div className={`mt-2.5 p-0 pt-0.5`}>
              <div className={`rounded-3xl border shadow-md
                ${isDark
                  ? 'bg-gray-900 border-gray-800 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
                } overflow-hidden`}>
                <div
                  className={`px-5 pt-5 pb-2 border-b flex items-center gap-2 font-bold text-base tracking-tight transition-all ${
                    isDark
                      ? 'border-gray-800 text-white'
                      : 'border-slate-200 text-slate-900'
                  }`}
                >
                  ✨ AI Analysis
                </div>
                <div className="px-5 py-5 space-y-6">
                  {/* Metrics Row */}
                  <div className="flex flex-row gap-4 mb-2">
                    {/* Card 1: Selection Probability */}
                    <div className={`flex-1 px-4 py-3 rounded-2xl md:rounded-3xl border shadow-sm flex flex-col items-center
                      ${isDark
                        ? 'bg-gray-950 border-gray-800'
                        : 'bg-slate-50 border-slate-200'
                      }`}>
                      <div className="text-[11px] font-bold uppercase tracking-wide mb-1 text-blue-500">Selection Probability</div>
                      <div className={`text-2xl font-extrabold flex items-end gap-1 ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                        {predictionResult.predicted_probability ?? 84}
                        <span className="text-xs font-bold text-blue-400 mb-0.5">%</span>
                      </div>
                    </div>
                    {/* Card 2: Eligibility */}
                    <div className={`flex-1 px-4 py-3 rounded-2xl md:rounded-3xl border shadow-sm flex flex-col items-center
                      ${isDark
                        ? 'bg-gray-950 border-gray-800'
                        : 'bg-slate-50 border-slate-200'
                      }`}>
                      <div className="text-[11px] font-bold uppercase tracking-wide mb-1 text-blue-500">Eligibility</div>
                      <div className={`text-lg font-extrabold ${predictionResult.eligible
                        ? (isDark ? 'text-green-400' : 'text-green-700')
                        : (isDark ? 'text-amber-400' : 'text-amber-700')
                      }`}>
                        {predictionResult.eligible ? 'Eligible' : 'Needs Improvement'}
                      </div>
                    </div>
                  </div>

                  {/* AI Insights Section */}
                  <div>
                    <div className={`font-bold text-[13px] mb-1 flex items-center gap-1.5 ${isDark ? 'text-blue-200' : 'text-blue-900'}`}>
                      💡 AI Insights
                    </div>
                    <div className={`rounded-2xl md:rounded-3xl border px-4 py-3 mt-1 font-medium text-[12px] leading-relaxed shadow-sm
                      ${isDark
                        ? 'bg-gray-950/40 border-gray-800 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}>
                      {predictionResult.reasoning}
                    </div>
                  </div>

                  {/* Top Skill Gaps Section */}
                  {predictionResult.gaps?.length > 0 && (
                    <div className="pt-3">
                      <div className={`text-[11px] font-bold uppercase font-mono mb-2 flex items-center gap-1.5
                        ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                        🎯 Top Skill Gaps
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {predictionResult.gaps.map((g: string, i: number) => (
                          <span
                            key={i}
                            className={`px-3 py-1 rounded-2xl md:rounded-3xl text-[11px] font-semibold shadow-sm
                              ${isDark
                                ? 'bg-gray-800 text-gray-200 border border-gray-700'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Latest Notes Card removed as per layout update */}
      </div>
    </div>
  );
}