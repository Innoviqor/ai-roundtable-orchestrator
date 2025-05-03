import React, { useState } from 'react';
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
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Github, Info, Moon, Settings, Sparkles, Sun, MenuIcon, PanelLeftIcon, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarTrigger, SidebarRail, SidebarInset, useSidebar } from '@/components/ui/sidebar';
const MainLayout: React.FC = () => {
  const {
    currentProject
  } = useProject();
  const {
    agents
  } = currentProject;
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const {
    open,
    toggleSidebar
  } = useSidebar();
  const [showOutputDialog, setShowOutputDialog] = useState(false);

  // Custom sidebar width variables - DOUBLED the width
  const sidebarWidth = "32rem"; // Doubled from 16rem
  const sidebarWidthIcon = "3rem";
  const sidebarWidthMobile = "90%"; // Adjusted for mobile

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
  return <div className="min-h-screen flex flex-col w-full">
      {/* Background mesh gradients */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(at_top_right,rgba(127,90,240,0.15),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(at_bottom_left,rgba(0,178,255,0.08),transparent_50%)] pointer-events-none" />
      
      {/* Header - Made more prominent and always visible */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/50 sticky top-0 z-10 h-16">
        <div className="container max-w-6xl mx-auto flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <div className="bg-gradient-to-r from-mesh-purple to-mesh-blue rounded-md p-0.5 mr-2">
              <div className="bg-mesh-background rounded-sm p-1.5">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-mesh-purple animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-mesh-blue animate-pulse" style={{
                  animationDelay: '0.2s'
                }} />
                  <div className="w-2 h-2 rounded-full bg-mesh-green animate-pulse" style={{
                  animationDelay: '0.4s'
                }} />
                </div>
              </div>
            </div>
            <h1 className="font-bold text-xl gradient-text">AI Mesh</h1>
            <Separator orientation="vertical" className="h-6 mx-2 hidden md:block" />
            <div className="hidden md:block">
              <ProjectManager />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Left Sidebar Toggle (Visible on all screens) */}
            <Button variant="outline" size="icon" className="rounded-full h-8 w-8 transition-all hover:shadow-glow flex" onClick={toggleSidebar}>
              {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>

            {/* Final Output Dialog Trigger */}
            <Button variant="outline" size="sm" className="transition-all hover:shadow-glow" onClick={() => setShowOutputDialog(true)}>
              <FileText className="h-4 w-4 mr-2" />
              View Output
            </Button>
            
            <EnhancedTooltip content={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8 transition-all hover:shadow-glow" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </EnhancedTooltip>
            
            {/* Mobile menu drawer */}
            <div className="md:hidden">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                    <MenuIcon className="h-4 w-4" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="px-4 py-6 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Menu</h3>
                    </div>
                    <div className="space-y-2">
                      <ProjectManager />
                      <Button variant="outline" size="sm" className="w-full justify-start transition-all">
                        <Info className="h-4 w-4 mr-2" />
                        Help
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start transition-all">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start transition-all">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </Button>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
            
            {/* Desktop menu buttons */}
            <div className="hidden md:flex items-center gap-2">
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
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar (Collapsible) with custom width */}
        <Sidebar collapsible="icon" style={{
        '--sidebar-width': sidebarWidth,
        '--sidebar-width-icon': sidebarWidthIcon,
        '--sidebar-width-mobile': sidebarWidthMobile
      } as React.CSSProperties}>
          <SidebarRail className="px-0 mx-0" />
          <SidebarHeader className="flex items-center">
            <div className="text-lg font-medium gradient-text px-2">Configure</div>
          </SidebarHeader>
          <SidebarContent>
            <div className="space-y-6 p-2">
              {/* Left Column Content */}
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
                  {agents.length > 0 ? agents.map(agent => <AgentCard key={agent.id} agent={agent} />) : <Card className="border-dashed border-white/10 bg-card/50 backdrop-blur-sm">
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
                    </Card>}
                </div>
              </div>
            </div>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <p className="text-xs text-mesh-textSecondary">AI Mesh v1.0</p>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex-grow">
          {/* Conversation View (Full width) */}
          <div className="h-full">
            <Card className="h-full overflow-hidden mesh-card">
              <CardHeader className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="gradient-text">Conversation</CardTitle>
                    <CardDescription>
                      AI agents working together on your prompt
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="icon" className="rounded-full h-8 w-8 md:hidden" onClick={toggleSidebar}>
                    {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <ScrollArea className="h-[calc(100vh-12rem)] md:h-[calc(100vh-14rem)]">
                <ConversationView />
              </ScrollArea>
            </Card>
          </div>
        </SidebarInset>
      </div>

      {/* Final Output Dialog */}
      <Dialog open={showOutputDialog} onOpenChange={setShowOutputDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <FinalOutputPanel />
        </DialogContent>
      </Dialog>

      {/* Mobile-only bottom button for output */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-10">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full rounded-b-none rounded-t-md border-b-0 bg-black/50 backdrop-blur-sm py-2">
              <span>View Final Output</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh]">
            <div className="p-4">
              <h3 className="font-medium text-lg mb-4">Final Output</h3>
              <div className="max-h-[60vh] overflow-y-auto">
                <FinalOutputPanel />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Footer - Hidden on mobile to save space */}
      <footer className="border-t border-white/10 py-2 backdrop-blur-sm bg-black/50 hidden md:block">
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
    </div>;
};
export default MainLayout;