
import React from 'react';
import { Loader2 } from 'lucide-react';
import { getAgentColorByPlatform, getAgentInitial, formatTimestamp } from '@/utils/helpers';

interface ThinkingIndicatorProps {
  thinking: string | null;
  agents: Array<{
    id: string;
    name: string;
    platform: string;
    isLeader?: boolean;
    role: string;
  }>;
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ thinking, agents }) => {
  if (!thinking) return null;

  if (thinking === 'all') {
    return (
      <div className="flex items-center space-x-2 text-sm text-mesh-textSecondary p-4 animate-fade-in">
        <Loader2 className="animate-spin h-5 w-5" />
        <span>Multiple agents are thinking...</span>
      </div>
    );
  }

  const thinkingAgent = agents.find(agent => agent.id === thinking);
  if (!thinkingAgent) return null;

  const avatarColor = getAgentColorByPlatform(thinkingAgent.platform);

  return (
    <div className="flex items-start space-x-4 animate-fade-in p-4">
      <div className="flex flex-col items-center">
        <div className={`${avatarColor} w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shadow-md ring-2 ring-white/10`}>
          {getAgentInitial(thinkingAgent.name)}
        </div>
      </div>
      
      <div className="flex-1 max-w-[85%]">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{thinkingAgent.name}</span>
          <span className="text-xs bg-mesh-purple/10 text-mesh-purple px-2 py-0.5 rounded-full">
            {thinkingAgent.role}
          </span>
          <span className="text-xs text-mesh-textSecondary ml-auto">
            {formatTimestamp(Date.now())}
          </span>
        </div>
        
        <div className="mt-1 text-sm flex items-center space-x-2 text-mesh-textSecondary bg-black/30 p-4 rounded-xl border border-white/5 shadow-md">
          <div className="flex space-x-2 items-center">
            <div className="w-2 h-2 rounded-full bg-mesh-purple animate-thinking"></div>
            <div className="w-2 h-2 rounded-full bg-mesh-purple animate-thinking" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-mesh-purple animate-thinking" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span>Thinking...</span>
        </div>
      </div>
    </div>
  );
};

export default ThinkingIndicator;
