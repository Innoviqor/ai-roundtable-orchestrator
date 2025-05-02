
export type AIPlatform = 
  | 'OpenAI' 
  | 'Anthropic' 
  | 'Google' 
  | 'Lovable' 
  | 'Local' 
  | 'Meta' 
  | 'Canva'
  | 'Other';

export type AgentType = 'chat' | 'task';

export type ConversationMode = 'sequential' | 'simultaneous';

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  systemPrompt: string;
  platform: AIPlatform;
  apiKey?: string;
  type: AgentType;
  avatar?: string;
}

export interface Message {
  id: string;
  agentId: string;
  content: string;
  timestamp: number;
  status?: 'thinking' | 'complete' | 'error';
}

export interface Project {
  id: string;
  name: string;
  prompt: string;
  agents: AIAgent[];
  conversationMode: ConversationMode;
  messages: Message[];
  created: number;
  updated: number;
}
