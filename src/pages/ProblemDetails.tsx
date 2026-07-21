import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Code2, Copy, Play, Send, Sparkles } from 'lucide-react';
import { useProblem } from '../hooks/useProblem';
import { useEditor } from '../hooks/useEditor';
import { useExecution } from '../hooks/useExecution';
import { useSubmission } from '../hooks/useSubmission';
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

interface ProblemDetailsProps {
  isDark?: boolean;
}

export default function ProblemDetails({ isDark = false }: ProblemDetailsProps) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'description' | 'hints' | 'editorial'>('description');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'assistant' | 'user'; text: string }>>([
    { role: 'assistant', text: 'Review the prompt, then run your solution and submit once it looks solid.' }
  ]);

  const { problem, loadProblem } = useProblem(slug);
  const editor = useEditor(slug || 'problem');
  const { execute, loading: executionLoading, result } = useExecution();
  const { submit, loading: submissionLoading } = useSubmission();

  useEffect(() => {
    if (slug) {
      loadProblem(slug);
    }
  }, [loadProblem, slug]);

  useEffect(() => {
    if (problem?.optimalSolution && !editor.code) {
      editor.setCode(problem.optimalSolution);
    }
  }, [editor, problem]);

  const cardStyle = isDark ? 'border-slate-800 bg-slate-900/80 text-slate-100' : 'border-slate-200 bg-white text-slate-900';
  const muted = isDark ? 'text-slate-400' : 'text-slate-600';

  const handleRun = async () => {
    if (!problem) return;
    await execute({ language: editor.language, code: editor.code, questionId: problem.id, mode: 'run' });
  };

  const handleSubmit = async () => {
    if (!problem) return;
    const execution = await execute({ language: editor.language, code: editor.code, questionId: problem.id, mode: 'submit' });
    if (!execution) return;
    await submit({
      id: `${problem.id}-${Date.now()}`,
      problemId: problem.id,
      status: execution.output.toLowerCase().includes('accepted') ? 'Accepted' : 'Wrong Answer',
      language: editor.language,
      runtime: execution.runtime || '0ms',
      memory: execution.memory || '0KB',
      submittedAt: new Date().toISOString(),
      feedback: execution.output
    });
  };

  const handleSendChat = () => {
    if (!chatInput.trim() || !problem) return;
    setChatMessages((prev) => [...prev, { role: 'user', text: chatInput }]);
    setChatMessages((prev) => [...prev, { role: 'assistant', text: `Let’s focus on ${problem.title} with an interview-ready approach.` }]);
    setChatInput('');
  };

  const summaryText = useMemo(() => {
    const base = problem ? `${problem.title} • ${problem.difficulty}` : 'Loading problem';
    return base;
  }, [problem]);

  if (!problem) {
    return (
      <div className={`rounded-3xl border p-8 ${cardStyle}`}>
        <div className="flex items-center gap-2 text-blue-500">
          <BookOpen size={18} />
          <span className="text-sm font-semibold uppercase tracking-[0.28em]">Loading workspace</span>
        </div>
        <p className={`mt-3 text-sm ${muted}`}>Preparing the coding workspace for this problem.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`rounded-3xl border p-4 ${cardStyle}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <button onClick={() => navigate('/')} className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-500">
              <ArrowLeft size={16} /> Back to dashboard
            </button>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-500">Coding Workspace</p>
            <h1 className="text-2xl font-bold">{problem.title}</h1>
            <p className={`mt-1 text-sm ${muted}`}>{summaryText}</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="text-blue-500" size={16} />
            <span className={muted}>Real execution, local drafts, and submission history</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className={`rounded-3xl border p-4 ${cardStyle}`}>
          <div className="mb-4 flex gap-2">
            {(['description', 'hints', 'editorial'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-full px-3 py-2 text-sm font-medium ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                {tab === 'description' ? 'Description' : tab === 'hints' ? 'Hints' : 'Editorial'}
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
          ) : (
            <Editorial editorial={problem.editorial} />
          )}
        </div>

        <div className="space-y-4">
          <div className={`rounded-3xl border p-4 ${cardStyle}`}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Code2 size={16} className="text-blue-500" />
                <h2 className="font-semibold">Editor</h2>
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
            <div className="mt-3 h-[340px] rounded-2xl border border-slate-200">
              <MonacoEditor
                value={editor.code}
                language={editor.language}
                theme={isDark ? 'vs-dark' : 'vs-light'}
                onChange={(value) => editor.setCode(value ?? '')}
                options={{ fontSize: editor.fontSize, wordWrap: editor.wordWrap ? 'on' : 'off' }}
              />
            </div>
            <div className="mt-4">
              <Console output={result?.output || 'Run your code to view the judge output.'} />
            </div>
          </div>

          <div className={`rounded-3xl border p-4 ${cardStyle}`}>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Send size={16} className="text-blue-500" />
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
        </div>
      </div>
    </div>
  );
}
