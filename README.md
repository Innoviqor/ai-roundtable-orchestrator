# AI Roundtable Orchestrator

An advanced multi-agent AI orchestration platform where multiple AI models collaborate to solve complex tasks.

**🎪 Bring together your favorite AIs to brainstorm, design, code, and create.**

## Features

✨ **15+ AI Platforms Supported:**
- OpenAI (GPT-4o-mini)
- Anthropic (Claude 3.5)
- Google (Gemini 1.5)
- Grok (X AI)
- Perplexity (Web Search)
- Together AI (Meta Llama, Mistral)
- Groq (Lightning Fast)
- Cohere, Mistral, Replicate
- AWS Bedrock
- + Canva, Suno, Lovable, Local Ollama, Custom endpoints

🤝 **Multi-Agent Collaboration:**
- Sequential or simultaneous agent responses
- Leader agent coordinates team
- Custom system prompts per agent
- Persistent conversation history

🎨 **Beautiful UI:**
- Dark mode with glassmorphism
- Real-time streaming responses
- Rich Markdown support
- Responsive design

📦 **Production Ready:**
- Full TypeScript support
- Error handling & validation
- API key security (via backend proxy)
- LocalStorage persistence

## Quick Start

```bash
# Install
npm install

# Run locally
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:5173` and start orchestrating!

## Getting API Keys

See **[API_KEYS.md](./API_KEYS.md)** for complete guide on getting free & paid API keys.

**TL;DR:** 
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/
- Google: https://aistudio.google.com/app/apikey
- Groq (free!): https://console.groq.com/

## Setup & Deployment

See **[SETUP.md](./SETUP.md)** for:
- Local development
- Deployment (Vercel, Netlify, Docker)
- Security best practices
- Performance optimization

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/71973125-d735-4e52-9b89-b289c79991dc) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/71973125-d735-4e52-9b89-b289c79991dc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
