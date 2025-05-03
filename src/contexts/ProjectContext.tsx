import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AIAgent, ConversationMode, Message, Project } from '@/types';
import { generateId, getProjectsFromLocalStorage, saveProjectToLocalStorage } from '@/utils/helpers';
import { getDefaultAgents } from '@/utils/mockAgentHandlers';
import { toast } from 'sonner';

interface ProjectContextProps {
  currentProject: Project;
  allProjects: Project[];
  isRunning: boolean;
  thinking: string | null;
  createNewProject: (name: string) => void;
  updateProject: (project: Partial<Project>) => void;
  addAgent: (agent: AIAgent) => void;
  updateAgent: (agentId: string, updates: Partial<AIAgent>) => void;
  removeAgent: (agentId: string) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  clearMessages: () => void;
  loadProject: (projectId: string) => void;
  exportProject: () => void;
  setIsRunning: (running: boolean) => void;
  setThinking: (agentId: string | null) => void;
}

const ProjectContext = createContext<ProjectContextProps | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project>({
    id: generateId(),
    name: 'New Project',
    prompt: '',
    agents: getDefaultAgents(),
    conversationMode: 'sequential',
    messages: [],
    created: Date.now(),
    updated: Date.now(),
    conversationRounds: 0,
    maxConversationRounds: 10, // Default to 10 rounds max to prevent infinite loops
  });
  const [isRunning, setIsRunning] = useState(false);
  const [thinking, setThinking] = useState<string | null>(null);

  // Load projects from localStorage on initial render
  useEffect(() => {
    const savedProjects = getProjectsFromLocalStorage();
    if (savedProjects.length > 0) {
      setAllProjects(savedProjects);
      // Set the most recently updated project as the current project
      const mostRecent = savedProjects.sort((a, b) => b.updated - a.updated)[0];
      setCurrentProject(mostRecent);
    }
  }, []);

  const createNewProject = (name: string) => {
    const newProject: Project = {
      id: generateId(),
      name: name || 'New Project',
      prompt: '',
      agents: getDefaultAgents(),
      conversationMode: 'sequential',
      messages: [],
      created: Date.now(),
      updated: Date.now(),
      conversationRounds: 0,
      maxConversationRounds: 10,
    };

    setCurrentProject(newProject);
    setAllProjects(prev => [...prev, newProject]);
    saveProjectToLocalStorage(newProject);
    toast.success(`Created new project: ${name || 'New Project'}`);
  };

  const updateProject = (updates: Partial<Project>) => {
    const updated = {
      ...currentProject,
      ...updates,
      updated: Date.now(),
    };
    setCurrentProject(updated);
    setAllProjects(prev => prev.map(project => 
      project.id === updated.id ? updated : project
    ));
    saveProjectToLocalStorage(updated);
  };

  const addAgent = (agent: AIAgent) => {
    const newAgent = {
      ...agent,
      id: agent.id || generateId(),
    };
    
    const updatedAgents = [...currentProject.agents, newAgent];
    updateProject({ agents: updatedAgents });
    toast.success(`Added new agent: ${agent.name}`);
  };

  const updateAgent = (agentId: string, updates: Partial<AIAgent>) => {
    const updatedAgents = currentProject.agents.map(agent =>
      agent.id === agentId ? { ...agent, ...updates } : agent
    );
    updateProject({ agents: updatedAgents });
  };

  const removeAgent = (agentId: string) => {
    const agentToRemove = currentProject.agents.find(a => a.id === agentId);
    const updatedAgents = currentProject.agents.filter(agent => agent.id !== agentId);
    updateProject({ agents: updatedAgents });
    toast.info(`Removed agent: ${agentToRemove?.name || 'Unknown'}`);
  };

  const addMessage = (message: Message) => {
    const updatedMessages = [...currentProject.messages, message];
    updateProject({ messages: updatedMessages });
  };

  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    const updatedMessages = currentProject.messages.map(message =>
      message.id === messageId ? { ...message, ...updates } : message
    );
    updateProject({ messages: updatedMessages });
  };

  const clearMessages = () => {
    updateProject({ 
      messages: [],
      conversationRounds: 0 // Reset conversation rounds when clearing messages
    });
    toast.info('Cleared conversation history');
  };

  const loadProject = (projectId: string) => {
    const projectToLoad = allProjects.find(p => p.id === projectId);
    if (projectToLoad) {
      setCurrentProject(projectToLoad);
      toast.success(`Loaded project: ${projectToLoad.name}`);
    }
  };

  const exportProject = () => {
    const dataStr = JSON.stringify(currentProject, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `${currentProject.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Project exported successfully');
  };

  const value = {
    currentProject,
    allProjects,
    isRunning,
    thinking,
    createNewProject,
    updateProject,
    addAgent,
    updateAgent,
    removeAgent,
    addMessage,
    updateMessage,
    clearMessages,
    loadProject,
    exportProject,
    setIsRunning,
    setThinking,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
