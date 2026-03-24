
export type AIPlatform = 
  | 'OpenAI' 
  | 'Anthropic' 
  | 'Google' 
  | 'Meta'
  | 'Grok'
  | 'Perplexity'
  | 'Together'
  | 'Groq'
  | 'Cohere'
  | 'Mistral'
  | 'Replicate'
  | 'Bedrock'
  | 'Canva'
  | 'Suno'
  | 'Lovable' 
  | 'Local' 
  | 'Other';

export type AgentType = 'chat' | 'task';

export type ConversationMode = 'sequential' | 'simultaneous';

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  systemPrompt: string;
  platform: AIPlatform;
  apiKey?: string;
  type: AgentType;
  avatar?: string;
  isLeader?: boolean;
}

export interface Message {
  id: string;
  agentId: string;
  content: string;
  timestamp: number;
  status?: 'thinking' | 'complete' | 'error';
}

export interface Project {
  id: string;
  name: string;
  prompt: string;
  agents: AIAgent[];
  conversationMode: ConversationMode;
  messages: Message[];
  created: number;
  updated: number;
  conversationRounds?: number;
  maxConversationRounds?: number;
}

// Example data for demonstration purposes
export const exampleAgents: AIAgent[] = [
  {
    id: 'architect-id',
    name: 'Architect',
    role: 'System Designer',
    systemPrompt: 'You are an architectural planner for projects, focusing on structure, design patterns, and overall vision.',
    platform: 'OpenAI',
    type: 'chat',
    isLeader: true
  },
  {
    id: 'researcher-id',
    name: 'Researcher',
    role: 'Information Specialist',
    systemPrompt: 'You analyze requirements and provide relevant information, options, and best practices. Use web search when helpful.',
    platform: 'Perplexity',
    type: 'chat',
    isLeader: false
  },
  {
    id: 'analyst-id',
    name: 'Analyst',
    role: 'Data Expert',
    systemPrompt: 'You provide deep analysis and insights, breaking down complex topics into understandable components.',
    platform: 'Anthropic',
    type: 'chat',
    isLeader: false
  },
  {
    id: 'composer-id',
    name: 'Composer',
    role: 'Content Creator',
    systemPrompt: 'You generate creative content like music, images, or text based on project requirements.',
    platform: 'Suno',
    type: 'chat',
    isLeader: false
  },
  {
    id: 'builder-id',
    name: 'Builder',
    role: 'Developer',
    systemPrompt: 'You implement the technical solutions with clean, efficient code and practical approaches.',
    platform: 'Together',
    type: 'chat',
    isLeader: false
  }
];

export const exampleMessages: Message[] = [
  {
    id: 'prompt-msg',
    agentId: 'user',
    content: "Make me a 1-page site that introduces a song I created and includes a play button for the audio.",
    timestamp: Date.now() - 1000 * 60 * 10,
    status: 'complete'
  },
  {
    id: 'architect-msg',
    agentId: 'architect-id',
    content: "[TEAM COORDINATOR] We need to create a simple yet elegant one-page website to showcase the user's song. The page should include:\n\n1. A compelling title and artist information\n2. Attractive visual theme that matches the song's mood\n3. An embedded audio player with play/pause controls\n4. Brief description or lyrics section\n\nTeam, here's how we should proceed:\n- Designer: Focus on the visual elements and user experience\n- Researcher: Identify the best audio embedding approach\n- Builder: Prepare the code framework for a responsive page",
    timestamp: Date.now() - 1000 * 60 * 9,
    status: 'complete'
  },
  {
    id: 'researcher-msg',
    agentId: 'researcher-id',
    content: "Based on my analysis, we have several options for the audio player implementation:\n\n1. HTML5 <audio> element - Simple, widely supported, customizable with CSS\n2. React audio libraries like react-h5-audio-player - Feature-rich\n3. Streaming service embeds (Soundcloud, Spotify) - If the track is hosted there\n\nFor a custom one-page site, I recommend the HTML5 audio approach with custom styling to match the page theme. This gives us the most control with minimal dependencies.",
    timestamp: Date.now() - 1000 * 60 * 8,
    status: 'complete'
  },
  {
    id: 'composer-msg',
    agentId: 'composer-id',
    content: "I've analyzed the song description and created a visual mood board to match it. For a modern, engaging music page, I recommend:\n\n- Color scheme: Deep purples and electric blues for an immersive feel\n- Typography: Sans-serif for titles (Montserrat), serif for descriptions (Georgia)\n- Visual elements: Subtle animated waveform behind the play button\n- Layout: Minimalist with focus on the play button as the central element\n\nThis approach keeps the song as the star while providing an engaging visual context.",
    timestamp: Date.now() - 1000 * 60 * 7,
    status: 'complete'
  },
  {
    id: 'builder-msg',
    agentId: 'builder-id',
    content: "Here's a React implementation using Tailwind CSS for the song site:\n\n```jsx\nimport { useState, useRef } from 'react';\n\nconst MusicPlayer = () => {\n  const [isPlaying, setIsPlaying] = useState(false);\n  const audioRef = useRef(null);\n  \n  const togglePlay = () => {\n    if (isPlaying) {\n      audioRef.current.pause();\n    } else {\n      audioRef.current.play();\n    }\n    setIsPlaying(!isPlaying);\n  };\n\n  return (\n    <div className=\"min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center p-4\">\n      <div className=\"max-w-md w-full bg-black/20 backdrop-blur-xl p-8 rounded-xl border border-white/10 shadow-xl\">\n        <h1 className=\"text-3xl font-bold text-white mb-2\">Cosmic Dreams</h1>\n        <p className=\"text-purple-200 mb-6\">by The User</p>\n        \n        <div className=\"relative mb-6\">\n          <div className=\"aspect-square rounded-md overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10\">\n            <div className=\"absolute inset-0 bg-waveform-pattern opacity-20\"></div>\n            <button \n              onClick={togglePlay}\n              className=\"h-16 w-16 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 flex items-center justify-center transition-all\"\n            >\n              {isPlaying ? (\n                <svg xmlns=\"http://www.w3.org/2000/svg\" className=\"h-8 w-8 text-white\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">\n                  <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M10 9v6m4-6v6M9 9h1m4 0h1m-5 6h1m4 0h1\" />\n                </svg>\n              ) : (\n                <svg xmlns=\"http://www.w3.org/2000/svg\" className=\"h-8 w-8 text-white\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">\n                  <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z\" />\n                  <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M21 12a9 9 0 11-18 0 9 9 0 0118 0z\" />\n                </svg>\n              )}\n            </button>\n          </div>\n        </div>\n        \n        <audio ref={audioRef} className=\"hidden\" controls>\n          <source src=\"/song.mp3\" type=\"audio/mpeg\" />\n          Your browser does not support the audio element.\n        </audio>\n        \n        <div className=\"mb-6\">\n          <h2 className=\"text-xl text-white mb-2\">About this track</h2>\n          <p className=\"text-purple-200/80\">A journey through space and time, capturing the essence of dreams and exploration. Created with passion and imagination.</p>\n        </div>\n        \n        <div className=\"text-center text-sm text-purple-200/60\">\n          © 2024 All Rights Reserved\n        </div>\n      </div>\n    </div>\n  );\n};\n\nexport default MusicPlayer;\n```\n\nThe component includes:\n- Responsive layout using Tailwind\n- Custom play button with toggle functionality\n- Hidden audio element with controls\n- Space for track information\n\nJust add your audio file at '/song.mp3' in the public folder.",
    timestamp: Date.now() - 1000 * 60 * 5,
    status: 'complete'
  },
  {
    id: 'architect-final-msg',
    agentId: 'architect-id',
    content: "[TEAM COORDINATOR] Perfect! We've created a comprehensive solution:\n\n1. The Researcher provided audio implementation options\n2. The Composer developed the visual design direction\n3. The Builder created a ready-to-use React component\n\nThis gives the user a complete package - a visually appealing, functional music showcase page with minimal effort required to implement. The code can be easily customized to change colors, text, and the audio file path.\n\nTeam, excellent work coordinating our efforts to deliver a cohesive solution!",
    timestamp: Date.now() - 1000 * 60 * 3,
    status: 'complete'
  }
];
