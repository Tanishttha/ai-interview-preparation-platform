import { useState } from 'react';
import { ArrowLeft, Play, CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Company } from '../types';
import { apiFetch } from '../lib/apiClient';

interface CompanyDetailProps {
  company: Company;
  onBack: () => void;
  onStartPrep: () => void;
  isDark?: boolean;
}

export default function CompanyDetail({ company, onBack, onStartPrep, isDark = false }: CompanyDetailProps) {
  const [cgpaInput, setCgpaInput] = useState<string>('8.2');
  const [backlogsInput, setBacklogsInput] = useState<string>('0');
  const [eligibilityResult, setEligibilityResult] = useState<any>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  const handleCheckEligibility = async () => {
    try {
      setCheckingEligibility(true);
      const res = await apiFetch(`/api/companies/${company.id}/eligibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cgpa: parseFloat(cgpaInput),
          backlogs: parseInt(backlogsInput),
          branch: "Computer Science"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setEligibilityResult(data);
      }
    } catch (err) {
      console.error("Failed to verify eligibility:", err);
    } finally {
      setCheckingEligibility(false);
    }
  };

  // Common Theme Styles
  const cardStyle = isDark
    ? 'bg-gray-900/40 border-gray-800 text-white'
    : 'bg-white border-slate-200 text-slate-900 shadow-sm';

  const inputStyle = isDark
    ? 'bg-gray-950 border-gray-800 text-white focus:border-blue-500'
    : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10';

  const subCardStyle = isDark
    ? 'bg-gray-950/40 border-gray-800 text-gray-300'
    : 'bg-slate-50 border-slate-200 text-slate-700';

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className={`flex items-center gap-2 text-xs font-semibold transition-colors cursor-pointer ${
            isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-blue-600'
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Company Explorer
        </button>
      </div>

      {/* Hero Overview */}
      <div className={`p-6 sm:p-8 rounded-3xl relative overflow-hidden border ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-gray-950 to-[#0F172A] border-gray-800 text-white'
          : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white border-blue-500 shadow-lg shadow-blue-500/20'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <span className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border shadow-md ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white/10 border-white/20 backdrop-blur-md'
            }`}>
              {company.logo}
            </span>
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-white">{company.name} Preparation</h2>
              <p className={`text-xs font-mono font-semibold ${isDark ? 'text-blue-400' : 'text-blue-100'}`}>{company.role}</p>
            </div>
          </div>
          <button
            onClick={onStartPrep}
            className={`px-5 py-3 rounded-2xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] ${
              isDark
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20'
                : 'bg-white text-blue-700 hover:bg-blue-50 font-bold'
            }`}
          >
            <Play className={`w-4 h-4 ${isDark ? 'fill-white' : 'fill-blue-700'}`} /> Start Preparation Track
          </button>
        </div>

        {/* Short metrics grid */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 mt-6 border-t text-xs ${
          isDark ? 'border-gray-800/60 text-gray-400' : 'border-white/20 text-blue-100'
        }`}>
          <div>
            <span className={`block text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-blue-200'}`}>Average Package</span>
            <strong className="text-white text-base mt-0.5 block font-extrabold">{company.package}</strong>
          </div>
          <div>
            <span className={`block text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-blue-200'}`}>Success Rate</span>
            <strong className={`text-base mt-0.5 block font-extrabold ${isDark ? 'text-emerald-400' : 'text-emerald-300'}`}>{company.successRate}%</strong>
          </div>
          <div>
            <span className={`block text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-blue-200'}`}>Recommended Prep</span>
            <strong className="text-white text-base mt-0.5 block font-extrabold">{company.prepTime}</strong>
          </div>
          <div>
            <span className={`block text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-blue-200'}`}>Difficulty Gauge</span>
            <strong className={`text-base mt-0.5 block font-extrabold ${isDark ? 'text-rose-400' : 'text-amber-200'}`}>{company.difficulty}</strong>
          </div>
        </div>
      </div>

      {/* Layout Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Overview & Process Card */}
          <div className={`p-6 border rounded-3xl space-y-4 ${cardStyle}`}>
            <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Hiring Overview</h3>
            <p className={`text-xs leading-relaxed font-medium ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>{company.overview}</p>
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${subCardStyle}`}>
              <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Typical Selection Process</span>
              <p className={`font-medium leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{company.hiringProcess}</p>
            </div>
          </div>

          {/* Timeline of rounds */}
          <div className={`p-6 border rounded-3xl space-y-5 ${cardStyle}`}>
            <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Round Wise Journey</h3>
            <div className={`relative border-l ml-4 space-y-6 ${isDark ? 'border-gray-800' : 'border-slate-200'}`}>
              {company.interviewRounds.map((round, idx) => (
                <div key={idx} className="relative pl-6">
                  <span className="absolute -left-3 top-1 w-6 h-6 bg-blue-500/15 border-2 border-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                    {idx + 1}
                  </span>
                  <div className="space-y-1">
                    <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{round}</h4>
                    <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Focus on structural patterns, optimal complexity limits, and key variables.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar stats & parameters */}
        <div className="lg:col-span-4 space-y-6">
          {/* Eligibility & CTC Card */}
          <div className={`p-6 border rounded-3xl space-y-4 text-xs ${cardStyle}`}>
            <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Parameters</h3>
            <div className="space-y-3.5">
              <div className="space-y-1">
                <span className={`block uppercase tracking-wider text-[9px] font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Eligibility Criteria</span>
                <span className={`font-semibold leading-relaxed ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>{company.eligibility}</span>
              </div>
              <div className={`space-y-1 border-t pt-3.5 ${isDark ? 'border-gray-800' : 'border-slate-100'}`}>
                <span className={`block uppercase tracking-wider text-[9px] font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>CTC Component Breakdown</span>
                <span className={`font-semibold leading-relaxed ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>{company.ctcBreakdown}</span>
              </div>
            </div>

            {/* Live Interactive Eligibility Checker */}
            <div className={`border-t pt-4 mt-2 space-y-3 ${isDark ? 'border-gray-800' : 'border-slate-100'}`}>
              <span className="text-blue-600 dark:text-blue-400 font-bold block uppercase tracking-wider text-[10px] font-mono">
                Recruiter Match Evaluator
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold block ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Your CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={cgpaInput}
                    onChange={(e) => setCgpaInput(e.target.value)}
                    className={`w-full p-2.5 rounded-2xl border outline-none font-semibold transition-all ${inputStyle}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold block ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Active Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    value={backlogsInput}
                    onChange={(e) => setBacklogsInput(e.target.value)}
                    className={`w-full p-2.5 rounded-2xl border outline-none font-semibold transition-all ${inputStyle}`}
                  />
                </div>
              </div>
              <button
                onClick={handleCheckEligibility}
                disabled={checkingEligibility}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-md shadow-blue-500/20"
              >
                {checkingEligibility ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Verify Company Eligibility"}
              </button>

              {eligibilityResult && (
                <div className={`p-3.5 rounded-2xl border flex gap-2.5 items-start text-xs font-semibold ${
                  eligibilityResult.eligible 
                    ? (isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800') 
                    : (isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-800')
                }`}>
                  {eligibilityResult.eligible ? (
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  )}
                  <div className="space-y-1">
                    <span className="font-bold uppercase tracking-wider block text-[9px] font-mono">
                      {eligibilityResult.eligible ? "Eligible for Interview" : "Ineligible / Benchmarks unmet"}
                    </span>
                    <p className="font-medium leading-snug">{eligibilityResult.reasons[0]}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Topics and trends */}
          <div className={`p-6 border rounded-3xl space-y-4 text-xs ${cardStyle}`}>
            <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Trends &amp; Skills</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className={`block text-[9px] uppercase tracking-wider font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Required Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {company.skillsRequired.map((s, idx) => (
                    <span key={idx} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                      isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'
                    }`}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`space-y-1.5 border-t pt-3.5 ${isDark ? 'border-gray-800' : 'border-slate-100'}`}>
                <span className={`block text-[9px] uppercase tracking-wider font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Most Tested Topics</span>
                <div className="flex flex-wrap gap-1.5">
                  {company.importantTopics.map((t, idx) => (
                    <span key={idx} className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${
                      isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`space-y-1 border-t pt-3.5 ${isDark ? 'border-gray-800' : 'border-slate-100'}`}>
                <span className={`block text-[9px] uppercase tracking-wider font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Recent Trends</span>
                <p className={`font-medium leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{company.recentTrends}</p>
              </div>
            </div>
          </div>

          {/* Recommended Resources */}
          <div className={`p-6 border rounded-3xl space-y-3.5 text-xs ${cardStyle}`}>
            <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Recommended Resources</h3>
            <div className="space-y-2">
              {company.resources.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  className={`p-3.5 border rounded-2xl flex items-center justify-between text-xs transition-all ${
                    isDark
                      ? 'bg-gray-950/20 border-gray-800 hover:border-blue-500/40 text-gray-200'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-800'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-bold block">{res.name}</span>
                    <span className={`text-[10px] font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{res.type}</span>
                  </div>
                  <ExternalLink className={`w-3.5 h-3.5 ${isDark ? 'text-gray-400' : 'text-slate-400'}`} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}