import React, { useState } from 'react';
import { Sparkles, MessageSquare, X, Send } from 'lucide-react';
import { apiFetch } from '../lib/apiClient';

interface FloatingAIWidgetProps {
  isDark?: boolean;
}

export default function FloatingAIWidget({ isDark = false }: FloatingAIWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'ai', text: 'Hi! I am your global PrepAI Assistant. Ask me any coding doubts, resume structuring questions, or HR behavioral tips!' }
  ]);

  const [loading, setLoading] = useState(false);

  // Dynamic Theme Class Variables
  const cardBg = isDark ? 'bg-[#0F172A]' : 'bg-white';
  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const borderPrimary = isDark ? 'border-slate-800' : 'border-slate-200';
  const subCardBg = isDark ? 'bg-[#161B22]' : 'bg-slate-50';
  const inputBg = isDark 
    ? 'bg-[#161B22] text-slate-100 placeholder:text-slate-500' 
    : 'bg-white text-slate-900 placeholder:text-slate-400';

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { sender: 'user', text: input };
    const currentLog = [...chatLog, userMsg];
    setChatLog(currentLog);
    setInput('');
    setLoading(true);

    try {
      const res = await apiFetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text, history: chatLog })
      });
      const data = await res.json();
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.response || 'Sorry, I got disconnected. Please try again.'
        }
      ]);
    } catch (err) {
      console.error(err);
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: '⚠️ Unable to connect to assistant backend.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans text-xs">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full shadow-2xl hover:scale-105 transition-all flex items-center justify-center cursor-pointer relative group"
        >
          <MessageSquare className="w-5.5 h-5.5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </button>
      )}

      {/* Floating Chat Panel */}
      {isOpen && (
        <div className={`w-80 h-96 border rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${cardBg} ${borderPrimary}`}>
          {/* Header */}
          <div className={`px-4 py-3 border-b flex items-center justify-between shrink-0 ${subCardBg} ${borderPrimary}`}>
            <span className={`font-bold flex items-center gap-1.5 uppercase tracking-wider text-[10px] ${textPrimary}`}>
              <Sparkles className={`w-3.5 h-3.5 animate-pulse ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} /> PrepAI Chatbot
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat log body */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-3 font-medium leading-relaxed ${
            isDark ? 'bg-[#0B0F17]' : 'bg-white'
          }`}>
            {chatLog.map((msg, idx) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={idx}
                  className={`p-3 max-w-[85%] rounded-2xl ${
                    isAi
                      ? `${subCardBg} border ${borderPrimary} ${textPrimary} mr-auto shadow-xs`
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold ml-auto shadow-sm'
                  }`}
                >
                  {isAi && (
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-wider block mb-1 ${
                      isDark ? 'text-cyan-400' : 'text-blue-700'
                    }`}>
                      PrepAI Helper
                    </span>
                  )}
                  <p className="text-[11px] leading-relaxed whitespace-pre-wrap">
                    {msg.text
                      .replace(/```[a-zA-Z]*\n?/g, '')
                      .replace(/```/g, '')
                      .replace(/\*\*/g, '')}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Chat inputs */}
          <form onSubmit={handleSend} className={`p-2.5 border-t flex gap-1.5 shrink-0 ${subCardBg} ${borderPrimary}`}>
            <input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`flex-1 border text-[11px] px-3 py-2 rounded-xl outline-none font-medium focus:border-blue-500 transition-all ${inputBg} ${borderPrimary}`}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-md cursor-pointer shrink-0 disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}