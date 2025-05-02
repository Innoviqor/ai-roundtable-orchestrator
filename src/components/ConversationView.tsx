
import React, { useEffect, useRef, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Message } from '@/types';
import { formatTimestamp, generateId, getAgentColorByPlatform, getAgentInitial } from '@/utils/helpers';
import { callAgent } from '@/utils/mockAgentHandlers';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Crown, Loader2 } from 'lucide-react';
import { EnhancedTooltip } from './ui/enhanced-tooltip';

const ConversationView: React.FC = () => {
  const { currentProject, addMessage, updateMessage, isRunning, setIsRunning } = useProject();
  const [thinking, setThinking] = useState<string | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentProject.messages, thinking]);

  // Trigger response to the last message if it's from an agent
  useEffect(() => {
    // Only run this if we're in conversation mode and not already thinking
    if (isRunning && !thinking && currentProject.messages.length > 0) {
      const lastMessage = currentProject.messages[currentProject.messages.length - 1];
      const lastAgent = currentProject.agents.find(a => a.id === lastMessage.agentId);
      
      // Don't respond if this is a user message or if we've reached the conversation limit
      if (lastAgent && currentProject.conversationRounds < currentProject.maxConversationRounds) {
        triggerNextAgentResponse(lastMessage);
      }
    }
  }, [currentProject.messages, isRunning, thinking]);

  // Handle run conversation event
  useEffect(() => {
    const handleRunConversation = async (event: CustomEvent) => {
      if (event.detail.projectId !== currentProject.id) return;
      
      const { agents, prompt, conversationMode } = currentProject;
      
      // Check if there's a leader agent
      const leaderAgent = agents.find(agent => agent.isLeader);
      
      if (leaderAgent) {
        // Leader-directed conversation
        setThinking(leaderAgent.id);
        
        try {
          // Get leader's directives first
          const leaderDirective = await callAgent(
            leaderAgent, 
            `You are the leader. Based on this request: "${prompt}", provide clear instructions for each team member to follow. Your goal is to coordinate the team's effort.`, 
            []
          );
          
          addMessage(leaderDirective);
          
          // Now process other agents sequentially with leader's guidance
          for (const agent of agents.filter(a => a.id !== leaderAgent.id)) {
            if (!isRunning) break; // Check if we should stop
            
            setThinking(agent.id);
            
            try {
              // Include the leader's directive in the context
              const message = await callAgent(
                agent, 
                prompt,
                [...currentProject.messages, leaderDirective] // Include leader's directive
              );
              
              addMessage(message);
            } catch (error) {
              console.error(`Error with agent ${agent.name}:`, error);
              toast.error(`Failed to get response from ${agent.name}`);
            }
          }
        } catch (error) {
          console.error(`Error with leader ${leaderAgent.name}:`, error);
          toast.error(`Failed to get response from leader ${leaderAgent.name}`);
        } finally {
          setThinking(null);
        }
      } else if (conversationMode === 'sequential') {
        // Traditional sequential mode (no leader)
        for (let i = 0; i < agents.length; i++) {
          if (!isRunning) break; // Check if we should stop
          
          const agent = agents[i];
          setThinking(agent.id);
          
          try {
            // Call the agent and get a response
            const message = await callAgent(agent, prompt, currentProject.messages);
            addMessage(message);
          } catch (error) {
            console.error(`Error with agent ${agent.name}:`, error);
            toast.error(`Failed to get response from ${agent.name}`);
          } finally {
            setThinking(null);
          }
        }
      } else {
        // Simultaneous mode (no leader)
        setThinking('all');
        
        try {
          const messagePromises = agents.map(agent => 
            callAgent(agent, prompt, currentProject.messages)
          );
          
          const messages = await Promise.all(messagePromises);
          messages.forEach(message => addMessage(message));
        } catch (error) {
          console.error('Error running simultaneous conversation:', error);
          toast.error('Failed to complete simultaneous conversation');
        } finally {
          setThinking(null);
        }
      }
    };

    const handleStopConversation = () => {
      setThinking(null);
    };

    // Add event listeners
    window.addEventListener('runConversation', handleRunConversation as EventListener);
    window.addEventListener('stopConversation', handleStopConversation);

    // Cleanup
    return () => {
      window.removeEventListener('runConversation', handleRunConversation as EventListener);
      window.removeEventListener('stopConversation', handleStopConversation);
    };
  }, [currentProject, addMessage, setIsRunning, isRunning]);

  // Function to trigger the next agent response in the conversation
  const triggerNextAgentResponse = async (lastMessage: Message) => {
    const { agents } = currentProject;
    if (agents.length <= 1) return; // Need at least 2 agents to have a conversation
    
    // Find the agent that sent the last message
    const lastAgentIndex = agents.findIndex(agent => agent.id === lastMessage.agentId);
    
    // Determine the next agent (circular)
    const nextAgentIndex = (lastAgentIndex + 1) % agents.length;
    const nextAgent = agents[nextAgentIndex];
    
    // Skip if this is the leader agent and we already had the leader directive
    if (nextAgent.isLeader && currentProject.messages.some(m => m.agentId === nextAgent.id)) {
      // Try the next agent instead
      const afterNextAgentIndex = (nextAgentIndex + 1) % agents.length;
      if (afterNextAgentIndex !== lastAgentIndex) {
        const afterNextAgent = agents[afterNextAgentIndex];
        await generateAgentResponse(afterNextAgent, lastMessage);
      }
      return;
    }
    
    await generateAgentResponse(nextAgent, lastMessage);
  };
  
  // Generate a response from a specific agent
  const generateAgentResponse = async (agent: any, lastMessage: Message) => {
    if (!isRunning) return;
    
    setThinking(agent.id);
    
    try {
      // Increment the conversation round counter
      updateProject({
        conversationRounds: (currentProject.conversationRounds || 0) + 1
      });
      
      // Prompt for the agent to respond to the previous message
      const responsePrompt = `Respond to this message from ${
        currentProject.agents.find(a => a.id === lastMessage.agentId)?.name || 'another agent'
      }: "${lastMessage.content}"`;
      
      // Call the agent with the appropriate context
      const message = await callAgent(
        agent,
        responsePrompt,
        currentProject.messages
      );
      
      addMessage(message);
    } catch (error) {
      console.error(`Error getting response from ${agent.name}:`, error);
      toast.error(`Failed to get response from ${agent.name}`);
      setIsRunning(false);
    } finally {
      setThinking(null);
    }
  };
  
  // Helper function to update the project
  const updateProject = (updates: any) => {
    const { updateProject } = useProject();
    updateProject(updates);
  };

  if (currentProject.messages.length === 0 && !thinking) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="rounded-full bg-mesh-purple/20 p-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mesh-purple">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h3 className="font-medium text-lg">No Conversation Yet</h3>
        <p className="text-mesh-textSecondary mt-2 max-w-sm">
          Enter a prompt and run the conversation to see your AI agents work together.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto scrollbar-thin">
      <div className="flex-1 p-4 space-y-4">
        {currentProject.messages.map((message) => {
          const agent = currentProject.agents.find(a => a.id === message.agentId);
          if (!agent) return null;
          
          const avatarColor = getAgentColorByPlatform(agent.platform);
          
          return (
            <div key={message.id} className="flex flex-col space-y-2 animate-fade-in">
              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  <div className={`${avatarColor} w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mt-1 shadow-md`}>
                    {getAgentInitial(agent.name)}
                  </div>
                  {agent.isLeader && (
                    <EnhancedTooltip content="This agent is leading the conversation">
                      <Crown size={14} className="leader-crown mt-1" />
                    </EnhancedTooltip>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{agent.name}</span>
                    <span className="text-xs text-mesh-textSecondary">{formatTimestamp(message.timestamp)}</span>
                    <EnhancedTooltip content={`This agent's role is: ${agent.role}`}>
                      <span className="text-xs bg-mesh-purple/10 text-mesh-purple px-2 py-0.5 rounded-full">
                        {agent.role}
                      </span>
                    </EnhancedTooltip>
                  </div>
                  <div className="mt-1 text-sm whitespace-pre-wrap bg-black/20 p-3 rounded-lg border border-white/5">
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {thinking && (
          <div className="flex flex-col space-y-2 animate-fade-in">
            {thinking === 'all' ? (
              <div className="flex items-center space-x-2 text-sm text-mesh-textSecondary">
                <Loader2 className="animate-spin h-4 w-4" />
                <span>Multiple agents are thinking...</span>
              </div>
            ) : (
              <>
                {currentProject.agents.map(agent => {
                  if (agent.id !== thinking) return null;
                  
                  const avatarColor = getAgentColorByPlatform(agent.platform);
                  
                  return (
                    <div key={agent.id} className="flex items-start space-x-3">
                      <div className="flex flex-col items-center">
                        <div className={`${avatarColor} w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mt-1 shadow-md`}>
                          {getAgentInitial(agent.name)}
                        </div>
                        {agent.isLeader && (
                          <EnhancedTooltip content="This agent is leading the conversation">
                            <Crown size={14} className="leader-crown mt-1" />
                          </EnhancedTooltip>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{agent.name}</span>
                          <span className="text-xs text-mesh-textSecondary">{formatTimestamp(Date.now())}</span>
                        </div>
                        <div className="mt-1 text-sm flex items-center space-x-2 text-mesh-textSecondary bg-black/20 p-3 rounded-lg border border-white/5">
                          <div className="flex space-x-1 items-center">
                            <div className="w-2 h-2 rounded-full bg-mesh-purple animate-thinking"></div>
                            <div className="w-2 h-2 rounded-full bg-mesh-purple animate-thinking" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 rounded-full bg-mesh-purple animate-thinking" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                          <span>Thinking...</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default ConversationView;
