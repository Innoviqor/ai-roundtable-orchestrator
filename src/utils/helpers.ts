
import { AIAgent, AIPlatform, Message } from "@/types";

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function getAgentColorByPlatform(platform: AIPlatform): string {
  switch (platform) {
    case 'OpenAI':
      return 'bg-gradient-to-r from-emerald-500 to-emerald-700';
    case 'Anthropic':
      return 'bg-gradient-to-r from-purple-500 to-purple-700';
    case 'Google':
      return 'bg-gradient-to-r from-blue-500 to-blue-700';
    case 'Lovable':
      return 'bg-gradient-to-r from-rose-500 to-rose-700';
    case 'Local':
      return 'bg-gradient-to-r from-slate-500 to-slate-700';
    case 'Meta':
      return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    case 'Canva':
      return 'bg-gradient-to-r from-blue-400 to-cyan-500';
    case 'Other':
    default:
      return 'bg-gradient-to-r from-gray-500 to-gray-700';
  }
}

export function getAgentInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
}

export async function simulateAgentResponse(
  agent: AIAgent, 
  prompt: string, 
  previousMessages: Message[]
): Promise<string> {
  // Simulated response delay (1-3 seconds)
  const delay = 1000 + Math.random() * 2000;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Generate simulated responses based on agent role and platform
  const roleResponses: Record<string, string[]> = {
    'Developer': [
      `I'll help implement this. First, let's break down the requirements...`,
      `Based on the prompt, we need to create ${prompt.split(' ').length % 5 + 1} components...`,
      `Let me write some pseudocode for this solution...`,
      `Here's a basic implementation approach we could take...`
    ],
    'Designer': [
      `From a design perspective, we should focus on user experience first...`,
      `I'm thinking a clean interface with subtle animations would work well...`,
      `Let me suggest a color palette that would align with this brand...`,
      `The layout should prioritize ${prompt.includes('mobile') ? 'mobile' : 'desktop'} views...`
    ],
    'Critic': [
      `I see a potential issue with this approach...`,
      `While that could work, have we considered the edge cases?`,
      `Let me play devil's advocate for a moment...`,
      `That's a good start, but we might want to refine...`
    ],
    'Product Manager': [
      `From a product perspective, we should prioritize these features...`,
      `Our target users would probably prefer if we...`,
      `Let's make sure we're aligned with the business goals here...`,
      `I'd recommend we focus on the core functionality first...`
    ],
    'Researcher': [
      `According to recent studies in this field...`,
      `Let me provide some context and background information...`,
      `There are several approaches we could consider based on existing literature...`,
      `The data suggests we should pursue this direction...`
    ]
  };

  // Default responses for any role not specifically defined
  const defaultResponses = [
    `I've analyzed the prompt and here are my thoughts...`,
    `Based on my expertise, I would recommend...`,
    `Let me contribute my perspective on this...`,
    `Here's what I think about the current discussion...`
  ];

  // Get responses for this agent's role or use default
  const responses = roleResponses[agent.role] || defaultResponses;
  
  // Select a random response
  const responseIndex = Math.floor(Math.random() * responses.length);
  
  // Customize based on prompt content
  let response = responses[responseIndex];
  
  // Add reference to the prompt
  if (prompt.length > 10) {
    const promptSegment = prompt.substring(0, 30) + (prompt.length > 30 ? '...' : '');
    response += ` Regarding "${promptSegment}", I think...`;
  }
  
  // Add some variation based on platform
  switch (agent.platform) {
    case 'OpenAI':
      response += ' My analysis shows this is the optimal approach.';
      break;
    case 'Anthropic':
      response += ' I've carefully considered the ethical implications of this.';
      break;
    case 'Google':
      response += ' Based on a comprehensive information search, this seems most appropriate.';
      break;
    case 'Meta':
      response += ' This solution would engage users effectively.';
      break;
    case 'Canva':
      response += ' I've created a visual mockup to illustrate this concept.';
      break;
    default:
      break;
  }
  
  // Reference previous messages occasionally
  if (previousMessages.length > 0 && Math.random() > 0.5) {
    const randomMessage = previousMessages[Math.floor(Math.random() * previousMessages.length)];
    response += ` I agree with the point about ${randomMessage.content.split(' ').slice(0, 3).join(' ')}...`;
  }
  
  return response;
}

export function saveProjectToLocalStorage(project: Project): void {
  try {
    const projects = getProjectsFromLocalStorage();
    const updatedProjects = projects.filter(p => p.id !== project.id);
    updatedProjects.push(project);
    localStorage.setItem('ai-mesh-projects', JSON.stringify(updatedProjects));
  } catch (error) {
    console.error('Failed to save project to localStorage:', error);
  }
}

export function getProjectsFromLocalStorage(): Project[] {
  try {
    const projectsJson = localStorage.getItem('ai-mesh-projects');
    return projectsJson ? JSON.parse(projectsJson) : [];
  } catch (error) {
    console.error('Failed to retrieve projects from localStorage:', error);
    return [];
  }
}

export function getProjectFromLocalStorage(id: string): Project | undefined {
  try {
    const projects = getProjectsFromLocalStorage();
    return projects.find(project => project.id === id);
  } catch (error) {
    console.error('Failed to retrieve project from localStorage:', error);
    return undefined;
  }
}
