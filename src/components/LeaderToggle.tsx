
import React from 'react';
import { AIAgent } from '@/types';
import { useProject } from '@/contexts/ProjectContext';
import { Switch } from '@/components/ui/switch';
import { Crown } from 'lucide-react';
import { EnhancedTooltip } from './ui/enhanced-tooltip';

interface LeaderToggleProps {
  agent: AIAgent;
}

const LeaderToggle: React.FC<LeaderToggleProps> = ({ agent }) => {
  const { updateAgent } = useProject();

  const toggleLeader = () => {
    updateAgent(agent.id, { isLeader: !agent.isLeader });
  };

  return (
    <div className="flex items-center space-x-2">
      <EnhancedTooltip 
        content={
          agent.isLeader 
            ? "This agent will lead the conversation and coordinate the other AIs" 
            : "Make this agent the conversation leader"
        }
      >
        <div className="flex items-center space-x-1.5">
          <Switch
            checked={!!agent.isLeader}
            onCheckedChange={toggleLeader}
            className="data-[state=checked]:bg-yellow-500"
          />
          <Crown 
            size={16} 
            className={`transition-colors ${agent.isLeader ? 'text-yellow-500' : 'text-muted-foreground'}`} 
          />
        </div>
      </EnhancedTooltip>
    </div>
  );
};

export default LeaderToggle;
