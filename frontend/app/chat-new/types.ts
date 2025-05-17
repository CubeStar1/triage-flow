import { Message as AIMessage } from 'ai';

// Extend the AI SDK Message type with our custom fields
export interface Message extends AIMessage {
  tabular_data?: Record<string, any>[];
}

export interface Conversation {
  id: string;
  title: string;
  updated_at: string;
  visibility?: 'public' | 'private';
  userId?: string;
}

// Re-export the AI SDK types we use
export type { CreateMessage, ChatRequest, ChatRequestOptions } from 'ai';

// Utility type for API responses
export interface APIResponse {
  error?: string;
  message?: string;
  data?: any;
} 

