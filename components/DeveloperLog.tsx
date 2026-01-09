
import React from 'react';
import { LogEntry } from '../types';

interface DeveloperLogProps {
  logs: LogEntry[];
}

const DeveloperLog: React.FC<DeveloperLogProps> = ({ logs }) => {
  return (
    <div className="flex-grow bg-slate-900 rounded-2xl p-4 overflow-y-auto border border-slate-800 shadow-xl scrollbar-hide">
      {logs.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3 p-8 opacity-40">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-medium italic">Waiting for API traffic...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="border-b border-slate-800 pb-4 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    log.type === 'REQUEST' ? 'bg-blue-900/40 text-blue-400 border border-blue-800' :
                    log.type === 'RESPONSE' ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-800' :
                    'bg-rose-900/40 text-rose-400 border border-rose-800'
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{log.endpoint}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-600 uppercase">{log.timestamp}</span>
              </div>
              <pre className="code-font text-[11px] leading-relaxed text-slate-300 bg-slate-950/50 p-3 rounded-lg border border-slate-800 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(log.payload, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeveloperLog;
