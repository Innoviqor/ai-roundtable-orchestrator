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
    case 'Groq':
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
    
    case 'Grok':
      return previousMessages.map(msg => ({
        role: msg.agentId === 'user' ? 'user' : 'assistant',
        content: msg.content
      })).concat([{ role: 'user', content: currentPrompt }]);

    case 'Perplexity':
      return {
        messages: previousMessages.map(msg => ({
          role: msg.agentId === 'user' ? 'user' : 'assistant',
          content: msg.content
        })).concat([{ role: 'user', content: currentPrompt }])
      };

    case 'Together':
    case 'Mistral':
      return previousMessages.map(msg => ({
        role: msg.agentId === 'user' ? 'user' : 'assistant',
        content: msg.content
      })).concat([{ role: 'user', content: currentPrompt }]);

    case 'Cohere':
      return {
        messages: previousMessages.map(msg => ({
          role: msg.agentId === 'user' ? 'user' : 'assistant',
          message: msg.content
        })).concat([{ role: 'user', message: currentPrompt }])
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

// OpenAI API call (gpt-4o-mini)
export const callOpenAI = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  try {
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

// Anthropic API call (Claude)
export const callAnthropic = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
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

// Google Gemini API call
export const callGoogle = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  try {
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

// Grok API call (X AI)
export const callGrok = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  try {
    const messagesWithSystem = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];
    
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-2',
        messages: messagesWithSystem,
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from Grok');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Grok API error:', error);
    throw error;
  }
};

// Perplexity API call (with web search)
export const callPerplexity = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: messages.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })).concat([{ role: 'system', content: systemPrompt }]),
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from Perplexity');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Perplexity API error:', error);
    throw error;
  }
};

// Together AI API call (Meta Llama, Mistral, etc)
export const callTogether = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  try {
    const messagesWithSystem = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];
    
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3-70b-chat-hf',
        messages: messagesWithSystem,
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from Together AI');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Together AI error:', error);
    throw error;
  }
};

// Groq API call (fast inference)
export const callGroq = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  try {
    const messagesWithSystem = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: messagesWithSystem,
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from Groq');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API error:', error);
    throw error;
  }
};

// Cohere API call
export const callCohere = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  try {
    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'command-r-plus',
        messages: messages.messages.map(msg => ({
          role: msg.role,
          message: msg.message
        })),
        system: systemPrompt
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from Cohere');
    }
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Cohere API error:', error);
    throw error;
  }
};

// Mistral API call
export const callMistral = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  try {
    const messagesWithSystem = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];
    
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: messagesWithSystem,
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from Mistral');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Mistral API error:', error);
    throw error;
  }
};

// AWS Bedrock (Claude via Bedrock)
export const callBedrock = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  try {
    // Bedrock requires AWS SDK, this is a placeholder
    // In production, use @aws-sdk/client-bedrock-runtime
    const messagesWithSystem = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];
    
    const response = await fetch('https://bedrock.us-east-1.amazonaws.com/model/anthropic.claude-3-5-sonnet-20241022-v1:0/invoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages: messagesWithSystem,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to get response from Bedrock');
    }
    
    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Bedrock API error:', error);
    throw error;
  }
};

// Suno API call (music generation)
export const callSuno = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  try {
    const prompt = typeof messages === 'string' ? messages : JSON.stringify(messages);
    
    const response = await fetch('https://api.suno.ai/api/generate/v2/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        tags: 'ai-generated',
        title: 'Generated Track',
        make_instrumental: false
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate music with Suno');
    }
    
    const data = await response.json();
    return `Music generated successfully. Track ID: ${data.id}. Listen at: https://suno.ai/song/${data.id}`;
  } catch (error) {
    console.error('Suno API error:', error);
    throw error;
  }
};

// Canva API call (design generation)
export const callCanva = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  try {
    const prompt = typeof messages === 'string' ? messages : JSON.stringify(messages);
    
    const response = await fetch('https://api.canva.com/rest/v1/designs/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        design_type: 'presentation',
        prompt: prompt,
        title: 'AI Generated Design'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create design with Canva');
    }
    
    const data = await response.json();
    return `Design created successfully. View at: ${data.design_url}`;
  } catch (error) {
    console.error('Canva API error:', error);
    throw error;
  }
};

// Lovable API call (Vercel AI / Web App Builder)
export const callLovable = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  try {
    const prompt = typeof messages === 'string' ? messages : JSON.stringify(messages);
    
    const response = await fetch('https://api.lovable.dev/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: `${systemPrompt}\n\n${prompt}`,
        framework: 'react',
        styled: true
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate with Lovable');
    }
    
    const data = await response.json();
    return `Web app generated successfully. Project: ${data.project_url}`;
  } catch (error) {
    console.error('Lovable API error:', error);
    throw error;
  }
};

// Replicate API call (image/video generation)
export const callReplicate = async (
  apiKey: string,
  messages: any,
  systemPrompt: string
): Promise<string> => {
  try {
    const prompt = typeof messages === 'string' ? messages : JSON.stringify(messages);
    
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: 'a00d0b8da8e84b2e9c4998cc2c0e153e635eef36d28d5184bb2eaa5a5cb49910',
        input: {
          prompt: prompt,
          num_outputs: 1,
          quality: 'high'
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.[0]?.msg || 'Failed to generate with Replicate');
    }
    
    const data = await response.json();
    return `Media generated successfully. Output: ${data.output?.[0] || 'Processing...'}`;
  } catch (error) {
    console.error('Replicate API error:', error);
    throw error;
  }
};

// Local AI call (Ollama)
export const callLocalAI = async (
  messages: any,
  systemPrompt: string,
  localEndpoint: string = 'http://localhost:11434'
): Promise<string> => {
  try {
    const messagesWithSystem = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];
    
    const response = await fetch(`${localEndpoint}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama2',
        messages: messagesWithSystem,
        stream: false
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to connect to local AI endpoint. Is Ollama running?');
    }
    
    const data = await response.json();
    return data.message.content;
  } catch (error) {
    console.error('Local AI error:', error);
    throw error;
  }
};

// Custom API call
export const callCustomAI = async (
  apiKey: string,
  messages: any,
  systemPrompt: string,
  customEndpoint: string
): Promise<string> => {
  try {
    const payload = typeof messages === 'string' ? { prompt: messages } : messages;
    
    const response = await fetch(customEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...payload,
        system: systemPrompt
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from custom endpoint');
    }
    
    const data = await response.json();
    return data.result || data.output || data.text || JSON.stringify(data);
  } catch (error) {
    console.error('Custom API error:', error);
    throw error;
  }
};

// Main function to call external AI APIs based on platform
export const callExternalAI = async (
  agent: any,
  prompt: string,
  previousMessages: Message[]
): Promise<string> => {
  // Check if API key is available (except for Local)
  if (!agent.apiKey && agent.platform !== 'Local' && agent.platform !== 'Other') {
    console.warn(`No API key provided for ${agent.name} (${agent.platform})`);
    return `I'm ${agent.name}, but I can't respond properly because no API key was provided. Please add an API key in my settings.`;
  }

  // Convert previous messages to the format expected by each API
  const formattedMessages = formatMessagesForPlatform(agent, prompt, previousMessages);

  try {
    console.log(`Calling ${agent.platform} API for agent: ${agent.name}`);
    
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
      
      case 'Grok':
        result = await callGrok(agent.apiKey!, formattedMessages, agent.systemPrompt);
        break;
      
      case 'Perplexity':
        result = await callPerplexity(agent.apiKey!, formattedMessages, agent.systemPrompt);
        break;
      
      case 'Together':
        result = await callTogether(agent.apiKey!, formattedMessages, agent.systemPrompt);
        break;
      
      case 'Groq':
        result = await callGroq(agent.apiKey!, formattedMessages, agent.systemPrompt);
        break;
      
      case 'Cohere':
        result = await callCohere(agent.apiKey!, formattedMessages, agent.systemPrompt);
        break;
      
      case 'Mistral':
        result = await callMistral(agent.apiKey!, formattedMessages, agent.systemPrompt);
        break;
      
      case 'Bedrock':
        result = await callBedrock(agent.apiKey!, formattedMessages, agent.systemPrompt);
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
      
      case 'Replicate':
        result = await callReplicate(agent.apiKey!, formattedMessages, agent.systemPrompt);
        break;
      
      case 'Local':
        result = await callLocalAI(formattedMessages, agent.systemPrompt);
        break;
      
      case 'Meta':
        result = await callTogether(agent.apiKey!, formattedMessages, agent.systemPrompt);
        break;
      
      case 'Other':
      default:
        result = await callCustomAI(
          agent.apiKey!,
          formattedMessages,
          agent.systemPrompt,
          agent.customEndpoint || ''
        );
        break;
    }
    
    toast.dismiss(toastId);
    
    return result;
  } catch (error) {
    console.error(`Error calling ${agent.platform} API:`, error);
    toast.error(`Failed to get response from ${agent.platform}: ${(error as Error).message}`);
    throw error;
  }
};
