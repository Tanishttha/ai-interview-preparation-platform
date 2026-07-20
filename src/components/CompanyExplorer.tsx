import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Clock, ArrowRight, Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { COMPANIES } from '../data';
import { Company } from '../types';
import { apiFetch } from '../lib/apiClient';

interface CompanyExplorerProps {
  onSelectCompany: (company: Company) => void;
  bookmarks: string[];
  onToggleBookmark: (companyId: string) => void;
  isDark?: boolean;
}

export default function CompanyExplorer({ 
  onSelectCompany, 
  bookmarks, 
  onToggleBookmark, 
  isDark = false 
}: CompanyExplorerProps) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [companies, setCompanies] = useState<Company[]>(COMPANIES);
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic Theme Class Variables
  const bgMain = isDark ? 'bg-[#0B0F17]' : 'bg-white';
  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const borderPrimary = isDark ? 'border-slate-800' : 'border-slate-200';
  
  const cardBg = isDark ? 'bg-[#0F172A]' : 'bg-white';
  const subCardBg = isDark ? 'bg-[#161B22]' : 'bg-slate-50';
  const inputBg = isDark 
    ? 'bg-[#161B22] text-slate-100 placeholder:text-slate-500' 
    : 'bg-slate-50 text-slate-900 placeholder:text-slate-400';

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const res = await apiFetch('/api/companies');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setCompanies(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch companies from backend database:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.role && c.role.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter && c.role
      ? c.role.toLowerCase().includes(roleFilter.toLowerCase())
      : true;
    const matchesDifficulty = difficultyFilter ? c.difficulty === difficultyFilter : true;
    const matchesLocation = locationFilter && c.location
      ? c.location.toLowerCase().includes(locationFilter.toLowerCase())
      : true;
    return matchesSearch && matchesRole && matchesDifficulty && matchesLocation;
  });

  return (
    <div className={`p-6 space-y-6 min-h-screen transition-colors duration-300 ${bgMain} ${textPrimary}`}>
      {/* Top Search and Filters Grid */}
      <div className={`p-6 border rounded-3xl space-y-4 shadow-sm ${cardBg} ${borderPrimary}`}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${textSecondary}`} />
            <input
              type="text"
              placeholder="Search companies e.g. Google, Microsoft, Uber..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10.5 pr-4 py-2.5 border text-xs rounded-xl outline-none font-medium focus:border-blue-500 transition-all ${inputBg} ${borderPrimary}`}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <SlidersHorizontal className={`w-4 h-4 shrink-0 hidden sm:inline ${textSecondary}`} />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className={`px-3.5 py-2.5 border text-[11px] font-bold rounded-xl outline-none cursor-pointer ${inputBg} ${borderPrimary}`}
            >
              <option value="">Difficulty (All)</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`px-3.5 py-2.5 border text-[11px] font-bold rounded-xl outline-none cursor-pointer ${inputBg} ${borderPrimary}`}
            >
              <option value="">Role (All)</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Intern">Intern / FTE</option>
            </select>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className={`px-3.5 py-2.5 border text-[11px] font-bold rounded-xl outline-none cursor-pointer ${inputBg} ${borderPrimary}`}
            >
              <option value="">Location (All)</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>
      </div>

      {/* Companies Cards Grid Loading State */}
      {isLoading && (
        <div className={`flex justify-center items-center py-4 border rounded-2xl ${
          isDark ? 'bg-blue-500/10 border-blue-500/20 text-cyan-400' : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          <span className="text-[11px] font-mono font-bold ml-2">Loading official partner records from database...</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((c) => {
          const isBookmarked = bookmarks.includes(c.id);
          const diffColor =
            c.difficulty === 'Easy'
              ? (isDark ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-800 bg-emerald-100 border-emerald-200')
              : c.difficulty === 'Medium'
              ? (isDark ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-amber-800 bg-amber-100 border-amber-200')
              : (isDark ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-rose-800 bg-rose-100 border-rose-200');

          return (
            <div
              key={c.id}
              className={`p-6 border rounded-3xl transition-all duration-200 hover:scale-[1.01] hover:border-blue-500/40 flex flex-col justify-between space-y-4 shadow-sm ${cardBg} ${borderPrimary}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl border shadow-inner ${subCardBg} ${borderPrimary}`}>
                    {c.logo}
                  </span>
                  <div>
                    <h3 className={`font-bold text-base ${textPrimary}`}>{c.name}</h3>
                    <p className={`text-[10px] font-medium truncate max-w-[150px] ${textSecondary}`}>{c.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => onToggleBookmark(c.id)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                  }`}
                  title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Bookmark className={`w-4 h-4 ${textSecondary}`} />
                  )}
                </button>
              </div>

              {/* Core Telemetry Info */}
              <div className={`grid grid-cols-2 gap-4 border-y py-3.5 text-xs font-medium ${borderPrimary}`}>
                <div className="space-y-0.5">
                  <span className={`text-[9px] uppercase tracking-wider block font-bold font-mono ${textSecondary}`}>Package Range</span>
                  <strong className={`font-bold ${textPrimary}`}>{c.package}</strong>
                </div>
                <div className="space-y-0.5 text-right">
                  <span className={`text-[9px] uppercase tracking-wider block font-bold font-mono ${textSecondary}`}>Difficulty</span>
                  <span className={`px-2 py-0.5 border rounded text-[10px] font-bold font-mono inline-block ${diffColor}`}>
                    {c.difficulty}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className={`text-[9px] uppercase tracking-wider block font-bold font-mono ${textSecondary}`}>Preparation Time</span>
                  <span className={`flex items-center gap-1 font-medium ${textPrimary}`}>
                    <Clock className={`w-3.5 h-3.5 ${textSecondary}`} /> {c.prepTime}
                  </span>
                </div>
                <div className="space-y-0.5 text-right">
                  <span className={`text-[9px] uppercase tracking-wider block font-bold font-mono ${textSecondary}`}>Success Rate</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{c.successRate}%</span>
                </div>
              </div>

              {/* Action and location footer */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className={`flex items-center gap-1 text-[10px] font-medium max-w-[150px] truncate ${textSecondary}`}>
                  <MapPin className={`w-3.5 h-3.5 shrink-0 ${textSecondary}`} /> {c.location}
                </span>
                <button
                  onClick={() => onSelectCompany(c)}
                  className={`text-xs font-bold flex items-center gap-1 cursor-pointer group transition-colors ${
                    isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-700 hover:text-blue-800'
                  }`}
                >
                  Start Preparation <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}