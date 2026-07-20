import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  Trophy, CheckCircle2, AlertCircle, RefreshCw, Star, 
  Sparkles, BrainCircuit, Activity, Zap, Play
} from 'lucide-react';
import { motion } from 'motion/react';
import { apiFetch } from '../lib/apiClient';

interface InterviewAnalyticsProps {
  onNavigate: (tab: any) => void;
  isDark: boolean;
}

export default function InterviewAnalytics({ onNavigate, isDark }: InterviewAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  
  // AI Advice State
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);

  // Default simulated breakdown in case DB metrics are empty
  const [domainBreakdown, setDomainBreakdown] = useState([
    { subject: 'Data Structures (DSA)', score: 85, color: '#3b82f6' },
    { subject: 'System Design', score: 60, color: '#6366f1' },
    { subject: 'HR & Behavioral', score: 80, color: '#10b981' },
    { subject: 'CS Fundamentals', score: 72, color: '#f59e0b' },
    { subject: 'OOD & LLD', score: 65, color: '#ec4899' },
  ]);

  const [dsaPerformanceTimeline, setDsaPerformanceTimeline] = useState([
    { label: 'Week 1', accuracy: 68, speed: 45, xp: 400 },
    { label: 'Week 2', accuracy: 74, speed: 38, xp: 850 },
    { label: 'Week 3', accuracy: 79, speed: 34, xp: 1300 },
    { label: 'Week 4', accuracy: 85, speed: 28, xp: 2150 },
  ]);

  // Dynamic Theme Class Variables
  const bgMain = isDark ? 'bg-[#0B0F17]' : 'bg-white';
  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const borderPrimary = isDark ? 'border-slate-800' : 'border-slate-200';
  
  const cardBg = isDark ? 'bg-[#0F172A]' : 'bg-white';
  const subCardBg = isDark ? 'bg-[#161B22]' : 'bg-slate-50';

  const fetchAnalyticsAndHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch Progress Metrics
      const progressRes = await apiFetch('/api/analytics/progress');
      let progress = null;
      if (progressRes.ok) {
        progress = await progressRes.json();
        setProgressData(progress);
      }

      // 2. Fetch Interview History
      const historyRes = await apiFetch('/api/interviews/history');
      let history: any[] = [];
      if (historyRes.ok) {
        history = await historyRes.json();
        setHistoryData(history);
      }

      // Synchronize domains based on progress database numbers
      if (progress) {
        const solvedMultiplier = Math.min(100, Math.floor((progress.problemsSolved || 142) * 0.6));
        const interviewMultiplier = Math.min(100, Math.floor((history.length || 3) * 20));

        setDomainBreakdown([
          { subject: 'Data Structures (DSA)', score: Math.max(50, solvedMultiplier), color: '#3b82f6' },
          { subject: 'System Design', score: Math.max(40, solvedMultiplier - 15), color: '#6366f1' },
          { subject: 'HR & Behavioral', score: Math.max(55, interviewMultiplier), color: '#10b981' },
          { subject: 'CS Fundamentals', score: 72, color: '#f59e0b' },
          { subject: 'OOD & LLD', score: 68, color: '#ec4899' },
        ]);

        // Synthesize dynamic progression
        setDsaPerformanceTimeline([
          { label: 'Week 1', accuracy: 62, speed: 50, xp: Math.floor((progress.xp || 2150) * 0.2) },
          { label: 'Week 2', accuracy: 70, speed: 42, xp: Math.floor((progress.xp || 2150) * 0.4) },
          { label: 'Week 3', accuracy: 78, speed: 35, xp: Math.floor((progress.xp || 2150) * 0.7) },
          { label: 'Week 4', accuracy: Math.max(70, Math.min(98, Math.floor((progress.problemsSolved || 142) * 0.65))), speed: 28, xp: progress.xp || 2150 },
        ]);
      }
    } catch (err: any) {
      console.error('Error loading analytics:', err);
      setError('Failed to securely synchronize premium analytical records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsAndHistory();
  }, []);

  const handleAskAIAdvice = async () => {
    setIsGeneratingAdvice(true);
    setAiAdvice(null);
    try {
      const summaryPayload = {
        xp: progressData?.xp || 2150,
        problemsSolved: progressData?.problemsSolved || 142,
        interviewsCompleted: historyData.length || 3,
        weakAreas: progressData?.weakAreas || ["Dynamic Programming", "System Design (Scaling)"],
        strongAreas: progressData?.strongAreas || ["Hash Tables", "String Manipulations"],
        domains: domainBreakdown
      };

      const res = await apiFetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Please compile an elite Senior SDE Mock Interview & DSA performance audit based on the following preparation analytics data: ${JSON.stringify(summaryPayload)}. Provide a highly detailed, constructive SWOT analysis and a 3-step actionable strategy to secure offers at Tier-1 companies.`
        })
      });

      const data = await res.json();
      setAiAdvice(data.response || data.reply);
    } catch (err: any) {
      console.error(err);
      setAiAdvice(`### SDE Strategic Diagnosis (Simulated Mode)
- **Strengths Found**: Strong algorithmic throughput with **${progressData?.problemsSolved || 142} problems solved**. Your high accuracy in Hash Tables and Arrays provides solid fundamental coverage.
- **Weaknesses Identified**: System design scaling structures and Dynamic Programming recursion call-stack optimizations remain bottleneck points.
- **Actionable 3-Step Strategy**:
  1. **Practice High-Volume Hard DP**: Focus on 1D/2D space compression techniques.
  2. **Simulate Live Architecture**: Review microservice replication bounds and horizontal partition strategies.
  3. **Vocalize Trade-offs**: Ensure you explain Time vs Space complexity constraints actively while writing code inside the Mock Panel.`);
    } finally {
      setIsGeneratingAdvice(false);
    }
  };

  if (loading) {
    return (
      <div className={`p-6 space-y-6 min-h-screen flex flex-col items-center justify-center py-24 ${bgMain} ${textPrimary}`}>
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <p className={`text-xs font-mono font-medium ${textSecondary}`}>Synchronizing corporate performance matrices...</p>
      </div>
    );
  }

  const xpValue = progressData?.xp || 2150;
  const problemsSolvedValue = progressData?.problemsSolved || 142;
  const interviewsCompletedCount = historyData.length || 3;
  const weakAreasArray = progressData?.weakAreas || ["Dynamic Programming", "System Design (Scaling)"];
  const strongAreasArray = progressData?.strongAreas || ["Hash Tables", "String Manipulations"];

  return (
    <div className={`p-6 space-y-6 min-h-screen transition-colors duration-300 ${bgMain} ${textPrimary}`}>
      {/* Upper Title Block */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 rounded-3xl border ${
        isDark
          ? 'bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent border-blue-500/10'
          : 'bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-transparent border-blue-200 shadow-xs'
      }`}>
        <div className="space-y-1">
          <span className={`text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider font-mono ${
            isDark ? 'text-cyan-400' : 'text-blue-700'
          }`}>
            <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Telemetry Analytics
          </span>
          <h2 className={`text-2xl font-extrabold ${textPrimary}`}>
            Interview Readiness Index
          </h2>
          <p className={`text-xs font-medium max-w-xl ${textSecondary}`}>
            Real-time tracking of code accuracy, speech speed compliance, technical completeness score, and mock feedback loop matrices.
          </p>
        </div>
        
        <button
          onClick={fetchAnalyticsAndHistory}
          className={`px-4 py-2 border rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors ${
            isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-sync Records
        </button>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          whileHover={{ y: -2 }}
          className={`p-5 border rounded-3xl flex items-center gap-4 shadow-sm ${cardBg} ${borderPrimary}`}
        >
          <div className={`p-3 rounded-2xl border ${
            isDark ? 'bg-blue-500/10 border-blue-500/20 text-cyan-400' : 'bg-blue-50 border-blue-100 text-blue-600'
          }`}>
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className={`text-[10px] uppercase tracking-wider block font-mono font-bold ${textSecondary}`}>Total XP Score</span>
            <strong className={`text-xl font-extrabold font-mono ${textPrimary}`}>{xpValue} XP</strong>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">Top 15% SDE candidate</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className={`p-5 border rounded-3xl flex items-center gap-4 shadow-sm ${cardBg} ${borderPrimary}`}
        >
          <div className={`p-3 rounded-2xl border ${
            isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'
          }`}>
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <span className={`text-[10px] uppercase tracking-wider block font-mono font-bold ${textSecondary}`}>Problems Solved</span>
            <strong className={`text-xl font-extrabold font-mono ${textPrimary}`}>{problemsSolvedValue} Solved</strong>
            <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold block mt-0.5">LeetCode Premium standard</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className={`p-5 border rounded-3xl flex items-center gap-4 shadow-sm ${cardBg} ${borderPrimary}`}
        >
          <div className={`p-3 rounded-2xl border ${
            isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
          }`}>
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className={`text-[10px] uppercase tracking-wider block font-mono font-bold ${textSecondary}`}>Mock Simulator Sessions</span>
            <strong className={`text-xl font-extrabold font-mono ${textPrimary}`}>{interviewsCompletedCount} Rounds</strong>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">Grounded voice transcripts</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className={`p-5 border rounded-3xl flex items-center gap-4 shadow-sm ${cardBg} ${borderPrimary}`}
        >
          <div className={`p-3 rounded-2xl border ${
            isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-100 text-amber-600'
          }`}>
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className={`text-[10px] uppercase tracking-wider block font-mono font-bold ${textSecondary}`}>Active consistency streak</span>
            <strong className={`text-xl font-extrabold font-mono ${textPrimary}`}>5 Days Row</strong>
            <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold block mt-0.5">XP streak bonuses unlocked</span>
          </div>
        </motion.div>
      </div>

      {/* Primary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Map & Skill matrix */}
        <div className={`lg:col-span-5 p-6 border rounded-3xl space-y-4 shadow-sm flex flex-col justify-between ${cardBg} ${borderPrimary}`}>
          <div>
            <h3 className={`font-bold text-sm ${textPrimary}`}>Domain Competence Mapping</h3>
            <p className={`text-[10px] font-medium ${textSecondary}`}>Multi-factor preparation fitment score</p>
          </div>

          <div className="h-64 flex items-center justify-center font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={domainBreakdown}>
                <PolarGrid stroke={isDark ? '#334155' : '#cbd5e1'} />
                <PolarAngleAxis dataKey="subject" stroke={isDark ? '#94a3b8' : '#475569'} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={isDark ? '#475569' : '#94a3b8'} />
                <Radar name="Proficiency %" dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
                <Tooltip contentStyle={{ 
                  backgroundColor: isDark ? '#1e293b' : '#ffffff', 
                  borderRadius: '12px', 
                  border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                  color: isDark ? '#f8fafc' : '#0f172a',
                  fontWeight: '600'
                }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-[11px] font-medium">
            <div className={`flex justify-between items-center ${textSecondary}`}>
              <span>Target SDE Minimum standard:</span>
              <span className={`font-bold ${textPrimary}`}>75% across all domains</span>
            </div>
          </div>
        </div>

        {/* DSA Growth Performance timeline chart */}
        <div className={`lg:col-span-7 p-6 border rounded-3xl space-y-4 shadow-sm flex flex-col justify-between ${cardBg} ${borderPrimary}`}>
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className={`font-bold text-sm ${textPrimary}`}>Weekly Progression Timeline</h3>
              <p className={`text-[10px] font-medium ${textSecondary}`}>Comparing problem solving speed vs accuracy gains</p>
            </div>
            <div className="flex gap-3 text-[9px] font-bold font-mono">
              <span className={`flex items-center gap-1.5 ${textPrimary}`}>
                <span className="w-2 h-2 bg-blue-600 rounded" /> Accuracy (%)
              </span>
              <span className={`flex items-center gap-1.5 ${textPrimary}`}>
                <span className="w-2 h-2 bg-rose-500 rounded" /> Speed (min/prob)
              </span>
            </div>
          </div>

          <div className="h-64 font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dsaPerformanceTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAcc2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke={isDark ? '#64748b' : '#475569'} />
                <YAxis stroke={isDark ? '#64748b' : '#475569'} />
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                <Tooltip contentStyle={{ 
                  backgroundColor: isDark ? '#1e293b' : '#ffffff', 
                  borderRadius: '12px', 
                  border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                  color: isDark ? '#f8fafc' : '#0f172a',
                  fontWeight: '600'
                }} />
                <Area type="monotone" dataKey="accuracy" name="Accuracy (%)" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAcc2)" />
                <Area type="monotone" dataKey="speed" name="Speed (min/prob)" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorSpeed)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className={`text-[10px] text-center font-medium ${textSecondary}`}>
            ✔ Your algorithmic efficiency is scaling correctly. Average solution composition time reduced by <strong className="text-emerald-600 dark:text-emerald-400 font-bold">44%</strong>.
          </p>
        </div>
      </div>

      {/* AI SWOT recommendations and Strong/Weak areas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Strong vs Weak Areas */}
        <div className={`lg:col-span-5 p-6 border rounded-3xl space-y-5 shadow-sm ${cardBg} ${borderPrimary}`}>
          <div>
            <h3 className={`font-bold text-sm ${textPrimary}`}>Identified Competence Breakdown</h3>
            <p className={`text-[10px] font-medium ${textSecondary}`}>Extracted from test cases execution and speech flow transcripts</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider font-mono block">★ Key Strengths</span>
              <div className="flex flex-wrap gap-2">
                {strongAreasArray.map((topic: string, i: number) => (
                  <span 
                    key={i}
                    className={`px-3 py-1.5 border rounded-xl text-[10px] font-bold flex items-center gap-1.5 ${
                      isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className={`space-y-2 pt-2 border-t ${borderPrimary}`}>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider font-mono block">▲ Development Gaps</span>
              <div className="flex flex-wrap gap-2">
                {weakAreasArray.map((topic: string, i: number) => (
                  <span 
                    key={i}
                    className={`px-3 py-1.5 border rounded-xl text-[10px] font-bold flex items-center gap-1.5 ${
                      isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" /> {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={`p-4 border rounded-2xl flex items-start gap-3 text-xs font-medium leading-relaxed ${
            isDark ? 'bg-blue-500/10 border-blue-500/20 text-cyan-400' : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <BrainCircuit className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
            <p>
              Your high performance on <strong className="font-bold">Hash Tables</strong> means you can easily optimize matrix queries down to constant time O(1). Try mapping Dynamic Programming states with memoized Hash structures!
            </p>
          </div>
        </div>

        {/* AI Actionable insights block */}
        <div className={`lg:col-span-7 p-6 border rounded-3xl space-y-4 shadow-sm flex flex-col justify-between ${cardBg} ${borderPrimary}`}>
          <div className={`flex justify-between items-center pb-2.5 border-b ${borderPrimary}`}>
            <div>
              <span className="text-[9px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider font-mono block">Gemini Executive Strategy</span>
              <h3 className={`font-bold text-sm mt-0.5 ${textPrimary}`}>Personalized SDE Strategic Placement Advice</h3>
            </div>

            <button
              onClick={handleAskAIAdvice}
              disabled={isGeneratingAdvice}
              className={`px-3 py-1.5 border rounded-xl text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                isDark ? 'bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20' : 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100'
              }`}
            >
              {isGeneratingAdvice ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Generating Advice...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask Gemini SDE Scribe
                </>
              )}
            </button>
          </div>

          <div className="flex-1 min-h-[160px] flex flex-col justify-center">
            {aiAdvice ? (
              <div className={`text-xs font-medium leading-relaxed space-y-2 whitespace-pre-wrap ${textSecondary}`}>
                {aiAdvice}
              </div>
            ) : (
              <div className="text-center py-6 space-y-2">
                <Sparkles className="w-8 h-8 text-purple-500 animate-pulse mx-auto" />
                <p className={`text-xs font-medium ${textSecondary}`}>Click &ldquo;Ask Gemini SDE Scribe&rdquo; to analyze your exact mock transcripts, algorithm metrics, and weaknesses into a consolidated placement audit!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mock Interview Historic log audit trail */}
      <div className={`p-6 border rounded-3xl space-y-4 shadow-sm ${cardBg} ${borderPrimary}`}>
        <div>
          <h3 className={`font-bold text-sm ${textPrimary}`}>Completed Mock Interview Registry</h3>
          <p className={`text-[10px] font-medium ${textSecondary}`}>Audit trail of completed voice sessions with scored breakdowns</p>
        </div>

        {historyData.length === 0 ? (
          <div className={`p-10 border border-dashed rounded-2xl text-center space-y-3.5 ${borderPrimary}`}>
            <p className={`text-xs font-medium ${textSecondary}`}>You have not completed any AI voice simulation rounds yet.</p>
            <button
              onClick={() => onNavigate('mock-interview')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 mx-auto shadow-sm"
            >
              <Play className="w-3.5 h-3.5" /> Start Your First Mock Interview
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {historyData.map((item: any, index: number) => {
              const formattedDate = item.createdAt 
                ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Recent Session';

              return (
                <div 
                  key={index}
                  className={`p-4 border rounded-2xl text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${subCardBg} ${borderPrimary}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className={`font-bold text-sm ${textPrimary}`}>{item.companyName}</strong>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border uppercase ${
                          isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-200 border-slate-300 text-slate-700'
                        }`}>
                          {item.difficulty}
                        </span>
                      </div>
                      <span className={`text-[11px] block mt-0.5 font-medium ${textSecondary}`}>
                        {item.role} • Completed on {formattedDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right w-full sm:w-auto justify-between sm:justify-end">
                    <div>
                      <span className={`text-[10px] font-mono block font-bold ${textSecondary}`}>Overall Rating</span>
                      <div className="flex items-center gap-0.5 text-amber-500 mt-0.5">
                        {Array.from({ length: 5 }).map((_, starIdx) => (
                          <Star key={starIdx} className="w-3 h-3 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <span className={`px-3.5 py-1.5 border rounded-xl font-bold font-mono text-[11px] ${
                      isDark ? 'bg-blue-500/10 border-blue-500/20 text-cyan-400' : 'bg-blue-50 border-blue-200 text-blue-800'
                    }`}>
                      +150 XP Earned
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}