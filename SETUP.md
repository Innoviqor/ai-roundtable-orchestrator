# Setup & Deployment Guide

## Local Development

### Prerequisites
- Node.js 16+ and npm
- Your favorite API keys (see API_KEYS.md)

### Installation

```bash
# Clone the repo (already done)
cd ai-roundtable-orchestrator

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

---

## Quick Start (5 minutes)

1. **Add your first agent:**
   - Click "+ Add Agent" button
   - Name: "Helper"
   - Platform: "OpenAI"
   - Click expand (▼)
   - Paste your OpenAI API key
   - Click "Use Default" for system prompt

2. **Start chatting:**
   - Type a prompt in the input box
   - Hit "Send"
   - Watch your agent respond!

3. **Add more agents:**
   - Repeat step 1 with different platforms
   - They'll all participate in the conversation

---

## Deployment Options

### Option 1: Vercel (Recommended - Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Advantages:**
- Free hosting
- Auto-deploys on push
- Fast global CDN
- Easy custom domain

**Disadvantages:**
- API keys exposed if not careful (see Security below)

### Option 2: Netlify (Free)

```bash
# Build the app
npm run build

# Deploy via drag-and-drop or CLI
npm i -g netlify-cli
netlify deploy
```

### Option 3: GitHub Pages (Free, Static Only)

```bash
npm run build
# Upload dist/ folder to GitHub Pages
```

### Option 4: Docker (Self-Hosted)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

```bash
# Build and run
docker build -t ai-roundtable .
docker run -p 3000:3000 ai-roundtable
```

---

## Security & Environment Variables

### The Problem
If you paste API keys directly in the UI, they'll be exposed in browser storage.

### The Solution: Backend Proxy

For production, create a backend that handles API calls:

```javascript
// backend/api/call-ai.js (example)
export default async function handler(req, res) {
  const { platform, messages, apiKey } = req.body;
  
  // API key comes from server-side environment variables
  const realApiKey = process.env[`${platform}_API_KEY`];
  
  // Call the AI API with the secure key
  const response = await fetch('https://api.openai.com/v1/...', {
    headers: { 'Authorization': `Bearer ${realApiKey}` },
    body: JSON.stringify({ messages })
  });
  
  return response.json();
}
```

**Then in the frontend:**
```javascript
// Instead of calling API directly, call your backend
const response = await fetch('/api/call-ai', {
  method: 'POST',
  body: JSON.stringify({ platform, messages })
  // No API key needed here!
});
```

### Environment Variables

Create `.env.local` for local development:

```env
VITE_OPENAI_KEY=sk-...
VITE_ANTHROPIC_KEY=sk-ant-...
VITE_GOOGLE_KEY=...
```

**WARNING:** Even with .env files, frontend keys are not secure. Use backend proxy for production.

---

## Configuration

### Adding a New AI Platform

1. **Update types/index.ts:**
   ```typescript
   export type AIPlatform = 
     | ...existing...
     | 'NewPlatform';
   ```

2. **Add API function in services/aiService.ts:**
   ```typescript
   export const callNewPlatform = async (
     apiKey: string,
     messages: any,
     systemPrompt: string
   ): Promise<string> => {
     // Call the API...
   };
   ```

3. **Add to the switch statement in callExternalAI:**
   ```typescript
   case 'NewPlatform':
     result = await callNewPlatform(apiKey, messages, systemPrompt);
     break;
   ```

4. **Add color in utils/helpers.ts:**
   ```typescript
   case 'NewPlatform':
     return 'bg-gradient-to-r from-green-500 to-blue-500';
   ```

5. **Add to PLATFORMS list in AgentCard.tsx:**
   ```typescript
   const PLATFORMS: AIPlatform[] = [
     // ... existing ...
     'NewPlatform'
   ];
   ```

6. **Add example prompt in mockAgentHandlers.ts:**
   ```typescript
   'NewPlatform': 'You are NewPlatform AI. Be helpful...'
   ```

---

## Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### Manual Testing Checklist
- [ ] Add agent
- [ ] Remove agent
- [ ] Toggle leader status
- [ ] Change platform
- [ ] Paste API key
- [ ] Send message with one agent
- [ ] Send message with multiple agents
- [ ] Sequential mode works
- [ ] Simultaneous mode works
- [ ] Export conversation works

---

## Troubleshooting

### "Port 5173 already in use"
```bash
npm run dev -- --port 3000
```

### "API key not working"
- Check you copied the entire key (no spaces/newlines)
- Verify key is valid at the platform dashboard
- Check for rate limiting

### "CORS error"
Some APIs don't allow cross-origin requests from browsers.

**Solution:** Use a CORS proxy or backend.

```javascript
// Use a CORS proxy (not recommended for production)
const corsUrl = 'https://cors-anywhere.herokuapp.com/';
fetch(corsUrl + 'https://api.example.com/...')
```

### "Blank page after deployment"
- Check browser console for errors
- Make sure build completed: `npm run build`
- Check if routes are configured correctly

### "Local AI not responding"
- Make sure Ollama is running: `ollama serve`
- Verify endpoint is correct: `http://localhost:11434`
- Try: `curl http://localhost:11434/api/tags`

---

## Performance Optimization

### Bundle Size
```bash
npm run build
# Check dist/ folder size
```

### Code Splitting
Already configured in vite.config.ts

### Caching
- Browser caches API responses (in localStorage)
- Projects saved in browser storage (IndexedDB)

### Rate Limiting
To prevent API abuse, consider:

```typescript
// Example: Rate limit per API
const rateLimiter = {
  OpenAI: 60, // requests per minute
  Groq: 100,
  Local: Infinity // no limit
};
```

---

## Monitoring & Logging

### Log API Calls
```typescript
// In aiService.ts
console.log(`Calling ${agent.platform} API for agent: ${agent.name}`);
```

### Monitor Errors
```typescript
window.addEventListener('error', (event) => {
  console.error('Unhandled error:', event.error);
  // Send to error tracking service (Sentry, LogRocket, etc.)
});
```

---

## Scaling

For production with many users:

1. **Use API aggregator** (OpenRouter, AnythingLLM)
   - Single key management
   - Built-in rate limiting
   - Fallback models

2. **Add database**
   - Save projects to persistent storage
   - Track user usage

3. **Add authentication**
   - OpenID Connect / Auth0
   - Protect your endpoints

4. **Use CDN**
   - Cache static assets
   - Serve from edge locations

---

## Support & Resources

- **GitHub Issues:** Report bugs
- **Discussions:** Feature requests
- **API Docs:**
  - OpenAI: https://platform.openai.com/docs
  - Anthropic: https://docs.anthropic.com
  - Google: https://ai.google.dev
  - Etc. (see API_KEYS.md)

---

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Run locally: `npm run dev`
3. ✅ Get API keys (see API_KEYS.md)
4. ✅ Add agents to the app
5. ✅ Test conversations
6. ✅ Deploy to Vercel/Netlify
7. ✅ Share with team!

Happy building! 🚀
