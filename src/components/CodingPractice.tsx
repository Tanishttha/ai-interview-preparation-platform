import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Code, Play, ChevronRight, Terminal, RefreshCw, MessageSquare, Send, User } from 'lucide-react';
import { CODING_PROBLEMS } from '../data';
import { CodingProblem } from '../types';
import { apiFetch } from '../lib/apiClient';

interface CodingPracticeProps {
  isDark?: boolean;
}

export default function CodingPractice({ isDark = false }: CodingPracticeProps) {
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  
  // Editor State
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState<'desc' | 'hints' | 'editorial' | 'complexity'>('desc');
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiReview, setAiReview] = useState<string>('');
  const [showAiReview, setShowAiReview] = useState(false);

  // Collaborative SDE Partner Chat State
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'SDE Partner' | 'You', text: string }[]>([
    { sender: 'SDE Partner', text: 'Hi! I am your collaborative SDE partner for this coding round. Check out the description, make a start on your draft, and let me know if you would like a hint or a complexity audit on your current code!' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Filter tags
  const tags = ['Arrays', 'Hash Table', 'Linked List', 'Trees', 'DFS', 'DP', 'Strings'];

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const filteredProblems = CODING_PROBLEMS.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficultyFilter ? p.difficulty === difficultyFilter : true;
    const matchesTag = tagFilter ? p.tags.includes(tagFilter) : true;
    return matchesSearch && matchesDifficulty && matchesTag;
  });

  const handleSelectProblem = (p: CodingProblem) => {
    setSelectedProblem(p);
    setCode(p.optimalSolution); // Prefill with clean optimal solution for sandbox
    setLanguage('typescript'); // optimalSolution is authored in TypeScript
    setConsoleOutput('');
    setAiReview('');
    setShowAiReview(false);
    setChatMessages([
      { sender: 'SDE Partner', text: `Let's tackle "${p.title}" together. What approach are you thinking? Brute force or straight to optimal? Let me know, or type a query if you get stuck!` }
    ]);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setConsoleOutput('Compiling and running your code on Judge0...');
    try {
      const res = await apiFetch('/api/coding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: selectedProblem?.id || 'two-sum',
          code,
          language,
          mode: 'run'
        })
      });
      const data = await res.json();
      setIsRunning(false);
      if (data.error) {
        setConsoleOutput(`❌ Error:\n${data.error}`);
      } else {
        setConsoleOutput(`▶ RUN OUTPUT\n\nStatus: ${data.status}\nRuntime: ${data.runtime}\nMemory: ${data.memory}\n\n${data.rawOutput || data.feedback}${data.stderr ? `\n\nstderr:\n${data.stderr}` : ''}`);
      }
    } catch (err: any) {
      setIsRunning(false);
      setConsoleOutput(`⚠️ Network error during run execution:\n${err.message || err}`);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setConsoleOutput('Submitting to Judge0 grader...');
    try {
      const res = await apiFetch('/api/coding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: selectedProblem?.id || 'two-sum',
          code,
          language,
          mode: 'submit'
        })
      });
      const data = await res.json();
      setIsSubmitting(false);
      if (data.error) {
        setConsoleOutput(`❌ Submission Failed:\n${data.error}`);
      } else {
        setConsoleOutput(`${data.success ? '🎉 SUCCESS!' : '❌ FAILED'}\n\nSubmission status: ${data.status}\nRuntime: ${data.runtime}\nMemory: ${data.memory}\n\nGrader feedback:\n${data.feedback}`);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setConsoleOutput(`⚠️ Network error during code submission:\n${err.message || err}`);
    }
  };

  const handleAiReview = async () => {
    setIsRunning(true);
    try {
      const res = await apiFetch('/api/ai/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          problemTitle: selectedProblem?.title
        })
      });
      const data = await res.json();
      setIsRunning(false);
      if (data.error) {
        setAiReview(`⚠️ Error during code review: ${data.error}`);
      } else {
        setAiReview(data.review);
      }
      setShowAiReview(true);
    } catch (err: any) {
      setIsRunning(false);
      setAiReview(`⚠️ Network error while attempting premium AI code review:\n${err.message || err}`);
      setShowAiReview(true);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'You', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await apiFetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Topic: ${selectedProblem?.title || "DSA"}. Core code draft:\n\n${code}\n\nCandidate query: ${userMsg}`,
          history: chatMessages.slice(-6).map(m => ({
            role: m.sender === 'You' ? 'user' : 'model',
            text: m.text
          }))
        })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { sender: 'SDE Partner', text: data.response || data.reply || "Nice approach! Let's refine the boundary conditions to ensure zero overflow." }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { sender: 'SDE Partner', text: "Your logic looks structurally sound. Try adding sanity checks for empty parameters!" }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Common card style
  const cardStyle = isDark
    ? 'bg-gray-900/40 border-gray-800 text-white'
    : 'bg-white border-slate-200 text-slate-900 shadow-sm';

  const inputStyle = isDark
    ? 'bg-gray-950/40 border-gray-800 text-gray-200 focus:border-blue-500'
    : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-blue-600';

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden">
      {!selectedProblem ? (
        <div className="space-y-6 h-full overflow-y-auto pb-10">
          {/* List and filters */}
          <div className={`p-6 border rounded-3xl space-y-4 ${cardStyle}`}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-slate-400'}`} />
                <input
                  type="text"
                  placeholder="Search problems e.g. Two Sum, Validate BST..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pl-10.5 pr-4 py-2.5 border text-xs rounded-2xl outline-none font-medium transition-all ${inputStyle}`}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className={`px-3.5 py-2.5 border text-xs rounded-2xl outline-none font-semibold cursor-pointer ${inputStyle}`}
                >
                  <option value="">Difficulty (All)</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className={`px-3.5 py-2.5 border text-xs rounded-2xl outline-none font-semibold cursor-pointer ${inputStyle}`}
                >
                  <option value="">Topics (All)</option>
                  {tags.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table list */}
          <div className={`p-6 border rounded-3xl overflow-hidden ${cardStyle}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b font-bold uppercase tracking-wider text-[10px] ${
                    isDark ? 'border-gray-800 text-gray-400' : 'border-slate-200 text-slate-500'
                  }`}>
                    <th className="pb-3 pl-2">Problem Name</th>
                    <th className="pb-3">Difficulty</th>
                    <th className="pb-3">Acceptance</th>
                    <th className="pb-3">Topic Tags</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y font-medium ${
                  isDark ? 'divide-gray-800/60' : 'divide-slate-100'
                }`}>
                  {filteredProblems.map((p) => {
                    const diffColor =
                      p.difficulty === 'Easy'
                        ? (isDark ? 'text-emerald-400' : 'text-emerald-600')
                        : p.difficulty === 'Medium'
                        ? (isDark ? 'text-amber-400' : 'text-amber-600')
                        : (isDark ? 'text-rose-400' : 'text-rose-600');

                    return (
                      <tr key={p.id} className={`transition-colors ${
                        isDark ? 'hover:bg-gray-950/40' : 'hover:bg-slate-50'
                      }`}>
                        <td className={`py-4 font-bold pl-2 ${isDark ? 'text-gray-200' : 'text-slate-900'}`}>
                          {p.title}
                        </td>
                        <td className={`py-4 font-extrabold ${diffColor}`}>
                          {p.difficulty}
                        </td>
                        <td className={`py-4 font-mono font-bold ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{p.acceptanceRate}</td>
                        <td className="py-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {p.tags.map((t) => (
                              <span key={t} className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${
                                isDark ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 text-right pr-2">
                          <button
                            onClick={() => handleSelectProblem(p)}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                          >
                            Solve
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full gap-4 pb-4">
          {/* Left panel: Description and tabs */}
          <div className={`${isChatOpen ? 'lg:col-span-4' : 'lg:col-span-5'} border rounded-3xl flex flex-col h-full overflow-hidden transition-all ${cardStyle}`}>
            {/* Header tabs */}
            <div className={`flex border-b text-xs font-bold uppercase p-2 gap-1.5 shrink-0 ${
              isDark ? 'bg-gray-950/40 border-gray-800' : 'bg-slate-50 border-slate-200'
            }`}>
              {(['desc', 'hints', 'editorial', 'complexity'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                    activeTab === tab 
                      ? (isDark ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-200')
                      : (isDark ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
                  }`}
                >
                  {tab === 'desc' ? 'Description' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab content - scrollable */}
            <div className={`flex-1 overflow-y-auto p-5 text-xs space-y-4 font-medium leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-slate-700'
            }`}>
              {activeTab === 'desc' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-black text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedProblem.title}</h3>
                    <button
                      onClick={() => setSelectedProblem(null)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
                    >
                      ← All Problems
                    </button>
                  </div>
                  <p className="whitespace-pre-line">{selectedProblem.description}</p>

                  {/* Examples */}
                  <div className="space-y-3.5 pt-2">
                    {selectedProblem.examples.map((ex, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl border font-mono text-[11px] space-y-1 ${
                        isDark ? 'bg-gray-950/40 border-gray-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span className={`font-bold block text-xs uppercase font-sans mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Example {idx + 1}</span>
                        <div><strong className={isDark ? 'text-gray-400' : 'text-slate-500'}>Input:</strong> {ex.input}</div>
                        <div><strong className={isDark ? 'text-gray-400' : 'text-slate-500'}>Output:</strong> {ex.output}</div>
                        {ex.explanation && <div><strong className={isDark ? 'text-gray-400' : 'text-slate-500'}>Explanation:</strong> {ex.explanation}</div>}
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  <div className="space-y-1.5 pt-2">
                    <span className={`font-bold block text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Constraints</span>
                    <ul className={`list-disc list-inside space-y-1 font-mono text-[11px] ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                      {selectedProblem.constraints.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'hints' && (
                <div className="space-y-4">
                  <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Brainstorming Hints</h4>
                  <div className="space-y-3">
                    {selectedProblem.hints.map((hint, idx) => (
                      <div key={idx} className={`p-4 border rounded-2xl flex gap-2.5 ${
                        isDark ? 'bg-blue-500/10 border-blue-500/20 text-gray-300' : 'bg-blue-50 border-blue-100 text-slate-800'
                      }`}>
                        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <p>{hint}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'editorial' && (
                <div className="space-y-4">
                  <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Optimal Approach Summary</h4>
                  <p className="whitespace-pre-line leading-relaxed">{selectedProblem.editorial}</p>
                </div>
              )}

              {activeTab === 'complexity' && (
                <div className="space-y-4">
                  <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Asymptotic Bound Analysis</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className={`p-4 rounded-2xl border ${isDark ? 'bg-gray-950/20 border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
                      <span className={`block text-[10px] uppercase font-mono tracking-wider font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Time Complexity</span>
                      <p className={`font-bold text-xs mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedProblem.complexity.time}</p>
                    </div>
                    <div className={`p-4 rounded-2xl border ${isDark ? 'bg-gray-950/20 border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
                      <span className={`block text-[10px] uppercase font-mono tracking-wider font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Space Complexity</span>
                      <p className={`font-bold text-xs mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedProblem.complexity.space}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center panel: Live editor & terminal output */}
          <div className={`${isChatOpen ? 'lg:col-span-5' : 'lg:col-span-7'} flex flex-col h-full gap-4 transition-all`}>
            {/* Editor wrapper */}
            <div className="flex-1 bg-gray-950 border border-gray-800 rounded-3xl overflow-hidden flex flex-col shadow-sm">
              <div className="flex justify-between items-center bg-gray-900/80 px-4 py-2 text-xs border-b border-gray-800 text-gray-300">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-[11px] font-mono tracking-wide uppercase">{language} editor</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent text-[11px] outline-none text-gray-300 border-none font-mono cursor-pointer"
                  >
                    <option value="javascript" className="bg-gray-900">JavaScript</option>
                    <option value="python" className="bg-gray-900">Python3</option>
                    <option value="cpp" className="bg-gray-900">C++17</option>
                  </select>
                </div>
              </div>

              {/* Editable TextArea representing IDE */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-[#090D16] p-5 font-mono text-xs text-blue-400 focus:outline-none resize-none leading-relaxed select-all"
                spellCheck="false"
              />

              {/* Action row */}
              <div className="flex justify-between items-center p-3.5 bg-gray-900/80 border-t border-gray-800">
                <button
                  onClick={handleAiReview}
                  className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI Code Review
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className={`px-3 py-1.5 border rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      isChatOpen ? 'bg-blue-600/20 border-blue-500/40 text-blue-300' : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> SDE Chat
                  </button>
                  <button
                    onClick={handleRun}
                    disabled={isRunning}
                    className="px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />} Run
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20 disabled:opacity-50"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>

            {/* Terminal Console Output */}
            <div className="h-40 bg-gray-950 border border-gray-800 rounded-3xl p-4 flex flex-col font-mono text-xs shadow-sm">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold pb-2 border-b border-gray-800 block mb-2 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-400" /> Console Terminal Output
              </span>
              <div className="flex-1 overflow-y-auto whitespace-pre-line text-gray-300 text-[11px] leading-relaxed scrollbar-none font-medium">
                {consoleOutput || 'Ready for compiling. Press "Run Code" or "Submit" to evaluate correctness.'}
              </div>
            </div>
          </div>

          {/* Right panel: Live SDE Partner Collaborative Chat */}
          {isChatOpen && (
            <div className={`lg:col-span-3 border rounded-3xl flex flex-col h-full overflow-hidden ${cardStyle}`}>
              <div className={`p-4 border-b shrink-0 ${
                isDark ? 'bg-gray-950/40 border-gray-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block font-mono">Live Coding round</span>
                <h4 className={`font-bold mt-0.5 text-xs flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> SDE Collaborative Partner
                </h4>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-[11px] font-medium">
                {chatMessages.map((msg, i) => {
                  const isSde = msg.sender === 'SDE Partner';
                  return (
                    <div key={i} className={`flex gap-2 items-start ${isSde ? '' : 'flex-row-reverse'}`}>
                      <div className={`p-1.5 rounded-lg shrink-0 text-white ${isSde ? 'bg-blue-600' : 'bg-gray-800'}`}>
                        {isSde ? <MessageSquare className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                      </div>
                      <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                        isSde 
                          ? (isDark ? 'bg-blue-500/10 text-gray-200 border border-blue-500/20' : 'bg-blue-50 text-slate-800 border border-blue-100') 
                          : (isDark ? 'bg-gray-800 text-white' : 'bg-slate-200 text-slate-900')
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                {isChatLoading && (
                  <div className="flex gap-2 items-start">
                    <div className="p-1.5 bg-blue-600 rounded-lg text-white">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <div className={`p-3 border text-gray-400 italic rounded-2xl max-w-[85%] ${
                      isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'
                    }`}>
                      Partner is reviewing code draft...
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input */}
              <div className={`p-3.5 border-t shrink-0 flex gap-2 ${
                isDark ? 'bg-gray-950/40 border-gray-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask SDE partner..."
                  className={`flex-1 px-3 py-2 border rounded-xl text-xs outline-none font-medium transition-all ${inputStyle}`}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                />
                <button
                  onClick={handleSendChat}
                  disabled={!chatInput.trim() || isChatLoading}
                  className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl cursor-pointer disabled:opacity-40 transition-all shadow-md shadow-blue-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Code Review Overlay Modal */}
      {showAiReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-lg border p-6 rounded-3xl shadow-2xl space-y-4 ${
            isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex justify-between items-center pb-3 border-b ${isDark ? 'border-gray-800' : 'border-slate-100'}`}>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Sparkles className="w-4 h-4 animate-spin-slow" /> Premium AI Code Review
              </span>
              <button
                onClick={() => setShowAiReview(false)}
                className={`font-bold hover:opacity-75 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}
              >
                ✕
              </button>
            </div>
            <div className={`text-xs font-mono whitespace-pre-line leading-relaxed max-h-96 overflow-y-auto pr-1 ${
              isDark ? 'text-gray-300' : 'text-slate-700'
            }`}>
              {aiReview}
            </div>
            <div className={`flex justify-end pt-3 border-t ${isDark ? 'border-gray-800' : 'border-slate-100'}`}>
              <button
                onClick={() => setShowAiReview(false)}
                className={`px-4 py-2 border rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  isDark ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700' : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                }`}
              >
                Apply suggestions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}