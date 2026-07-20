import React, { useState } from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { signInWithGoogle, isFirebaseConfigured } from '../lib/firebase';

interface AuthPageProps {
  onSuccess: () => void;
  onBack: () => void;
  isDark?: boolean;
}

export default function AuthPage({ onSuccess, onBack, isDark = false }: AuthPageProps) {
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setSuccess('');
    setLoading(true);
    try {
      await signInWithGoogle();
      setSuccess('Google sign-in successful!');
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch {
      setSuccess('Google Sign-In is currently unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center font-sans p-4 transition-colors duration-300 ${
      isDark ? 'bg-[#0B1120]' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
    }`}>
      {/* Top Back Navigation */}
      <div className="absolute top-6 left-6">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 text-sm font-semibold transition-colors cursor-pointer ${
            isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-white hover:border hover:border-slate-200 rounded-xl px-4 py-2 shadow-sm'
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>

      {/* Main Auth Card */}
      <div className={`w-full max-w-[440px] border rounded-3xl p-8 backdrop-blur-md relative overflow-hidden transition-all ${
        isDark
          ? 'bg-gray-900/50 border-gray-800 text-white shadow-2xl'
          : 'bg-white border-slate-200 rounded-[28px] text-slate-900 shadow-sm'
      }`}>
        {/* Top Brand Logo & Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Welcome to PrepAI
          </h2>
          <p className={`text-sm font-medium max-w-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
            Continue securely with your Google account to access AI interviews, coding practice, company insights, and your personalized dashboard.
          </p>
        </div>

        {/* Success Alert Banner */}
        {success && (
          <div className={`mb-5 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 border ${
            isDark
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-emerald-50/80 border-emerald-200 rounded-2xl text-emerald-700 shadow-sm'
          }`}>
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" /> {success}
          </div>
        )}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${isDark ? 'border-gray-800' : 'border-slate-200'}`} />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
            <span className={`px-3 ${
              isDark ? 'bg-gray-900 text-gray-500' : 'bg-white text-slate-500'
            }`}>
              Continue with Google
            </span>
          </div>
        </div>

        {/* Google Sign-in Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`group w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:hover:translate-y-0 ${
            isDark
              ? 'bg-gray-950 border-gray-800 hover:bg-gray-900/80 text-white shadow-md'
              : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-blue-300 text-slate-900 shadow-sm hover:-translate-y-0.5'
          }`}
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.2 35.2 26.8 36 24 36c-5.3 0-9.7-3.3-11.4-8l-6.6 5.1C9.3 39.6 16.1 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6.2 6.9l6.2 5.2C39 36.8 44 31 44 24c0-1.3-.1-2.3-.4-3.5z"/>
          </svg>
          <div className="flex flex-col items-start leading-tight">
            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {loading ? 'Signing you in...' : 'Continue with Google'}
            </span>
            <span className={`text-[11px] font-medium ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
              Fast, secure and one-click access
            </span>
          </div>
        </button>

        {/* Terms Footer */}
        <p className={`text-[11px] mt-6 text-center font-medium ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
          By continuing, you agree to our <a href="#" className="underline-offset-2 hover:underline hover:text-blue-600 transition-colors">Terms of Service</a> and <a href="#" className="underline-offset-2 hover:underline hover:text-blue-600 transition-colors">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}