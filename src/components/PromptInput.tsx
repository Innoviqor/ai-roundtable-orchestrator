
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConversationMode } from '@/types';
import { Play, StopCircle, Trash2 } from 'lucide-react';

const PromptInput: React.FC = () => {
  const { currentProject, updateProject, isRunning, setIsRunning, clearMessages } = useProject();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateProject({ prompt: e.target.value });
  };

  const handleModeChange = (value: string) => {
    updateProject({ conversationMode: value as ConversationMode });
  };

  const handleRunConversation = async () => {
    if (!currentProject.prompt.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    setIsRunning(true);
    
    // We'll emit this event for the ConversationView component to handle
    const event = new CustomEvent('runConversation', {
      detail: { projectId: currentProject.id }
    });
    window.dispatchEvent(event);
    
    setIsSubmitting(false);
  };

  const handleStopConversation = () => {
    setIsRunning(false);
    // We'll emit this event for the ConversationView component to handle
    const event = new CustomEvent('stopConversation');
    window.dispatchEvent(event);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Conversation Prompt</label>
        <Textarea
          placeholder="Enter your prompt here..."
          value={currentProject.prompt}
          onChange={handlePromptChange}
          className="min-h-[120px] resize-none"
          disabled={isRunning}
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Select
            value={currentProject.conversationMode}
            onValueChange={handleModeChange}
            disabled={isRunning}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Conversation Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sequential">Sequential</SelectItem>
              <SelectItem value="simultaneous">Simultaneous</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={clearMessages}
            disabled={isRunning || currentProject.messages.length === 0}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex space-x-2">
          {isRunning ? (
            <Button 
              onClick={handleStopConversation}
              variant="destructive"
            >
              <StopCircle className="mr-2 h-4 w-4" />
              Stop Conversation
            </Button>
          ) : (
            <Button 
              onClick={handleRunConversation}
              disabled={!currentProject.prompt.trim() || currentProject.agents.length === 0 || isSubmitting}
              className="bg-mesh-primary hover:bg-mesh-tertiary"
            >
              <Play className="mr-2 h-4 w-4" />
              Run Conversation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
