import React from 'react';
import { Search, Sun, Moon, Menu } from 'lucide-react';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  activeTab: string;
  onOpenSidebar: () => void;
  user?: any;
}

export default function Navbar({ isDark, toggleTheme, activeTab, onOpenSidebar, user }: NavbarProps) {
  // -------------------------------------------------------------
  // Clean, Non-Mixed Theme Class Variables
  // -------------------------------------------------------------
  const bgNavbar = isDark ? 'bg-[#0F172A]/90 border-slate-800' : 'bg-white/90 border-slate-200 shadow-xs';
  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const borderPrimary = isDark ? 'border-slate-800' : 'border-slate-200';
  
  const dropdownBg = isDark ? 'bg-[#0F172A] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xl';
  const inputBg = isDark ? 'bg-[#161B22] text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 text-slate-900 placeholder:text-slate-400';
  const hoverBg = isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-100';

  return (
    <header className={`h-16 border-b backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 transition-colors duration-300 ${bgNavbar}`}>
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle for Mobile */}
        <button
          onClick={onOpenSidebar}
          className={`lg:hidden p-2 rounded-xl cursor-pointer transition-colors ${hoverBg} ${textSecondary}`}
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className={`text-base sm:text-lg font-extrabold capitalize flex items-center gap-2 ${textPrimary}`}>
          {activeTab.replace('-', ' ')}
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search bar */}
        <div className="relative hidden md:block w-64">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`} />
          <input
            type="text"
            placeholder="Search problems, companies..."
            className={`w-full pl-9 pr-4 py-2 border text-xs rounded-xl outline-none focus:border-blue-500 font-medium ${inputBg} ${borderPrimary}`}
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl transition-all cursor-pointer ${hoverBg} ${textSecondary}`}
          title="Toggle Dark/Light Mode"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Profile Card */}
        <div className={`flex items-center gap-2.5 border-l pl-4 ${borderPrimary}`}>
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              className={`w-8 h-8 rounded-xl object-cover border ${borderPrimary}`}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold rounded-xl flex items-center justify-center text-xs uppercase shadow-xs">
              {user?.displayName ? user.displayName.charAt(0) : 'M'}
            </div>
          )}
          <div className="hidden sm:block">
            <p className={`text-xs font-bold truncate max-w-[120px] ${textPrimary}`}>
              {user?.displayName || 'Mehak'}
            </p>
            <p className={`text-[9px] font-mono truncate max-w-[120px] ${textSecondary}`}>
              {user?.email || 'NSUT Delhi'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}