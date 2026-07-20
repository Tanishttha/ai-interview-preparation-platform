import { 
  LayoutDashboard, Building2, Map, Code2, MessageSquare, Laptop, 
  BrainCircuit, FileBarChart2, PlayCircle, BarChart3, Trophy, Bookmark, 
  Calendar as CalendarIcon, Settings, LogOut, ShieldCheck, Timer, NotebookTabs, 
  Compass, Sparkles, Briefcase, X 
} from 'lucide-react';

export type DashboardTab = 
  | 'dashboard'
  | 'companies'
  | 'roadmap'
  | 'coding'
  | 'hr'
  | 'technical'
  | 'aptitude'
  | 'resume'
  | 'mock-interview'
  | 'analytics'
  | 'career-coach'
  | 'jobs'
  | 'bookmarks'
  | 'leaderboard'
  | 'achievements'
  | 'calendar'
  | 'pomodoro'
  | 'notes'
  | 'experiences'
  | 'settings';

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user?: any;
  isDark?: boolean;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout, isOpen, setIsOpen, user, isDark = false }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'companies', label: 'Companies', icon: <Building2 className="w-4 h-4" /> },
    { id: 'roadmap', label: 'AI Roadmap', icon: <Map className="w-4 h-4" /> },
    { id: 'coding', label: 'Coding Practice', icon: <Code2 className="w-4 h-4" /> },
    { id: 'hr', label: 'HR Interview', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'technical', label: 'Technical & System', icon: <Laptop className="w-4 h-4" /> },
    { id: 'aptitude', label: 'Aptitude Section', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'resume', label: 'Resume Analyzer', icon: <FileBarChart2 className="w-4 h-4" /> },
    { id: 'mock-interview', label: 'Mock Interview', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'analytics', label: 'Interview Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'career-coach', label: 'AI Career Coach', icon: <Compass className="w-4 h-4" /> },
    { id: 'jobs', label: 'Job Matches', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { id: 'achievements', label: 'Achievements', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar Planner', icon: <CalendarIcon className="w-4 h-4" /> },
    { id: 'pomodoro', label: 'Study Timer', icon: <Timer className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes Section', icon: <NotebookTabs className="w-4 h-4" /> },
    { id: 'experiences', label: 'Community Feed', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ] as const;

  const handleTabClick = (tabId: DashboardTab) => {
    setActiveTab(tabId);
    setIsOpen(false); // Close mobile sidebar drawer
  };

  const sidebarContent = (
    <div className={`h-full flex flex-col justify-between py-5 border-r transition-colors ${
      isDark 
        ? 'bg-slate-950 text-slate-300 border-slate-800' 
        : 'bg-white text-slate-600 border-slate-200'
    }`}>
      {/* Brand Logo */}
      <div className="px-6 flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className={`font-black text-base tracking-tight ${
            isDark 
              ? 'text-white bg-gradient-to-r from-blue-400 via-indigo-300 to-indigo-200 bg-clip-text' 
              : 'text-slate-900'
          }`}>
            PrepAI Premium
          </span>
        </div>
        <button 
          className={`lg:hidden p-1 rounded-lg ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`} 
          onClick={() => setIsOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div
        className={`flex-1 overflow-y-auto px-4 space-y-1.5 scrollbar-thin ${
          isDark ? 'scrollbar-thumb-gray-800' : 'scrollbar-thumb-gray-300'
        }`}
      >
        {menuItems.map((item) => {
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-item-${item.id}`}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? (isDark
                      ? 'bg-blue-500/15 text-blue-300 border border-blue-500/40 shadow-lg shadow-blue-500/20'
                      : 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm')
                  : (isDark
                      ? 'hover:bg-slate-800 text-slate-400 hover:text-white border border-transparent'
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent')
              }`}
            >
              <span className={`transition-colors ${
                isSelected 
                  ? (isDark ? 'text-blue-400' : 'text-blue-600') 
                  : (isDark ? 'text-gray-500' : 'text-slate-400')
              }`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Footer Info / Logout */}
      <div className={`px-4 mt-4 pt-4 border-t space-y-2 ${
        isDark ? 'border-gray-800/80' : 'border-slate-100'
      }`}>
        <div className={`px-3.5 py-2 flex items-center gap-2.5 text-xs rounded-2xl border ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200/80'
        }`}>
          <div
            className={`w-7 h-7 bg-blue-600/10 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}
          >
            {user?.displayName ? user.displayName.charAt(0) : 'C'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className={`font-bold truncate ${isDark ? 'text-gray-200' : 'text-slate-900'}`}>{user?.displayName || 'Candidate'}</p>
            <p className={`text-[10px] truncate font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{user?.email || 'Premium Plan Active'}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            isDark 
              ? 'text-red-400 hover:bg-red-500/10' 
              : 'text-rose-600 hover:bg-rose-50'
          }`}
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen fixed top-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar Slide-in */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-64 z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {sidebarContent}
      </aside>
    </>
  );
}