import { useState, useEffect } from 'react';
import { Timer as TimerIcon, ArrowRight, BookOpen, CheckCircle2, AlertTriangle } from 'lucide-react';

interface AptitudeSectionProps {
  isDark?: boolean;
}

export default function AptitudeSection({ isDark = false }: AptitudeSectionProps) {
  const [activeTab, setActiveTab] = useState<'study' | 'test'>('study');
  const [testActive, setTestActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [testFinished, setTestFinished] = useState(false);

  // Mock Data
  const studyGuides = [
    {
      title: 'Quantitative Aptitude',
      topics: ['Permutations & Combinations', 'Probability Theory', 'Time, Speed, Distance', 'Compound Interest'],
      desc: 'Standard numerical reasoning questions tested in early elimination rounds.'
    },
    {
      title: 'Logical Reasoning',
      topics: ['Syllogisms & Venn Diagrams', 'Seating Arrangements', 'Blood Relations', 'Binary Logic puzzles'],
      desc: 'Deductive structures designed to score processing logic.'
    },
    {
      title: 'Verbal Aptitude',
      topics: ['Reading Comprehension', 'Sentence Correction', 'Idioms & Phrases', 'Critical Reasoning'],
      desc: 'Grammatical syntax mapping and contextual alignment questions.'
    }
  ];

  const questions = [
    {
      id: 1,
      q: 'A train 120m long passes a telegraph post in 6 seconds. Find the speed of the train in km/hr.',
      options: ['36 km/hr', '54 km/hr', '72 km/hr', '90 km/hr'],
      correctIdx: 2
    },
    {
      id: 2,
      q: 'If A + B means A is sister of B, and A - B means A is brother of B, what does P - Q + R mean?',
      options: ['P is brother of R', 'P is uncle of R', 'P is nephew of R', 'P is father of R'],
      correctIdx: 0
    }
  ];

  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && testActive) {
      handleFinishTest();
    }
    return () => clearInterval(timer);
  }, [testActive, timeLeft]);

  const handleStartTest = () => {
    setTestActive(true);
    setTimeLeft(60);
    setAnswers({});
    setTestFinished(false);
  };

  const handleOptionSelect = (qIdx: number, oIdx: number) => {
    setAnswers({ ...answers, [qIdx]: oIdx });
  };

  const handleFinishTest = () => {
    setTestActive(false);
    setTestFinished(true);
  };

  const score = Object.keys(answers).reduce((sum, key) => {
    const qIdx = parseInt(key);
    return answers[qIdx] === questions[qIdx].correctIdx ? sum + 1 : sum;
  }, 0);

  // ==================== STRICT THEME CLASSES ====================
  const cardStyle = isDark
    ? 'bg-gray-900/50 border-gray-800 rounded-3xl text-white'
    : 'bg-white border-slate-200 rounded-[28px] shadow-sm text-slate-900';

  const subCardStyle = isDark
    ? 'bg-gray-950/40 border-gray-800 text-gray-300'
    : 'bg-slate-50 border-slate-200 text-slate-700';

  const badgeStyle = isDark
    ? 'bg-gray-950/60 text-gray-300 border-gray-800'
    : 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div className={`p-6 space-y-6 min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#020817]' : 'bg-slate-50'} ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {/* Tabs */}
      <div className={`flex border p-2 rounded-3xl gap-2 shadow-inner transition-colors ${
        isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          onClick={() => { setActiveTab('study'); setTestActive(false); }}
          className={`flex-1 px-5 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'study'
              ? isDark 
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                : 'bg-blue-100 text-blue-800 border border-blue-200'
              : isDark 
                ? 'text-gray-400 hover:text-gray-200' 
                : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Study Syllabus
        </button>

        <button
          onClick={() => setActiveTab('test')}
          className={`flex-1 px-5 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'test'
              ? isDark 
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                : 'bg-blue-100 text-blue-800 border border-blue-200'
              : isDark 
                ? 'text-gray-400 hover:text-gray-200' 
                : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TimerIcon className="w-4 h-4" /> Mock Test
        </button>
      </div>

      {activeTab === 'study' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studyGuides.map((guide, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border transition-all ${cardStyle} hover:border-blue-400/60`}
            >
              <h3 className="font-bold text-lg mb-2">{guide.title}</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-600'} mb-5`}>{guide.desc}</p>

              <div className="space-y-3">
                <span className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                  Most Tested Topics
                </span>
                <div className="flex flex-wrap gap-2">
                  {guide.topics.map((topic, i) => (
                    <span
                      key={i}
                      className={`text-xs px-3 py-1 rounded-xl border ${badgeStyle}`}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('test')}
                className={`mt-6 text-sm font-bold flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-700'} hover:underline`}
              >
                Attempt Mock Test <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {/* Start Screen */}
          {!testActive && !testFinished && (
            <div className={`p-10 rounded-3xl border text-center space-y-8 ${cardStyle}`}>
              <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'} border`}>
                <TimerIcon className={`w-10 h-10 ${isDark ? 'text-blue-400' : 'text-blue-700'}`} />
              </div>

              <div>
                <h2 className="text-3xl font-extrabold tracking-tight mb-2">Elimination-Stage Aptitude Mock</h2>
                <p className={`max-w-sm mx-auto ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                  Test your numerical, logical, and verbal processing bounds.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                <div className={`p-5 rounded-2xl border ${subCardStyle}`}>
                  <span className={`block text-xs font-mono uppercase ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Questions</span>
                  <span className="font-bold text-2xl mt-1 block">2</span>
                </div>
                <div className={`p-5 rounded-2xl border ${subCardStyle}`}>
                  <span className={`block text-xs font-mono uppercase ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Time</span>
                  <span className="font-bold text-2xl mt-1 block">60s</span>
                </div>
              </div>

              <button
                onClick={handleStartTest}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold rounded-2xl text-sm shadow-lg shadow-blue-500/30 transition-all active:scale-95"
              >
                Start Countdown Challenge
              </button>
            </div>
          )}

          {/* Active Test */}
          {testActive && (
            <div className={`p-8 rounded-3xl border ${cardStyle}`}>
              <div className="flex justify-between items-center mb-8">
                <span className={`flex items-center gap-2 font-bold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                  <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
                  Time Left: <span className="text-rose-500 font-mono text-xl">{timeLeft}s</span>
                </span>
                <button onClick={handleFinishTest} className="text-rose-500 hover:underline text-sm font-bold">
                  End Test
                </button>
              </div>

              <div className="space-y-10">
                {questions.map((q, qIdx) => (
                  <div key={q.id} className="space-y-4">
                    <span className={`font-mono text-xs tracking-widest uppercase ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                      Question {qIdx + 1}
                    </span>
                    <p className={`text-lg leading-relaxed font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{q.q}</p>

                    <div className="grid grid-cols-1 gap-3">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[qIdx] === oIdx;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleOptionSelect(qIdx, oIdx)}
                            className={`p-5 text-left rounded-2xl border transition-all text-sm font-medium ${
                              isSelected
                                ? isDark
                                  ? 'bg-blue-900 border-blue-500 text-blue-300'
                                  : 'bg-blue-50 border-blue-600 text-blue-900'
                                : isDark
                                ? 'bg-gray-900 border-gray-800 hover:bg-gray-800 hover:border-blue-500/40 text-white'
                                : 'bg-white border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Result Screen */}
          {testFinished && (
            <div className={`p-10 rounded-3xl border text-center space-y-8 ${cardStyle}`}>
              <div className={`inline-flex p-5 rounded-full ${isDark ? 'bg-emerald-950 border border-emerald-800' : 'bg-emerald-50 border border-emerald-200'}`}>
                <CheckCircle2 className={`w-12 h-12 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>

              <div>
                <h3 className="text-3xl font-extrabold">Test Completed!</h3>
                <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Here is your scorecard</p>
              </div>

              <div className="grid grid-cols-2 gap-6 max-w-xs mx-auto">
                <div className={`p-6 rounded-2xl border ${subCardStyle}`}>
                  <span className={`uppercase text-xs font-mono tracking-widest ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Score</span>
                  <span className="block text-5xl font-black mt-2">{score} / {questions.length}</span>
                </div>
                <div className={`p-6 rounded-2xl border ${subCardStyle}`}>
                  <span className={`uppercase text-xs font-mono tracking-widest ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Accuracy</span>
                  <span className={`block text-5xl font-black mt-2 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    {Math.round((score / questions.length) * 100)}%
                  </span>
                </div>
              </div>

              <button
                onClick={handleStartTest}
                className={`px-8 py-3.5 rounded-2xl text-sm font-bold border transition-all ${
                  isDark
                    ? 'border-gray-800 hover:bg-gray-800'
                    : 'border-slate-200 hover:bg-slate-100'
                }`}
              >
                Re-attempt Test
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}