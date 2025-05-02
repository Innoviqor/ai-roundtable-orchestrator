
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
import { Github, Info, Moon, Settings, Sparkles, Sun } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentProject } = useProject();
  const { agents } = currentProject;
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Set initial theme class
  React.useEffect(() => {
    document.documentElement.classList.add(theme);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background mesh gradients */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(at_top_right,rgba(127,90,240,0.15),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(at_bottom_left,rgba(0,178,255,0.08),transparent_50%)] pointer-events-none" />
      
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/50 sticky top-0 z-10">
        <div className="container max-w-6xl flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-mesh-purple to-mesh-blue rounded-md p-0.5 mr-2">
              <div className="bg-mesh-background rounded-sm p-1.5">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-mesh-purple animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-mesh-blue animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-mesh-green animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
            <h1 className="font-bold text-xl gradient-text">AI Mesh</h1>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <ProjectManager />
          </div>
          <div className="flex items-center gap-2">
            <EnhancedTooltip content={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8 transition-all hover:shadow-glow" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </EnhancedTooltip>
            
            <EnhancedTooltip content="Learn how to use AI Mesh effectively">
              <Button variant="outline" size="sm" className="transition-all hover:shadow-glow">
                <Info className="h-4 w-4 mr-2" />
                Help
              </Button>
            </EnhancedTooltip>
            
            <EnhancedTooltip content="Configure application settings and preferences">
              <Button variant="outline" size="sm" className="transition-all hover:shadow-glow">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </EnhancedTooltip>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-6xl py-6 grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-6">
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

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium gradient-text">
                AI Agents
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
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 grid grid-rows-2 gap-6 h-[calc(100vh-9rem)]">
          <Card className="overflow-hidden mesh-card">
            <CardHeader className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="gradient-text">Conversation</CardTitle>
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
          
          <Card className="overflow-hidden mesh-card">
            <FinalOutputPanel />
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-4 backdrop-blur-sm bg-black/50">
        <div className="container max-w-6xl flex items-center justify-between">
          <div className="text-sm text-mesh-textSecondary">
            AI Mesh — Orchestrate conversations between multiple AIs
          </div>
          <div className="flex items-center space-x-4">
            <EnhancedTooltip content="View source code on GitHub">
              <a href="#" className="text-sm text-mesh-textSecondary hover:text-mesh-textPrimary transition-colors">
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
