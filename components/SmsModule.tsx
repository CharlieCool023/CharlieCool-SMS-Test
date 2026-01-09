
import React, { useState, useEffect } from 'react';
import { SenderId, TermiiChannel, LogEntry } from '../types';
import { sendSms } from '../services/termiiService';

interface SmsModuleProps {
  availableSenders: SenderId[];
  channel: TermiiChannel;
  onLog: (type: LogEntry['type'], endpoint: string, payload: any) => void;
}

const SmsModule: React.FC<SmsModuleProps> = ({ availableSenders, channel, onLog }) => {
  const [sender, setSender] = useState<SenderId>(availableSenders[0] || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!availableSenders.includes(sender)) {
      setSender(availableSenders[0] || '');
    }
  }, [availableSenders, sender]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !message || !sender) return;

    const cleanPhone = phoneNumber.replace('+', '').trim();
    setLoading(true);
    setSuccess(null);
    setError(null);
    
    onLog('REQUEST', '/api/sms/send', { to: cleanPhone, from: sender, sms: message, channel });

    try {
      const result = await sendSms({
        to: cleanPhone,
        from: sender,
        sms: message,
        channel: channel
      });

      onLog('RESPONSE', '/api/sms/send', result.data);

      if (result.status === 200 && (result.data.message === 'Successfully Sent' || result.data.status === 'success')) {
        setSuccess('Message sent successfully!');
        setMessage('');
      } else {
        setError(result.errorMessage || 'Failed to send message.');
      }
    } catch (err: any) {
      setError(err.message);
      onLog('ERROR', '/api/sms/send', { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-1">Send Manual Message</h3>
        <p className="text-sm text-slate-500">Test simple text delivery using selected sender ID and channel.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sender ID</label>
            <select 
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700"
              required
            >
              {availableSenders.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recipient Phone</label>
            <input 
              type="text" 
              placeholder="e.g., 234..."
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message Content</label>
          <textarea 
            rows={4}
            placeholder="Enter message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
            required
          />
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl space-y-2 animate-fade-in">
            <div className="flex items-center gap-3 text-rose-700 text-sm font-bold">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-700 text-sm font-bold animate-fade-in">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            {success}
          </div>
        )}

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          {loading ? 'Processing...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default SmsModule;
