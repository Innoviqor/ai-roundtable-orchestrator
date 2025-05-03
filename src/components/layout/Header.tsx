
import React from 'react';
import { useProject } from '@/contexts/ProjectContext';
import ProjectManager from '../ProjectManager';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { EnhancedTooltip } from '@/components/ui/enhanced-tooltip';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Github, Info, MenuIcon, Moon, Settings, Sun } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const { currentProject } = useProject();

  return (
    <header className="border-b border-white/10 backdrop-blur-sm bg-black/50 sticky top-0 z-10 h-16">
      <div className="container mx-auto flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-2">
          <div className="lg:hidden">
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
            
            <EnhancedTooltip content="View source code on GitHub">
              <Button variant="outline" size="sm" className="transition-all hover:shadow-glow">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </EnhancedTooltip>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
