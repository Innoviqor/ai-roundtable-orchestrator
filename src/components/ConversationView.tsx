
import React, { useEffect, useRef, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Message } from '@/types';
import { formatTimestamp, generateId, getAgentColorByPlatform, getAgentInitial } from '@/utils/helpers';
import { callAgent } from '@/utils/mockAgentHandlers';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Loader2 } from 'lucide-react';

const ConversationView: React.FC = () => {
  const { currentProject, addMessage, updateMessage, isRunning, setIsRunning } = useProject();
  const [thinking, setThinking] = useState<string | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentProject.messages, thinking]);

  // Handle run conversation event
  useEffect(() => {
    const handleRunConversation = async (event: CustomEvent) => {
      if (event.detail.projectId !== currentProject.id) return;
      
      const { agents, prompt, conversationMode } = currentProject;
      
      if (conversationMode === 'sequential') {
        // Run agents one by one
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
        // Run all agents simultaneously
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
      
      setIsRunning(false);
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

  if (currentProject.messages.length === 0 && !thinking) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="rounded-full bg-muted p-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h3 className="font-medium text-lg">No Conversation Yet</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
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
            <div key={message.id} className="flex flex-col space-y-2">
              <div className="flex items-start space-x-3">
                <div className={`${avatarColor} w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mt-1`}>
                  {getAgentInitial(agent.name)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{agent.name}</span>
                    <span className="text-xs text-muted-foreground">{formatTimestamp(message.timestamp)}</span>
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                      {agent.role}
                    </span>
                  </div>
                  <div className="mt-1 text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {thinking && (
          <div className="flex flex-col space-y-2">
            {thinking === 'all' ? (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
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
                      <div className={`${avatarColor} w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mt-1`}>
                        {getAgentInitial(agent.name)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{agent.name}</span>
                          <span className="text-xs text-muted-foreground">{formatTimestamp(Date.now())}</span>
                        </div>
                        <div className="mt-1 text-sm flex items-center space-x-2 text-muted-foreground">
                          <Loader2 className="animate-spin h-4 w-4" />
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
