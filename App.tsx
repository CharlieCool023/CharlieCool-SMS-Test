
import React, { useState, useCallback } from 'react';
import { 
  TermiiChannel, 
  SenderId, 
  DEFAULT_SENDERS,
  LogEntry 
} from './types';
import SmsModule from './components/SmsModule';
import OtpModule from './components/OtpModule';
import DeveloperLog from './components/DeveloperLog';
import { SpeedInsights } from '@vercel/speed-insights/react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sms' | 'otp'>('sms');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [availableSenders, setAvailableSenders] = useState<SenderId[]>(DEFAULT_SENDERS);
  const [newSenderInput, setNewSenderInput] = useState('');
  const [globalChannel, setGlobalChannel] = useState<TermiiChannel>(TermiiChannel.DND);

  const addLog = useCallback((type: LogEntry['type'], endpoint: string, payload: any) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      type,
      endpoint,
      payload
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  const handleAddSender = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSenderInput.trim().toUpperCase();
    if (trimmed && !availableSenders.includes(trimmed)) {
      setAvailableSenders(prev => [...prev, trimmed]);
      setNewSenderInput('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <SpeedInsights />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">Charles Test Guide</h1>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Termii API Testing Playground</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
             <form onSubmit={handleAddSender} className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-sm">
               <input 
                 type="text" 
                 placeholder="New Sender ID..."
                 value={newSenderInput}
                 onChange={(e) => setNewSenderInput(e.target.value)}
                 className="bg-transparent text-[11px] font-bold px-3 py-1 outline-none text-slate-700 w-32 placeholder:text-slate-400"
               />
               <button 
                 type="submit"
                 className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors uppercase tracking-tight"
               >
                 Add
               </button>
             </form>

            <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex flex-col px-3 py-1">
                <span className="text-[9px] uppercase font-bold text-slate-400 leading-none mb-1">Route</span>
                <select 
                  value={globalChannel}
                  onChange={(e) => setGlobalChannel(e.target.value as TermiiChannel)}
                  className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <option value={TermiiChannel.DND}>DND (Priority)</option>
                  <option value={TermiiChannel.GENERIC}>Generic</option>
                  <option value={TermiiChannel.WHATSAPP}>WhatsApp</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Testing Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden animate-fade-in">
            <div className="flex p-2 bg-slate-50 border-b border-slate-200">
              <button 
                onClick={() => setActiveTab('sms')}
                className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${activeTab === 'sms' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
              >
                Manual SMS
              </button>
              <button 
                onClick={() => setActiveTab('otp')}
                className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${activeTab === 'otp' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
              >
                OTP Verification
              </button>
            </div>
            
            <div className="p-8">
              {activeTab === 'sms' ? (
                <SmsModule 
                  availableSenders={availableSenders} 
                  channel={globalChannel} 
                  onLog={addLog} 
                />
              ) : (
                <OtpModule 
                  availableSenders={availableSenders} 
                  channel={globalChannel} 
                  onLog={addLog} 
                />
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-slate-50 border border-indigo-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-indigo-900 font-bold mb-3 flex items-center gap-2">
              <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Developer Guide
            </h3>
            <div className="space-y-3 text-indigo-800/80 text-sm leading-relaxed font-medium">
              <p>
                The <strong>DND Channel</strong> (Do Not Disturb) is mandatory for transactional content in high-compliance regions. It bypasses user-level blocks for critical messages.
              </p>
              <p>
                Use <strong>SHANONOBANK</strong> or <strong>LOOPFREIGHT</strong> for pre-approved testing. You can also add your own verified Sender ID using the header tool.
              </p>
            </div>
          </div>
        </div>

        {/* Debug Log Panel */}
        <div className="lg:col-span-5 flex flex-col h-[calc(100vh-12rem)] lg:sticky lg:top-28 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">HTTP Traffic Console</h2>
            <button 
              onClick={() => setLogs([])}
              className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all border border-slate-200"
            >
              Clear Buffer
            </button>
          </div>
          <DeveloperLog logs={logs} />
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-4 opacity-40 grayscale hover:grayscale-0 transition-all">
            <span className="text-xs font-black tracking-tighter text-slate-900">TERMII VERIFIED</span>
            <span className="text-xs font-black tracking-tighter text-slate-900">DND COMPLIANT</span>
            <span className="text-xs font-black tracking-tighter text-slate-900">SSL SECURE</span>
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            Charles Test Guide &copy; {new Date().getFullYear()} &bull; For Educational Use Only
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;