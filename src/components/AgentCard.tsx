
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { AIAgent, AgentType, AIPlatform } from '@/types';
import { getAgentColorByPlatform, getAgentInitial } from '@/utils/helpers';
import { mockPlatformExamplePrompts } from '@/utils/mockAgentHandlers';
import LeaderToggle from './LeaderToggle';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedTooltip } from '@/components/ui/enhanced-tooltip';
import {
  Trash2,
  Copy,
  AlertCircle,
  Settings,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AgentCardProps {
  agent: AIAgent;
}

const PLATFORMS: AIPlatform[] = [
  'OpenAI',
  'Anthropic',
  'Google',
  'Lovable',
  'Meta',
  'Canva',
  'Local',
  'Other'
];

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const { updateAgent, removeAgent, addAgent } = useProject();
  const [expanded, setExpanded] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleTypeChange = (value: string) => {
    updateAgent(agent.id, { type: value as AgentType });
  };

  const handlePlatformChange = (value: string) => {
    const newPlatform = value as AIPlatform;
    updateAgent(agent.id, { 
      platform: newPlatform,
      // Optionally update the system prompt with platform-specific examples
      systemPrompt: mockPlatformExamplePrompts[newPlatform] || agent.systemPrompt
    });
  };

  const duplicateAgent = () => {
    const duplicatedAgent: AIAgent = {
      ...agent,
      id: '', // Will be generated when added
      name: `${agent.name} (Copy)`
    };
    addAgent(duplicatedAgent);
  };

  const avatarColor = getAgentColorByPlatform(agent.platform);
  
  return (
    <Card className="mesh-card w-full">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`${avatarColor} w-8 h-8 rounded-full flex items-center justify-center text-white font-medium shadow-md`}>
              {getAgentInitial(agent.name)}
            </div>
            <div className="flex-1">
              <Input
                value={agent.name}
                onChange={(e) => updateAgent(agent.id, { name: e.target.value })}
                className="font-medium bg-transparent border-transparent hover:border-mesh-purple/50 focus:border-mesh-purple/50 focus:bg-black/20"
                placeholder="Agent Name"
              />
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <EnhancedTooltip content={expanded ? "Collapse agent details" : "Expand agent details"}>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setExpanded(!expanded)}
                className="h-8 w-8 p-0 hover:bg-mesh-purple/10"
              >
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </EnhancedTooltip>
            <EnhancedTooltip content="Duplicate this agent">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={duplicateAgent}
                className="h-8 w-8 p-0 hover:bg-mesh-purple/10"
              >
                <Copy size={16} />
              </Button>
            </EnhancedTooltip>
            <Dialog>
              <DialogTrigger asChild>
                <EnhancedTooltip content="Delete this agent">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                </EnhancedTooltip>
              </DialogTrigger>
              <DialogContent className="glassmorphism">
                <DialogHeader>
                  <DialogTitle>Delete Agent</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete {agent.name}? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => document.querySelector('[data-state="open"]')?.setAttribute('data-state', 'closed')}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      removeAgent(agent.id);
                      document.querySelector('[data-state="open"]')?.setAttribute('data-state', 'closed');
                    }}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-0 pt-2">
        {/* Leader toggle - always visible */}
        <div className="flex justify-between items-center">
          <div className="text-xs text-mesh-textSecondary">{agent.role}</div>
          <LeaderToggle agent={agent} />
        </div>
      </CardContent>

      <CardContent className={`px-4 pb-4 pt-0 transition-all duration-300 ${expanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="grid gap-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Role</label>
              <Input
                value={agent.role}
                onChange={(e) => updateAgent(agent.id, { role: e.target.value })}
                placeholder="e.g., Developer, Designer, Critic"
                className="w-full mesh-input"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Platform</label>
              <Select
                value={agent.platform}
                onValueChange={handlePlatformChange}
              >
                <SelectTrigger className="w-full mesh-input">
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent className="glassmorphism">
                  <SelectGroup>
                    {PLATFORMS.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">System Prompt</label>
              <EnhancedTooltip content="Use the default prompt for this AI platform">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs hover:bg-mesh-purple/10"
                  onClick={() => {
                    const platformPrompt = mockPlatformExamplePrompts[agent.platform];
                    if (platformPrompt) {
                      updateAgent(agent.id, { systemPrompt: platformPrompt });
                    }
                  }}
                >
                  Use Default
                </Button>
              </EnhancedTooltip>
            </div>
            <Textarea
              value={agent.systemPrompt}
              onChange={(e) => updateAgent(agent.id, { systemPrompt: e.target.value })}
              placeholder="Instructions that define how this agent should behave"
              className="w-full min-h-[100px] mesh-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">API Key</label>
              <div className="relative">
                <Input
                  type={showApiKey ? 'text' : 'password'}
                  value={agent.apiKey || ''}
                  onChange={(e) => updateAgent(agent.id, { apiKey: e.target.value })}
                  placeholder="Enter API key for this service"
                  className="w-full pr-9 mesh-input"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {!agent.apiKey && agent.platform !== 'Local' && (
                  <div className="flex items-center text-amber-500">
                    <AlertCircle size={12} className="mr-1" />
                    <span>Missing API key. You can mock responses without one.</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Agent Type</label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`chat-type-${agent.id}`}
                    checked={agent.type === 'chat'}
                    onCheckedChange={() => handleTypeChange(agent.type === 'chat' ? 'task' : 'chat')}
                  />
                  <Label htmlFor={`chat-type-${agent.id}`}>
                    {agent.type === 'chat' ? 'Chat AI' : 'Task AI'}
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  {agent.type === 'chat' 
                    ? 'Participates in conversation with other agents' 
                    : 'Performs specific tasks when called upon'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className={`px-4 pt-0 pb-4 transition-all duration-300 ${expanded ? 'block' : 'hidden'}`}>
        <div className="flex justify-end">
          <EnhancedTooltip content="Configure advanced settings for this agent">
            <Button variant="outline" size="sm" className="text-xs hover:bg-mesh-purple/10">
              <Settings size={12} className="mr-1" />
              Advanced Settings
            </Button>
          </EnhancedTooltip>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AgentCard;
