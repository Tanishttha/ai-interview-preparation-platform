import React, { useState } from 'react';
import { 
  ArrowRight, Star, HelpCircle, ChevronDown, CheckCircle2, Shield, 
  Sparkles, Terminal, Video, Brain, FileText, Cpu, Compass 
} from 'lucide-react';
import { FAQS } from '../data';

interface LandingPageProps {
  onStart: () => void;
  onExploreCompanies: () => void;
  isDark: boolean;
}

export default function LandingPage({ onStart, onExploreCompanies, isDark }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Dynamic Theme Class Variables
  const bgMain = isDark ? 'bg-[#0B0F17]' : 'bg-white';
  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const borderPrimary = isDark ? 'border-slate-800' : 'border-slate-200';
  
  const cardBg = isDark ? 'bg-[#0F172A]' : 'bg-white';
  const subCardBg = isDark ? 'bg-[#161B22]' : 'bg-slate-50';
  const headerBg = isDark ? 'bg-[#0F172A]/80 border-slate-800' : 'bg-white/80 border-slate-200 shadow-xs';

  const features = [
    { title: 'AI Mock Interviews', desc: 'Simulate high-stakes video and voice interviews with real-time feedback and dynamic grading.', icon: <Video className="w-6 h-6 text-blue-500" /> },
    { title: 'Company Wise Prep', desc: 'Explore exact hiring pipelines, CTC packages, and past question repositories of over 30+ top tech firms.', icon: <Compass className="w-6 h-6 text-emerald-500" /> },
    { title: 'Resume Analyzer', desc: 'Obtain instant ATS score matches, formatting reports, and find missing keywords to beat filters.', icon: <FileText className="w-6 h-6 text-amber-500" /> },
    { title: 'Coding Practice', desc: 'Solve classic algorithms on our premium split-screen editor with full AI code reviews and complexity outputs.', icon: <Terminal className="w-6 h-6 text-rose-500" /> },
    { title: 'AI Behavioral Coach', desc: 'Perfect your STAR framework delivery with speech metrics tracking speed, fillers, and confidence.', icon: <Brain className="w-6 h-6 text-purple-500" /> },
    { title: 'Personalized Roadmaps', desc: 'Input your college year, timeline, and current skillsets to generate custom, week-by-week practice tracks.', icon: <Cpu className="w-6 h-6 text-cyan-500" /> },
  ];

  const testimonials = [
    { name: 'Karthik Sen', role: 'Software Engineer at Google', text: 'The mock video interview felt incredibly realistic. The feedback on speaking speed and filler words completely polished my Googliness delivery.', avatar: '🎯', rating: 5 },
    { name: 'Priyanka Nair', role: 'Associate SDE at Amazon', text: 'Using the Resume Analyzer, I bumped my score from 62 to 89. The resume-based AI questions were exactly what the interviewers asked!', avatar: '👑', rating: 5 },
    { name: 'Arjun Mehta', role: 'SDE at Microsoft', text: 'The structured company-wise roadmap was a lifesaver. It kept me highly focused on tree and graph algorithms that are heavily tested.', avatar: '💼', rating: 5 },
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${bgMain} ${textPrimary}`}>
      {/* Navigation Header */}
      <header className={`border-b sticky top-0 backdrop-blur-md z-50 transition-colors ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              PrepAI
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* Explore Companies button removed */}
            <button
              type="button"
              onClick={() => {}}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Recruiter Portal
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-[radial-gradient(circle_at_30%_20%,#06b6d415,transparent_40%)]' 
            : 'bg-[radial-gradient(circle_at_30%_20%,#2563eb0d,transparent_40%)]'
        }`} />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 border rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
              isDark ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Interview Coach
            </div>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] ${textPrimary}`}>
              AI Interview <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Preparation Platform
              </span>
            </h1>
            <p className={`text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed ${textSecondary}`}>
              Master coding, aptitude, HR, technical and system design interviews using advanced Artificial Intelligence. Tailored custom practice modules matching over 30+ tech giants.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onStart}
                className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                Start Preparing <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            {/* CSS Mockup of AI Video Interview */}
            <div className={`relative w-full max-w-[420px] aspect-[4/5] border rounded-3xl p-4 overflow-hidden shadow-2xl ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 border border-rose-500/30 rounded-full text-[10px] text-rose-400 font-mono font-bold tracking-wider uppercase animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> LIVE MOCK
              </div>
              <div className="absolute top-3 right-3 z-20 flex gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>00:42</span>
              </div>

              {/* Simulated camera video background */}
              <div className={`w-full h-2/3 border rounded-2xl flex flex-col items-center justify-center relative overflow-hidden ${
                isDark ? 'bg-[#161B22] border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                <div className={`w-20 h-20 rounded-full border flex items-center justify-center text-4xl mb-3 shadow-inner ${
                  isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'
                }`}>
                  👤
                </div>
                <div className={`text-xs font-mono font-bold ${isDark ? 'text-cyan-400' : 'text-blue-700'}`}>Analyzing facial keypoints...</div>
                
                {/* Visual telemetry overlays */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between gap-2 z-10">
                  <div className={`p-2 border rounded-lg text-[10px] font-mono font-bold ${
                    isDark ? 'bg-black/60 border-slate-800 text-slate-300' : 'bg-white/90 border-slate-200 text-slate-800'
                  }`}>
                    Eye Contact: <span className="text-emerald-600 dark:text-emerald-400">94%</span>
                  </div>
                  <div className={`p-2 border rounded-lg text-[10px] font-mono font-bold ${
                    isDark ? 'bg-black/60 border-slate-800 text-slate-300' : 'bg-white/90 border-slate-200 text-slate-800'
                  }`}>
                    Smile Detector: <span className="text-amber-600 dark:text-amber-400">Neutral</span>
                  </div>
                </div>
              </div>

              {/* Simulated dynamic AI transcript card */}
              <div className={`mt-4 border rounded-xl p-3.5 space-y-1.5 relative ${
                isDark ? 'bg-[#161B22] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-[10px] font-bold uppercase tracking-wider font-mono flex items-center gap-1 ${
                  isDark ? 'text-cyan-400' : 'text-blue-700'
                }`}>
                  <Sparkles className="w-3 h-3" /> AI Interviewer Feedback
                </div>
                <p className={`text-[11px] font-medium leading-relaxed italic ${textSecondary}`}>
                  &ldquo;Excellent structuring of your answer using the STAR framework. Your speaking speed is optimal (130 words per minute), but watch out for &apos;um&apos; fillers.&rdquo;
                </p>
                <div className={`flex items-center gap-1.5 pt-1.5 border-t text-[10px] font-bold font-mono ${borderPrimary} ${textSecondary}`}>
                  <span>Confidence Score: <strong className="text-emerald-600 dark:text-emerald-400">92%</strong></span>
                  <span>•</span>
                  <span>Filler words: <strong className="text-amber-600 dark:text-amber-400">1 count</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={`py-20 border-t relative ${borderPrimary}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className={`text-3xl font-extrabold tracking-tight ${textPrimary}`}>
              Smarter Interview Tools for Smart Candidates
            </h2>
            <p className={`text-sm font-medium ${textSecondary}`}>
              We cover all dimensions of advanced recruitment preparation, backed by realistic simulator telemetry.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, idx) => (
              <div
                key={idx}
                className={`p-6 border rounded-3xl transition-all duration-200 hover:scale-[1.01] space-y-4 ${cardBg} ${borderPrimary} hover:border-blue-500/40`}
              >
                <div className={`p-3 border rounded-2xl w-fit ${subCardBg} ${borderPrimary}`}>
                  {item.icon}
                </div>
                <h3 className={`font-bold text-base ${textPrimary}`}>{item.title}</h3>
                <p className={`text-xs font-medium leading-relaxed ${textSecondary}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-20 border-t ${
        isDark ? 'bg-[#0F172A]/50 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className={`text-3xl font-extrabold tracking-tight ${textPrimary}`}>
              Success Stories From Top Candidates
            </h2>
            <p className={`text-sm font-medium ${textSecondary}`}>
              How students and industry professionals leveraged PrepAI to crack coveted technical offers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className={`p-6 border rounded-3xl space-y-4 ${cardBg} ${borderPrimary}`}
              >
                <div className="flex gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className={`text-xs font-medium leading-relaxed italic ${textSecondary}`}>&ldquo;{item.text}&rdquo;</p>
                <div className={`flex items-center gap-3 pt-3 border-t ${borderPrimary}`}>
                  <span className="text-2xl">{item.avatar}</span>
                  <div>
                    <h4 className={`font-bold text-xs ${textPrimary}`}>{item.name}</h4>
                    <p className={`text-[10px] font-mono font-medium ${textSecondary}`}>{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className={`py-20 border-t ${borderPrimary}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <h2 className={`text-3xl font-extrabold tracking-tight ${textPrimary}`}>
              Frequently Asked Questions
            </h2>
            <p className={`text-sm font-medium ${textSecondary}`}>
              Got questions about our telemetry modeling or features? Let&apos;s clear them up.
            </p>
          </div>
          <div className="space-y-4">
            {FAQS.map((item, idx) => (
              <div
                key={idx}
                className={`border rounded-2xl overflow-hidden transition-all ${cardBg} ${borderPrimary}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className={`w-full px-6 py-4.5 flex justify-between items-center text-left transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className={`font-bold text-sm flex items-center gap-2.5 ${textPrimary}`}>
                    <HelpCircle className="w-5 h-5 text-blue-500 shrink-0" />
                    {item.question}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${textSecondary} ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className={`px-6 pb-5 pt-2 text-xs font-medium leading-relaxed border-t ${subCardBg} ${borderPrimary} ${textSecondary}`}>
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-12 text-center text-xs font-medium space-y-4 ${borderPrimary} ${textSecondary}`}>
        <div className="flex justify-center items-center gap-2.5">
          <span className="p-1.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span className={`font-bold text-sm tracking-tight ${textPrimary}`}>
            PrepAI
          </span>
        </div>
        <p>&copy; 2026 PreP AI Platform. All rights reserved.</p>
        {/* <div className="flex justify-center gap-6 font-bold">
          <a href="#" className={`transition-colors ${isDark ? 'hover:text-cyan-400' : 'hover:text-blue-600'}`}>Privacy Policy</a>
          <a href="#" className={`transition-colors ${isDark ? 'hover:text-cyan-400' : 'hover:text-blue-600'}`}>Terms of Service</a>
          <a href="#" className={`transition-colors ${isDark ? 'hover:text-cyan-400' : 'hover:text-blue-600'}`}>Support Center</a>
        </div> */}
      </footer>
    </div>
  );
}