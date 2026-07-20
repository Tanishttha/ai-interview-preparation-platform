import { useState } from 'react';
import { Sparkles, Mic, RefreshCw, Info } from 'lucide-react';

interface HRInterviewProps {
  isDark?: boolean;
}

export default function HRInterview({ isDark = false }: HRInterviewProps) {
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [report, setReport] = useState<any>(null);

  const hrQuestions = [
    { id: '1', question: 'Tell me about yourself and your background.', topic: 'Introduction', description: 'Briefly touch on your education, key projects, and career goal.' },
    { id: '2', question: 'Describe a situation where you had a conflict in a team. How did you resolve it?', topic: 'Conflict Resolution', description: 'Describe your dynamic conflict negotiation skills following STAR principles.' },
    { id: '3', question: 'What is your greatest weakness, and what steps are you taking to overcome it?', topic: 'Self-Awareness', description: 'Name a real technical friction point and detail how you actively train past it.' }
  ];

  // Dynamic Theme Class Variables
  const bgMain = isDark ? 'bg-[#0B0F17]' : 'bg-white';
  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const borderPrimary = isDark ? 'border-slate-800' : 'border-slate-200';
  
  const cardBg = isDark ? 'bg-[#0F172A]' : 'bg-white';
  const subCardBg = isDark ? 'bg-[#161B22]' : 'bg-slate-50';

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setRecorded(true);
    } else {
      setIsRecording(true);
      setRecorded(false);
      setReport(null);
    }
  };

  const handleEvaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setReport({
        overall: 89,
        grammar: 92,
        speed: '128 WPM (Optimal)',
        fillers: '2 count ("um", "like")',
        eyeContact: '94% Consistency',
        starStructure: {
          situation: 'Strong baseline contextual framing.',
          task: 'Clearly defined task parameters.',
          action: 'Excellent details on individual code contributions.',
          result: 'Good numeric outputs, but try quantifying efficiency saves.'
        },
        suggestions: 'Fantastic delivery. Focus on slowing down slightly during transition clauses to completely eliminate remaining fillers.'
      });
    }, 1500);
  };

  return (
    <div className={`p-6 space-y-6 min-h-screen transition-colors duration-300 ${bgMain} ${textPrimary}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Question List & Active Player */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`p-6 border rounded-3xl space-y-4 shadow-sm ${cardBg} ${borderPrimary}`}>
            <div className={`flex justify-between items-center pb-2.5 border-b text-xs ${borderPrimary}`}>
              <span className={`font-bold uppercase tracking-wider block ${
                isDark ? 'text-cyan-400' : 'text-blue-700'
              }`}>Core HR Questions</span>
              <span className={`font-bold font-mono ${textSecondary}`}>{activeQuestionIdx + 1} of {hrQuestions.length}</span>
            </div>

            <div className="space-y-2">
              {hrQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setActiveQuestionIdx(idx);
                    setRecorded(false);
                    setReport(null);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs flex justify-between items-center cursor-pointer ${
                    activeQuestionIdx === idx
                      ? (isDark ? 'bg-cyan-900/40 text-cyan-400 border-cyan-500/30 shadow-sm' : 'bg-blue-50 border-blue-200 text-blue-900 font-bold')
                      : `${subCardBg} ${borderPrimary} ${textSecondary} hover:border-slate-300`
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-bold block">{q.question}</span>
                    <span className={`text-[10px] block font-medium ${textSecondary}`}>{q.topic}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${textSecondary}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Recorder Panel */}
          <div className={`p-6 border rounded-3xl space-y-6 relative overflow-hidden shadow-sm ${cardBg} ${borderPrimary}`}>
            <div className="space-y-2">
              <span className={`text-xs font-mono font-bold uppercase tracking-wider block ${
                isDark ? 'text-cyan-400' : 'text-blue-700'
              }`}>Active Simulation</span>
              <h3 className={`text-base font-extrabold leading-snug ${textPrimary}`}>
                {hrQuestions[activeQuestionIdx].question}
              </h3>
              <p className={`text-[11px] font-medium flex items-center gap-1.5 leading-relaxed ${textSecondary}`}>
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" /> {hrQuestions[activeQuestionIdx].description}
              </p>
            </div>

            {/* Video Placeholder */}
            <div className={`relative w-full aspect-video rounded-2xl overflow-hidden border flex flex-col items-center justify-center ${
              isDark ? 'bg-[#161B22] border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 border rounded-full text-[9px] font-mono font-bold uppercase ${
                isDark ? 'bg-black/60 border-slate-800 text-slate-300' : 'bg-white/90 border-slate-200 text-slate-800'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
                {isRecording ? 'RECORDING ACTIVE' : 'STANDBY'}
              </div>

              {isRecording ? (
                <div className="flex flex-col items-center space-y-4">
                  {/* Dynamic Audio wave indicator */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <span
                        key={i}
                        className="w-1 bg-blue-600 rounded-full animate-pulse"
                        style={{
                          height: `${Math.floor(Math.random() * 28) + 12}px`,
                          animationDelay: `${i * 100}ms`
                        }}
                      />
                    ))}
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-cyan-400' : 'text-blue-700'}`}>
                    Stream audio latency: 12ms
                  </span>
                </div>
              ) : (
                <div className={`text-center space-y-1 text-xs font-medium ${textSecondary}`}>
                  <span className="text-3xl block">🎙</span>
                  <p className={`font-bold ${textPrimary}`}>Camera / Microphone initialized.</p>
                  <p className="text-[10px]">Press start below to mock record your answer.</p>
                </div>
              )}
            </div>

            {/* Recorder controls */}
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={handleToggleRecord}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.98] cursor-pointer shadow-md ${
                  isRecording
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20'
                }`}
              >
                <Mic className="w-4 h-4" /> {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>

              {recorded && !isRecording && (
                <button
                  onClick={handleEvaluate}
                  disabled={isEvaluating}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {isEvaluating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Evaluate Answer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Scorecard & STAR breakdown */}
        <div className="lg:col-span-5">
          {report ? (
            <div className={`p-6 border rounded-3xl space-y-5 shadow-sm ${cardBg} ${borderPrimary}`}>
              <div className={`flex justify-between items-center pb-2.5 border-b ${borderPrimary}`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${textPrimary}`}>Evaluation Scorecard</span>
                <span className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{report.overall}%</span>
              </div>

              {/* High-fidelity parameters list */}
              <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                <div className={`p-3 border rounded-2xl ${subCardBg} ${borderPrimary}`}>
                  <span className={`text-[10px] uppercase tracking-wider block font-bold font-mono ${textSecondary}`}>Speaking Speed</span>
                  <span className={`font-bold block mt-1 ${textPrimary}`}>{report.speed}</span>
                </div>
                <div className={`p-3 border rounded-2xl ${subCardBg} ${borderPrimary}`}>
                  <span className={`text-[10px] uppercase tracking-wider block font-bold font-mono ${textSecondary}`}>Grammar Accuracy</span>
                  <span className={`font-bold block mt-1 ${textPrimary}`}>{report.grammar}%</span>
                </div>
                <div className={`p-3 border rounded-2xl ${subCardBg} ${borderPrimary}`}>
                  <span className={`text-[10px] uppercase tracking-wider block font-bold font-mono ${textSecondary}`}>Filler Words</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 block mt-1">{report.fillers}</span>
                </div>
                <div className={`p-3 border rounded-2xl ${subCardBg} ${borderPrimary}`}>
                  <span className={`text-[10px] uppercase tracking-wider block font-bold font-mono ${textSecondary}`}>Eye Contact</span>
                  <span className={`font-bold block mt-1 ${textPrimary}`}>{report.eyeContact}</span>
                </div>
              </div>

              {/* STAR framework parsing feedback */}
              <div className="space-y-2 text-xs font-medium">
                <span className={`font-bold block uppercase tracking-wider text-[10px] font-mono ${textSecondary}`}>STAR Framework Alignment</span>
                <div className={`space-y-2 ${textSecondary}`}>
                  <div className="flex gap-2">
                    <strong className="text-blue-600 dark:text-blue-400 font-bold uppercase font-mono text-[9px] shrink-0 mt-0.5">S (Situation)</strong>
                    <p className="font-medium">{report.starStructure.situation}</p>
                  </div>
                  <div className={`flex gap-2 border-t pt-1.5 ${borderPrimary}`}>
                    <strong className="text-blue-600 dark:text-blue-400 font-bold uppercase font-mono text-[9px] shrink-0 mt-0.5">T (Task)</strong>
                    <p className="font-medium">{report.starStructure.task}</p>
                  </div>
                  <div className={`flex gap-2 border-t pt-1.5 ${borderPrimary}`}>
                    <strong className="text-blue-600 dark:text-blue-400 font-bold uppercase font-mono text-[9px] shrink-0 mt-0.5">A (Action)</strong>
                    <p className="font-medium">{report.starStructure.action}</p>
                  </div>
                  <div className={`flex gap-2 border-t pt-1.5 ${borderPrimary}`}>
                    <strong className="text-blue-600 dark:text-blue-400 font-bold uppercase font-mono text-[9px] shrink-0 mt-0.5">R (Result)</strong>
                    <p className="font-medium">{report.starStructure.result}</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 border rounded-2xl text-xs space-y-1 ${
                isDark ? 'bg-purple-500/10 border-purple-500/20 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-900'
              }`}>
                <span className="font-bold block flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-3.5 h-3.5" /> AI Coach Suggestions
                </span>
                <p className="font-medium leading-relaxed">{report.suggestions}</p>
              </div>
            </div>
          ) : (
            <div className={`p-8 border rounded-3xl text-center space-y-3.5 text-xs flex flex-col items-center justify-center min-h-[400px] ${cardBg} ${borderPrimary} ${textSecondary}`}>
              <span className="text-4xl block">📈</span>
              <h4 className={`font-bold text-sm ${textPrimary}`}>No Assessment Loaded</h4>
              <p className="max-w-[280px] leading-relaxed font-medium">
                Record your response to the selected HR question and trigger evaluation to view behavioral metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ChevronRight definition helper
function ChevronRight(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}