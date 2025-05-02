
import React from 'react';
import ProjectManager from './ProjectManager';
import AgentCard from './AgentCard';
import AddAgentButton from './AddAgentButton';
import PromptInput from './PromptInput';
import ConversationView from './ConversationView';
import FinalOutputPanel from './FinalOutputPanel';
import { useProject } from '@/contexts/ProjectContext';
import { EnhancedTooltip } from './ui/enhanced-tooltip';

import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Github, Info, Settings, Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentProject } = useProject();
  const { agents } = currentProject;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/95">
      {/* Background mesh gradient */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(at_top_right,rgba(155,135,245,0.1),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(at_bottom_left,rgba(155,135,245,0.05),transparent_50%)] pointer-events-none" />
      
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-mesh-primary to-mesh-tertiary rounded-md p-0.5 mr-2">
              <div className="bg-background rounded-sm p-1.5">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-mesh-primary animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-mesh-secondary animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-mesh-tertiary animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
            <h1 className="font-bold text-xl bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">AI Mesh</h1>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <ProjectManager />
          </div>
          <div className="flex items-center gap-2">
            <EnhancedTooltip content="Learn how to use AI Mesh effectively">
              <Button variant="outline" size="sm" className="transition-all hover:bg-secondary/80">
                <Info className="h-4 w-4 mr-2" />
                Help
              </Button>
            </EnhancedTooltip>
            <EnhancedTooltip content="Configure application settings and preferences">
              <Button variant="outline" size="sm" className="transition-all hover:bg-secondary/80">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </EnhancedTooltip>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-6 grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium flex items-center">
                <span className="bg-gradient-to-r from-mesh-primary to-mesh-tertiary bg-clip-text text-transparent">Prompt & Settings</span>
              </h2>
            </div>
            <Card className="border border-white/10 bg-card/50 backdrop-blur-sm shadow-lg">
              <CardContent className="pt-6">
                <PromptInput />
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">
                <span className="bg-gradient-to-r from-mesh-primary to-mesh-tertiary bg-clip-text text-transparent">AI Agents</span>
              </h2>
              <EnhancedTooltip content="Add a new AI agent to your conversation">
                <div>
                  <AddAgentButton />
                </div>
              </EnhancedTooltip>
            </div>
            <div className="space-y-4">
              {agents.length > 0 ? (
                agents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))
              ) : (
                <Card className="border-dashed border-white/10 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Sparkles className="h-6 w-6 text-mesh-primary" />
                    </div>
                    <h3 className="font-medium mb-2">No Agents Configured</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Add AI agents to create a collaborative conversation
                    </p>
                    <AddAgentButton />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 grid grid-rows-2 gap-6 h-[calc(100vh-9rem)]">
          <Card className="overflow-hidden border border-white/10 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="bg-gradient-to-r from-mesh-primary to-mesh-tertiary bg-clip-text text-transparent">Conversation</CardTitle>
                  <CardDescription>
                    AI agents working together on your prompt
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <ScrollArea className="h-[calc(50vh-10rem)]">
              <ConversationView />
            </ScrollArea>
          </Card>
          
          <Card className="overflow-hidden border border-white/10 bg-card/50 backdrop-blur-sm shadow-lg">
            <FinalOutputPanel />
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-4 backdrop-blur-sm bg-background/80">
        <div className="container flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            AI Mesh — Orchestrate conversations between multiple AIs
          </div>
          <div className="flex items-center space-x-4">
            <EnhancedTooltip content="View source code on GitHub">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                <div className="flex items-center">
                  <Github className="h-4 w-4 mr-1" />
                  <span>GitHub</span>
                </div>
              </a>
            </EnhancedTooltip>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
