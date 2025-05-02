
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
