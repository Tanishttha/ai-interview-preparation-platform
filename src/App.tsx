import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Sidebar, { DashboardTab } from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardOverview from './components/DashboardOverview';
import CompanyExplorer from './components/CompanyExplorer';
import CompanyDetail from './components/CompanyDetail';
import PersonalizedRoadmap from './components/PersonalizedRoadmap';
import CodingPractice from './pages/CodingPractice';
import ProblemDetails from './pages/ProblemDetails';
import HRInterview from './components/HRInterview';
import TechnicalInterview from './components/TechnicalInterview';
import AptitudeSection from './components/AptitudeSection';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import MockInterviewSimulator from './components/MockInterviewSimulator';
import InterviewAnalytics from './components/InterviewAnalytics';
import OtherTools from './components/OtherTools';
import AICareerCoach from './components/AICareerCoach';
import FloatingAIWidget from './components/FloatingAIWidget';
import { Company } from './types';
import { onAuthChanged, signOutUser, AuthUser } from './lib/firebase';

interface DashboardContentProps {
  activeTab: DashboardTab;
  isDark: boolean;
  bookmarks: string[];
  setSelectedCompany: (company: Company | null) => void;
  handleToggleBookmark: (id: string) => void;
  user: AuthUser | null;
  toggleTheme: () => void;
  handleLogout: () => Promise<void>;
  notifSetting: boolean;
  setNotifSetting: (value: boolean) => void;
  langSetting: string;
  setLangSetting: (value: string) => void;
  setActiveTab: (tab: DashboardTab) => void;
  setIsSidebarOpen: (value: boolean) => void;
  selectedCompany: Company | null;
}

function DashboardContent({
  activeTab,
  isDark,
  bookmarks,
  setSelectedCompany,
  handleToggleBookmark,
  user,
  toggleTheme,
  handleLogout,
  notifSetting,
  setNotifSetting,
  langSetting,
  setLangSetting,
  setActiveTab,
  setIsSidebarOpen,
  selectedCompany,
}: DashboardContentProps) {
  const location = useLocation();
  const isProblemRoute = location.pathname.startsWith('/problems/');

  const bgMain = isDark ? 'bg-[#0B0F17]' : 'bg-white';
  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const borderPrimary = isDark ? 'border-slate-800' : 'border-slate-200';
  const cardBg = isDark ? 'bg-[#0F172A]' : 'bg-white';
  const subCardBg = isDark ? 'bg-[#161B22]' : 'bg-slate-50';

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <DashboardOverview
          onNavigate={(tab) => {
            setActiveTab(tab);
            setSelectedCompany(null);
          }}
          isDark={isDark}
        />
      );
    }

    if (activeTab === 'companies') {
      if (selectedCompany) {
        return (
          <CompanyDetail
            company={selectedCompany}
            onBack={() => setSelectedCompany(null)}
            onStartPrep={() => {
              setActiveTab('roadmap');
              setSelectedCompany(null);
            }}
            isDark={isDark}
          />
        );
      }

      return (
        <CompanyExplorer
          onSelectCompany={setSelectedCompany}
          bookmarks={bookmarks}
          onToggleBookmark={handleToggleBookmark}
          isDark={isDark}
        />
      );
    }

    if (activeTab === 'roadmap') return <PersonalizedRoadmap isDark={isDark} />;
    if (activeTab === 'coding') return <CodingPractice isDark={isDark} />;
    if (activeTab === 'hr') return <HRInterview isDark={isDark} />;
    if (activeTab === 'technical') return <TechnicalInterview isDark={isDark} />;
    if (activeTab === 'aptitude') return <AptitudeSection isDark={isDark} />;
    if (activeTab === 'resume') return <ResumeAnalyzer isDark={isDark} />;
    if (activeTab === 'mock-interview') return <MockInterviewSimulator isDark={isDark} />;
    if (activeTab === 'analytics') {
      return (
        <InterviewAnalytics
          onNavigate={(tab) => {
            setActiveTab(tab);
            setSelectedCompany(null);
          }}
          isDark={isDark}
        />
      );
    }

    if (activeTab === 'career-coach') return <AICareerCoach tool="career-coach" isDark={isDark} />;
    if (activeTab === 'jobs') return <AICareerCoach tool="jobs" isDark={isDark} />;

    if (['bookmarks', 'leaderboard', 'achievements', 'calendar', 'Timer', 'notes', 'experiences'].includes(activeTab as never)) {
      return (
        <OtherTools
          tool={activeTab as never}
          bookmarks={bookmarks}
          onToggleBookmark={handleToggleBookmark}
          isDark={isDark}
        />
      );
    }

    if (activeTab === 'settings') {
      return (
        <div className={`mx-auto max-w-2xl rounded-3xl border p-6 shadow-sm ${cardBg} ${borderPrimary}`}>
          <div className={`border-b pb-2 ${borderPrimary}`}>
            <h3 className={`text-base font-extrabold ${textPrimary}`}>Workspace Configurations</h3>
          </div>
          <div className="mt-6 space-y-4 text-xs font-medium">
            <div className={`flex items-center justify-between rounded-2xl border p-3.5 ${subCardBg} ${borderPrimary}`}>
              <div>
                <span className={`block font-bold ${textPrimary}`}>Workspace dark theme</span>
                <p className={`text-[10px] ${textSecondary}`}>Toggle dark UI canvas modes</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`rounded-xl border px-4 py-1.5 font-bold transition-all ${
                  isDark ? 'border-cyan-500/20 bg-cyan-500/10 text-cyan-400' : 'border-blue-200 bg-blue-50 text-blue-800'
                }`}
              >
                {isDark ? 'Dark Active' : 'Light Active'}
              </button>
            </div>

            <div className={`flex items-center justify-between rounded-2xl border p-3.5 ${subCardBg} ${borderPrimary}`}>
              <div>
                <span className={`block font-bold ${textPrimary}`}>Desktop Notification Center</span>
                <p className={`text-[10px] ${textSecondary}`}>Alert me upon upcoming mock interview sessions</p>
              </div>
              <button
                onClick={() => setNotifSetting(!notifSetting)}
                className={`rounded-xl border px-4 py-1.5 font-bold transition-all ${
                  notifSetting
                    ? isDark
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      : 'border-emerald-200 bg-emerald-100 text-emerald-800'
                    : isDark
                      ? 'border-slate-700 bg-slate-800 text-slate-400'
                      : 'border-slate-300 bg-slate-200 text-slate-600'
                }`}
              >
                {notifSetting ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className={`flex items-center justify-between rounded-2xl border p-3.5 ${subCardBg} ${borderPrimary}`}>
              <div>
                <span className={`block font-bold ${textPrimary}`}>Language Locale</span>
                <p className={`text-[10px] ${textSecondary}`}>Adjust the speech analyzer parser locale</p>
              </div>
              <select
                value={langSetting}
                onChange={(event) => setLangSetting(event.target.value)}
                className={`rounded-xl border px-3 py-1.5 text-[10px] font-bold outline-none ${
                  isDark ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="spanish">Spanish</option>
              </select>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedCompany(null);
        }}
        onLogout={handleLogout}
        isOpen={false}
        setIsOpen={setIsSidebarOpen}
        user={user}
        isDark={isDark}
      />

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <Navbar
          isDark={isDark}
          toggleTheme={toggleTheme}
          activeTab={activeTab}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          user={user}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {isProblemRoute ? (
            <Routes>
              <Route path="/problems/:slug" element={<ProblemDetails isDark={isDark} />} />
            </Routes>
          ) : (
            renderContent()
          )}
        </main>
      </div>

      <FloatingAIWidget isDark={isDark} />
    </div>
  );
}

function AppContent() {
  const [screen, setScreen] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>(['google', 'two-sum']);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [notifSetting, setNotifSetting] = useState(true);
  const [langSetting, setLangSetting] = useState('english');

  const bgMain = isDark ? 'bg-[#0B0F17]' : 'bg-white';
  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';

  useEffect(() => {
    const unsubscribe = onAuthChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setScreen('dashboard');
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setIsDark((value) => !value);
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarks((value) => (value.includes(id) ? value.filter((item) => item !== id) : [...value, id]));
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Logout failure:', error);
    }
    setUser(null);
    setScreen('landing');
    setActiveTab('dashboard');
    setSelectedCompany(null);
  };

  if (authLoading) {
    return (
      <div className={`flex min-h-screen items-center justify-center font-sans ${bgMain} ${textPrimary}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-sm font-semibold">Loading PrepAI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className={`min-h-screen transition-colors duration-300 ${bgMain} ${textPrimary}`}>
        {screen === 'landing' && (
          <LandingPage
            onStart={() => setScreen('auth')}
            onExploreCompanies={() => setScreen('auth')}
            isDark={isDark}
          />
        )}

        {screen === 'auth' && (
          <AuthPage
            onSuccess={() => setScreen('dashboard')}
            onBack={() => setScreen('landing')}
            isDark={isDark}
          />
        )}

        {screen === 'dashboard' && (
          <DashboardContent
            activeTab={activeTab}
            isDark={isDark}
            bookmarks={bookmarks}
            setSelectedCompany={setSelectedCompany}
            handleToggleBookmark={handleToggleBookmark}
            user={user}
            toggleTheme={toggleTheme}
            handleLogout={handleLogout}
            notifSetting={notifSetting}
            setNotifSetting={setNotifSetting}
            langSetting={langSetting}
            setLangSetting={setLangSetting}
            setActiveTab={setActiveTab}
            setIsSidebarOpen={setIsSidebarOpen}
            selectedCompany={selectedCompany}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
