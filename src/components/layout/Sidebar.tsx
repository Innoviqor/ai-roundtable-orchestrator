
import React from 'react';
import PromptInput from '../PromptInput';
import AgentCard from '../AgentCard';
import AddAgentButton from '../AddAgentButton';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent } from '@/components/ui/card';
import { EnhancedTooltip } from '@/components/ui/enhanced-tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar: React.FC = () => {
  const { currentProject } = useProject();
  const { agents } = currentProject;
  const [agentsSectionOpen, setAgentsSectionOpen] = React.useState(true);

  return (
    <div className="space-y-6 p-4 overflow-y-auto">
      {/* Prompt & Settings Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center gradient-text">
            Prompt & Settings
          </h2>
        </div>
        <Card className="mesh-card">
          <CardContent className="pt-6">
            <PromptInput />
          </CardContent>
        </Card>
      </div>

      {/* Agents Section - Collapsible on Mobile */}
      <div className="lg:block">
        <Collapsible 
          open={agentsSectionOpen} 
          onOpenChange={setAgentsSectionOpen}
          className="lg:block"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium gradient-text">
              AI Agents
            </h2>
            <div className="flex gap-2">
              <EnhancedTooltip content="Add a new AI agent to your conversation">
                <div>
                  <AddAgentButton />
                </div>
              </EnhancedTooltip>
              <CollapsibleTrigger asChild className="lg:hidden">
                <Button variant="outline" size="sm" className="transition-all hover:shadow-glow">
                  {agentsSectionOpen ? 'Hide' : 'Show'} Agents
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${agentsSectionOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          
          <CollapsibleContent className="space-y-4">
            {agents.length > 0 ? (
              agents.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))
            ) : (
              <Card className="border-dashed border-white/10 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-mesh-purple/20 p-3 mb-4">
                    <Sparkles className="h-6 w-6 text-mesh-purple" />
                  </div>
                  <h3 className="font-medium mb-2">No Agents Configured</h3>
                  <p className="text-mesh-textSecondary text-sm mb-4">
                    Add AI agents to create a collaborative conversation
                  </p>
                  <AddAgentButton />
                </CardContent>
              </Card>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default Sidebar;
