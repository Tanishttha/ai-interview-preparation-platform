import React, { useState, useEffect } from 'react';
import { 
  Bookmark, Calendar as CalendarIcon, Timer, Trophy, ShieldCheck, 
  Sparkles, Plus, Folder, Search, Check, RefreshCw, MessageSquare, 
  Send, Layers 
} from 'lucide-react';
import { ACHIEVEMENTS, LEADERBOARD_ENTRIES } from '../data';
import { Note } from '../types';
import { apiFetch } from '../lib/apiClient';

interface OtherToolsProps {
  tool: 'bookmarks' | 'leaderboard' | 'achievements' | 'calendar' | 'pomodoro' | 'notes' | 'experiences';
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  isDark?: boolean;
}

export default function OtherTools({ tool, bookmarks, onToggleBookmark, isDark = false }: OtherToolsProps) {
  // --- Pomodoro State ---
  const [pomoTime, setPomoTime] = useState(1500); // 25 min default
  const [pomoActive, setPomoActive] = useState(false);
  // --- Stopwatch State ---
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);

  useEffect(() => {
    let timer: any;
    if (pomoActive && pomoTime > 0) {
      timer = setInterval(() => {
        setPomoTime((p) => p - 1);
      }, 1000);
    } else if (pomoTime === 0 && pomoActive) {
      setPomoActive(false);
      alert('Pomodoro period completed! Take a break.');
    }
    return () => clearInterval(timer);
  }, [pomoActive, pomoTime]);

  // Stopwatch interval effect
  useEffect(() => {
    let interval: any = null;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stopwatchRunning]);

  const formatPomoTime = () => {
    const mins = Math.floor(pomoTime / 60);
    const secs = pomoTime % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatStopwatch = () => {
    const h = Math.floor(stopwatchSeconds / 3600).toString().padStart(2,'0');
    const m = Math.floor((stopwatchSeconds % 3600) / 60).toString().padStart(2,'0');
    const s = (stopwatchSeconds % 60).toString().padStart(2,'0');
    return `${h}:${m}:${s}`;
  };

  // --- Notes State ---
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [notesSearch, setNotesSearch] = useState('');

  // Fetch Notes on mount
  useEffect(() => {
    apiFetch('/api/notes')
      .then((res) => {
        if (!res.ok) {
          setNotes([]);
          setActiveNote(null);
          setNoteTitle('');
          setNoteContent('');
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setNotes(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          setActiveNote(data[0]);
          setNoteTitle(data[0].title);
          setNoteContent(data[0].content);
        } else {
          setActiveNote(null);
          setNoteTitle('');
          setNoteContent('');
        }
      })
      .catch((err) => {
        console.error('Error fetching notes:', err);
      });
  }, []);

  const handleSaveNote = async () => {
    if (!activeNote) return;
    try {
      const res = await apiFetch(`/api/notes/${activeNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: noteTitle, content: noteContent })
      });
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      const updated = notes.map((n) => (n.id === activeNote.id ? data : n));
      setNotes(updated);
      setActiveNote(data);
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  const handleCreateNote = async () => {
    try {
      const res = await apiFetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Scratchpad Note',
          content: 'Start writing your conceptual code details here...',
          folder: 'Unsorted'
        })
      });
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      setNotes([data, ...notes]);
      setActiveNote(data);
      setNoteTitle(data.title);
      setNoteContent(data.content);
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const res = await apiFetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        return;
      }
      const updated = notes.filter((n) => n.id !== id);
      setNotes(updated);
      if (activeNote?.id === id) {
        if (updated.length > 0) {
          setActiveNote(updated[0]);
          setNoteTitle(updated[0].title);
          setNoteContent(updated[0].content);
        } else {
          setActiveNote(null);
          setNoteTitle('');
          setNoteContent('');
        }
      }
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  // --- Leaderboard State ---
  const [leaderboardCategory, setLeaderboardCategory] = useState<'global' | 'college' | 'friends'>('global');

  // --- Calendar Events ---
  interface CalendarEvent {
    id: string;
    title: string;
    time: string;
    date: string;
    description?: string;
  }
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');

  const fetchCalendar = () => {
    apiFetch('/api/calendar')
      .then((res) => res.json())
      .then((data) => setCalendarEvents(data))
      .catch((err) => console.error('Error fetching calendar:', err));
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  const handleAddCalendarEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDate) return;
    try {
      const res = await apiFetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEventTitle,
          date: newEventDate,
          time: newEventTime || '12:00',
          description: 'Custom Study Session'
        })
      });
      if (res.ok) {
        setNewEventTitle('');
        setNewEventDate('');
        setNewEventTime('');
        fetchCalendar();
      }
    } catch (err) {
      console.error('Error adding event:', err);
    }
  };

  // --- Experiences (Community Feed) & RAG Patterns State ---
  const [experiencesTab, setExperiencesTab] = useState<'feed' | 'rag'>('feed');
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isExperiencesLoading, setIsExperiencesLoading] = useState(false);

  // Sharing form
  const [shareTitle, setShareTitle] = useState('');
  const [shareCompany, setShareCompany] = useState('Google');
  const [shareRole, setShareRole] = useState('SDE-1');
  const [shareDifficulty, setShareDifficulty] = useState('Medium');
  const [shareContent, setShareContent] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  // RAG Pattern Scraper form
  const [ragCompany, setRagCompany] = useState('Netflix');
  const [customCompany, setCustomCompany] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [isRaging, setIsRaging] = useState(false);
  const [scrapedHistory, setScrapedHistory] = useState<any[]>([]);
  const [ragPatterns, setRagPatterns] = useState<any>({
    company: "Netflix",
    hiringTrends: "Stresses system architecture boundaries, high availability, and structural microservice failure loops.",
    focusSkills: ["System Design", "Scalability", "DP Optimization"],
    recentQuestions: [
      "Design a real-time analytics pipeline that processes billions of ticks per second.",
      "Implement a lock-free ring buffer for zero-latency task queues."
    ],
    RAGcontext: "Seeded initial knowledge cache."
  });

  const fetchScrapedHistory = async () => {
    try {
      const res = await apiFetch('/api/ai/scrape/history');
      if (res.ok) {
        const data = await res.json();
        setScrapedHistory(data);
      }
    } catch (err) {
      console.error('Error fetching scraped logs:', err);
    }
  };

  const fetchExperiences = async () => {
    setIsExperiencesLoading(true);
    try {
      const res = await apiFetch('/api/ai/experiences');
      const data = await res.json();
      setExperiences(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExperiencesLoading(false);
    }
  };

  useEffect(() => {
    if (tool === 'experiences') {
      fetchExperiences();
      fetchScrapedHistory();
    }
  }, [tool]);

  const handleShareExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareTitle || !shareContent) return;
    setIsSharing(true);
    try {
      const res = await apiFetch('/api/ai/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: shareTitle,
          company: shareCompany,
          role: shareRole,
          difficulty: shareDifficulty,
          content: shareContent
        })
      });
      if (res.ok) {
        setShareTitle('');
        setShareContent('');
        fetchExperiences();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSharing(false);
    }
  };

  const handleRunRagScraper = async () => {
    setIsRaging(true);
    try {
      const bodyPayload = customCompany 
        ? { companyName: customCompany, url: customUrl }
        : { companyName: ragCompany };
      
      const endpoint = customCompany ? '/api/ai/scrape' : '/api/ai/scrape-patterns';

      const res = await apiFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      
      const responseData = await res.json();
      const actualData = responseData.data || responseData;
      
      setRagPatterns({
        company: actualData.company || actualData.companyName,
        hiringTrends: actualData.hiringTrends || actualData.interviewProcess,
        recentQuestions: actualData.recentQuestions || [],
        focusSkills: actualData.focusSkills || actualData.technicalTopics || [],
        RAGcontext: actualData.RAGcontext || `Live grounded context scraped from careers site and indexed on ${actualData.scrapedAt || new Date().toISOString().split('T')[0]}.`
      });

      setCustomCompany('');
      setCustomUrl('');
      fetchScrapedHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setIsRaging(false);
    }
  };

  // Dynamic Theme Variables
  const bgMain = isDark ? 'bg-[#0B0F17]' : 'bg-white';
  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const borderPrimary = isDark ? 'border-slate-800' : 'border-slate-200';
  
  const cardBg = isDark ? 'bg-[#0F172A]' : 'bg-white';
  const subCardBg = isDark ? 'bg-[#161B22]' : 'bg-slate-50';
  const inputBg = isDark ? 'bg-[#161B22] text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 text-slate-900 placeholder:text-slate-400';

  return (
    <div className={`p-6 space-y-6 min-h-screen transition-colors duration-300 ${bgMain} ${textPrimary}`}>
      {/* 1. BOOKMARKS VIEW */}
      {tool === 'bookmarks' && (
        <div className={`p-6 border rounded-3xl space-y-4 shadow-sm ${cardBg} ${borderPrimary}`}>
          <div className={`pb-2 border-b ${borderPrimary}`}>
            <h3 className={`font-bold text-base flex items-center gap-2 ${textPrimary}`}>
              <Bookmark className="w-5 h-5 text-blue-500 fill-blue-500/10" /> Saved Bookmarks
            </h3>
          </div>
          {bookmarks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bookmarks.map((bId) => (
                <div key={bId} className={`p-4 border rounded-2xl flex justify-between items-center text-xs ${subCardBg} ${borderPrimary}`}>
                  <div className="space-y-0.5">
                    <span className={`font-bold block uppercase font-mono tracking-wider text-[10px] ${textSecondary}`}>Saved Item</span>
                    <strong className={`block text-sm capitalize ${textPrimary}`}>{bId} Tracker</strong>
                  </div>
                  <button
                    onClick={() => onToggleBookmark(bId)}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-8 text-center text-xs font-medium leading-relaxed ${textSecondary}`}>
              No saved bookmarks found. Go to Company Explorer or Coding list to save item milestones.
            </div>
          )}
        </div>
      )}

      {/* 2. LEADERBOARD VIEW */}
      {tool === 'leaderboard' && (
        <div className={`p-6 border rounded-3xl space-y-5 shadow-sm ${cardBg} ${borderPrimary}`}>
          <div className={`flex justify-between items-center pb-2.5 border-b ${borderPrimary}`}>
            <h3 className={`font-bold text-base flex items-center gap-2 ${textPrimary}`}>
              <Trophy className="w-5 h-5 text-amber-500" /> Premium Arena Leaderboards
            </h3>
            <div className={`flex gap-1.5 p-1 border rounded-2xl text-[10px] font-bold uppercase ${
              isDark ? 'bg-[#161B22] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              {(['global', 'college', 'friends'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setLeaderboardCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${
                    leaderboardCategory === cat 
                      ? (isDark ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/30' : 'bg-blue-100 text-blue-800 border border-blue-200 shadow-xs') 
                      : textSecondary
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {LEADERBOARD_ENTRIES.filter((e) => e.type === leaderboardCategory).map((entry, idx) => (
              <div key={idx} className={`p-4.5 border rounded-2xl text-xs flex justify-between items-center ${subCardBg} ${borderPrimary}`}>
                <div className="flex items-center gap-3">
                  <span className={`font-bold font-mono w-4 ${textSecondary}`}>{entry.rank}</span>
                  <span className="text-base">{entry.avatar}</span>
                  <div>
                    <h4 className={`font-bold ${textPrimary}`}>{entry.name}</h4>
                    <p className={`text-[10px] font-medium ${textSecondary}`}>{entry.college}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-blue-600 dark:text-cyan-400 font-mono block">{entry.xp} XP</span>
                  <span className={`text-[9px] font-bold block ${textSecondary}`}>{entry.problemsSolved} Solved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ACHIEVEMENTS VIEW */}
      {tool === 'achievements' && (
        <div className={`p-6 border rounded-3xl space-y-5 shadow-sm ${cardBg} ${borderPrimary}`}>
          <div className={`pb-2 border-b ${borderPrimary}`}>
            <h3 className={`font-bold text-base flex items-center gap-2 ${textPrimary}`}>
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Badges &amp; Goals
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ACHIEVEMENTS.map((ach) => (
              <div key={ach.id} className={`p-5 border rounded-3xl text-xs space-y-3.5 ${subCardBg} ${borderPrimary}`}>
                <div className="flex justify-between items-start">
                  <div className="flex gap-2.5">
                    <span className="text-2xl">{ach.icon}</span>
                    <div className="space-y-0.5">
                      <h4 className={`font-bold ${textPrimary}`}>{ach.title}</h4>
                      <p className={`text-[10px] font-medium leading-relaxed max-w-[200px] ${textSecondary}`}>{ach.description}</p>
                    </div>
                  </div>
                  {ach.unlockedAt ? (
                    <span className={`px-2 py-0.5 border rounded text-[9px] font-mono uppercase tracking-wider font-bold ${
                      isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}>Unlocked</span>
                  ) : (
                    <span className={`px-2 py-0.5 border rounded text-[9px] font-mono uppercase tracking-wider font-bold ${
                      isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-200 border-slate-300 text-slate-600'
                    }`}>Pending</span>
                  )}
                </div>
                {ach.progress && (
                  <div className="space-y-1.5">
                    <div className={`flex justify-between text-[10px] font-bold ${textSecondary}`}>
                      <span>Goal Progress</span>
                      <span>{ach.progress.current} / {ach.progress.total}</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((ach.progress.current / ach.progress.total) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CALENDAR VIEW */}
      {tool === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`lg:col-span-7 border rounded-3xl p-6 space-y-4 shadow-sm ${cardBg} ${borderPrimary}`}>
            <div className={`pb-2 border-b ${borderPrimary}`}>
              <h3 className={`font-bold text-base flex items-center gap-2 ${textPrimary}`}>
                <CalendarIcon className="w-5 h-5 text-indigo-500" /> Study Planner Calendar
              </h3>
            </div>
            {calendarEvents.length > 0 ? (
              <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
                {calendarEvents.map((ev) => (
                  <div key={ev.id} className={`p-4 border rounded-2xl flex gap-3.5 text-xs items-center justify-between ${subCardBg} ${borderPrimary}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📅</span>
                      <div>
                        <h4 className={`font-bold ${textPrimary}`}>{ev.title}</h4>
                        <span className={`text-[10px] font-mono font-medium block mt-0.5 ${textSecondary}`}>{ev.date} • {ev.time}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 border rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                      isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-800'
                    }`}>
                      Study session
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-center text-xs font-medium py-8 ${textSecondary}`}>No scheduled sessions. Use the planner form on the right to schedule a coding or review session!</p>
            )}
          </div>

          <div className={`lg:col-span-5 border rounded-3xl p-6 shadow-sm ${cardBg} ${borderPrimary}`}>
            <div className={`pb-2 border-b mb-4 ${borderPrimary}`}>
              <h4 className={`font-bold text-sm ${textPrimary}`}>Schedule Study Session</h4>
            </div>
            <form onSubmit={handleAddCalendarEvent} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider block ${textSecondary}`}>Session Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Graph traversals & Dynamic Programming"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className={`w-full border px-3.5 py-2.5 rounded-xl outline-none focus:border-blue-500 transition-all ${inputBg} ${borderPrimary}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold uppercase tracking-wider block ${textSecondary}`}>Date</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className={`w-full border px-3 py-2.5 rounded-xl outline-none focus:border-blue-500 transition-all ${inputBg} ${borderPrimary}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-[10px] font-bold uppercase tracking-wider block ${textSecondary}`}>Time</label>
                  <input
                    type="time"
                    required
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className={`w-full border px-3 py-2.5 rounded-xl outline-none focus:border-blue-500 transition-all ${inputBg} ${borderPrimary}`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-center font-bold text-xs transition-colors cursor-pointer block shadow-sm"
              >
                Add Session to Planner
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. POMODORO TIMER */}
      {tool === 'pomodoro' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Pomodoro Card */}
          <div className={`p-8 border rounded-3xl text-center space-y-6 shadow-sm ${cardBg} ${borderPrimary}`}>
            <div className="space-y-1">
              <h3 className={`font-bold text-base flex items-center justify-center gap-2 ${textPrimary}`}>
                Pomodoro Timer
              </h3>
              <p className={`text-xs font-medium ${textSecondary}`}>Structure your algorithmic blocks with high-focus cycles.</p>
            </div>
            <div className="relative flex flex-col items-center">
              <div className="text-5xl font-mono font-bold text-rose-500 tracking-wider">
                {formatPomoTime()}
              </div>
              {pomoActive && (
                <span className="mt-2 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse mr-2"></span>
                  <span className={`text-xs font-mono ${textSecondary}`}>Focusing...</span>
                </span>
              )}
            </div>
            <div className="flex justify-center gap-2 text-xs font-bold">
              <button
                onClick={() => {
                  setPomoTime(1500);
                  setPomoActive(false);
                }}
                className={`px-3 py-1.5 border rounded-lg cursor-pointer ${subCardBg} ${borderPrimary} ${textSecondary}`}
                type="button"
              >
                25 Min Standard
              </button>
              <button
                onClick={() => {
                  setPomoTime(3000);
                  setPomoActive(false);
                }}
                className={`px-3 py-1.5 border rounded-lg cursor-pointer ${subCardBg} ${borderPrimary} ${textSecondary}`}
                type="button"
              >
                50 Min deep blocks
              </button>
            </div>
            <button
              onClick={() => setPomoActive(!pomoActive)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 mx-auto cursor-pointer shadow-md transition-all ${
                pomoActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
              }`}
              type="button"
            >
              {pomoActive ? 'Pause Focus' : 'Start Focus'}
            </button>
          </div>
          {/* Stopwatch Card */}
          <div className={`p-8 border rounded-3xl text-center space-y-6 shadow-sm ${cardBg} ${borderPrimary}`}>
            <div className="space-y-1">
              <h3 className={`font-bold text-base flex items-center justify-center gap-2 ${textPrimary}`}>
                ⏱ Stopwatch
              </h3>
              <p className={`text-xs font-medium ${textSecondary}`}>Track your uninterrupted study sessions.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-mono font-bold text-blue-600 dark:text-cyan-400 tracking-wider">
                {formatStopwatch()}
              </span>
              <span className={`text-[11px] mt-2 font-mono ${textSecondary}`}>Elapsed Study Time</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-xs font-bold mt-2">
              {/* Start */}
              {!stopwatchRunning && stopwatchSeconds === 0 && (
                <button
                  onClick={() => setStopwatchRunning(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-sm"
                  type="button"
                >
                  Start
                </button>
              )}
              {/* Pause */}
              {stopwatchRunning && (
                <button
                  onClick={() => setStopwatchRunning(false)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-sm"
                  type="button"
                >
                  Pause
                </button>
              )}
              {/* Resume */}
              {!stopwatchRunning && stopwatchSeconds > 0 && (
                <button
                  onClick={() => setStopwatchRunning(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-sm"
                  type="button"
                >
                  Resume
                </button>
              )}
              {/* Reset */}
              {stopwatchSeconds > 0 && (
                <button
                  onClick={() => {
                    setStopwatchRunning(false);
                    setStopwatchSeconds(0);
                  }}
                  className={`px-4 py-2 ${subCardBg} ${borderPrimary} ${textSecondary} border rounded-xl shadow-sm`}
                  type="button"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. CONCEPTUAL NOTES SECTION */}
      {tool === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] overflow-hidden">
          <div className={`lg:col-span-4 border rounded-3xl flex flex-col h-full overflow-hidden p-4 space-y-4 shadow-sm ${cardBg} ${borderPrimary}`}>
            <div className="flex justify-between items-center">
              <span className={`text-xs font-bold uppercase tracking-wider ${textPrimary}`}>Notebook files</span>
              <button
                onClick={handleCreateNote}
                className={`p-1.5 border rounded-lg cursor-pointer ${
                  isDark ? 'bg-blue-500/10 border-blue-500/20 text-cyan-400' : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}
                title="Create Scratchpad"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`} />
              <input
                type="text"
                placeholder="Search notes..."
                value={notesSearch}
                onChange={(e) => setNotesSearch(e.target.value)}
                className={`w-full pl-8 pr-3 py-2 border text-xs rounded-xl outline-none font-medium ${inputBg} ${borderPrimary}`}
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-none">
              {(Array.isArray(notes) ? notes : []).filter(n => n.title.toLowerCase().includes(notesSearch.toLowerCase())).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNote(item);
                    setNoteTitle(item.title);
                    setNoteContent(item.content);
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex flex-col gap-1 cursor-pointer ${
                    activeNote?.id === item.id
                      ? (isDark ? 'bg-cyan-900/40 border-cyan-500/30 text-white' : 'bg-blue-50 border-blue-200 text-blue-900 font-bold')
                      : `${subCardBg} ${borderPrimary} ${textSecondary}`
                  }`}
                >
                  <span className="font-bold block truncate">{item.title}</span>
                  <div className={`flex justify-between text-[9px] font-mono w-full ${textSecondary}`}>
                    <span className="flex items-center gap-1"><Folder className="w-3 h-3" /> {item.folder}</span>
                    <span>{item.updatedAt}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className={`lg:col-span-8 border rounded-3xl flex flex-col h-full overflow-hidden shadow-sm ${cardBg} ${borderPrimary}`}>
            {activeNote ? (
              <div className="flex-1 flex flex-col p-5 space-y-4">
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className={`font-bold text-base bg-transparent border-none outline-none ${textPrimary}`}
                />
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className={`flex-1 bg-transparent border-none outline-none text-xs resize-none font-medium leading-relaxed font-mono ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                  placeholder="Start jotting concepts down..."
                />
                <div className={`flex justify-between pt-3 border-t ${borderPrimary}`}>
                  <button
                    onClick={() => handleDeleteNote(activeNote.id)}
                    className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    Delete Note
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                  >
                    <Check className="w-4 h-4" /> Save Note
                  </button>
                </div>
              </div>
            ) : (
              <div className={`flex-1 text-center text-xs font-medium flex items-center justify-center ${textSecondary}`}>
                Select a note or create one to start drafting concepts.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. EXPERIENCES & RAG INTERVIEW PATTERN SECTION */}
      {tool === 'experiences' && (
        <div className="space-y-6">
          <div className={`flex justify-between items-center p-1.5 border rounded-2xl max-w-sm mx-auto ${
            isDark ? 'bg-[#161B22] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <button
              onClick={() => setExperiencesTab('feed')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all ${
                experiencesTab === 'feed'
                  ? (isDark ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/30 shadow-md' : 'bg-blue-100 text-blue-800 border border-blue-200 shadow-xs')
                  : textSecondary
              }`}
            >
              Candidate Feed
            </button>
            <button
              onClick={() => setExperiencesTab('rag')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all ${
                experiencesTab === 'rag'
                  ? (isDark ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/30 shadow-md' : 'bg-blue-100 text-blue-800 border border-blue-200 shadow-xs')
                  : textSecondary
              }`}
            >
              AI RAG Pattern Hub
            </button>
          </div>

          {experiencesTab === 'feed' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left panel: Experiences List */}
              <div className={`lg:col-span-8 p-6 border rounded-3xl space-y-4 shadow-sm ${cardBg} ${borderPrimary}`}>
                <div className={`pb-2 border-b ${borderPrimary}`}>
                  <h3 className={`font-bold text-base flex items-center gap-2 ${textPrimary}`}>
                    <MessageSquare className="w-5 h-5 text-blue-500" /> Interview Experience Arena
                  </h3>
                </div>

                {isExperiencesLoading ? (
                  <div className="py-12 text-center space-y-2">
                    <RefreshCw className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
                    <p className={`text-xs font-mono ${textSecondary}`}>Fetching shared experiences from corporate memory...</p>
                  </div>
                ) : experiences.length === 0 ? (
                  <p className={`text-center text-xs font-medium py-8 ${textSecondary}`}>No experiences shared yet. Be the first to post using the form on the right!</p>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {experiences.map((exp: any) => (
                      <div key={exp.id} className={`p-5 border rounded-3xl space-y-3 ${subCardBg} ${borderPrimary}`}>
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div className="space-y-0.5">
                            <span className={`text-[9px] font-bold uppercase font-mono tracking-wider ${
                              isDark ? 'text-cyan-400' : 'text-blue-700'
                            }`}>
                              {exp.company} • {exp.role}
                            </span>
                            <h4 className={`font-bold text-sm ${textPrimary}`}>{exp.title}</h4>
                          </div>
                          <span className={`px-2 py-0.5 border rounded text-[9px] font-bold font-mono uppercase ${
                            exp.difficulty === 'Hard'
                              ? (isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-800 border-rose-200')
                              : (isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-800 border-amber-200')
                          }`}>
                            {exp.difficulty} Difficulty
                          </span>
                        </div>
                        <p className={`text-xs font-medium leading-relaxed whitespace-pre-wrap ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          {exp.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right panel: Post form */}
              <div className={`lg:col-span-4 p-6 border rounded-3xl space-y-4 shadow-sm ${cardBg} ${borderPrimary}`}>
                <div className={`pb-1.5 border-b ${borderPrimary}`}>
                  <h4 className={`font-bold text-sm ${textPrimary}`}>Share Your Interview Round</h4>
                </div>

                <form onSubmit={handleShareExperience} className="space-y-3.5 text-xs font-medium">
                  <div className="space-y-1">
                    <span className={`text-[10px] font-bold block uppercase tracking-wider ${textSecondary}`}>Title</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Google SDE-2 Phone Screen"
                      value={shareTitle}
                      onChange={(e) => setShareTitle(e.target.value)}
                      className={`w-full p-2 border rounded-xl outline-none focus:border-blue-500 ${inputBg} ${borderPrimary}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className={`text-[10px] font-bold block uppercase tracking-wider ${textSecondary}`}>Company</span>
                      <select
                        value={shareCompany}
                        onChange={(e) => setShareCompany(e.target.value)}
                        className={`w-full p-2 border rounded-xl outline-none focus:border-blue-500 cursor-pointer ${inputBg} ${borderPrimary}`}
                      >
                        <option value="Google">Google</option>
                        <option value="Microsoft">Microsoft</option>
                        <option value="Amazon">Amazon</option>
                        <option value="Netflix">Netflix</option>
                        <option value="Uber">Uber</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <span className={`text-[10px] font-bold block uppercase tracking-wider ${textSecondary}`}>Role</span>
                      <input
                        type="text"
                        required
                        value={shareRole}
                        onChange={(e) => setShareRole(e.target.value)}
                        className={`w-full p-2 border rounded-xl outline-none focus:border-blue-500 ${inputBg} ${borderPrimary}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className={`text-[10px] font-bold block uppercase tracking-wider ${textSecondary}`}>Round Difficulty</span>
                    <select
                      value={shareDifficulty}
                      onChange={(e) => setShareDifficulty(e.target.value)}
                      className={`w-full p-2 border rounded-xl outline-none focus:border-blue-500 font-bold cursor-pointer ${inputBg} ${borderPrimary}`}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className={`text-[10px] font-bold block uppercase tracking-wider ${textSecondary}`}>Content &amp; Questions asked</span>
                    <textarea
                      required
                      placeholder="List the technical and coding problems asked, along with behavioral details..."
                      value={shareContent}
                      onChange={(e) => setShareContent(e.target.value)}
                      className={`w-full h-24 p-2 border rounded-xl outline-none focus:border-blue-500 resize-none font-medium leading-relaxed ${inputBg} ${borderPrimary}`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSharing}
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {isSharing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Publish Experience
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Form & History */}
              <div className="lg:col-span-5 space-y-5">
                {/* Scraping Panel */}
                <div className={`p-5 border rounded-3xl space-y-4 shadow-sm ${cardBg} ${borderPrimary}`}>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 uppercase tracking-wider font-mono">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Live Scraper Console
                    </span>
                    <h3 className={`text-base font-bold ${textPrimary}`}>Run Corporate Intelligence</h3>
                    <p className={`text-[11px] font-medium leading-relaxed ${textSecondary}`}>
                      Crawl corporate career portals and interview boards in real-time. Grounded AI parses raw text into patterns.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Preset Selection */}
                    <div className="space-y-1">
                      <label className={`text-[10px] font-bold uppercase tracking-wider block ${textSecondary}`}>Target Preset Corporate</label>
                      <select
                        value={ragCompany}
                        onChange={(e) => {
                          setRagCompany(e.target.value);
                          setCustomCompany(''); // clear custom
                        }}
                        disabled={!!customCompany}
                        className={`w-full px-3 py-2 border rounded-xl text-xs outline-none font-bold cursor-pointer ${inputBg} ${borderPrimary}`}
                      >
                        <option value="Google">Google (Software Engineer)</option>
                        <option value="Netflix">Netflix (Platform & Systems SDE)</option>
                        <option value="Amazon">Amazon (SDE-2 Fullstack)</option>
                        <option value="Meta">Meta (Production SRE)</option>
                        <option value="Stripe">Stripe (Backend Engineer)</option>
                      </select>
                    </div>

                    <div className="relative flex py-1 items-center">
                      <div className={`flex-grow border-t ${borderPrimary}`}></div>
                      <span className={`flex-shrink mx-3 text-[10px] font-bold font-mono ${textSecondary}`}>OR TRIGGER CUSTOM CRAWLER</span>
                      <div className={`flex-grow border-t ${borderPrimary}`}></div>
                    </div>

                    {/* Custom Scraper Fields */}
                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <label className={`text-[10px] font-bold uppercase tracking-wider block font-mono ${textSecondary}`}>Target Company Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Uber, Adobe, Airbnb"
                          value={customCompany}
                          onChange={(e) => setCustomCompany(e.target.value)}
                          className={`w-full border text-xs px-3 py-2 rounded-xl outline-none font-medium ${inputBg} ${borderPrimary}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={`text-[10px] font-bold uppercase tracking-wider block font-mono ${textSecondary}`}>Specific Career Portal / Board URL</label>
                        <input
                          type="url"
                          placeholder="https://www.uber.com/careers/positions"
                          value={customUrl}
                          onChange={(e) => setCustomUrl(e.target.value)}
                          className={`w-full border text-xs px-3 py-2 rounded-xl outline-none font-medium ${inputBg} ${borderPrimary}`}
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleRunRagScraper}
                      disabled={isRaging || (!!customCompany && !customUrl)}
                      className="w-full py-2.5 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-sm"
                    >
                      {isRaging ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Crawling Page & Extracting Patterns...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          Launch Real-Time AI Scraper
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Scraper Log trail */}
                <div className={`p-5 border rounded-3xl space-y-3.5 shadow-sm ${cardBg} ${borderPrimary}`}>
                  <div className={`pb-1.5 border-b flex justify-between items-center ${borderPrimary}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${textSecondary}`}>Live RAG Audit Trail</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1 text-[10px] font-mono scrollbar-none">
                    {scrapedHistory.length === 0 ? (
                      <p className={`italic py-2 ${textSecondary}`}>No scraping records logged yet.</p>
                    ) : (
                      scrapedHistory.map((log: any, idx: number) => (
                        <div key={idx} className={`p-2 border rounded-lg flex flex-col gap-1 ${subCardBg} ${borderPrimary}`}>
                          <div className={`flex justify-between font-bold ${textPrimary}`}>
                            <span>{log.companyName}</span>
                            <span className="text-emerald-600 dark:text-emerald-400">HTTP 200 OK</span>
                          </div>
                          <span className={`block truncate ${textSecondary}`}>{log.scrapedUrl}</span>
                          <span className={`text-[8px] ${textSecondary}`}>{log.scrapedAt}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Display Scraped Intelligence Output */}
              <div className="lg:col-span-7 space-y-5">
                {ragPatterns && (
                  <div className={`p-6 border rounded-3xl space-y-5 shadow-lg relative overflow-hidden ${cardBg} ${borderPrimary}`}>
                    <div className="absolute top-0 right-0 p-3">
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-bold border ${
                        isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                      }`}>
                        KNOWLEDGE GRAPH
                      </span>
                    </div>

                    <div className={`flex items-center gap-2.5 pb-3 border-b ${borderPrimary}`}>
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className={`uppercase font-mono tracking-wider text-[11px] block ${textPrimary}`}>RAG Intelligence Report</strong>
                        <span className={`text-[10px] font-mono ${textSecondary}`}>Entity: {ragPatterns.company}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Process Overview */}
                      <div className="space-y-1.5">
                        <h4 className={`text-xs font-bold flex items-center gap-1.5 uppercase font-mono tracking-wider ${textPrimary}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Verified Hiring Process &amp; Trends
                        </h4>
                        <p className={`text-xs font-medium leading-relaxed whitespace-pre-wrap ${textSecondary}`}>
                          {ragPatterns.hiringTrends}
                        </p>
                      </div>

                      {/* Technical Skills Required */}
                      <div className="space-y-2">
                        <h4 className={`text-xs font-bold flex items-center gap-1.5 uppercase font-mono tracking-wider ${textPrimary}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Core Technical Core Focus
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {ragPatterns.focusSkills && ragPatterns.focusSkills.map((skill: string, i: number) => (
                            <span key={i} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg font-mono border ${
                              isDark ? 'bg-blue-500/10 border-blue-500/20 text-cyan-400' : 'bg-blue-50 border-blue-200 text-blue-800'
                            }`}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Recent Coding Questions */}
                      <div className="space-y-2.5 pt-1">
                        <h4 className={`text-xs font-bold flex items-center gap-1.5 uppercase font-mono tracking-wider ${textPrimary}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live Scraped Algorithmic Questions
                        </h4>
                        <div className="space-y-2">
                          {ragPatterns.recentQuestions && ragPatterns.recentQuestions.map((q: string, i: number) => (
                            <div key={i} className={`p-3 border rounded-xl space-y-1 text-xs ${subCardBg} ${borderPrimary}`}>
                              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">QUESTION 0{i + 1}</span>
                              <p className={`font-medium leading-relaxed ${textPrimary}`}>{q}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className={`pt-3 border-t flex items-center justify-between text-[9px] font-mono ${borderPrimary} ${textSecondary}`}>
                      <span>Source: {ragPatterns.RAGcontext || "Grounded Web Index"}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}