
import { AIAgent, Message, AIPlatform } from "@/types";
import { generateId, simulateAgentResponse } from "./helpers";
import { callExternalAI } from "@/services/aiService";

export const callAgent = async (
  agent: AIAgent,
  prompt: string,
  previousMessages: Message[]
): Promise<Message> => {
  try {
    let content: string;
    
    // Check if we should use real API or mock
    const shouldUseMockResponse = 
      !agent.apiKey && agent.platform !== 'Local' || 
      (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_AI === 'true');
    
    if (shouldUseMockResponse) {
      // Use mock response if no API key provided or explicitly in mock mode
      content = await simulateAgentResponse(agent, prompt, previousMessages);
      console.log(`Using mock response for ${agent.name} (${agent.platform})`);
    } else {
      // Call actual external AI API
      try {
        content = await callExternalAI(agent, prompt, previousMessages);
      } catch (error) {
        console.error(`Error calling external AI for ${agent.name}:`, error);
        // Fallback to mock if API call fails
        content = await simulateAgentResponse(agent, prompt, previousMessages);
        content = `[API Error Fallback] ${content}`;
      }
    }
    
    // Add leadership style prefix if agent is a leader
    if (agent.isLeader) {
      content = `[TEAM COORDINATOR] ${content}\n\n${generateLeadershipDirectives()}`;
    }
    
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

// Generate leadership directives to guide the team
function generateLeadershipDirectives(): string {
  const directives = [
    "Team, here's how we should proceed:",
    "Let's coordinate our efforts as follows:",
    "I suggest we take these next steps:",
    "To achieve our goal, I recommend we:"
  ];
  
  const tasks = [
    "- Designer: Focus on the visual elements and user experience",
    "- Developer: Implement the core functionality",
    "- Critic: Review the proposed solution for potential issues",
    "- Let's break this down into manageable components",
    "- First, let's understand the requirements fully",
    "- We should prioritize the most important features first",
    "- Let's make sure we address all edge cases"
  ];
  
  // Select a random directive and 2-3 random tasks
  const directive = directives[Math.floor(Math.random() * directives.length)];
  const selectedTasks = [];
  const taskCount = Math.floor(Math.random() * 2) + 2; // 2-3 tasks
  
  for (let i = 0; i < taskCount; i++) {
    const randomIndex = Math.floor(Math.random() * tasks.length);
    selectedTasks.push(tasks[randomIndex]);
    tasks.splice(randomIndex, 1); // Remove selected task to avoid duplication
    
    if (tasks.length === 0) break; // Break if we run out of tasks
  }
  
  return `${directive}\n${selectedTasks.join('\n')}`;
}

export const mockPlatformExamplePrompts: Record<string, string> = {
  'OpenAI': 'You are a helpful assistant using GPT-4o-mini. Think step-by-step and provide clear, accurate information with code examples when relevant.',
  'Anthropic': 'You are Claude, an AI assistant created by Anthropic. Be helpful, harmless, and honest. Use your reasoning capabilities to tackle complex problems.',
  'Google': 'You are Gemini, Google\'s AI assistant. Provide informative and balanced responses. You have access to web search for current information.',
  'Grok': 'You are Grok, X AI\'s assistant. Be witty, irreverent, and honest. You have real-time information and understand current events.',
  'Perplexity': 'You are Perplexity AI. Provide research-backed answers with sources. You excel at synthesis and have web search capabilities.',
  'Together': 'You are powered by Together AI using open-source models. Be efficient and provide well-reasoned responses.',
  'Groq': 'You are using Groq\'s ultra-fast inference engine. Provide quick, accurate responses with exceptional speed.',
  'Cohere': 'You are Cohere AI. Excel at understanding nuance, providing retrieval-augmented responses, and enterprise-grade interactions.',
  'Mistral': 'You are Mistral AI, focused on open-source excellence. Provide accurate, helpful responses while respecting user privacy.',
  'Replicate': 'You are Replicate AI. Specialize in generating images, videos, and creative media based on text descriptions.',
  'Bedrock': 'You are Claude running via AWS Bedrock. Leverage enterprise infrastructure while maintaining high reasoning capabilities.',
  'Meta': 'You are Meta AI, designed to be helpful, harmless, and honest in all your interactions. Think about safety and ethics.',
  'Canva': 'You are Canva AI. Create and suggest beautiful designs with a focus on aesthetics, brand consistency, and visual appeal.',
  'Suno': 'You are Suno, an AI that specializes in creating and generating original music based on text descriptions and styles.',
  'Lovable': 'You are Lovable AI, an interface and web app builder. Focus on producing beautiful, functional UI/UX with clean code.',
  'Local': 'You are running locally on the user\'s machine via Ollama. Be efficient with resources while providing helpful, private responses.',
  'Other': 'You are an AI assistant connected to a custom API endpoint. Help the user accomplish their goals by providing useful responses.'
};

export const getDefaultAgents = (): AIAgent[] => [
  {
    id: generateId(),
    name: 'Architect',
    role: 'System Designer',
    systemPrompt: 'You are an architectural planner for projects, focusing on structure, design patterns, and overall vision.',
    platform: 'OpenAI',
    type: 'chat',
    isLeader: true
  },
  {
    id: generateId(),
    name: 'Researcher',
    role: 'Information Specialist',
    systemPrompt: 'You analyze requirements and provide relevant information, options, and best practices.',
    platform: 'Google',
    type: 'chat',
    isLeader: false
  },
  {
    id: generateId(),
    name: 'Composer',
    role: 'Content Creator',
    systemPrompt: 'You generate creative content like music, images, or text based on project requirements.',
    platform: 'Suno',
    type: 'chat',
    isLeader: false
  },
  {
    id: generateId(),
    name: 'Builder',
    role: 'Developer',
    systemPrompt: 'You implement the technical solutions with clean, efficient code and practical approaches.',
    platform: 'Lovable',
    type: 'chat',
    isLeader: false
  }
];
