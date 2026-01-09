
export enum TermiiChannel {
  DND = 'dnd',
  GENERIC = 'generic',
  WHATSAPP = 'whatsapp'
}

// Changed to a type to support custom sender IDs
export type SenderId = string;

export const DEFAULT_SENDERS: SenderId[] = ['SHANONOBANK', 'LOOPFREIGHT'];

export interface TermiiSmsRequest {
  to: string;
  from: string;
  sms: string;
  type: string;
  channel: TermiiChannel;
  api_key: string;
}

export interface TermiiOtpRequest {
  api_key: string;
  message_type: 'ALPHANUMERIC' | 'NUMERIC';
  to: string;
  from: string;
  channel: TermiiChannel;
  pin_attempts: number;
  pin_time_to_live: number;
  pin_length: number;
  pin_placeholder: string;
  message_text: string;
}

export interface TermiiVerifyRequest {
  api_key: string;
  pin_id: string;
  pin: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'REQUEST' | 'RESPONSE' | 'ERROR';
  endpoint: string;
  payload: any;
}
