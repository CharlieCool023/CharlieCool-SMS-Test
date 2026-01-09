
import { 
  TermiiSmsRequest, 
  TermiiOtpRequest, 
  TermiiVerifyRequest 
} from '../types';

// Using a CORS proxy to allow the browser to communicate with Termii's server-side API
const PROXY = 'https://corsproxy.io/?';
const BASE_URL = 'https://v3.api.termii.com/api';
const API_KEY = 'TLRJyguLIdAWbMTbBbSYaLFGitIGyGUmIUEfEKAEoZqOiqYONlFRPqnKGfxUiR';

/**
 * Helper to parse Termii's sometimes double-encoded error strings
 */
const parseTermiiError = (data: any): string => {
  if (!data) return 'Unknown error';
  
  // Handle the case where Termii returns a string like "400 : {"code":400...}"
  if (typeof data.message === 'string' && data.message.includes('{')) {
    try {
      const jsonPart = data.message.split(' : ')[1] || data.message;
      const parsed = JSON.parse(jsonPart);
      return parsed.message || data.message;
    } catch (e) {
      return data.message;
    }
  }
  
  return data.message || data.error || 'Request failed';
};

export const sendSms = async (payload: Omit<TermiiSmsRequest, 'api_key' | 'type'>) => {
  const fullPayload: TermiiSmsRequest = {
    ...payload,
    api_key: API_KEY,
    type: 'plain'
  };

  try {
    const response = await fetch(`${PROXY}${encodeURIComponent(`${BASE_URL}/sms/send`)}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(fullPayload)
    });

    const responseData = await response.json();
    return {
      status: response.status,
      data: responseData,
      errorMessage: response.status !== 200 ? parseTermiiError(responseData) : null,
      request: fullPayload
    };
  } catch (err: any) {
    return { status: 500, data: null, errorMessage: err.message, request: fullPayload };
  }
};

export const sendOtp = async (payload: any) => {
  const fullPayload = {
    ...payload,
    api_key: API_KEY
  };

  try {
    const response = await fetch(`${PROXY}${encodeURIComponent(`${BASE_URL}/sms/otp/send`)}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(fullPayload)
    });

    const responseData = await response.json();
    return {
      status: response.status,
      data: responseData,
      errorMessage: response.status !== 200 ? parseTermiiError(responseData) : null,
      request: fullPayload
    };
  } catch (err: any) {
    return { status: 500, data: null, errorMessage: err.message, request: fullPayload };
  }
};

export const verifyOtp = async (payload: Omit<TermiiVerifyRequest, 'api_key'>) => {
  const fullPayload: TermiiVerifyRequest = {
    ...payload,
    api_key: API_KEY
  };

  try {
    const response = await fetch(`${PROXY}${encodeURIComponent(`${BASE_URL}/sms/otp/verify`)}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(fullPayload)
    });

    const responseData = await response.json();
    return {
      status: response.status,
      data: responseData,
      errorMessage: response.status !== 200 ? parseTermiiError(responseData) : null,
      request: fullPayload
    };
  } catch (err: any) {
    return { status: 500, data: null, errorMessage: err.message, request: fullPayload };
  }
};
