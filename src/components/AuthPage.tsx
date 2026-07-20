import React, { useState, useRef } from 'react';
import { Sparkles, ArrowLeft, AlertCircle } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

interface AuthPageProps {
  onSuccess: () => void;
  onBack: () => void;
  isDark?: boolean;
}

export default function AuthPage({ onSuccess, onBack, isDark = false }: AuthPageProps) {
  const [success, setSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Ref to block double triggers/popups
  const isExecutingRef = useRef(false);

  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isExecutingRef.current || loading) return;

    isExecutingRef.current = true;
    setSuccess('');
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await signInWithGoogle();
      if (result?.user) {
        setSuccess('Google sign-in successful!');
        onSuccess();
      }
    } catch (err: any) {
      console.error('[Google Sign-In Error]:', err);
      console.error('[Google Sign-In Error Code]:', err?.code);
      console.error('[Google Sign-In Error Message]:', err?.message);

      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Google popup was closed or Firebase callback failed. Please try again.');
      } else if (err?.code === 'auth/popup-blocked') {
        setErrorMsg('Pop-up was blocked by your browser. Please allow popups and try again.');
      } else if (err?.code === 'auth/cancelled-popup-request') {
        setErrorMsg('Another Google sign-in popup was already running. Please try again.');
      } else {
        setErrorMsg(`Google Sign-In failed: ${err?.code || 'unknown error'}`);
      }
    } finally {
      setLoading(false);
      isExecutingRef.current = false;
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
          type="button"
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

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className={`mb-5 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 border ${
            isDark
              ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              : 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm'
          }`}>
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" /> {errorMsg}
          </div>
        )}

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
          type="button"
          className={`group w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:hover:translate-y-0 ${
            isDark
              ? 'bg-gray-950 border-gray-800 hover:bg-gray-900/80 text-white shadow-md'
              : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-blue-300 text-slate-900 shadow-sm'
          }`}
        >
          {/* Fixed Google SVG Path */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.13C3.26 21.3 7.31 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.6H1.29C.47 8.23 0 10.06 0 12s.47 3.77 1.29 5.4l3.99-3.13z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.6l3.99 3.13c.95-2.83 3.6-4.98 6.72-4.98z"/>
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

        <p className={`text-[11px] mt-6 text-center font-medium ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
          By continuing, you agree to our <a href="#" className="underline-offset-2 hover:underline hover:text-blue-600 transition-colors">Terms of Service</a> and <a href="#" className="underline-offset-2 hover:underline hover:text-blue-600 transition-colors">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}