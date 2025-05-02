
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Download, FilePlus, Loader2, Save, Upload } from 'lucide-react';
import { formatTimestamp } from '@/utils/helpers';

const ProjectManager: React.FC = () => {
  const { currentProject, allProjects, createNewProject, loadProject, exportProject, updateProject } = useProject();
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState(currentProject.name);

  const handleCreateProject = () => {
    setIsCreating(true);
    createNewProject(newProjectName);
    setNewProjectName('');
    setIsCreating(false);
  };

  const handleImportProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const projectData = JSON.parse(e.target?.result as string);
        updateProject({
          ...projectData,
          updated: Date.now()
        });
      } catch (error) {
        console.error('Error importing project:', error);
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="flex items-center space-x-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <FilePlus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Enter a name for your new AI Mesh project.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewProjectName('')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!newProjectName.trim() || isCreating}
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FilePlus className="h-4 w-4 mr-2" />
              )}
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {currentProject.name}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Current Project</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* List of projects */}
          {allProjects.map((project) => (
            <DropdownMenuItem 
              key={project.id}
              onClick={() => loadProject(project.id)}
              disabled={project.id === currentProject.id}
            >
              <div className="flex flex-col">
                <span>{project.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(project.updated)}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
          {allProjects.length === 0 && (
            <DropdownMenuItem disabled>No saved projects</DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setRenameDialogOpen(true)}>
            Rename Project
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportProject}>
            <Download className="h-4 w-4 mr-2" />
            Export Project
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <label className="flex w-full cursor-pointer items-center">
              <Upload className="h-4 w-4 mr-2" />
              <span>Import Project</span>
              <Input
                type="file"
                accept=".json"
                onChange={handleImportProject}
                className="hidden"
              />
            </label>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Enter a new name for your project.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Project Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRenameDialogOpen(false);
                setNewName(currentProject.name);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (newName.trim()) {
                  updateProject({ name: newName });
                  setRenameDialogOpen(false);
                }
              }}
              disabled={!newName.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectManager;
