
import React from 'react';
import ProjectManager from './ProjectManager';
import AgentCard from './AgentCard';
import AddAgentButton from './AddAgentButton';
import PromptInput from './PromptInput';
import ConversationView from './ConversationView';
import FinalOutputPanel from './FinalOutputPanel';
import { useProject } from '@/contexts/ProjectContext';

import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Github, Info, Settings } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentProject } = useProject();
  const { agents } = currentProject;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-mesh-primary to-mesh-tertiary rounded-md p-0.5 mr-2">
              <div className="bg-background rounded-sm p-1.5">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-mesh-primary" />
                  <div className="w-2 h-2 rounded-full bg-mesh-secondary" />
                  <div className="w-2 h-2 rounded-full bg-mesh-tertiary" />
                </div>
              </div>
            </div>
            <h1 className="font-bold text-xl">AI Mesh</h1>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <ProjectManager />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Info className="h-4 w-4 mr-2" />
              Help
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-6 grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Prompt & Settings</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <PromptInput />
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">AI Agents</h2>
              <AddAgentButton />
            </div>
            <div className="space-y-4">
              {agents.length > 0 ? (
                agents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Settings className="h-6 w-6 text-muted-foreground" />
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
          <Card className="overflow-hidden">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Conversation</CardTitle>
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
          
          <Card className="overflow-hidden">
            <FinalOutputPanel />
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4">
        <div className="container flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            AI Mesh — Orchestrate conversations between multiple AIs
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              <div className="flex items-center">
                <Github className="h-4 w-4 mr-1" />
                <span>GitHub</span>
              </div>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
