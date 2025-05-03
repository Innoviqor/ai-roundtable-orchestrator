
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Sidebar as SidebarUI, SidebarContent, SidebarHeader, SidebarFooter, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import our new modular components
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import Conversation from './conversation/Conversation';
import FinalOutputButton from './conversation/FinalOutputButton';

const MainLayout: React.FC = () => {
  const { currentProject } = useProject();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const { open, toggleSidebar } = useSidebar();
  
  // Custom sidebar width variables
  const sidebarWidth = "min(360px, 30vw)";  // Updated width
  const sidebarWidthIcon = "3rem";
  const sidebarWidthMobile = "90%";

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
    <div className="min-h-screen flex flex-col w-full">
      {/* Background mesh gradients */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(at_top_right,rgba(127,90,240,0.15),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(at_bottom_left,rgba(0,178,255,0.08),transparent_50%)] pointer-events-none" />
      
      {/* Header Component */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar (Collapsible) */}
        <SidebarUI 
          collapsible="icon" 
          style={{
            '--sidebar-width': sidebarWidth,
            '--sidebar-width-icon': sidebarWidthIcon,
            '--sidebar-width-mobile': sidebarWidthMobile
          } as React.CSSProperties}
        >
          <SidebarHeader className="flex items-center p-4 border-b border-white/10">
            <div className="text-lg font-medium gradient-text">Configure</div>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-8 w-8 ml-auto transition-all hover:shadow-glow lg:hidden" 
              onClick={toggleSidebar}
            >
              {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </SidebarHeader>
          
          <SidebarContent className="scrollbar-thin">
            <Sidebar />
          </SidebarContent>
          
          <SidebarFooter className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <p className="text-xs text-mesh-textSecondary">AI Mesh v1.0</p>
              <FinalOutputButton />
            </div>
          </SidebarFooter>
        </SidebarUI>

        {/* Main Content */}
        <SidebarInset className="flex-grow overflow-hidden">
          {/* Conversation View */}
          <Card className="h-full overflow-hidden mesh-card flex flex-col">
            <div className="flex-1 overflow-auto scrollbar-thin">
              <Conversation />
            </div>
            
            {/* Mobile-only bottom view output button */}
            <div className="p-4 border-t border-white/10 md:hidden">
              <FinalOutputButton />
            </div>
          </Card>
        </SidebarInset>
      </div>

      {/* Footer - Hidden on mobile to save space */}
      <footer className="border-t border-white/10 py-2 backdrop-blur-sm bg-black/50 hidden lg:block">
        <div className="container max-w-6xl mx-auto flex items-center justify-between px-4">
          <div className="text-sm text-mesh-textSecondary">
            AI Mesh — Orchestrate conversations between multiple AIs
          </div>
          <a 
            href="https://github.com" 
            target="_blank"
            rel="noopener noreferrer" 
            className="text-sm text-mesh-textSecondary hover:text-mesh-textPrimary transition-colors flex items-center gap-1"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
