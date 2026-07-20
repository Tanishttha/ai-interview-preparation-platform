import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Compass, Sparkles, Send, TrendingUp, Info, Search, LayoutDashboard, 
  Briefcase, Zap, User, Settings, Bell, ShieldCheck 
} from 'lucide-react';
import { JOBS } from '../data';

interface AICareerCoachProps {
  tool?: 'career-coach' | 'jobs';
  isDark?: boolean;
}

export default function AICareerCoachDashboard({ tool = 'career-coach', isDark = false }: AICareerCoachProps) {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState<'career-coach' | 'jobs'>(tool);
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { 
      sender: 'coach', 
      text: 'Hello! I am your AI Career Coach. I scan global recruitment pipelines, compensation databases, and your skill metrics to map optimal paths. Ask me anything about career tracks, salary targets, or project priorities!' 
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || loading) return;
    
    const userMsg = { sender: 'user', text: chatInput };
    setChatLog((prev) => [...prev, userMsg]);
    setChatInput('');
    setLoading(true);

    // Simulated Response
    setTimeout(() => {
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'coach',
          text: 'Based on your current trajectory, focusing on distributed systems architecture will position you in the top 5% of candidate profiles for Senior SDE (L5) roles this quarter.'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  // Salary Growth Graph Data
  const salaryData = [
    { year: 'Entry (L3)', base: 22, stock: 10 },
    { year: 'SDE-2 (L4)', base: 34, stock: 18 },
    { year: 'Senior (L5)', base: 48, stock: 28 },
    { year: 'Staff (L6)', base: 65, stock: 45 }
  ];

  // -------------------------------------------------------------
  // Dynamic Light / Dark Theme Styles Mechanism
  // -------------------------------------------------------------
  const bgMain = isDark ? 'bg-[#0B0F17] text-slate-100' : 'bg-slate-50 text-slate-900';
  const sidebarBg = isDark ? 'bg-[#0F172A] border-slate-800/80' : 'bg-white border-slate-200 shadow-sm';
  const headerBg = isDark ? 'bg-[#0F172A] border-slate-800/80' : 'bg-white border-slate-200 shadow-xs';
  
  const cardStyle = isDark
    ? 'bg-[#0F172A] border-slate-800/80 text-white shadow-xl'
    : 'bg-white border-slate-200 text-slate-900 shadow-sm';

  const subCardStyle = isDark
    ? 'bg-[#161B22] border-slate-800 text-slate-300'
    : 'bg-slate-50 border-slate-200 text-slate-700';

  const inputStyle = isDark
    ? 'bg-[#161B22] border-slate-700/60 text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/60'
    : 'bg-slate-100 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500';

  return (
    <div className={`flex h-screen w-full font-sans antialiased overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200 ${bgMain}`}>
      
      {/* 1. LEFT NAVIGATION SIDEBAR */}
      <aside className={`w-64 border-r flex flex-col justify-between p-4 shrink-0 transition-colors ${sidebarBg}`}>
        <div className="space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-extrabold text-base tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>PrepAI</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-500 uppercase">
                  PRO
                </span>
              </div>
              <p className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Career Intelligence</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            <button 
              onClick={() => setActiveTab('career-coach')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'career-coach' 
                  ? (isDark 
                      ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/15 text-cyan-400 border border-cyan-500/30' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-xs')
                  : (isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>AI Advisory Chat</span>
            </button>

            <button 
              onClick={() => setActiveTab('jobs')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'jobs' 
                  ? (isDark 
                      ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/15 text-cyan-400 border border-cyan-500/30' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-xs')
                  : (isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Job Opportunities</span>
            </button>

            <button className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Skill Matrix</span>
            </button>
          </nav>
        </div>

        {/* PrepAI Premium Card */}
        <div className={`p-4 rounded-2xl border relative overflow-hidden space-y-3 ${
          isDark 
            ? 'bg-gradient-to-b from-[#1E293B] to-[#161B22] border-slate-700/60' 
            : 'bg-gradient-to-b from-slate-100 to-slate-50 border-slate-200'
        }`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl -mr-6 -mt-6" />
          <div className="flex items-center gap-2">
            <ShieldCheck className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
            <span className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>PrepAI Premium</span>
          </div>
          <p className={`text-[11px] leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Unlocked 100% path coverage with high-priority recruitment routing.
          </p>
          <div className="pt-1">
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full w-[88%]" />
            </div>
            <span className={`text-[9px] font-mono mt-1 block text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>88% Quota Used</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP SEARCH BAR HEADER */}
        <header className={`h-16 border-b px-6 flex items-center justify-between shrink-0 transition-colors ${headerBg}`}>
          
          {/* Search Input */}
          <div className="relative w-96">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <input 
              type="text" 
              placeholder="Search roles, skill targets, or salary benchmarks..."
              className={`w-full border rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500/30 transition-all ${inputStyle}`}
            />
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-4">
            <button className={`p-2 rounded-xl border transition-colors relative ${subCardStyle}`}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500" />
            </button>
            <button className={`p-2 rounded-xl border transition-colors ${subCardStyle}`}>
              <Settings className="w-4 h-4" />
            </button>
            <div className={`h-5 w-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-bold text-xs ${subCardStyle}`}>
                <User className="w-4 h-4" />
              </div>
              <div className="text-left hidden md:block">
                <p className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Alex Vance</p>
                <p className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Senior Engineer</p>
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'career-coach' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* CENTRAL CHAT CONTAINER */}
              <div className={`lg:col-span-7 h-[calc(100vh-8.5rem)] border rounded-3xl flex flex-col overflow-hidden ${cardStyle}`}>
                
                {/* Chat Header */}
                <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
                  isDark ? 'bg-[#161B22]/80 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-2xl border ${
                      isDark ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-blue-50 border-blue-100 text-blue-600'
                    }`}>
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Career Advisory Chat</h3>
                      <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Real-time compensation & trajectory insights</p>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                    isDark ? 'bg-emerald-950/40 border-emerald-800/50' : 'bg-emerald-50 border-emerald-200'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${
                      isDark ? 'text-emerald-400' : 'text-emerald-700'
                    }`}>
                      Advisor Online
                    </span>
                  </div>
                </div>

                {/* Chat Body */}
                <div className={`flex-1 overflow-y-auto p-6 space-y-4 text-xs font-medium ${
                  isDark ? 'bg-[#0B0F17]/40' : 'bg-slate-50/50'
                }`}>
                  {chatLog.map((msg, idx) => {
                    const isCoach = msg.sender === 'coach';
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${isCoach ? 'items-start' : 'items-end'}`}
                      >
                        <div
                          className={`max-w-[85%] p-4 rounded-2xl leading-relaxed transition-all duration-200 ${
                            isCoach
                              ? (isDark 
                                  ? 'bg-[#1E293B] border border-slate-700/60 text-slate-200 rounded-tl-none shadow-md' 
                                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs')
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-md font-semibold'
                          }`}
                        >
                          {isCoach && (
                            <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 font-mono ${
                              isDark ? 'text-cyan-400' : 'text-blue-700'
                            }`}>
                              AI Advisor Coach
                            </span>
                          )}
                          <p className="whitespace-pre-line text-xs">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendChat} className={`p-4 border-t shrink-0 ${
                  isDark ? 'bg-[#161B22]/80 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`flex items-center gap-3 p-1.5 rounded-2xl border transition-all ${
                    isDark ? 'bg-[#0B0F17] border-slate-700/60' : 'bg-white border-slate-200'
                  }`}>
                    <input
                      type="text"
                      placeholder="Ask about compensations, skill gaps, or learning strategies..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className={`flex-1 bg-transparent border-0 outline-none text-xs px-3 py-2 font-medium ${
                        isDark ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-md cursor-pointer shrink-0 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>

              {/* RIGHT-SIDE CARDS */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 1. SDE Compensation Growth */}
                <div className={`p-6 border space-y-5 ${cardStyle}`}>
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm tracking-tight">
                      <div className={`p-2 rounded-xl border ${
                        isDark ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-blue-50 border-blue-100 text-blue-600'
                      }`}>
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <h4 className={isDark ? 'text-white' : 'text-slate-900'}>SDE Compensation Growth</h4>
                    </div>
                    <p className={`text-xs font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Median LPA ranges based on target band profiles
                    </p>
                  </div>

                  {/* Glowing Area Chart */}
                  <div className="h-52 w-full text-xs font-mono pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salaryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="glowColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#cbd5e1'} />
                        <XAxis dataKey="year" stroke={isDark ? '#64748b' : '#475569'} tickLine={false} />
                        <YAxis stroke={isDark ? '#64748b' : '#475569'} tickLine={false} />
                        <Tooltip contentStyle={{ 
                          backgroundColor: isDark ? '#1e293b' : '#ffffff', 
                          border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', 
                          borderRadius: '12px', 
                          fontSize: '11px',
                          color: isDark ? '#f8fafc' : '#0f172a',
                          fontWeight: '600'
                        }} />
                        <Area 
                          type="monotone" 
                          dataKey="base" 
                          stroke="#2563eb" 
                          strokeWidth={3} 
                          fillOpacity={1} 
                          fill="url(#glowColor)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <p className={`text-[11px] font-medium flex items-center gap-2 pt-3 border-t ${
                    isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                  }`}>
                    <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" /> Ranges exclude variables and custom sign-on bonuses.
                  </p>
                </div>

                {/* 2. Skill Gap Analysis */}
                <div className={`p-6 border space-y-4 ${cardStyle}`}>
                  <div className="flex items-center gap-2 font-bold text-sm tracking-tight">
                    <div className={`p-2 rounded-xl border ${
                      isDark ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-purple-50 border-purple-100 text-purple-600'
                    }`}>
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h4 className={isDark ? 'text-white' : 'text-slate-900'}>Skill Gap Analysis</h4>
                  </div>

                  <div className="space-y-3.5">
                    {/* Progress Bar 1 */}
                    <div className={`p-4 border rounded-2xl space-y-2.5 ${subCardStyle}`}>
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Data Structures Mastery</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                          isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}>
                          85% Match
                        </span>
                      </div>
                      <div className={`w-full rounded-full h-2 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(52,211,153,0.6)]" 
                          style={{ width: '85%' }} 
                        />
                      </div>
                    </div>

                    {/* Progress Bar 2 */}
                    <div className={`p-4 border rounded-2xl space-y-2.5 ${subCardStyle}`}>
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>System Design Competence</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                          isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}>
                          60% Match
                        </span>
                      </div>
                      <div className={`w-full rounded-full h-2 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <div 
                          className="bg-amber-500 h-full rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(251,191,36,0.6)]" 
                          style={{ width: '60%' }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-6">
              {/* Job Panel Banner */}
              <div className={`p-8 border rounded-3xl flex flex-col space-y-3 relative overflow-hidden ${
                isDark
                  ? 'bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border-slate-800 shadow-xl'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
              }`}>
                <span className={`text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider font-mono ${
                  isDark ? 'text-cyan-400' : 'text-blue-100 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/20'
                }`}>
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> High-Compatibility Matching Active
                </span>
                <h3 className="text-2xl font-extrabold tracking-tight text-white">
                  Recommended Job Opportunities
                </h3>
                <p className={`text-xs max-w-2xl font-normal leading-relaxed ${isDark ? 'text-slate-300' : 'text-blue-100'}`}>
                  Based on your resume scoring metrics (89%) and coding practice profiles, we match you directly with elite active positions.
                </p>
              </div>

              {/* Jobs List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(JOBS || []).map((job: any) => (
                  <div key={job.id} className={`p-6 border rounded-3xl flex flex-col justify-between space-y-6 transition-all duration-200 hover:scale-[1.01] ${cardStyle}`}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-3.5">
                        <span className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xl shrink-0 ${subCardStyle}`}>
                          {job.logo}
                        </span>
                        <div>
                          <h4 className={`font-bold text-base line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{job.title}</h4>
                          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{job.company} • {job.location}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 border rounded-full text-[10px] font-mono font-bold tracking-wider uppercase shrink-0 ${
                        isDark ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}>
                        {job.matchScore}% Match
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className={`text-[10px] uppercase tracking-wider block font-bold font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Estimated LPA Package
                      </span>
                      <strong className={`block text-lg font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {job.salary}
                      </strong>
                    </div>

                    <div className={`space-y-2 border-t pt-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                      <span className={`text-[10px] uppercase tracking-wider block font-bold font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Required Skills Match
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {job.skillsNeeded?.map((skill: string, idx: number) => (
                          <span key={idx} className={`px-2.5 py-1 text-xs rounded-xl font-mono border ${subCardStyle}`}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <a
                      href={job.applyUrl}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-center font-bold text-xs rounded-2xl transition-all cursor-pointer shadow-md active:scale-[0.98]"
                    >
                      Apply to Position
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}