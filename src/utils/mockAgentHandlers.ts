
import { AIAgent, Message } from "@/types";
import { generateId, simulateAgentResponse } from "./helpers";

export const callAgent = async (
  agent: AIAgent,
  prompt: string,
  previousMessages: Message[]
): Promise<Message> => {
  try {
    // In a real app, we would make actual API calls to different services
    // For now, we'll simulate responses
    const content = await simulateAgentResponse(agent, prompt, previousMessages);
    
    return {
      id: generateId(),
      agentId: agent.id,
      content,
      timestamp: Date.now(),
      status: 'complete'
    };
  } catch (error) {
    console.error(`Error calling agent ${agent.name}:`, error);
    return {
      id: generateId(),
      agentId: agent.id,
      content: `Error: Failed to get response from ${agent.name}`,
      timestamp: Date.now(),
      status: 'error'
    };
  }
};

export const mockPlatformExamplePrompts: Record<string, string> = {
  'OpenAI': 'You are a helpful assistant. Think step-by-step and provide clear, accurate information.',
  'Anthropic': 'You are Claude, an AI assistant created by Anthropic. Be helpful, harmless, and honest.',
  'Google': 'You are Gemini, Google's helpful AI. Provide informative and balanced responses.',
  'Lovable': 'You are Lovable, an AI built to design interfaces and write code. Focus on producing beautiful UI/UX.',
  'Meta': 'You are Meta AI, designed to be helpful, harmless, and honest in all your interactions.',
  'Canva': 'You are Canva AI. Create and suggest beautiful designs with a focus on aesthetics and brand consistency.',
  'Local': 'You are running locally on the user's machine. Be efficient with resources while providing helpful responses.',
  'Other': 'You are an AI assistant. Help the user accomplish their goals by providing useful responses.'
};

export const getDefaultAgents = (): AIAgent[] => [
  {
    id: generateId(),
    name: 'Dev GPT',
    role: 'Developer',
    systemPrompt: mockPlatformExamplePrompts['OpenAI'] + ' Focus on writing clean, efficient code and providing technical solutions.',
    platform: 'OpenAI',
    type: 'chat'
  },
  {
    id: generateId(),
    name: 'Design Claude',
    role: 'Designer',
    systemPrompt: mockPlatformExamplePrompts['Anthropic'] + ' Focus on user experience, visual design, and aesthetics.',
    platform: 'Anthropic',
    type: 'chat'
  },
  {
    id: generateId(),
    name: 'Critical Thinker',
    role: 'Critic',
    systemPrompt: mockPlatformExamplePrompts['Google'] + ' Your job is to find flaws, edge cases, and potential improvements in the proposed solutions.',
    platform: 'Google',
    type: 'chat'
  }
];
