
import { AIAgent, Message } from "@/types";

// Function to format messages for each AI platform
export const formatMessagesForPlatform = (
  agent: AIAgent,
  currentPrompt: string,
  previousMessages: Message[]
): any => {
  // Convert messages to the format expected by each API
  switch (agent.platform) {
    case 'OpenAI':
      return previousMessages.map(msg => ({
        role: msg.agentId === 'user' ? 'user' : 'assistant',
        content: msg.content
      })).concat([{ role: 'user', content: currentPrompt }]);
    
    case 'Anthropic':
      return {
        messages: previousMessages.map(msg => ({
          role: msg.agentId === 'user' ? 'user' : 'assistant',
          content: msg.content
        })).concat([{ role: 'user', content: currentPrompt }])
      };
    
    case 'Google':
      return {
        contents: previousMessages.map(msg => ({
          role: msg.agentId === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        })).concat([{ role: 'user', parts: [{ text: currentPrompt }] }])
      };
    
    // Default format for other platforms
    default:
      return {
        messages: previousMessages.map(msg => ({
          role: msg.agentId === 'user' ? 'user' : 'assistant',
          content: msg.content
        })).concat([{ role: 'user', content: currentPrompt }])
      };
  }
};

// Implementation of platform-specific API calls
export const callOpenAI = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  console.log('Calling OpenAI API with:', { systemPrompt, messagesCount: messages.length });
  // Mock implementation for demo purposes
  return `This is a mock response from OpenAI. System prompt: ${systemPrompt.substring(0, 20)}...`;
};

export const callAnthropic = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  console.log('Calling Anthropic API with:', { systemPrompt, messages: messages });
  // Mock implementation for demo purposes
  return `This is a mock response from Anthropic. System prompt: ${systemPrompt.substring(0, 20)}...`;
};

export const callGoogle = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  console.log('Calling Google API with:', { systemPrompt, messages: messages });
  // Mock implementation for demo purposes
  return `This is a mock response from Google. System prompt: ${systemPrompt.substring(0, 20)}...`;
};

export const callMeta = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  console.log('Calling Meta API with:', { systemPrompt, messages: messages });
  // Mock implementation for demo purposes
  return `This is a mock response from Meta. System prompt: ${systemPrompt.substring(0, 20)}...`;
};

export const callCanva = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  console.log('Calling Canva API with:', { systemPrompt, messages: messages });
  // Mock implementation for demo purposes
  return `This is a mock response from Canva. System prompt: ${systemPrompt.substring(0, 20)}...`;
};

export const callSuno = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  console.log('Calling Suno API with:', { systemPrompt, messages: messages });
  // Mock implementation for demo purposes
  return `This is a mock response from Suno, creating a song based on your description. System prompt: ${systemPrompt.substring(0, 20)}...`;
};

export const callLovable = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  console.log('Calling Lovable API with:', { systemPrompt, messages: messages });
  // Mock implementation for demo purposes
  return `This is a mock response from Lovable. System prompt: ${systemPrompt.substring(0, 20)}...`;
};

export const callLocalAI = async (
  messages: any,
  systemPrompt: string
): Promise<string> => {
  console.log('Using local AI processing with:', { systemPrompt, messages: messages });
  // Mock implementation for demo purposes
  return `This is a mock response from a local AI model. System prompt: ${systemPrompt.substring(0, 20)}...`;
};

export const callCustomAI = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  console.log('Calling custom API endpoint with:', { systemPrompt, messages: messages });
  // Mock implementation for demo purposes
  return `This is a mock response from a custom AI endpoint. System prompt: ${systemPrompt.substring(0, 20)}...`;
};

// Function to call external AI APIs based on platform
export const callExternalAI = async (
  agent: AIAgent,
  prompt: string,
  previousMessages: Message[]
): Promise<string> => {
  // Check if API key is available
  if (!agent.apiKey && agent.platform !== 'Local') {
    console.warn(`No API key provided for ${agent.name} (${agent.platform})`);
    return `I'm ${agent.name}, but I can't respond properly because no API key was provided. Please add an API key in my settings.`;
  }

  // Convert previous messages to the format expected by each API
  const formattedMessages = formatMessagesForPlatform(agent, prompt, previousMessages);

  try {
    switch (agent.platform) {
      case 'OpenAI':
        return await callOpenAI(agent.apiKey!, formattedMessages, agent.systemPrompt);
      
      case 'Anthropic':
        return await callAnthropic(agent.apiKey!, formattedMessages, agent.systemPrompt);
      
      case 'Google':
        return await callGoogle(agent.apiKey!, formattedMessages, agent.systemPrompt);
      
      case 'Meta':
        return await callMeta(agent.apiKey!, formattedMessages, agent.systemPrompt);
      
      case 'Canva':
        return await callCanva(agent.apiKey!, formattedMessages, agent.systemPrompt);
      
      case 'Suno':
        return await callSuno(agent.apiKey!, formattedMessages, agent.systemPrompt);
      
      case 'Lovable':
        return await callLovable(agent.apiKey!, formattedMessages, agent.systemPrompt);
      
      case 'Local':
        // For local, we'll use a client-side model or fallback to mock
        return await callLocalAI(formattedMessages, agent.systemPrompt);
      
      case 'Other':
      default:
        // Generic API call for custom endpoints
        return await callCustomAI(agent.apiKey!, formattedMessages, agent.systemPrompt);
    }
  } catch (error) {
    console.error(`Error calling ${agent.platform} API:`, error);
    throw new Error(`Failed to get response from ${agent.platform}: ${(error as Error).message}`);
  }
};
