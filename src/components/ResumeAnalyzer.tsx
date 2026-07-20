import React, { useState } from 'react';
import { 
  Upload, Sparkles, CheckCircle2, RefreshCw, FileText, 
  AlertTriangle, ShieldCheck, Copy, Check, Plus, Trash, 
  Download, Eye, X, Linkedin 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { apiFetch } from '../lib/apiClient';

interface ResumeAnalyzerProps {
  isDark?: boolean;
}

export default function ResumeAnalyzer({ isDark = false }: ResumeAnalyzerProps) {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'builder'>('analyzer');
  
  // Tab 1: ATS Analyzer State
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [atsScore, setAtsScore] = useState(89);
  const [grammarScore, setGrammarScore] = useState(94);
  const [impactScore, setImpactScore] = useState('Strong');
  const [suggestions, setSuggestions] = useState<string[]>([
    'Single-column layout correctly parsed by standard parser configurations.',
    'Quantified metrics present in 3/4 bullet points (Strong impact delivery).'
  ]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([
    'gRPC Protocols', 'Consistent Hashing', 'OAuth 2.0 Auth'
  ]);
  const [aiQuestions, setAiQuestions] = useState<{
    project: { q: string; detail: string }[];
    skills: { q: string; detail: string }[];
    behavior: { q: string; detail: string }[];
  }>({
    project: [
      { q: 'In your "PrepAI" project, how did you architect the video live telemetry feeds to prevent UI thread blocking?', detail: 'Project context: PrepAI React Sandbox' },
      { q: 'Why did you select Redis rather than standard in-memory JS maps for caching simulated pipeline states?', detail: 'Project context: Redis caching block implementation' }
    ],
    skills: [
      { q: 'Can you write a multi-threaded producer-consumer task queue in Java using lock condition boundaries?', detail: 'Skill tested: Java, Multi-threading' },
      { q: 'How does React 19 fiber reconciler prioritize background rendering loops under heavy DOM edits?', detail: 'Skill tested: React, Frontend optimization' }
    ],
    behavior: [
      { q: 'Describe a moment during your college projects where you had to push a critical code feature past a deadline under massive resource constraints.', detail: 'Tested context: Ownership, delivery' },
      { q: 'How do you handle disagreement with your senior developers regarding framework choices?', detail: 'Tested context: Conflict negotiation' }
    ]
  });
  const [activeQuestionCategory, setActiveQuestionCategory] = useState<'project' | 'skills' | 'behavior'>('project');

  // Tab 2: AI Builder State
  const [inputBullet, setInputBullet] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewrittenBullets, setRewrittenBullets] = useState<string[]>([
    '• Re-architected full-stack query indexes by introducing consistent hashing partitions, mitigating query lag by 45%.',
    '• Engineered multi-tenant authorization boundaries using OAuth 2.0 and gRPC protocol buffers, reducing response payload sizes by 3.2x.',
    '• Managed Docker development workflows across team branches, decreasing build failures by 20%.'
  ]);
  const [hasCopied, setHasCopied] = useState(false);

  // Resume Model State
  const [resumeProfile, setResumeProfile] = useState({
    name: 'Mehak Sharma',
    title: 'SDE Candidate',
    email: 'mehak@example.com',
    skills: 'React, Node.js, TypeScript, SQL, Docker, Redis',
    bullets: [
      'Implemented full-text search index filters.',
      'Refactored API controllers to improve database response speeds.'
    ]
  });

  const [pasteText, setPasteText] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Job Description Matching Evaluator State
  const [jobDescription, setJobDescription] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [isEvaluatingMatch, setIsEvaluatingMatch] = useState(false);
  const [activeRightSubTab, setActiveRightSubTab] = useState<'evaluation' | 'questions'>('evaluation');
  const [evaluationResult, setEvaluationResult] = useState<{
    matchScore: number;
    potentialScore: number;
    improvementScore: number;
    matchingKeywords: string[];
    missingKeywords: string[];
    recommendations: string[];
  } | null>(null);

  // LinkedIn Sync State
  const [isSyncingLinkedIn, setIsSyncingLinkedIn] = useState(false);
  const [linkedinSyncError, setLinkedinSyncError] = useState<string | null>(null);

  // -------------------------------------------------------------
  // Clean, Non-Mixed Theme Class Variables
  // -------------------------------------------------------------
  const bgMain = isDark ? 'bg-[#0B0F17]' : 'bg-white';
  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const borderPrimary = isDark ? 'border-slate-800' : 'border-slate-200';
  
  const cardBg = isDark ? 'bg-[#0F172A]' : 'bg-white';
  const subCardBg = isDark ? 'bg-[#161B22]' : 'bg-slate-50';
  const inputBg = isDark ? 'bg-[#161B22] text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 text-slate-900 placeholder:text-slate-400';

  // Listen for LinkedIn callback message
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      
      if (event.data?.type === 'LINKEDIN_AUTH_CALLBACK') {
        setIsSyncingLinkedIn(false);
        if (event.data.success && event.data.profile) {
          const profile = event.data.profile;
          const updatedProfile = {
            name: profile.name || 'Candidate Name',
            title: profile.title || 'Software Engineer',
            email: profile.email || 'candidate@example.com',
            skills: profile.skills || '',
            bullets: profile.bullets || []
          };
          
          setResumeProfile(updatedProfile);
          handleSaveProfile(updatedProfile);
          
          const textRep = `
            ${updatedProfile.name}
            ${updatedProfile.title}
            Email: ${updatedProfile.email}
            Skills: ${updatedProfile.skills}
            Accomplishments:
            ${updatedProfile.bullets.map((b: string) => `• ${b}`).join('\n')}
          `;
          triggerUpload(`${(updatedProfile.name).replace(/\s+/g, '_')}_LinkedIn_Sync.txt`, textRep);
        } else {
          setLinkedinSyncError(event.data.error || 'LinkedIn sync authentication failed.');
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLinkedInSync = async () => {
    setIsSyncingLinkedIn(true);
    setLinkedinSyncError(null);
    try {
      const response = await apiFetch('/api/auth/linkedin/url');
      if (!response.ok) {
        throw new Error('Failed to retrieve LinkedIn authentication URL.');
      }
      const { url } = await response.json();
      
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        url,
        'linkedin_oauth_popup',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );
      
      if (!popup) {
        setLinkedinSyncError('Popup blocked! Please allow popups for this site to sync your LinkedIn profile.');
        setIsSyncingLinkedIn(false);
      }
    } catch (err: any) {
      console.error("LinkedIn sync start failure:", err);
      setLinkedinSyncError(err.message || 'An error occurred while launching LinkedIn sync.');
      setIsSyncingLinkedIn(false);
    }
  };

  // Load interactive profile from backend on mount
  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await apiFetch('/api/user/resume/profile');
        if (res.ok) {
          const data = await res.json();
          if (data && (data.name || data.skills || data.bullets)) {
            setResumeProfile({
              name: data.name || 'Mehak Sharma',
              title: data.title || 'SDE Candidate',
              email: data.email || 'mehak@example.com',
              skills: data.skills || 'React, Node.js, TypeScript, SQL, Docker, Redis',
              bullets: data.bullets || []
            });
          }
        }
      } catch (err) {
        console.error("Failed to load backend resume profile:", err);
      }
    };
    loadProfile();
  }, []);

  const handleSaveProfile = async (customProfile = resumeProfile) => {
    setIsSavingProfile(true);
    setSaveSuccess(false);
    try {
      const res = await apiFetch('/api/user/resume/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customProfile)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      console.error("Failed to persist resume profile details:", err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      let y = margin;

      const checkSpace = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      };

      // Header block
      doc.setTextColor(15, 23, 42);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.text(resumeProfile.name, margin, y);
      y += 8;

      doc.setTextColor(37, 99, 235);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(resumeProfile.title || 'SDE Candidate', margin, y);
      y += 5;

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(9);
      doc.text(resumeProfile.email || 'candidate@example.com', margin, y);
      y += 7;

      // Divider Line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      // SECTION: TECHNICAL SKILLS
      doc.setTextColor(15, 23, 42);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.text("CORE TECHNICAL SKILLS", margin, y);
      y += 4.5;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      
      const skillsText = resumeProfile.skills || "React, Node.js, TypeScript, SQL, Docker, Redis";
      const wrappedSkills = doc.splitTextToSize(skillsText, contentWidth);
      doc.text(wrappedSkills, margin, y);
      y += (wrappedSkills.length * 5) + 6;

      // SECTION: KEY ACCOMPLISHMENTS (STAR METHOD)
      checkSpace(15);
      doc.setTextColor(15, 23, 42);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.text("AI-OPTIMIZED TECHNICAL ACCOMPLISHMENTS (STAR)", margin, y);
      y += 6;

      if (resumeProfile.bullets.length === 0) {
        doc.setFont('Helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text("No accomplishments added yet. Use the STAR Optimizer to refine and add achievements.", margin, y);
      } else {
        resumeProfile.bullets.forEach((bullet) => {
          const rawBullet = bullet.replace(/^•\s*/, '').trim();
          
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(51, 65, 85);

          const bulletIndent = 5;
          const bulletTextWidth = contentWidth - bulletIndent;
          const wrappedLines = doc.splitTextToSize(rawBullet, bulletTextWidth);
          const blockHeight = (wrappedLines.length * 4.8) + 4;

          checkSpace(blockHeight);

          doc.setFillColor(37, 99, 235);
          doc.circle(margin + 1.5, y - 1, 0.7, 'F');

          doc.text(wrappedLines, margin + bulletIndent, y);
          y += blockHeight;
        });
      }

      // Add Footer
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(7.5);
      doc.setFont('Helvetica', 'italic');
      const footerY = pageHeight - 12;
      doc.text("Optimized & Refined via PrepAI SDE Resume Workspace", margin, footerY);
      doc.text("Format: Standard 1-Page Industry Resume", pageWidth - margin - 52, footerY);

      const cleanFileName = resumeProfile.name.toLowerCase().replace(/\s+/g, '_') + "_sde_resume.pdf";
      doc.save(cleanFileName);
    } catch (err) {
      console.error("Failed to export resume PDF:", err);
      alert("Something went wrong while exporting PDF. Please check your browser permissions.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          triggerUpload(file.name, event.target?.result as string);
        };
        reader.readAsText(file);
      } else {
        triggerUpload(file.name);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          triggerUpload(file.name, event.target?.result as string);
        };
        reader.readAsText(file);
      } else {
        triggerUpload(file.name);
      }
    }
  };

  const triggerUpload = async (name: string, textContent?: string) => {
    setFileName(name);
    setIsUploading(true);
    try {
      const res = await apiFetch('/api/ai/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: name, resumeText: textContent })
      });
      const data = await res.json();
      setAtsScore(data.atsScore || 85);
      setGrammarScore(data.grammarScore || 90);
      setImpactScore(data.impactScore || 'Strong');
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }
      if (data.missingKeywords && data.missingKeywords.length > 0) {
        setMissingKeywords(data.missingKeywords);
      }
      if (data.questions) {
        setAiQuestions(data.questions);
      }
      setUploaded(true);
    } catch (err) {
      console.error(err);
      setUploaded(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setUploaded(false);
    setFileName('');
    setEvaluationResult(null);
    setJobDescription('');
    setTargetKeywords('');
  };

  const handleEvaluateMatch = async () => {
    if (!jobDescription.trim()) return;
    setIsEvaluatingMatch(true);
    try {
      const res = await apiFetch('/api/ai/resume/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          targetKeywords,
          resumeProfile
        })
      });
      if (res.ok) {
        const data = await res.json();
        setEvaluationResult(data);
      }
    } catch (err) {
      console.error("Failed to evaluate job match:", err);
    } finally {
      setIsEvaluatingMatch(false);
    }
  };

  const handleAiRewrite = async () => {
    if (!inputBullet.trim()) return;
    setIsRewriting(true);
    try {
      const res = await apiFetch('/api/ai/resume/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputBullet })
      });
      const data = await res.json();
      if (data.bullets) {
        setRewrittenBullets(data.bullets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleAddRewrittenToResume = (bullet: string) => {
    const cleaned = bullet.replace(/^•\s*/, '');
    const updatedBullets = [...resumeProfile.bullets, cleaned];
    const updatedProfile = { ...resumeProfile, bullets: updatedBullets };
    setResumeProfile(updatedProfile);
    handleSaveProfile(updatedProfile);
  };

  const handleRemoveBullet = (index: number) => {
    const updatedBullets = resumeProfile.bullets.filter((_, i) => i !== index);
    const updatedProfile = { ...resumeProfile, bullets: updatedBullets };
    setResumeProfile(updatedProfile);
    handleSaveProfile(updatedProfile);
  };

  const handleCopyText = () => {
    const formatted = `
${resumeProfile.name}
${resumeProfile.title} | ${resumeProfile.email}
Skills: ${resumeProfile.skills}

Core Accomplishments:
${resumeProfile.bullets.map(b => `• ${b}`).join('\n')}
    `.trim();
    navigator.clipboard.writeText(formatted);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className={`p-6 space-y-6 min-h-screen transition-colors duration-300 ${bgMain} ${textPrimary}`}>
      
      {/* Top Section Tabs */}
      <div className={`flex justify-between items-center p-1.5 border rounded-2xl max-w-md mx-auto ${
        isDark ? 'bg-[#161B22] border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <button
          onClick={() => setActiveTab('analyzer')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${
            activeTab === 'analyzer'
              ? (isDark ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/30 shadow-md' : 'bg-blue-100 text-blue-800 border border-blue-200 shadow-xs')
              : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
          }`}
        >
          ATS Analyzer & Scan
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${
            activeTab === 'builder'
              ? (isDark ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/30 shadow-md' : 'bg-blue-100 text-blue-800 border border-blue-200 shadow-xs')
              : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
          }`}
        >
          AI STAR Bullet Builder
        </button>
      </div>

      {activeTab === 'analyzer' ? (
        <div>
          {!uploaded ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Uploader & LinkedIn Sync Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* File Uploader */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`p-8 border-2 border-dashed rounded-3xl text-center space-y-4 transition-all flex flex-col items-center justify-center min-h-[240px] relative overflow-hidden ${
                    isDark ? 'bg-[#0F172A] border-slate-800 hover:border-cyan-500/40' : 'bg-white border-slate-200 hover:border-blue-500/40 shadow-xs'
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {isUploading ? (
                    <div className="space-y-3.5">
                      <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                      <p className={`text-xs font-mono ${textSecondary}`}>Parsing resume structure ... Scanning key technical tokens ...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className={`p-3 rounded-2xl w-fit mx-auto border ${
                        isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'
                      }`}>
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className={`font-bold text-sm ${textPrimary}`}>Drag &amp; drop your resume</h3>
                        <p className={`text-xs ${textSecondary}`}>Supports PDF, DOCX and TXT formats</p>
                      </div>
                      <button className={`px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer ${
                        isDark ? 'bg-[#161B22] border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}>
                        Browse files
                      </button>
                    </div>
                  )}
                </div>

                {/* LinkedIn Professional Sync Card */}
                <div className={`p-8 border rounded-3xl text-center space-y-4 flex flex-col items-center justify-center min-h-[240px] relative overflow-hidden ${
                  isDark
                    ? 'bg-gradient-to-br from-[#0077b5]/15 to-[#0B0F17] border-[#0077b5]/30'
                    : 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border-blue-200 shadow-xs'
                }`}>
                  {isSyncingLinkedIn ? (
                    <div className="space-y-3.5">
                      <RefreshCw className="w-8 h-8 text-[#0077b5] animate-spin mx-auto" />
                      <p className={`text-xs font-mono ${textSecondary}`}>Connecting with LinkedIn... Please authorize in popup...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-3 bg-[#0077b5]/15 border border-[#0077b5]/30 text-[#0077b5] rounded-2xl w-fit mx-auto flex items-center justify-center">
                        <Linkedin className="w-6 h-6 fill-current" />
                      </div>
                      <div className="space-y-1">
                        <h3 className={`font-bold text-sm ${textPrimary}`}>Sync from LinkedIn</h3>
                        <p className={`text-xs ${textSecondary}`}>Import your professional SDE skills and achievements instantly</p>
                      </div>
                      <button
                        onClick={handleLinkedInSync}
                        className="px-5 py-2.5 bg-[#0077b5] hover:bg-[#006699] text-white font-bold rounded-xl text-xs cursor-pointer transition-colors flex items-center gap-2 mx-auto shadow-md"
                      >
                        <Linkedin className="w-3.5 h-3.5 fill-current" />
                        Sync LinkedIn Profile
                      </button>
                    </div>
                  )}

                  {linkedinSyncError && (
                    <div className="absolute bottom-2 left-2 right-2 p-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-[10px] text-center leading-normal">
                      {linkedinSyncError}
                    </div>
                  )}
                </div>
              </div>

              {/* Paste Text Area option */}
              <div className={`p-6 border rounded-3xl space-y-3 ${cardBg} ${borderPrimary}`}>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                  <span className={`font-bold text-xs ${textPrimary}`}>Or, paste your raw resume text below</span>
                </div>
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder="Paste your resume headings, skills, experience, and bullet points here for direct ATS parsing..."
                  className={`w-full h-32 p-3 border rounded-2xl outline-none focus:border-blue-500 text-xs resize-none leading-relaxed font-mono ${inputBg} ${borderPrimary}`}
                />
                <button
                  onClick={() => triggerUpload("Pasted_Resume_Text.txt", pasteText)}
                  disabled={isUploading || !pasteText.trim()}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-45 shadow-sm"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Scanning Paste Content...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Scan Paste Text
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left panel: Report card and suggestions */}
              <div className="lg:col-span-6 space-y-6">
                <div className={`p-6 border rounded-3xl space-y-5 ${cardBg} ${borderPrimary}`}>
                  <div className={`flex justify-between items-center pb-2.5 border-b ${borderPrimary}`}>
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span className={`font-bold text-sm ${textPrimary}`}>ATS Analysis Report</span>
                    </div>
                    <button
                      onClick={handleReset}
                      className="text-[10px] text-blue-600 dark:text-cyan-400 hover:underline font-semibold"
                    >
                      Upload another
                    </button>
                  </div>

                  {/* Multi-parameter metrics */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className={`p-3 border rounded-2xl ${
                      isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'
                    }`}>
                      <span className={`text-[9px] uppercase tracking-wider block font-bold ${textSecondary}`}>ATS Score</span>
                      <strong className="text-blue-600 dark:text-blue-400 text-lg font-bold block mt-1">{atsScore}%</strong>
                    </div>
                    <div className={`p-3 border rounded-2xl ${
                      isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'
                    }`}>
                      <span className={`text-[9px] uppercase tracking-wider block font-bold ${textSecondary}`}>Grammar</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 text-lg font-bold block mt-1">{grammarScore}%</strong>
                    </div>
                    <div className={`p-3 border rounded-2xl ${
                      isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-100'
                    }`}>
                      <span className={`text-[9px] uppercase tracking-wider block font-bold ${textSecondary}`}>Impact Score</span>
                      <strong className="text-amber-600 dark:text-amber-400 text-lg font-bold block mt-1">{impactScore}</strong>
                    </div>
                  </div>

                  {/* Suggestions logs */}
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <span className={`font-semibold block uppercase tracking-wider text-[9px] flex items-center gap-1 ${textSecondary}`}>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Formatting &amp; Core Checks
                      </span>
                      <ul className={`space-y-1.5 font-medium list-inside list-disc ${textSecondary}`}>
                        {suggestions.map((sug, i) => (
                          <li key={i}>{sug}</li>
                        ))}
                      </ul>
                    </div>

                    {missingKeywords.length > 0 && (
                      <div className={`space-y-1 border-t pt-3.5 ${borderPrimary}`}>
                        <span className={`font-semibold block uppercase tracking-wider text-[9px] flex items-center gap-1 ${textSecondary}`}>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Missing Technical Keywords
                        </span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {missingKeywords.map((kw, i) => (
                            <span key={i} className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold border ${
                              isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>{kw}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right panel: Toggleable Matcher vs Mock Questions */}
              <div className="lg:col-span-6 space-y-6">
                {/* Sub-mode Selection Tabs */}
                <div className={`flex gap-1.5 p-1.5 border rounded-2xl ${
                  isDark ? 'bg-[#161B22] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <button
                    onClick={() => setActiveRightSubTab('evaluation')}
                    className={`flex-1 py-2 text-center rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1 ${
                      activeRightSubTab === 'evaluation'
                        ? (isDark ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/30' : 'bg-blue-100 text-blue-800 border border-blue-200 shadow-xs')
                        : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> JD Fit Optimizer
                  </button>
                  <button
                    onClick={() => setActiveRightSubTab('questions')}
                    className={`flex-1 py-2 text-center rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1 ${
                      activeRightSubTab === 'questions'
                        ? (isDark ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/30' : 'bg-blue-100 text-blue-800 border border-blue-200 shadow-xs')
                        : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" /> Mock Interview Questions
                  </button>
                </div>

                {activeRightSubTab === 'evaluation' ? (
                  <div className={`p-6 border rounded-3xl space-y-4 ${cardBg} ${borderPrimary}`}>
                    <div className={`pb-1.5 border-b ${borderPrimary}`}>
                      <span className={`text-[10px] font-semibold uppercase font-mono tracking-wider block ${
                        isDark ? 'text-cyan-400' : 'text-blue-700'
                      }`}>AI Match Optimizer</span>
                      <h4 className={`font-bold text-sm ${textPrimary}`}>Target Job &amp; Keyword Matcher</h4>
                      <p className={`text-[11px] font-medium mt-0.5 ${textSecondary}`}>Evaluate and boost your resume score against specific job postings.</p>
                    </div>

                    <div className="space-y-4">
                      {/* Inputs */}
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className={`text-[10px] font-bold uppercase tracking-wide ${textSecondary}`}>Paste Job Description</label>
                          <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the target job description here to extract ATS triggers..."
                            className={`w-full h-28 p-3 border rounded-2xl outline-none focus:border-blue-500 text-xs resize-none font-medium leading-relaxed ${inputBg} ${borderPrimary}`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className={`text-[10px] font-bold uppercase tracking-wide ${textSecondary}`}>Target Industry Keywords (Optional)</label>
                          <input
                            type="text"
                            value={targetKeywords}
                            onChange={(e) => setTargetKeywords(e.target.value)}
                            placeholder="e.g. React, gRPC, Consistent Hashing (comma-separated)"
                            className={`w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 text-xs font-medium ${inputBg} ${borderPrimary}`}
                          />
                        </div>

                        <button
                          onClick={handleEvaluateMatch}
                          disabled={isEvaluatingMatch || !jobDescription.trim()}
                          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-45 shadow-sm"
                        >
                          {isEvaluatingMatch ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              Evaluating Match Gap...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              Evaluate Fit &amp; Calculate Improvement
                            </>
                          )}
                        </button>
                      </div>

                      {/* Results */}
                      {evaluationResult && (
                        <div className={`space-y-5 pt-3 border-t ${borderPrimary}`}>
                          {/* Scoring Boost Widget */}
                          <div className={`p-4 border rounded-2xl space-y-3 ${
                            isDark ? 'bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-blue-900/30' : 'bg-blue-50/70 border-blue-100'
                          }`}>
                            <div className="flex justify-between items-center">
                              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                                isDark ? 'text-blue-400' : 'text-blue-800'
                              }`}>Scoring Gap Analysis</span>
                              <span className={`px-2 py-0.5 border rounded text-[10px] font-mono font-bold ${
                                isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              }`}>
                                +{evaluationResult.improvementScore}% Boost Potential
                              </span>
                            </div>

                            {/* Dual Progress Bars */}
                            <div className="space-y-2 text-xs">
                              <div className="space-y-1">
                                <div className={`flex justify-between text-[11px] font-medium ${textSecondary}`}>
                                  <span>Current Match Score</span>
                                  <span className={`font-bold ${textPrimary}`}>{evaluationResult.matchScore}%</span>
                                </div>
                                <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                                  <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${evaluationResult.matchScore}%` }} />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className={`flex justify-between text-[11px] font-medium ${textSecondary}`}>
                                  <span>Potential Match Score (Optimized)</span>
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{evaluationResult.potentialScore}%</span>
                                </div>
                                <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${evaluationResult.potentialScore}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Matched vs Missing Keywords */}
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide block">Matched Skills</span>
                              <div className="flex flex-wrap gap-1">
                                {evaluationResult.matchingKeywords.length === 0 ? (
                                  <span className={`italic text-[11px] ${textSecondary}`}>None detected yet</span>
                                ) : (
                                  evaluationResult.matchingKeywords.map((kw, i) => (
                                    <span key={i} className={`px-2 py-0.5 border rounded text-[10px] font-medium ${
                                      isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    }`}>{kw}</span>
                                  ))
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide block">Missing / Gap Skills</span>
                              <div className="flex flex-wrap gap-1">
                                {evaluationResult.missingKeywords.length === 0 ? (
                                  <span className="text-emerald-600 dark:text-emerald-400 italic text-[11px]">No missing gaps!</span>
                                ) : (
                                  evaluationResult.missingKeywords.map((kw, i) => (
                                    <span key={i} className={`px-2 py-0.5 border rounded text-[10px] font-medium ${
                                      isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-800 border-amber-200'
                                    }`}>{kw}</span>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actionable Recommendations */}
                          <div className={`space-y-2.5 pt-3.5 border-t ${borderPrimary}`}>
                            <span className={`text-[10px] font-bold uppercase tracking-wide block ${textSecondary}`}>Tailored AI Recommendations</span>
                            <div className="space-y-2">
                              {evaluationResult.recommendations.map((rec, i) => (
                                <div key={i} className={`flex gap-2 items-start text-xs ${textSecondary}`}>
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                                  <p className="leading-relaxed font-medium">{rec}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={`p-6 border rounded-3xl space-y-4 ${cardBg} ${borderPrimary}`}>
                    <div className={`pb-1.5 border-b ${borderPrimary}`}>
                      <span className={`text-[10px] font-semibold uppercase font-mono tracking-wider block ${
                        isDark ? 'text-cyan-400' : 'text-blue-700'
                      }`}>Custom Generator</span>
                      <h4 className={`font-bold text-sm ${textPrimary}`}>Resume-Centric Mock Questions</h4>
                    </div>

                    {/* Question sub-categories tabs */}
                    <div className={`flex gap-1.5 border-b pb-3 ${borderPrimary}`}>
                      <button
                        onClick={() => setActiveQuestionCategory('project')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider cursor-pointer ${
                          activeQuestionCategory === 'project'
                            ? (isDark ? 'bg-blue-500/20 text-cyan-400' : 'bg-blue-100 text-blue-800')
                            : textSecondary
                        }`}
                      >
                        Projects Wise
                      </button>
                      <button
                        onClick={() => setActiveQuestionCategory('skills')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider cursor-pointer ${
                          activeQuestionCategory === 'skills'
                            ? (isDark ? 'bg-blue-500/20 text-cyan-400' : 'bg-blue-100 text-blue-800')
                            : textSecondary
                        }`}
                      >
                        Skills Wise
                      </button>
                      <button
                        onClick={() => setActiveQuestionCategory('behavior')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider cursor-pointer ${
                          activeQuestionCategory === 'behavior'
                            ? (isDark ? 'bg-blue-500/20 text-cyan-400' : 'bg-blue-100 text-blue-800')
                            : textSecondary
                        }`}
                      >
                        Behavioral
                      </button>
                    </div>

                    {/* Dynamic generated questions content */}
                    <div className="space-y-3.5">
                      {(aiQuestions[activeQuestionCategory] || []).map((item, idx) => (
                        <div key={idx} className={`p-4 border rounded-2xl text-xs space-y-2 ${subCardBg} ${borderPrimary}`}>
                          <div className="flex gap-2.5">
                            <Sparkles className="w-4 h-4 text-purple-500 shrink-0 mt-0.5 animate-pulse" />
                            <p className={`leading-relaxed font-semibold ${textPrimary}`}>{item.q}</p>
                          </div>
                          <span className={`text-[10px] block font-mono pl-6 ${textSecondary}`}>{item.detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left panel: STAR generator tool */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`p-6 border rounded-3xl space-y-4 ${cardBg} ${borderPrimary}`}>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI Resume Rewriter (STAR Method)
                </span>
                <h4 className={`font-bold text-sm ${textPrimary}`}>Convert generic bullets to STAR achievements</h4>
              </div>

              <div className="space-y-3 text-xs">
                <textarea
                  value={inputBullet}
                  onChange={(e) => setInputBullet(e.target.value)}
                  placeholder="e.g., 'Implemented search on the website and made the database queries run much faster.'"
                  className={`w-full h-24 p-3 border rounded-2xl outline-none focus:border-blue-500 resize-none leading-relaxed font-medium ${inputBg} ${borderPrimary}`}
                />
                
                <button
                  onClick={handleAiRewrite}
                  disabled={isRewriting || !inputBullet.trim()}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 shadow-sm"
                >
                  {isRewriting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Optimizing Bullet Structure...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Rewrite Using STAR Method
                    </>
                  )}
                </button>
              </div>

              {/* Suggestions results */}
              <div className="space-y-3 pt-2">
                <span className={`text-[9px] font-bold block uppercase tracking-wider font-mono ${textSecondary}`}>STAR Rewritten Proposals</span>
                <div className="space-y-2.5">
                  {rewrittenBullets.map((bullet, idx) => (
                    <div key={idx} className={`p-3 border rounded-2xl text-xs space-y-2 relative group ${subCardBg} ${borderPrimary}`}>
                      <p className={`font-medium leading-relaxed pr-8 ${textPrimary}`}>{bullet}</p>
                      <button
                        onClick={() => handleAddRewrittenToResume(bullet)}
                        className={`absolute right-3 top-3 p-1.5 rounded-lg text-[9px] font-semibold cursor-pointer transition-colors border ${
                          isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'
                        }`}
                        title="Add this bullet to your live resume profile"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: SDE Resume Builder Form & Real-time Live Preview */}
          <div className="lg:col-span-7 space-y-6">
            <div className={`p-6 border rounded-3xl space-y-5 ${cardBg} ${borderPrimary}`}>
              <div className={`flex justify-between items-center pb-2.5 border-b ${borderPrimary}`}>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span className={`font-bold text-sm ${textPrimary}`}>Interactive Resume Profile</span>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={handleLinkedInSync}
                    disabled={isSyncingLinkedIn}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors border ${
                      isDark ? 'bg-[#0077b5]/20 border-[#0077b5]/30 text-cyan-400' : 'bg-blue-50 border-blue-200 text-blue-800'
                    }`}
                  >
                    <Linkedin className="w-3.5 h-3.5 fill-current shrink-0" />
                    {isSyncingLinkedIn ? 'Syncing...' : 'Sync LinkedIn'}
                  </button>
                  <button
                    onClick={() => handleSaveProfile()}
                    disabled={isSavingProfile}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {isSavingProfile ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                      </>
                    ) : saveSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" /> Saved!
                      </>
                    ) : (
                      <>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCopyText}
                    className={`px-3 py-1.5 border rounded-lg text-[10px] font-semibold flex items-center gap-1 cursor-pointer ${
                      isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {hasCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Raw
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowPreviewModal(true)}
                    className={`px-3 py-1.5 border rounded-lg text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                      isDark ? 'bg-blue-500/10 border-blue-500/20 text-cyan-400' : 'bg-blue-50 border-blue-200 text-blue-700'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Export PDF
                  </button>
                </div>
              </div>

              {/* Editable form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                <div className="space-y-1">
                  <label className={`text-[9px] font-bold uppercase tracking-wider block ${textSecondary}`}>Candidate Name</label>
                  <input
                    type="text"
                    value={resumeProfile.name}
                    onChange={(e) => setResumeProfile(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 ${inputBg} ${borderPrimary}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-[9px] font-bold uppercase tracking-wider block ${textSecondary}`}>Target SDE Title</label>
                  <input
                    type="text"
                    value={resumeProfile.title}
                    onChange={(e) => setResumeProfile(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 ${inputBg} ${borderPrimary}`}
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className={`text-[9px] font-bold uppercase tracking-wider block ${textSecondary}`}>Core Technical Skills (comma separated)</label>
                  <input
                    type="text"
                    value={resumeProfile.skills}
                    onChange={(e) => setResumeProfile(prev => ({ ...prev, skills: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-xl outline-none focus:border-blue-500 ${inputBg} ${borderPrimary}`}
                  />
                </div>
              </div>

              {/* Bullet points collection preview */}
              <div className="space-y-3 pt-2">
                <span className={`text-[9px] font-bold block uppercase tracking-wider ${textSecondary}`}>Dynamic Resume Bullet Points</span>
                <div className="space-y-2 text-xs">
                  {resumeProfile.bullets.length === 0 ? (
                    <p className={`font-medium italic ${textSecondary}`}>No accomplishments added. Use the STAR optimizer on the left to append premium achievements!</p>
                  ) : (
                    resumeProfile.bullets.map((b, idx) => (
                      <div key={idx} className={`p-3 border rounded-xl flex items-start gap-2.5 group ${subCardBg} ${borderPrimary}`}>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p className={`leading-relaxed flex-1 font-medium ${textPrimary}`}>{b}</p>
                        <button
                          onClick={() => handleRemoveBullet(idx)}
                          className="text-rose-500 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Professional Resume PDF Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`border rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] ${cardBg} ${borderPrimary}`}>
            {/* Modal Header */}
            <div className={`flex justify-between items-center px-6 py-4 border-b ${subCardBg} ${borderPrimary}`}>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <h3 className={`font-bold text-sm ${textPrimary}`}>Resume PDF Live Preview</h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Content (Simulated PDF Sheet) */}
            <div className={`p-6 overflow-y-auto flex-1 flex justify-center ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
              <div className="bg-white text-slate-900 w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 shadow-md border border-slate-200 rounded-lg font-sans relative flex flex-col justify-between">
                {/* Simulated A4 Content */}
                <div className="space-y-6">
                  {/* Name and Contacts */}
                  <div className="space-y-1 text-left">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">{resumeProfile.name}</h1>
                    <p className="text-blue-600 font-medium text-xs tracking-wide uppercase">{resumeProfile.title || 'SDE Candidate'}</p>
                    <p className="text-slate-500 text-[10px]">{resumeProfile.email || 'candidate@example.com'}</p>
                  </div>

                  {/* Horizontal Divider */}
                  <div className="h-[1px] bg-slate-200 w-full" />

                  {/* Skills Section */}
                  <div className="space-y-2 text-left">
                    <h2 className="text-xs font-bold tracking-wider text-slate-800 uppercase">Core Technical Skills</h2>
                    <p className="text-slate-600 text-xs leading-relaxed font-light">
                      {resumeProfile.skills || "React, Node.js, TypeScript, SQL, Docker, Redis"}
                    </p>
                  </div>

                  {/* Accomplishments Section */}
                  <div className="space-y-3 text-left">
                    <h2 className="text-xs font-bold tracking-wider text-slate-800 uppercase">AI-Optimized Technical Accomplishments (STAR)</h2>
                    <div className="space-y-3">
                      {resumeProfile.bullets.length === 0 ? (
                        <p className="text-slate-400 text-xs italic font-light">
                          No accomplishments added yet. Use the STAR Optimizer to refine and add achievements.
                        </p>
                      ) : (
                        resumeProfile.bullets.map((bullet, idx) => (
                          <div key={idx} className="flex gap-2.5 items-start">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                            <p className="text-slate-600 text-xs leading-relaxed font-light">
                              {bullet.replace(/^•\s*/, '')}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Simulated Footer */}
                <div className="pt-8 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 italic">
                  <span>Optimized & Refined via PrepAI SDE Resume Workspace</span>
                  <span>Standard 1-Page Industry Format</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className={`px-6 py-4 border-t flex justify-end gap-3 ${subCardBg} ${borderPrimary}`}>
              <button
                onClick={() => setShowPreviewModal(false)}
                className={`px-4 py-2 border font-semibold rounded-xl text-xs cursor-pointer transition-colors ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDownloadPdf();
                  setShowPreviewModal(false);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}