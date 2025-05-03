
import React from 'react';
import { formatTimestamp, getAgentColorByPlatform, getAgentInitial } from '@/utils/helpers';
import { EnhancedTooltip } from '@/components/ui/enhanced-tooltip';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  agent: {
    id: string;
    name: string;
    role: string;
    platform: string;
    isLeader?: boolean;
  };
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, agent }) => {
  const avatarColor = getAgentColorByPlatform(agent.platform);
  
  return (
    <div className="flex flex-col space-y-2 animate-fade-in">
      <div className="flex items-start space-x-4">
        <div className="flex flex-col items-center">
          <div className={cn(
            `${avatarColor} w-10 h-10 rounded-full flex items-center justify-center 
            text-white font-medium shadow-md ring-2 ring-white/10`
          )}>
            {getAgentInitial(agent.name)}
          </div>
          {agent.isLeader && (
            <EnhancedTooltip content="This agent is leading the conversation">
              <Crown size={16} className="leader-crown mt-1" />
            </EnhancedTooltip>
          )}
        </div>
        
        <div className="flex-1 max-w-[85%]">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-medium text-base">{agent.name}</span>
            <EnhancedTooltip content={`This agent's role is: ${agent.role}`}>
              <span className="text-xs bg-mesh-purple/10 text-mesh-purple px-2 py-0.5 rounded-full">
                {agent.role}
              </span>
            </EnhancedTooltip>
            <span className="text-xs text-mesh-textSecondary ml-auto">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
          
          <div 
            className={cn(
              "mt-1 text-sm whitespace-pre-wrap p-4 rounded-xl border",
              "backdrop-blur-sm shadow-md transition-all duration-200",
              "bg-black/30 border-white/5 hover:border-white/10",
              {
                'border-l-2 border-l-mesh-purple': agent.platform === 'openai',
                'border-l-2 border-l-[#D766AB]': agent.platform === 'anthropic',
                'border-l-2 border-l-[#4285F4]': agent.platform === 'google',
                'border-l-2 border-l-[#0081FB]': agent.platform === 'meta',
                'border-l-2 border-l-mesh-green': agent.platform === 'local',
                'border-l-2 border-l-[#00C4CC]': agent.platform === 'canva',
                'border-l-2 border-l-gray-500': agent.platform === 'other',
              }
            )}
          >
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
