
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useProject } from '@/contexts/ProjectContext';
import { AIAgent, AIPlatform, AgentType } from '@/types';
import { generateId } from '@/utils/helpers';
import { mockPlatformExamplePrompts } from '@/utils/mockAgentHandlers';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const AddAgentButton: React.FC = () => {
  const { addAgent } = useProject();
  const [open, setOpen] = React.useState(false);
  const [newAgent, setNewAgent] = React.useState<Partial<AIAgent>>({
    name: '',
    role: '',
    platform: 'OpenAI' as AIPlatform,
    systemPrompt: mockPlatformExamplePrompts['OpenAI'],
    type: 'chat' as AgentType
  });

  const handleChange = (field: keyof AIAgent, value: string) => {
    setNewAgent(prev => ({ ...prev, [field]: value }));

    // If platform changes, update the system prompt with an example
    if (field === 'platform') {
      const platformValue = value as AIPlatform;
      const examplePrompt = mockPlatformExamplePrompts[platformValue] || '';
      setNewAgent(prev => ({ 
        ...prev, 
        platform: platformValue,
        systemPrompt: examplePrompt
      }));
    }
  };

  const handleAddAgent = () => {
    if (!newAgent.name || !newAgent.role) {
      toast.error("Agent name and role are required");
      return;
    }

    addAgent({
      id: generateId(),
      name: newAgent.name || 'New Agent',
      role: newAgent.role || 'Assistant',
      systemPrompt: newAgent.systemPrompt || '',
      platform: newAgent.platform as AIPlatform || 'OpenAI',
      type: newAgent.type as AgentType || 'chat',
      apiKey: newAgent.apiKey
    });

    toast.success(`Added new agent: ${newAgent.name}`);

    // Reset form and close dialog
    setNewAgent({
      name: '',
      role: '',
      platform: 'OpenAI' as AIPlatform,
      systemPrompt: mockPlatformExamplePrompts['OpenAI'],
      type: 'chat' as AgentType
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Agent
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New AI Agent</DialogTitle>
          <DialogDescription>
            Configure a new AI agent to participate in your conversations.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="agent-name" className="text-right text-sm font-medium">
              Name
            </label>
            <Input
              id="agent-name"
              value={newAgent.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Developer GPT"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="agent-role" className="text-right text-sm font-medium">
              Role
            </label>
            <Input
              id="agent-role"
              value={newAgent.role}
              onChange={(e) => handleChange('role', e.target.value)}
              placeholder="e.g., Developer, Designer, Critic"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="agent-platform" className="text-right text-sm font-medium">
              Platform
            </label>
            <Select
              value={newAgent.platform}
              onValueChange={(value) => handleChange('platform', value)}
            >
              <SelectTrigger className="col-span-3" id="agent-platform">
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OpenAI">OpenAI</SelectItem>
                <SelectItem value="Anthropic">Anthropic</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
                <SelectItem value="Lovable">Lovable</SelectItem>
                <SelectItem value="Meta">Meta</SelectItem>
                <SelectItem value="Canva">Canva</SelectItem>
                <SelectItem value="Local">Local</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="agent-api-key" className="text-right text-sm font-medium">
              API Key
            </label>
            <Input
              id="agent-api-key"
              type="password"
              value={newAgent.apiKey || ''}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              placeholder={`Enter ${newAgent.platform} API key`}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="agent-type" className="text-right text-sm font-medium">
              Type
            </label>
            <Select
              value={newAgent.type}
              onValueChange={(value) => handleChange('type', value as AgentType)}
            >
              <SelectTrigger className="col-span-3" id="agent-type">
                <SelectValue placeholder="Select agent type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chat">Chat AI</SelectItem>
                <SelectItem value="task">Task AI</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <label htmlFor="agent-prompt" className="text-right text-sm font-medium pt-2">
              System Prompt
            </label>
            <Textarea
              id="agent-prompt"
              value={newAgent.systemPrompt}
              onChange={(e) => handleChange('systemPrompt', e.target.value)}
              placeholder="Instructions for how this agent should behave"
              className="col-span-3 min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            onClick={handleAddAgent}
            disabled={!newAgent.name || !newAgent.role}
          >
            Add Agent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAgentButton;
