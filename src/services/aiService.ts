import { AIAgent, Message } from "@/types";
import { toast } from "sonner";

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

// Implementation of OpenAI API call
export const callOpenAI = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  try {
    console.log('Calling OpenAI API with:', { systemPrompt, messagesCount: messages.length });
    
    // Add system message to the beginning of the messages array
    const messagesWithSystem = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messagesWithSystem,
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from OpenAI');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

// Implementation of Anthropic API call
export const callAnthropic = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  try {
    console.log('Calling Anthropic API with:', { systemPrompt, messages });
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        system: systemPrompt,
        messages: messages.messages,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from Anthropic');
    }
    
    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Anthropic API error:', error);
    throw error;
  }
};

// Implementation of Google API call
export const callGoogle = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  try {
    console.log('Calling Google API with:', { systemPrompt, messages });
    
    // Add system instruction to the beginning of the contents array
    const contentsWithSystem = [
      { role: 'system', parts: [{ text: systemPrompt }] },
      ...messages.contents
    ];
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: contentsWithSystem,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from Google');
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Google API error:', error);
    throw error;
  }
};

// Keep other mock implementations for services that we haven't implemented yet
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
    // Add analytics for tracking which AI is being called
    console.log(`Calling ${agent.platform} API for agent: ${agent.name}`);
    
    // Show loading toast
    const toastId = toast.loading(`${agent.name} is thinking...`);
    
    let result: string;
    
    switch (agent.platform) {
      case 'OpenAI':
        result = await callOpenAI(agent.apiKey!, formattedMessages, agent.systemPrompt);
        break;
      
      case 'Anthropic':
        result = await callAnthropic(agent.apiKey!, formattedMessages, agent.systemPrompt);
        break;
      
      case 'Google':
        result = await callGoogle(agent.apiKey!, formattedMessages, agent.systemPrompt);
        break;
      
      case 'Meta':
        result = await callMeta(agent.apiKey!, formattedMessages, agent.systemPrompt);
        break;
      
      case 'Canva':
        result = await callCanva(agent.apiKey!, formattedMessages, agent.systemPrompt);
        break;
      
      case 'Suno':
        result = await callSuno(agent.apiKey!, formattedMessages, agent.systemPrompt);
        break;
      
      case 'Lovable':
        result = await callLovable(agent.apiKey!, formattedMessages, agent.systemPrompt);
        break;
      
      case 'Local':
        result = await callLocalAI(formattedMessages, agent.systemPrompt);
        break;
      
      case 'Other':
      default:
        result = await callCustomAI(agent.apiKey!, formattedMessages, agent.systemPrompt);
        break;
    }
    
    // Dismiss loading toast
    toast.dismiss(toastId);
    
    return result;
  } catch (error) {
    console.error(`Error calling ${agent.platform} API:`, error);
    toast.error(`Failed to get response from ${agent.platform}: ${(error as Error).message}`);
    throw error;
  }
};
