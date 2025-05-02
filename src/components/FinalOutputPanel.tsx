
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Download, FileCode, FileText, Save } from 'lucide-react';
import { toast } from 'sonner';

const FinalOutputPanel: React.FC = () => {
  const { currentProject } = useProject();
  const [activeTab, setActiveTab] = useState('text');
  const [editedOutput, setEditedOutput] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const messages = currentProject.messages;
  const hasMessages = messages.length > 0;

  // Generate final output based on conversation
  const generateOutput = () => {
    if (!hasMessages) return '';
    
    switch (activeTab) {
      case 'text':
        return messages.map(msg => {
          const agent = currentProject.agents.find(a => a.id === msg.agentId);
          return `${agent?.name}: ${msg.content}`;
        }).join('\n\n');
        
      case 'markdown':
        return `# AI Mesh Conversation - ${currentProject.name}\n\n` +
          `**Prompt:** ${currentProject.prompt}\n\n` +
          messages.map(msg => {
            const agent = currentProject.agents.find(a => a.id === msg.agentId);
            return `## ${agent?.name} (${agent?.role})\n\n${msg.content}`;
          }).join('\n\n');
          
      case 'json':
        const output = {
          project: currentProject.name,
          prompt: currentProject.prompt,
          timestamp: new Date().toISOString(),
          messages: messages.map(msg => {
            const agent = currentProject.agents.find(a => a.id === msg.agentId);
            return {
              agent: agent?.name,
              role: agent?.role,
              platform: agent?.platform,
              content: msg.content,
              timestamp: new Date(msg.timestamp).toISOString()
            };
          })
        };
        return JSON.stringify(output, null, 2);
        
      default:
        return '';
    }
  };

  const exportOutput = () => {
    const content = isEditing ? editedOutput : generateOutput();
    
    let mime = 'text/plain';
    let ext = 'txt';
    
    if (activeTab === 'markdown') {
      mime = 'text/markdown';
      ext = 'md';
    } else if (activeTab === 'json') {
      mime = 'application/json';
      ext = 'json';
    }
    
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.name.replace(/\s+/g, '-').toLowerCase()}-output.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Output exported as ${ext.toUpperCase()}`);
  };

  const copyToClipboard = () => {
    const content = isEditing ? editedOutput : generateOutput();
    navigator.clipboard.writeText(content);
    toast.success('Output copied to clipboard');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsEditing(false);
    setEditedOutput('');
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Final Output</h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasMessages}
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasMessages}
              onClick={exportOutput}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
          <TabsList className="grid grid-cols-3 w-full max-w-xs">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {!hasMessages ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="rounded-full bg-muted p-3 mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium">No Output Yet</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Run a conversation with your AI agents to generate output.
            </p>
          </div>
        ) : isEditing ? (
          <Textarea
            value={editedOutput}
            onChange={(e) => setEditedOutput(e.target.value)}
            className="h-full min-h-[300px] font-mono text-sm"
          />
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {generateOutput()}
          </pre>
        )}
      </div>

      {hasMessages && (
        <div className="p-4 border-t flex justify-end">
          {isEditing ? (
            <Button
              onClick={() => setIsEditing(false)}
              variant="secondary"
              size="sm"
            >
              <Save className="h-4 w-4 mr-1" />
              Done Editing
            </Button>
          ) : (
            <Button
              onClick={() => {
                setIsEditing(true);
                setEditedOutput(generateOutput());
              }}
              variant="secondary"
              size="sm"
            >
              <FileCode className="h-4 w-4 mr-1" />
              Edit Output
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default FinalOutputPanel;
