
import React, { useEffect, useRef, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowDownToLine } from 'lucide-react';
import { toast } from 'sonner';
import MessageBubble from './MessageBubble';
import ThinkingIndicator from './ThinkingIndicator';
import { exampleAgents, exampleMessages } from '@/types';

const Conversation: React.FC = () => {
  const {
    currentProject,
    updateProject,
    thinking
  } = useProject();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [showingExample, setShowingExample] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [currentProject.messages, thinking]);
  
  const loadExampleMessages = () => {
    setShowingExample(true);
  };
  
  const loadExampleProject = () => {
    // Update the current project with example data
    updateProject({
      prompt: "Make me a 1-page site that introduces a song I created and includes a play button for the audio.",
      agents: JSON.parse(JSON.stringify(exampleAgents)),
      messages: JSON.parse(JSON.stringify(exampleMessages))
    });
    toast.success("Loaded example project");
    setShowingExample(false);
  };

  if (currentProject.messages.length === 0 && !thinking) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="rounded-full bg-mesh-purple/20 p-6 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mesh-purple">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h3 className="font-medium text-2xl mb-2">No Conversation Yet</h3>
        <p className="text-mesh-textSecondary max-w-sm mb-8">
          Enter a prompt and run the conversation to see your AI agents work together.
        </p>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-background/30 hover:bg-background/50 backdrop-blur" onClick={loadExampleMessages}>
              <ExternalLink size={16} />
              <span>View Example Conversation</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Example Multi-Agent Conversation</DialogTitle>
              <DialogDescription>
                See how multiple AI agents can collaborate on a task
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 my-4">
              {exampleMessages.map(message => {
                const agent = message.agentId === 'user' ? {
                  name: 'User',
                  role: 'Prompt',
                  platform: 'user'
                } : exampleAgents.find(a => a.id === message.agentId);
                
                if (!agent) return null;
                
                return (
                  <MessageBubble 
                    key={message.id} 
                    message={message} 
                    agent={agent} 
                  />
                );
              })}
            </div>
            
            <div className="flex justify-end mt-4">
              <Button onClick={loadExampleProject} className="bg-mesh-purple hover:bg-mesh-purple/80">
                <ArrowDownToLine size={16} className="mr-2" />
                Load Example Into Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 space-y-6">
      {currentProject.messages.map(message => {
        const agent = currentProject.agents.find(a => a.id === message.agentId);
        if (!agent) return null;
        
        return (
          <MessageBubble 
            key={message.id}
            message={message}
            agent={agent}
          />
        );
      })}
      
      <ThinkingIndicator 
        thinking={thinking} 
        agents={currentProject.agents}
      />
      
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default Conversation;
