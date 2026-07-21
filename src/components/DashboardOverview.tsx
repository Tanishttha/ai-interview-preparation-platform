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
        {/* Selection Probability Form */}
        <div className={`lg:col-span-4 p-6 border ${cardStyle} space-y-4`}>
          <div className={`pb-3 border-b ${isDark ? 'border-gray-800' : 'border-slate-100'}`}>
            <h3 className={`font-bold text-base mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Calculate Eligibility &amp; Success
            </h3>
          </div>

          <form onSubmit={handlePredictEligibility} className="space-y-3.5 text-xs font-medium">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <span className={`text-[10px] font-bold block uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>CGPA</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={cgpa}
                  onChange={(e) => setCgpa(parseFloat(e.target.value) || 0)}
                  className={`w-full p-2.5 rounded-2xl border outline-none font-semibold transition-all ${inputStyle}`}
                />
              </div>
              <div className="space-y-1.5">
                <span className={`text-[10px] font-bold block uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>DSA Solved</span>
                <input
                  type="number"
                  value={problemsSolved}
                  onChange={(e) => setProblemsSolved(parseInt(e.target.value) || 0)}
                  className={`w-full p-2.5 rounded-2xl border outline-none font-semibold transition-all ${inputStyle}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <span className={`text-[10px] font-bold block uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Resume ATS</span>
                <input
                  type="number"
                  value={resumeScore}
                  onChange={(e) => setResumeScore(parseInt(e.target.value) || 0)}
                  className={`w-full p-2.5 rounded-2xl border outline-none font-semibold transition-all ${inputStyle}`}
                />
              </div>
              <div className="space-y-1.5">
                <span className={`text-[10px] font-bold block uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Target Company</span>
                <select
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className={`w-full p-2.5 rounded-2xl border outline-none font-semibold transition-all cursor-pointer ${inputStyle}`}
                >
                  <option value="Google">Google</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Uber">Uber</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPredicting}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-500/20"
            >
              {isPredicting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Recalculate Probability Percentage"}
            </button>
          </form>

          {/* Reasoning Box */}
          {predictionResult && (
            <div className={`p-4 border rounded-2xl text-[11px] space-y-2.5 ${
              isDark
                ? 'bg-[#0B1120] border-gray-800 text-gray-300'
                : 'bg-blue-50/70 border-blue-100 text-slate-800'
            }`}>
              <p className="font-medium leading-relaxed">{predictionResult.reasoning}</p>
              
              {predictionResult.gaps?.length > 0 && (
                <div className={`space-y-1.5 pt-2 border-t ${isDark ? 'border-gray-800' : 'border-blue-200/60'}`}>
                  <span className={`text-[10px] font-bold uppercase font-mono ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                    Identified Gaps:
                  </span>
                  <ul className={`space-y-1 list-disc list-inside font-medium text-[11px] ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    {predictionResult.gaps.map((g: string, i: number) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Latest Notes Card */}
        <div className={`lg:col-span-8 p-6 border ${cardStyle} flex flex-col justify-between space-y-5`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Latest Notes
                </h3>
                <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  Continue where you left off
                </p>
              </div>
              <button
                onClick={() => onNavigate('notes')}
                className={`text-xs font-bold transition-all cursor-pointer ${
                  isDark
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                View All →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {latestNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between gap-3 ${
                    isDark
                      ? 'bg-gray-950/50 border-gray-800/80 hover:border-gray-700 hover:bg-gray-950'
                      : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-xs font-bold leading-snug line-clamp-2 ${
                      isDark ? 'text-gray-100' : 'text-slate-900'
                    }`}>
                      {note.title}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      isDark
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}>
                      {note.subject}
                    </span>
                  </div>
                  <p className={`text-[11px] font-medium ${
                    isDark ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    {note.updatedAt}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('notes')}
            className={`w-full py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-md ${
              isDark
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/10'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20'
            }`}
          >
            + Create New Note
          </button>
        </div>
      </div>
    </div>
  );
}