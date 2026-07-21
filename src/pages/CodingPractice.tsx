import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Code2, Play, Send, BookOpen, MessageSquareQuote } from 'lucide-react';
import { CodingProblem } from '../types';
import { useProblem } from '../hooks/useProblem';
import { useExecution } from '../hooks/useExecution';
import { useSubmission } from '../hooks/useSubmission';
import { useEditor } from '../hooks/useEditor';
import MonacoEditor from '../components/editor/MonacoEditor';
import EditorToolbar from '../components/editor/EditorToolbar';
import LanguageSelector from '../components/editor/LanguageSelector';
import RunButton from '../components/editor/RunButton';
import SubmitButton from '../components/editor/SubmitButton';
import Console from '../components/editor/Console';
import ProblemDescription from '../components/problem/ProblemDescription';
import Constraints from '../components/problem/Constraints';
import Examples from '../components/problem/Examples';
import Hints from '../components/problem/Hints';
import Editorial from '../components/problem/Editorial';
import Companies from '../components/problem/Companies';
import Notes from '../components/problem/Notes';
import ExecutionResult from '../components/execution/ExecutionResult';
import RuntimeBadge from '../components/execution/RuntimeBadge';
import MemoryBadge from '../components/execution/MemoryBadge';

interface CodingPracticePageProps {
  isDark?: boolean;
}

export default function CodingPracticePage({ isDark = false }: CodingPracticePageProps) {
  const navigate = useNavigate();
  const [selectedProblemId, setSelectedProblemId] = useState<string>('two-sum');
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'hints' | 'editorial' | 'notes'>('description');
  const [notes, setNotes] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'assistant' | 'user'; text: string }>>([
    { role: 'assistant', text: 'Welcome to the coding studio. Review the prompt, then run and submit your solution.' }
  ]);

  const { problems, loadProblems, loadProblem, problem } = useProblem(selectedProblemId);
  const { execute, loading: executionLoading, result } = useExecution();
  const { submit, loading: submissionLoading } = useSubmission();
  const editor = useEditor(selectedProblemId);

  useEffect(() => {
    loadProblems();
  }, [loadProblems]);

  useEffect(() => {
    if (selectedProblemId) {
      loadProblem(selectedProblemId);
    }
  }, [loadProblem, selectedProblemId]);

  useEffect(() => {
    if (problem?.optimalSolution) {
      editor.setCode(problem.optimalSolution);
    }
  }, [editor, problem]);

  const filteredProblems = useMemo(() => {
    return problems.filter((item) => {
      const bySearch = item.title.toLowerCase().includes(search.toLowerCase());
      const byDifficulty = difficultyFilter ? item.difficulty === difficultyFilter : true;
      const byTag = tagFilter ? item.tags.includes(tagFilter) : true;
      return bySearch && byDifficulty && byTag;
    });
  }, [difficultyFilter, problems, search, tagFilter]);

  const tags = useMemo(() => Array.from(new Set(problems.flatMap((item) => item.tags))), [problems]);

  const handleRun = async () => {
    if (!problem) return;
    await execute({ language: editor.language, code: editor.code, input: '' });
  };

  const handleSubmit = async () => {
    if (!problem) return;
    await submit({
      id: `${problem.id}-${Date.now()}`,
      problemId: problem.id,
      status: 'Accepted',
      language: editor.language,
      runtime: '0ms',
      memory: '0KB',
      submittedAt: new Date().toISOString()
    });
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { role: 'user', text: chatInput }]);
    setChatMessages((prev) => [...prev, { role: 'assistant', text: `Let’s focus on ${problem?.title ?? 'this problem'} with a clean, interview-ready approach.` }]);
    setChatInput('');
  };

  const cardStyle = isDark ? 'border-slate-800 bg-slate-900/80 text-slate-100' : 'border-slate-200 bg-white text-slate-900';
  const muted = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="space-y-4">
      <div className={`rounded-3xl border p-4 ${cardStyle}`}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-500">Coding Studio</p>
            <h2 className="text-2xl font-bold">LeetCode-style practice workspace</h2>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="text-blue-500" size={16} />
            <span className={muted}>Monaco editor, execution flow, submissions, notes, and progress-ready architecture</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <div className={`rounded-3xl border p-4 ${cardStyle}`}>
          <div className="mb-3 flex items-center gap-2">
            <Search size={16} className="text-blue-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search problems"
              className={`w-full rounded-2xl border px-3 py-2 text-sm ${isDark ? 'border-slate-800 bg-slate-950 text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-900'}`}
            />
          </div>
          <div className="mb-3 flex gap-2">
            <select value={difficultyFilter} onChange={(event) => setDifficultyFilter(event.target.value)} className={`rounded-2xl border px-3 py-2 text-sm ${isDark ? 'border-slate-800 bg-slate-950 text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-900'}`}>
              <option value="">All difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)} className={`rounded-2xl border px-3 py-2 text-sm ${isDark ? 'border-slate-800 bg-slate-950 text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-900'}`}>
              <option value="">All topics</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            {filteredProblems.map((item) => (
              <button key={item.id} onClick={() => navigate(`/problems/${item.slug}`)} className={`w-full rounded-2xl border px-3 py-3 text-left text-sm ${selectedProblemId === item.id ? 'border-blue-500 bg-blue-500/10' : 'border-transparent bg-slate-50/70'}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{item.title}</span>
                  <span className="text-xs text-slate-500">{item.difficulty}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-200 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-600">{tag}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {problem ? (
            <>
              <div className={`rounded-3xl border p-4 ${cardStyle}`}>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold">{problem.title}</h3>
                    <p className="text-sm text-slate-500">{problem.acceptanceRate} acceptance • {problem.companies.join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RuntimeBadge runtime={result?.runtime} />
                    <MemoryBadge memory={result?.memory} />
                  </div>
                </div>
                <div className="mb-4 flex gap-2">
                  {(['description', 'hints', 'editorial', 'notes'] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-full px-3 py-2 text-sm font-medium ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      {tab === 'description' ? 'Description' : tab === 'hints' ? 'Hints' : tab === 'editorial' ? 'Editorial' : 'Notes'}
                    </button>
                  ))}
                </div>
                {activeTab === 'description' ? (
                  <div className="space-y-4">
                    <ProblemDescription problem={problem} />
                    <Constraints constraints={problem.constraints} />
                    <Examples examples={problem.examples} />
                    <Companies companies={problem.companies} />
                  </div>
                ) : activeTab === 'hints' ? (
                  <Hints hints={problem.hints} />
                ) : activeTab === 'editorial' ? (
                  <Editorial editorial={problem.editorial} />
                ) : (
                  <Notes value={notes} onChange={setNotes} />
                )}
              </div>

              <div className={`rounded-3xl border p-4 ${cardStyle}`}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Code2 size={16} className="text-blue-500" />
                    <h3 className="font-semibold">Editor</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <LanguageSelector value={editor.language} onChange={editor.setLanguage} />
                    <RunButton loading={executionLoading} onClick={handleRun} />
                    <SubmitButton loading={submissionLoading} onClick={handleSubmit} />
                  </div>
                </div>
                <EditorToolbar
                  fontSize={editor.fontSize}
                  onFontSizeChange={(delta) => editor.setFontSize((value) => Math.max(10, Math.min(24, value + delta)))}
                  wordWrap={editor.wordWrap}
                  onWordWrapToggle={() => editor.setWordWrap((value) => !value)}
                  onReset={() => editor.setCode(problem.optimalSolution)}
                  onCopy={() => navigator.clipboard.writeText(editor.code)}
                />
                <div className="mt-3 h-[320px] rounded-2xl border border-slate-200">
                  <MonacoEditor
                    value={editor.code}
                    language={editor.language}
                    theme={isDark ? 'vs-dark' : 'vs-light'}
                    onChange={(value) => editor.setCode(value ?? '')}
                    options={{ fontSize: editor.fontSize, wordWrap: editor.wordWrap ? 'on' : 'off' }}
                  />
                </div>
                <div className="mt-4">
                  <Console output={result?.output ?? ''} />
                </div>
                <div className="mt-4">
                  <ExecutionResult output={result?.output ?? 'No execution yet.'} />
                </div>
              </div>

              <div className={`rounded-3xl border p-4 ${cardStyle}`}>
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <MessageSquareQuote size={16} className="text-blue-500" />
                  <span>AI Companion</span>
                </div>
                <div className="space-y-2">
                  {chatMessages.map((message, index) => (
                    <div key={`${message.role}-${index}`} className={`rounded-2xl px-3 py-2 text-sm ${message.role === 'assistant' ? 'bg-slate-100 text-slate-700' : 'bg-blue-600 text-white'}`}>
                      {message.text}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    placeholder="Ask for a hint or explain an error"
                    className={`flex-1 rounded-2xl border px-3 py-2 text-sm ${isDark ? 'border-slate-800 bg-slate-950 text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-900'}`}
                  />
                  <button onClick={handleSendChat} className="rounded-2xl bg-blue-600 px-3 py-2 text-white">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={`rounded-3xl border p-8 text-center ${cardStyle}`}>
              <BookOpen className="mx-auto mb-3 text-blue-500" size={28} />
              <h3 className="text-lg font-semibold">Choose a problem to begin</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
