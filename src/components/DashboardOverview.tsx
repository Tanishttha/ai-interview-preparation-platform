import { useState, useEffect } from 'react';
import { Timer as TimerIcon, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';

interface AptitudeSectionProps {
  isDark?: boolean;
}

export default function AptitudeSection({ isDark = false }: AptitudeSectionProps) {
  const [activeTab, setActiveTab] = useState<'study' | 'test'>('study');
  const [testActive, setTestActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds mock test
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [testFinished, setTestFinished] = useState(false);

  const studyGuides = [
    { 
      title: 'Quantitative Aptitude', 
      topics: ['Permutations & Combinations', 'Probability Theory', 'Time, Speed and Distance', 'Compound Interest'], 
      desc: 'Standard numerical reasoning questions frequently tested in early-stage elimination rounds.' 
    },
    { 
      title: 'Logical Reasoning', 
      topics: ['Syllogisms & Venn Diagrams', 'Seating Arrangements', 'Blood Relations', 'Binary Logic puzzles'], 
      desc: 'Deductive structures designed to score processing logic under restricted bounds.' 
    },
    { 
      title: 'Verbal Aptitude', 
      topics: ['Reading Comprehension', 'Sentence Correction', 'Idioms & Phrases', 'Critical Reasoning'], 
      desc: 'Grammatical syntax mapping and text contextual alignment questions.' 
    }
  ];

  const questions = [
    {
      id: 1,
      q: 'A train 120m long passes a telegraph post in 6 seconds. Find the speed of the train in km/hr.',
      options: ['36 km/hr', '54 km/hr', '72 km/hr', '90 km/hr'],
      correctIdx: 2 // 72 km/hr
    },
    {
      id: 2,
      q: 'If A + B means A is sister of B, and A - B means A is brother of B, what does P - Q + R mean?',
      options: ['P is brother of R', 'P is uncle of R', 'P is nephew of R', 'P is father of R'],
      correctIdx: 0 // P is brother of R
    }
  ];

  // Timer effect
  useEffect(() => {
    let timer: any;
    if (testActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
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
    if (answers[qIdx] === questions[qIdx].correctIdx) {
      return sum + 1;
    }
    return sum;
  }, 0);

  // -------------------------------------------------------------
  // Reference Code Dark/Light Mode Theme Mechanism
  // -------------------------------------------------------------
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
    <div className="space-y-6">
      {/* Top Header Tabs */}
      <div className={`flex border text-xs font-bold uppercase p-2 rounded-3xl gap-2 ${
        isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <button
          onClick={() => {
            setActiveTab('study');
            setTestActive(false);
          }}
          className={`px-4 py-2.5 rounded-2xl cursor-pointer flex items-center gap-2 transition-all font-bold ${
            activeTab === 'study' 
              ? (isDark 
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' 
                  : 'bg-blue-100 text-blue-800 border border-blue-200 shadow-sm') 
              : (isDark ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
          }`}
        >
          <BookOpen className="w-4 h-4" /> Study Syllabus
        </button>
        <button
          onClick={() => setActiveTab('test')}
          className={`px-4 py-2.5 rounded-2xl cursor-pointer flex items-center gap-2 transition-all font-bold ${
            activeTab === 'test' 
              ? (isDark 
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' 
                  : 'bg-blue-100 text-blue-800 border border-blue-200 shadow-sm') 
              : (isDark ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
          }`}
        >
          <TimerIcon className="w-4 h-4" /> Mock Aptitude Test
        </button>
      </div>

      {activeTab === 'study' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studyGuides.map((guide, idx) => (
            <div
              key={idx}
              className={`p-6 border transition-all flex flex-col justify-between ${cardStyle} hover:border-blue-500/40`}
            >
              <div className="space-y-3">
                <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {guide.title}
                </h3>
                <p className={`text-xs leading-relaxed font-medium ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                  {guide.desc}
                </p>
                <div className="space-y-2 pt-2">
                  <span className={`text-[10px] font-bold block uppercase tracking-wider font-mono ${
                    isDark ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    Most Tested Topics
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {guide.topics.map((t, tIdx) => (
                      <span key={tIdx} className={`px-2.5 py-1 rounded-xl text-[10px] font-semibold border ${badgeStyle}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('test')}
                className={`text-xs font-bold flex items-center gap-1 mt-6 cursor-pointer group transition-all ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-800'
                }`}
              >
                Attempt Mock Test <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {!testActive && !testFinished ? (
            /* Start Test Screen */
            <div className={`p-8 border text-center space-y-5 ${cardStyle}`}>
              <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center border ${
                isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'
              }`}>
                <TimerIcon className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Elimination-Stage Aptitude Mock
                </h3>
                <p className={`text-xs max-w-sm mx-auto font-medium leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                  Test your numerical, logical, and verbal processing bounds. Complete the challenge within the given time-limit.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto text-xs py-2">
                <div className={`p-3 border rounded-2xl font-medium ${subCardStyle}`}>
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-gray-400">Questions</span>
                  <strong className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>2 Questions</strong>
                </div>
                <div className={`p-3 border rounded-2xl font-medium ${subCardStyle}`}>
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-gray-400">Time Limit</span>
                  <strong className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>60 Seconds</strong>
                </div>
              </div>

              <button
                onClick={handleStartTest}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.98]"
              >
                Start Countdown Challenge
              </button>
            </div>
          ) : testActive ? (
            /* Active Test Screen */
            <div className={`p-6 border space-y-6 ${cardStyle}`}>
              <div className={`flex justify-between items-center pb-3 border-b ${isDark ? 'border-gray-800' : 'border-slate-100'}`}>
                <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                  isDark ? 'text-blue-400' : 'text-blue-700'
                }`}>
                  <TimerIcon className="w-4 h-4 animate-pulse text-rose-500" /> Time Remaining: 
                  <strong className="text-rose-500 font-mono text-sm">{timeLeft}s</strong>
                </span>
                <button
                  onClick={handleFinishTest}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-bold cursor-pointer"
                >
                  End Test
                </button>
              </div>

              <div className="space-y-6">
                {questions.map((q, qIdx) => (
                  <div key={q.id} className="space-y-3">
                    <span className={`text-[10px] font-bold block uppercase tracking-wider font-mono ${
                      isDark ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      Question {qIdx + 1}
                    </span>
                    <p className={`text-xs leading-relaxed font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {q.q}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[qIdx] === oIdx;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleOptionSelect(qIdx, oIdx)}
                            className={`p-3.5 text-left border text-xs rounded-2xl transition-all font-semibold cursor-pointer ${
                              isSelected
                                ? (isDark 
                                    ? 'bg-blue-500/20 border-blue-500 text-blue-400 font-bold ring-2 ring-blue-500/30' 
                                    : 'bg-blue-50 border-blue-600 text-blue-800 font-bold ring-2 ring-blue-500/20')
                                : (isDark
                                    ? 'bg-gray-950/40 border-gray-800 text-gray-300 hover:border-gray-700'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100')
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
          ) : (
            /* Test Completed Scorecard Screen */
            <div className={`p-8 border text-center space-y-6 ${cardStyle}`}>
              <div className={`inline-flex p-3 rounded-full border ${
                isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}>
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Mock Test Completed!
                </h3>
                <p className={`text-xs max-w-sm mx-auto font-medium leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                  Your answers have been checked against standard keys. Here is your scorecard.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto text-xs font-medium">
                <div className={`p-3.5 border rounded-2xl ${subCardStyle}`}>
                  <span className={`text-[10px] uppercase tracking-wider block font-bold font-mono ${
                    isDark ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    Raw Score
                  </span>
                  <span className={`font-black text-base mt-1 block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {score} / {questions.length}
                  </span>
                </div>
                <div className={`p-3.5 border rounded-2xl ${subCardStyle}`}>
                  <span className={`text-[10px] uppercase tracking-wider block font-bold font-mono ${
                    isDark ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    Accuracy Rate
                  </span>
                  <span className={`font-black text-base mt-1 block ${
                    isDark ? 'text-emerald-400' : 'text-emerald-700'
                  }`}>
                    {Math.round((score / questions.length) * 100)}%
                  </span>
                </div>
              </div>

              <button
                onClick={handleStartTest}
                className={`px-5 py-2.5 border rounded-2xl text-xs font-bold cursor-pointer transition-all ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700' 
                    : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
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