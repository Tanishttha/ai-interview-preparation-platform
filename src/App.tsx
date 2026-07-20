import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Sidebar, { DashboardTab } from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardOverview from './components/DashboardOverview';
import CompanyExplorer from './components/CompanyExplorer';
import CompanyDetail from './components/CompanyDetail';
import PersonalizedRoadmap from './components/PersonalizedRoadmap';
import CodingPractice from './components/CodingPractice';
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

export default function App() {
  const [screen, setScreen] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [user, setUser] = useState<AuthUser | null>(null);
  
  // Theme state (Dark Mode by default)
  const [isDark, setIsDark] = useState(true);

  // Mobile sidebar drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Bookmarks state (shared across components)
  const [bookmarks, setBookmarks] = useState<string[]>(['google', 'two-sum']);

  // Active chosen company inside Company Explorer / detail flow
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Settings view simulated configurations
  const [notifSetting, setNotifSetting] = useState(true);
  const [langSetting, setLangSetting] = useState('english');

  // Dynamic Theme Class Variables
  const bgMain = isDark ? 'bg-[#0B0F17]' : 'bg-white';
  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const borderPrimary = isDark ? 'border-slate-800' : 'border-slate-200';
  
  const cardBg = isDark ? 'bg-[#0F172A]' : 'bg-white';
  const subCardBg = isDark ? 'bg-[#161B22]' : 'bg-slate-50';

  // Firebase Auth state persistence sync
  useEffect(() => {
    const unsubscribe = onAuthChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setScreen('dashboard');
      } else {
        setScreen('landing');
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleToggleBookmark = (id: string) => {
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter((item) => item !== id));
    } else {
      setBookmarks([...bookmarks, id]);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error("Logout failure:", err);
    }
    setScreen('landing');
    setActiveTab('dashboard');
    setSelectedCompany(null);
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className={`min-h-screen transition-colors duration-300 ${bgMain} ${textPrimary}`}>
        {/* LANDING PAGE SCREEN */}
        {screen === 'landing' && (
          <LandingPage
            onStart={() => setScreen('auth')}
            onExploreCompanies={() => {
              setScreen('auth');
            }}
            isDark={isDark}
          />
        )}

        {/* AUTHENTICATION SCREEN */}
        {screen === 'auth' && (
          <AuthPage
            onSuccess={() => setScreen('dashboard')}
            onBack={() => setScreen('landing')}
            isDark={isDark}
          />
        )}

        {/* MAIN FULL-STACK STYLE DASHBOARD PANEL */}
        {screen === 'dashboard' && (
          <div className="flex h-screen overflow-hidden">
            {/* Navigational Sidebar Drawer */}
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setSelectedCompany(null); // Reset company focus upon tab switch
              }}
              onLogout={handleLogout}
              isOpen={isSidebarOpen}
              setIsOpen={setIsSidebarOpen}
              user={user}
              isDark={isDark}
            />

            {/* Right side container */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
              {/* Universal Header Navbar */}
              <Navbar
                isDark={isDark}
                toggleTheme={toggleTheme}
                activeTab={activeTab}
                onOpenSidebar={() => setIsSidebarOpen(true)}
                user={user}
              />

              {/* Central Scrollable Workspace Area */}
              <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                {activeTab === 'dashboard' && (
                  <DashboardOverview
                    onNavigate={(tab) => {
                      setActiveTab(tab);
                      setSelectedCompany(null);
                    }}
                    isDark={isDark}
                  />
                )}

                {activeTab === 'companies' && (
                  selectedCompany ? (
                    <CompanyDetail
                      company={selectedCompany}
                      onBack={() => setSelectedCompany(null)}
                      onStartPrep={() => {
                        setActiveTab('roadmap');
                        setSelectedCompany(null);
                      }}
                      isDark={isDark}
                    />
                  ) : (
                    <CompanyExplorer
                      onSelectCompany={setSelectedCompany}
                      bookmarks={bookmarks}
                      onToggleBookmark={handleToggleBookmark}
                      isDark={isDark}
                    />
                  )
                )}

                {activeTab === 'roadmap' && <PersonalizedRoadmap isDark={isDark} />}

                {activeTab === 'coding' && <CodingPractice isDark={isDark} />}

                {activeTab === 'hr' && <HRInterview isDark={isDark} />}

                {activeTab === 'technical' && <TechnicalInterview isDark={isDark} />}

                {activeTab === 'aptitude' && <AptitudeSection isDark={isDark} />}

                {activeTab === 'resume' && <ResumeAnalyzer isDark={isDark} />}

                {activeTab === 'mock-interview' && <MockInterviewSimulator isDark={isDark} />}

                {/* Subcharts analysis dashboard */}
                {activeTab === 'analytics' && (
                  <InterviewAnalytics
                    onNavigate={(tab) => {
                      setActiveTab(tab);
                      setSelectedCompany(null);
                    }}
                    isDark={isDark}
                  />
                )}

                {activeTab === 'career-coach' && <AICareerCoach tool="career-coach" isDark={isDark} />}

                {activeTab === 'jobs' && <AICareerCoach tool="jobs" isDark={isDark} />}

                {/* Bookmarks, achievements, calendars notes and pomodoros */}
                {(['bookmarks', 'leaderboard', 'achievements', 'calendar', 'pomodoro', 'notes', 'experiences'] as const).includes(activeTab as any) && (
                  <OtherTools
                    tool={activeTab as any}
                    bookmarks={bookmarks}
                    onToggleBookmark={handleToggleBookmark}
                    isDark={isDark}
                  />
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className={`max-w-2xl mx-auto p-6 border rounded-3xl space-y-6 shadow-sm ${cardBg} ${borderPrimary}`}>
                    <div className={`pb-2 border-b ${borderPrimary}`}>
                      <h3 className={`font-extrabold text-base ${textPrimary}`}>Workspace Configurations</h3>
                    </div>

                    <div className="space-y-4 text-xs font-medium">
                      <div className={`flex justify-between items-center p-3.5 border rounded-2xl ${subCardBg} ${borderPrimary}`}>
                        <div>
                          <span className={`font-bold block ${textPrimary}`}>Workspace dark theme</span>
                          <p className={`text-[10px] ${textSecondary}`}>Toggle dark UI canvas modes</p>
                        </div>
                        <button
                          onClick={toggleTheme}
                          className={`px-4 py-1.5 font-bold border rounded-xl cursor-pointer transition-all ${
                            isDark ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-blue-50 border-blue-200 text-blue-800'
                          }`}
                        >
                          {isDark ? 'Dark Active' : 'Light Active'}
                        </button>
                      </div>

                      <div className={`flex justify-between items-center p-3.5 border rounded-2xl ${subCardBg} ${borderPrimary}`}>
                        <div>
                          <span className={`font-bold block ${textPrimary}`}>Desktop Notification Center</span>
                          <p className={`text-[10px] ${textSecondary}`}>Alert me upon upcoming mock interview sessions</p>
                        </div>
                        <button
                          onClick={() => setNotifSetting(!notifSetting)}
                          className={`px-4 py-1.5 font-bold border rounded-xl cursor-pointer transition-all ${
                            notifSetting 
                              ? (isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-100 border-emerald-200 text-emerald-800') 
                              : (isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-200 border-slate-300 text-slate-600')
                          }`}
                        >
                          {notifSetting ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>

                      <div className={`flex justify-between items-center p-3.5 border rounded-2xl ${subCardBg} ${borderPrimary}`}>
                        <div>
                          <span className={`font-bold block ${textPrimary}`}>Language Locale</span>
                          <p className={`text-[10px] ${textSecondary}`}>Adjust the speech analyzer parser locale</p>
                        </div>
                        <select
                          value={langSetting}
                          onChange={(e) => setLangSetting(e.target.value)}
                          className={`bg-transparent font-bold outline-none cursor-pointer border-none ${
                            isDark ? 'text-cyan-400' : 'text-blue-700'
                          }`}
                        >
                          <option value="english" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>English (US)</option>
                          <option value="hindi" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>Hindi/English</option>
                        </select>
                      </div>

                      <div className={`p-4.5 border rounded-2xl text-xs space-y-2.5 ${
                        isDark ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-200'
                      }`}>
                        <span className="font-bold text-rose-600 dark:text-rose-400 block uppercase tracking-wider text-[10px] font-mono">Danger Zone</span>
                        <p className={`leading-relaxed font-medium ${textSecondary}`}>
                          Once you delete your PrepAI premium account, your interview history logs, calendar schedules, custom roadmaps, and unlocked achievements are permanently wiped from browser databases.
                        </p>
                        <button
                          onClick={() => {
                            if (confirm('Are you absolutely sure you want to delete your PrepAI workspace account? This cannot be undone.')) {
                              handleLogout();
                            }
                          }}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-sm"
                        >
                          Delete Account Permanently
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </main>
            </div>

            {/* Global Floating AI Coach Chat Widget */}
            <FloatingAIWidget isDark={isDark} />
          </div>
        )}
      </div>
    </div>
  );
}