
import { AIAgent, Message, AIPlatform } from "@/types";
import { generateId } from "@/utils/helpers";
import { toast } from "sonner";

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

// Helper function to format messages based on platform requirements
const formatMessagesForPlatform = (
  agent: AIAgent,
  prompt: string,
  previousMessages: Message[]
) => {
  // Convert app's message format to the format expected by each API
  const messages = previousMessages.map(msg => {
    const msgAgent = msg.agentId === agent.id ? "assistant" : "user";
    return {
      role: msgAgent,
      content: msg.content
    };
  });

  // Add the current prompt as the last user message
  messages.push({
    role: "user",
    content: prompt
  });

  return messages;
};

// OpenAI API implementation
const callOpenAI = async (
  apiKey: string,
  messages: any[],
  systemPrompt: string
): Promise<string> => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Unknown error from OpenAI");
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

// Anthropic API implementation
const callAnthropic = async (
  apiKey: string,
  messages: any[],
  systemPrompt: string
): Promise<string> => {
  const anthropicMessages = messages.map(msg => ({
    role: msg.role === "assistant" ? "assistant" : "user",
    content: msg.content
  }));

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-opus-20240229",
      system: systemPrompt,
      messages: anthropicMessages,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Unknown error from Anthropic");
  }

  const data = await response.json();
  return data.content[0].text;
};

// Google API implementation
const callGoogle = async (
  apiKey: string,
  messages: any[],
  systemPrompt: string
): Promise<string> => {
  const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\n${messages[messages.length - 1].content}` }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        apiKey: apiKey
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Unknown error from Google AI");
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

// Placeholder implementations for other services
// These would need to be implemented according to each service's API docs

const callMeta = async (apiKey: string, messages: any[], systemPrompt: string): Promise<string> => {
  // Implement Meta API call
  // This is a mock implementation - you would replace with actual Meta API
  console.log("Meta API called with key:", apiKey);
  return "This is a placeholder response from Meta AI. Implement the actual API integration.";
};

const callCanva = async (apiKey: string, messages: any[], systemPrompt: string): Promise<string> => {
  // Implement Canva API call
  // This is a mock implementation - you would replace with actual Canva API
  console.log("Canva API called with key:", apiKey);
  return "This is a placeholder response from Canva AI. Implement the actual API integration.";
};

const callLovable = async (apiKey: string, messages: any[], systemPrompt: string): Promise<string> => {
  // Implement Lovable API call
  // This is a mock implementation - you would replace with actual Lovable API
  console.log("Lovable API called with key:", apiKey);
  return "This is a placeholder response from Lovable AI. Implement the actual API integration.";
};

const callLocalAI = async (messages: any[], systemPrompt: string): Promise<string> => {
  // For local AI models (could use something like WebLLM or other client-side models)
  // For now, return a simulated response
  return "This is a local AI response. In a real implementation, this would use a client-side model.";
};

const callCustomAI = async (apiKey: string, messages: any[], systemPrompt: string): Promise<string> => {
  // Generic implementation for custom API endpoints
  // This would need configuration for the specific endpoint
  console.log("Custom API called with key:", apiKey);
  return "This is a placeholder for a custom AI integration. Configure the endpoint and authentication as needed.";
};
