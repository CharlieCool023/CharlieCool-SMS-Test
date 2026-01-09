
import React, { useState, useEffect } from 'react';
import { SenderId, TermiiChannel, LogEntry } from '../types';
import { sendOtp, verifyOtp } from '../services/termiiService';

interface OtpModuleProps {
  availableSenders: SenderId[];
  channel: TermiiChannel;
  onLog: (type: LogEntry['type'], endpoint: string, payload: any) => void;
}

const OtpModule: React.FC<OtpModuleProps> = ({ availableSenders, channel, onLog }) => {
  const [sender, setSender] = useState<SenderId>(availableSenders[0] || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('Your Charles Test code is < 1234 >. Valid for 10 minutes.');
  const [otpSent, setOtpSent] = useState(false);
  const [pinId, setPinId] = useState('');
  const [pinValue, setPinValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!availableSenders.includes(sender)) {
      setSender(availableSenders[0] || '');
    }
  }, [availableSenders, sender]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !sender) return;

    const cleanPhone = phoneNumber.replace('+', '').trim();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Latest Termii V3 OTP structure
    const payload = {
      to: cleanPhone,
      from: sender,
      channel: channel,
      pin_attempts: 3,
      pin_time_to_live: 10,
      pin_length: 6,
      pin_type: 'NUMERIC',
      pin_placeholder: '< 1234 >',
      message_text: messageTemplate,
      message_type: 'NUMERIC'
    };

    onLog('REQUEST', '/api/sms/otp/send', payload);

    try {
      const result = await sendOtp(payload);
      onLog('RESPONSE', '/api/sms/otp/send', result.data);

      if (result.status === 200 && (result.data.pinId || result.data.pin_id || result.data.status === 'success')) {
        setPinId(result.data.pinId || result.data.pin_id);
        setOtpSent(true);
        setSuccess('OTP sent successfully!');
      } else {
        const msg = result.errorMessage || 'Failed to trigger OTP.';
        setError(msg);
      }
    } catch (err: any) {
      setError(err.message);
      onLog('ERROR', '/api/sms/otp/send', { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinValue) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const verifyPayload = { pin_id: pinId, pin: pinValue };
    onLog('REQUEST', '/api/sms/otp/verify', verifyPayload);

    try {
      const result = await verifyOtp(verifyPayload);
      onLog('RESPONSE', '/api/sms/otp/verify', result.data);

      if (result.data.verified === true || result.data.verified === 'true') {
        setSuccess('OTP verified successfully!');
      } else {
        setError(result.errorMessage || 'Verification failed. Incorrect PIN.');
      }
    } catch (err: any) {
      setError(err.message);
      onLog('ERROR', '/api/sms/otp/verify', { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">OTP Verification Cycle</h3>
        <p className="text-sm text-slate-500">Generate a system OTP and verify it in one test sequence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        <div className={`p-6 rounded-2xl border-2 transition-all ${!otpSent ? 'border-indigo-100 bg-indigo-50/30' : 'border-slate-100 opacity-60'}`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">1</span>
            <h4 className="font-bold text-slate-800">Trigger OTP</h4>
          </div>

          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Sender ID</label>
              <select 
                value={sender}
                disabled={otpSent}
                onChange={(e) => setSender(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-50 transition-all font-bold text-slate-700"
                required
              >
                {availableSenders.map(id => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Mobile Number</label>
              <input 
                type="text" 
                placeholder="234..."
                value={phoneNumber}
                disabled={otpSent}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-50 transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message Template</label>
                <span className="text-[9px] font-medium text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">Required: &lt; 1234 &gt;</span>
              </div>
              <textarea 
                rows={3}
                placeholder="Your code is < 1234 >"
                value={messageTemplate}
                disabled={otpSent}
                onChange={(e) => setMessageTemplate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-50 transition-all text-sm resize-none"
              />
              <p className="mt-1 text-[10px] text-slate-400 italic">Termii replaces <code className="text-indigo-600 font-bold px-1 rounded bg-slate-100">&lt; 1234 &gt;</code> with the generated PIN.</p>
            </div>

            <button 
              type="submit" 
              disabled={loading || otpSent}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all text-sm shadow-md"
            >
              {loading ? 'Processing...' : 'Send OTP'}
            </button>
          </form>
        </div>

        <div className={`p-6 rounded-2xl border-2 transition-all ${otpSent ? 'border-indigo-100 bg-indigo-50/30' : 'border-slate-100 opacity-60'}`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">2</span>
            <h4 className="font-bold text-slate-800">Verify Code</h4>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Enter PIN</label>
              <input 
                type="text" 
                placeholder="6 digits"
                maxLength={10}
                value={pinValue}
                disabled={!otpSent}
                onChange={(e) => setPinValue(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-50 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button 
                type="submit" 
                disabled={loading || !otpSent}
                className="flex-grow py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all text-sm shadow-md"
              >
                Verify
              </button>
              <button 
                type="button"
                onClick={() => { setOtpSent(false); setPinValue(''); setPinId(''); setSuccess(null); setError(null); }}
                className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-all text-sm"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl space-y-2 animate-fade-in">
          <div className="flex items-center gap-3 text-rose-700 text-sm font-bold">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            <span>{error}</span>
          </div>
          {error.includes('Country Inactive') && (
            <div className="ml-8 text-xs text-rose-600 font-medium leading-relaxed">
              <strong>Tip:</strong> Go to your <a href="https://termii.com/dashboard" target="_blank" className="underline font-bold">Termii Dashboard</a>, navigate to <strong>Settings > Country Activation</strong>, and ensure Nigeria is enabled for the <strong>Token</strong> service.
            </div>
          )}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-700 text-sm font-bold animate-fade-in">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          {success}
        </div>
      )}
    </div>
  );
};

export default OtpModule;
