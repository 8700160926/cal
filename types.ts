export enum CalculatorMode {
  STANDARD = 'STANDARD',
  SCIENTIFIC = 'SCIENTIFIC',
  AI_CHAT = 'AI_CHAT'
}

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  isAi?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}