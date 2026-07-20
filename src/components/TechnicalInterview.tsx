import { useState } from 'react';
import { Sparkles, Laptop, Layers, Compass, BookOpen, Cpu, CheckCircle2, ChevronRight, Play, AlertCircle } from 'lucide-react';

type TechnicalInterviewProps = {
  isDark?: boolean;
};

export default function TechnicalInterview({ isDark = false }: TechnicalInterviewProps) {
  const [activeTab, setActiveTab] = useState<'cs' | 'system'>('cs');

  // CS Core State
  const [csSubject, setCsSubject] = useState<'OS' | 'DBMS' | 'Networks' | 'OOP'>('OS');
  const [csAnswered, setCsAnswered] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // System Design Architecture State
  const [designTopic, setDesignTopic] = useState('Scalability');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // --- Styling constants ---
  const cardStyle = isDark
    ? 'bg-gray-900/40 border-gray-800/80 rounded-3xl text-white'
    : 'bg-white border border-slate-200 rounded-[28px] shadow-sm text-slate-900 transition-all duration-200 hover:border-blue-300 hover:-translate-y-0.5';
  const subCardStyle = isDark
    ? 'bg-gray-950/40 border-gray-800 text-gray-300'
    : 'bg-slate-50 border border-slate-200 text-slate-700';
  const badgeStyle = isDark
    ? 'bg-gray-950/60 border-gray-800 text-gray-300'
    : 'bg-slate-100 border border-slate-200 text-slate-700';

  const csQuestions = {
    OS: {
      question: 'What is the primary difference between a process and a thread?',
      options: [
        'A process has its own address space, while threads of the same process share that space.',
        'Threads have their own dedicated files and network sockets separate from the process.',
        'Processes are scheduled by the CPU, while threads are only scheduled by software libraries.',
        'Threads cannot communicate with other threads, while processes communicate via shared registers.'
      ],
      correctIdx: 0,
      explanation: 'A process is an executing instance of an application with distinct virtual address blocks. Threads represent execution units within a process and share its heap, global variables, and system resources.'
    },
    DBMS: {
      question: 'What does the Isolation property in ACID transactions guarantee?',
      options: [
        'Transactions are written to persistent disc drives to survive hardware outages.',
        'Concurrent transactions do not interfere with each other and output serializable states.',
        'Either all operations of the transaction succeed, or the system rolls back completely.',
        'Data constraints are rigorously verified on each read operation.'
      ],
      correctIdx: 1,
      explanation: 'Isolation ensures that concurrent execution of transactions leaves the database in the same state as if they were executed sequentially.'
    },
    Networks: {
      question: 'How does TCP congestion control handle packet loss in TCP Reno?',
      options: [
        'It terminates the socket connection instantly.',
        'It halves the congestion window size (ssthresh) and enters fast recovery upon triple duplicate ACKs.',
        'It changes the port mapping dynamically to bypass noise.',
        'It doubles the window size to push the packets through faster.'
      ],
      correctIdx: 1,
      explanation: 'TCP Reno halves the congestion window upon receiving three duplicate ACKs (Fast Retransmit/Fast Recovery) instead of doing a complete Slow Start reset.'
    },
    OOP: {
      question: 'What is the core difference between Method Overloading and Method Overriding?',
      options: [
        'Overloading happens at compile time (static polymorphism), overriding happens at runtime (dynamic polymorphism).',
        'Overriding can only be applied to static functions, while overloading applies to constructors.',
        'Overloading changes the inheritance flow, while overriding operates inside the same class container.',
        'They are different names for identical procedural actions.'
      ],
      correctIdx: 0,
      explanation: 'Method Overloading allows multiple methods in the same class to share a name but with different parameter lists. Overriding allows a subclass to provide a specific implementation of a method already declared in its parent class.'
    }
  };

  const systemArchitectures = [
    { id: 'lb', name: 'Load Balancer', desc: 'Distributes incoming HTTP/TCP requests across microservice pools using Round Robin or Consistent Hashing.', details: 'Crucial for high availability. Typically terminates SSL handshake before forwarding traffic.' },
    { id: 'ag', name: 'API Gateway', desc: 'Handles authentication, rate limiting, logging, routing, and response aggregation.', details: 'Acts as a single entry point. Protects internal service nodes from external direct access.' },
    { id: 'ms', name: 'Microservices Pool', desc: 'Self-contained, horizontally autoscaled service replicas processing discrete business logic.', details: 'Stateless services communicating via REST, gRPC, or messaging queues (Kafka, RabbitMQ).' },
    { id: 'cache', name: 'Redis Cache Block', desc: 'In-memory key-value data storage cache serving warm query results in under 5 milliseconds.', details: 'Implements Cache-Aside or Write-Through policies. Needs strict eviction strategies like LRU.' },
    { id: 'db', name: 'PostgreSQL Relational DB', desc: 'Durable primary system of record database managing ACID tables with primary indexes.', details: 'Scales vertically. Leverages read-replicas or sharding schemes to offload heavy query read streams.' }
  ];

  const handleCsOptionSelect = (idx: number) => {
    setCsAnswered(idx);
    setShowFeedback(true);
  };

  const handleResetCs = () => {
    setCsAnswered(null);
    setShowFeedback(false);
  };

  return (
    <div className={isDark ? 'space-y-6' : 'space-y-6 bg-gradient-to-br from-slate-50 via-white to-slate-100 min-h-screen'}>
      {/* Top Tabs */}
      <div
        className={
          isDark
            ? 'flex border-b border-gray-800 text-xs font-semibold uppercase bg-gray-900/40 p-2.5 rounded-3xl gap-2 shadow-sm'
            : 'flex border-b border-slate-200 text-xs font-semibold uppercase bg-white p-2.5 rounded-3xl gap-2 shadow-sm'
        }
      >
        <button
          onClick={() => setActiveTab('cs')}
          className={`px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 transition-colors ${
            activeTab === 'cs'
              ? (isDark
                  ? 'bg-blue-600/10 text-blue-400'
                  : 'bg-blue-100 border border-blue-200 text-blue-800')
              : (isDark
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-slate-600 hover:text-slate-900')
          }`}
        >
          <Cpu className="w-4 h-4" /> CS Core Subjects MCQ
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 transition-colors ${
            activeTab === 'system'
              ? (isDark
                  ? 'bg-blue-600/10 text-blue-400'
                  : 'bg-blue-100 border border-blue-200 text-blue-800')
              : (isDark
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-slate-600 hover:text-slate-900')
          }`}
        >
          <Layers className="w-4 h-4" /> System Design &amp; Architecture
        </button>
      </div>

      {activeTab === 'cs' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left panel: Quiz */}
          <div className={`lg:col-span-8 p-6 ${cardStyle} space-y-5`}>
            <div className="flex flex-wrap gap-2">
              {(['OS', 'DBMS', 'Networks', 'OOP'] as const).map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    setCsSubject(sub);
                    handleResetCs();
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                    csSubject === sub
                      ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                      : (isDark
                          ? 'bg-gray-950/20 text-gray-400 hover:bg-gray-900'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                  }`}
                >
                  {sub === 'OS' && 'Operating Systems'}
                  {sub === 'DBMS' && 'Database Systems'}
                  {sub === 'Networks' && 'Computer Networks'}
                  {sub === 'OOP' && 'OOP Concepts'}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider block">Core Subject Challenge</span>
              <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'} leading-relaxed`}>
                {csQuestions[csSubject].question}
              </h3>

              <div className="space-y-2.5">
                {csQuestions[csSubject].options.map((option, idx) => {
                  let optStyle = '';
                  if (csAnswered !== null) {
                    if (idx === csQuestions[csSubject].correctIdx) {
                      optStyle = isDark
                        ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 font-medium'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-700';
                    } else if (idx === csAnswered) {
                      optStyle = isDark
                        ? 'bg-rose-500/15 border-rose-400 text-rose-300'
                        : 'bg-rose-50 border-rose-300 text-rose-700';
                    } else {
                      optStyle = isDark
                        ? 'bg-gray-950/10 border-gray-800/60 opacity-60 text-gray-600'
                        : 'bg-slate-50 border-slate-200/60 opacity-60 text-slate-500';
                    }
                  } else {
                    optStyle = isDark
                      ? 'bg-gray-950/20 border-gray-800 hover:border-blue-300 transition-all duration-200 hover:-translate-y-0.5'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-blue-300 transition-all duration-200 hover:-translate-y-0.5';
                  }

                  // Selected (but not yet correct/incorrect)
                  if (csAnswered === idx && csAnswered !== csQuestions[csSubject].correctIdx) {
                    optStyle = isDark
                      ? 'bg-blue-900/30 border-blue-500 text-blue-300 ring-2 ring-blue-500/20'
                      : 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-500/20';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => csAnswered === null && handleCsOptionSelect(idx)}
                      disabled={csAnswered !== null}
                      className={`w-full text-left p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${optStyle} ${csAnswered === null ? 'cursor-pointer' : ''}`}
                    >
                      <span>{option}</span>
                      {csAnswered !== null && idx === csQuestions[csSubject].correctIdx && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {showFeedback && (
                <div className={`p-4 ${isDark ? 'bg-blue-900/10 border border-blue-800' : 'bg-blue-50 border border-blue-100'} rounded-2xl text-xs space-y-2`}>
                  <span className="font-semibold text-blue-500 block flex items-center gap-1.5 uppercase font-mono text-[10px] tracking-wider">
                    <Sparkles className="w-4.5 h-4.5 animate-spin-slow" /> Correct Solution &amp; Explanation
                  </span>
                  <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} font-light leading-relaxed`}>
                    {csQuestions[csSubject].explanation}
                  </p>
                  <button
                    onClick={handleResetCs}
                    className="text-[10px] text-blue-500 hover:underline font-semibold"
                  >
                    Try another question
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right panel: CS Metrics */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`p-6 ${cardStyle} space-y-4`}>
              <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>CS Subject Metrics</h3>
              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <span className={`${isDark ? 'text-gray-400' : 'text-slate-500'} block text-[9px] uppercase tracking-wider`}>Strong Topics</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-transparent">Process Scheduling</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-transparent">TCP Handshakes</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-transparent">Inheritance</span>
                  </div>
                </div>

                <div className={`space-y-1 border-t ${isDark ? 'border-gray-800/60' : 'border-slate-100'} pt-3.5`}>
                  <span className={`${isDark ? 'text-gray-400' : 'text-slate-500'} block text-[9px] uppercase tracking-wider`}>Weak Areas</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-[10px] border border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-transparent">Locking Schemes (DBMS)</span>
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-[10px] border border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-transparent">DNS Routing</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={isDark ? 'p-6 bg-[#0B1120] border border-gray-800 rounded-3xl space-y-3 text-xs' : 'p-6 bg-white border border-slate-200 rounded-[28px] shadow-sm space-y-3 text-xs'}>
              <span className="text-blue-400 font-mono text-[10px] uppercase block tracking-wider font-semibold">Recommended Reads</span>
              <div className="space-y-2">
                <div className={isDark ? 'p-3 bg-gray-950/40 rounded-xl border border-gray-850' : 'p-3 bg-slate-50 rounded-xl border border-slate-200'}>
                  <h4 className={isDark ? 'font-semibold text-gray-200' : 'font-semibold text-slate-900'}>Database Index structures Deep Dive</h4>
                  <p className={isDark ? 'text-[10px] text-gray-500 font-light mt-0.5' : 'text-[10px] text-slate-500 font-light mt-0.5'}>Learn how B-Trees and Hash maps balance write speed.</p>
                </div>
                <div className={isDark ? 'p-3 bg-gray-950/40 rounded-xl border border-gray-850' : 'p-3 bg-slate-50 rounded-xl border border-slate-200'}>
                  <h4 className={isDark ? 'font-semibold text-gray-200' : 'font-semibold text-slate-900'}>System Design: Scaling Cache Clusters</h4>
                  <p className={isDark ? 'text-[10px] text-gray-500 font-light mt-0.5' : 'text-[10px] text-slate-500 font-light mt-0.5'}>A complete look at consistent hashing patterns.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* System design architecture interactive model */}
          <div className={`lg:col-span-8 p-6 ${cardStyle} space-y-6`}>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider block">Interactive Architecture Sandbox</span>
              <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>High-Throughput Web Application Blueprint</h3>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'} font-light`}>Select individual nodes below to inspect operational parameters, failure points, and optimal latency benchmarks.</p>
            </div>

            {/* Visual Architecture Box Graph */}
            <div className={isDark
              ? 'p-5 bg-gray-950 rounded-2xl border border-gray-850 flex flex-col items-center gap-4 py-8 relative'
              : 'p-5 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col items-center gap-4 py-8 relative'}>
              <div className={`absolute top-2.5 right-2.5 text-[9px] font-mono uppercase ${isDark ? 'text-gray-600' : 'text-slate-400'}`}>Interactive SVG Node Layout</div>
              {/* Load Balancer */}
              <button
                onClick={() => setSelectedNode('lb')}
                className={`px-5 py-2.5 ${isDark ? 'bg-gray-900 border text-xs font-mono rounded-xl transition-all hover:-translate-y-0.5 hover:border-blue-300 cursor-pointer' : 'bg-white border-slate-200 text-slate-700 text-xs font-mono rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 cursor-pointer'} ${
                  selectedNode === 'lb'
                    ? (isDark ? 'border-blue-500 text-blue-400 shadow-md shadow-blue-500/10' : 'border-blue-500 text-blue-800 ring-2 ring-blue-500/20')
                    : (isDark ? 'border-gray-800 text-gray-300' : '')
                }`}
              >
                🔀 Load Balancer
              </button>
              <div className={isDark ? 'w-0.5 h-6 bg-gray-800' : 'w-0.5 h-6 bg-slate-300'} />
              {/* API Gateway */}
              <button
                onClick={() => setSelectedNode('ag')}
                className={`px-5 py-2.5 ${isDark ? 'bg-gray-900 border text-xs font-mono rounded-xl transition-all hover:-translate-y-0.5 hover:border-blue-300 cursor-pointer' : 'bg-white border-slate-200 text-slate-700 text-xs font-mono rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 cursor-pointer'} ${
                  selectedNode === 'ag'
                    ? (isDark ? 'border-blue-500 text-blue-400 shadow-md shadow-blue-500/10' : 'border-blue-500 text-blue-800 ring-2 ring-blue-500/20')
                    : (isDark ? 'border-gray-800 text-gray-300' : '')
                }`}
              >
                🚧 API Gateway
              </button>
              <div className={isDark ? 'w-0.5 h-6 bg-gray-800' : 'w-0.5 h-6 bg-slate-300'} />
              {/* Parallel branches for Cache and Microservices */}
              <div className="flex justify-center items-center gap-6 w-full">
                <button
                  onClick={() => setSelectedNode('cache')}
                  className={`px-4 py-2.5 ${isDark ? 'bg-gray-900 border text-xs font-mono rounded-xl transition-all hover:-translate-y-0.5 hover:border-blue-300 cursor-pointer' : 'bg-white border-slate-200 text-slate-700 text-xs font-mono rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 cursor-pointer'} ${
                    selectedNode === 'cache'
                      ? (isDark ? 'border-blue-500 text-blue-400 shadow-md shadow-blue-500/10' : 'border-blue-500 text-blue-800 ring-2 ring-blue-500/20')
                      : (isDark ? 'border-gray-800 text-gray-300' : '')
                  }`}
                >
                  ⚡ Redis Cache
                </button>
                <div className={isDark ? 'w-12 h-0.5 bg-gray-800' : 'w-12 h-0.5 bg-slate-300'} />
                <button
                  onClick={() => setSelectedNode('ms')}
                  className={`px-4 py-2.5 ${isDark ? 'bg-gray-900 border text-xs font-mono rounded-xl transition-all hover:-translate-y-0.5 hover:border-blue-300 cursor-pointer' : 'bg-white border-slate-200 text-slate-700 text-xs font-mono rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 cursor-pointer'} ${
                    selectedNode === 'ms'
                      ? (isDark ? 'border-blue-500 text-blue-400 shadow-md shadow-blue-500/10' : 'border-blue-500 text-blue-800 ring-2 ring-blue-500/20')
                      : (isDark ? 'border-gray-800 text-gray-300' : '')
                  }`}
                >
                  ⚙ Microservices
                </button>
              </div>
              <div className={isDark ? 'w-0.5 h-6 bg-gray-800' : 'w-0.5 h-6 bg-slate-300'} />
              {/* Database */}
              <button
                onClick={() => setSelectedNode('db')}
                className={`px-5 py-2.5 ${isDark ? 'bg-gray-900 border text-xs font-mono rounded-xl transition-all hover:-translate-y-0.5 hover:border-blue-300 cursor-pointer' : 'bg-white border-slate-200 text-slate-700 text-xs font-mono rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 cursor-pointer'} ${
                  selectedNode === 'db'
                    ? (isDark ? 'border-blue-500 text-blue-400 shadow-md shadow-blue-500/10' : 'border-blue-500 text-blue-800 ring-2 ring-blue-500/20')
                    : (isDark ? 'border-gray-800 text-gray-300' : '')
                }`}
              >
                💾 Primary PostgreSQL Database
              </button>
            </div>
          </div>

          {/* Right side node detail analysis */}
          <div className="lg:col-span-4">
            {selectedNode ? (
              <div className={`p-6 ${cardStyle} space-y-4 shadow-sm`}>
                {(() => {
                  const node = systemArchitectures.find((n) => n.id === selectedNode);
                  if (!node) return null;
                  return (
                    <>
                      <div className={`pb-2.5 border-b ${isDark ? 'border-gray-800/60' : 'border-slate-100'}`}>
                        <span className="text-[10px] font-semibold text-blue-500 uppercase font-mono tracking-wider block">Node Inspector</span>
                        <h4 className={`font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{node.name}</h4>
                      </div>
                      <p className={`text-xs leading-relaxed font-light ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>{node.desc}</p>
                      <div className={`p-4 ${isDark ? 'bg-blue-900/10 border border-blue-800 text-gray-300' : 'bg-blue-50 border border-blue-100 text-slate-700'} rounded-2xl text-xs space-y-1.5 leading-relaxed font-light`}>
                        <span className="font-semibold text-blue-500 block text-[9px] uppercase tracking-wider">Operational Guidelines</span>
                        <p>{node.details}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className={`p-8 ${isDark ? 'bg-gray-900/10 border border-gray-800/60 text-gray-500' : 'bg-slate-50 border border-slate-200 text-slate-500'} rounded-3xl text-center space-y-3.5 text-xs flex flex-col items-center justify-center min-h-[300px]`}>
                <span className="text-4xl block">🔍</span>
                <h4 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-slate-900'}`}>No Node Selected</h4>
                <p className="max-w-[240px] leading-relaxed font-light">
                  Click on any structural element in the architecture sandbox layout to inspect full design parameters.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
