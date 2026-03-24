# AI Roundtable Orchestrator - API Keys Guide

This document explains how to obtain and configure API keys for all supported AI platforms.

## Quick Reference Table

| Platform | Free Tier? | Speed | Cost | Notes |
|----------|-----------|-------|------|-------|
| OpenAI | $5 credit | Medium | $0.15/1M tokens | Most popular, GPT-4o-mini |
| Anthropic | $5 credit | Medium | $0.80/1M tokens | Best for reasoning, Claude 3.5 |
| Google | $300 credit | Fast | $0.075/1M tokens | Gemini 1.5 Pro, web search |
| Grok | Limited | Very Fast | $5/month | X/Twitter integration, real-time |
| Perplexity | Free tier | Fast | $0-20/month | Web search included, Sonar Pro |
| Together AI | Free tier | Very Fast | $0.05/1M tokens | Meta Llama, Mistral, cheap |
| Groq | Free tier | **Fastest** | $0.05/1M tokens | Lightning-fast inference |
| Cohere | Free tier | Medium | $0.15/1M tokens | Good for enterprise, Command R+ |
| Mistral | Free tier | Fast | $0.07/1M tokens | Open source focus, EU-based |
| Replicate | Free tier | Medium | $0.001-0.01/sec | Image/video generation, simple |
| AWS Bedrock | Pay-per-use | Medium | $0.80/1M tokens | Claude via AWS, enterprise |
| Meta (Llama) | Free | Fast | Via Together/Replicate | Open source, powerful |
| Canva | Paid API | Medium | Contact sales | Design generation, premium |
| Suno | Free tier | Slow | $0-10/month | Music generation, 5 songs/day free |
| Lovable | Freemium | N/A | Free | Web app builder integration |
| Local (Ollama) | Free | Depends | $0 | Run locally, no API needed |

---

## Getting API Keys

### 1. **OpenAI** (gpt-4o-mini)
- **Link:** https://platform.openai.com/api-keys
- **Steps:**
  1. Sign up or log in
  2. Go to "API Keys" → "Create new secret key"
  3. Copy and paste into the app
- **Cost:** $0.15 per 1M input tokens, $0.60 per 1M output tokens
- **Use Case:** General chat, reasoning, code generation

### 2. **Anthropic** (Claude 3.5 Sonnet)
- **Link:** https://console.anthropic.com/
- **Steps:**
  1. Sign up or log in
  2. Go to "API Keys"
  3. Click "Create Key"
  4. Copy and paste
- **Cost:** $0.80 per 1M input tokens, $2.40 per 1M output tokens
- **Use Case:** Deep reasoning, analysis, writing
- **Note:** Best value for complex tasks

### 3. **Google Gemini** (Gemini 1.5 Pro)
- **Link:** https://aistudio.google.com/app/apikey
- **Steps:**
  1. Click "Create API Key"
  2. Select your project
  3. Copy the key
- **Free Tier:** $300 credits for 60 days
- **Cost:** $0.075 per 1M input tokens (after free tier)
- **Use Case:** Web search integration, multimodal tasks

### 4. **Grok** (X AI)
- **Link:** https://console.x.ai/
- **Steps:**
  1. Sign in with X/Twitter account
  2. Create project → Generate API key
  3. Copy key
- **Cost:** $5/month subscription (includes API)
- **Use Case:** Real-time info, Twitter integration, edgy responses

### 5. **Perplexity AI** (Sonar Pro)
- **Link:** https://www.perplexity.ai/dashboard/api
- **Steps:**
  1. Sign up for account
  2. Go to API section
  3. Generate token
- **Free Tier:** Limited (search-focused)
- **Cost:** $0-20/month for API
- **Use Case:** Web search + reasoning, research assistant

### 6. **Together AI** (Meta Llama, Mistral)
- **Link:** https://api.together.xyz/
- **Steps:**
  1. Sign up
  2. Go to "Manage API Keys"
  3. Create new key
- **Free Tier:** Yes, $5 free credits
- **Cost:** $0.05/1M tokens (very cheap)
- **Models:** 
  - `meta-llama/Llama-3-70b-chat-hf`
  - `mistralai/Mistral-7B-Instruct-v0.3`
- **Use Case:** Budget-friendly, fast, open-source models

### 7. **Groq** (Fastest Inference)
- **Link:** https://console.groq.com/
- **Steps:**
  1. Sign up
  2. Go to API Keys
  3. Create key
- **Free Tier:** Yes, generous free tier
- **Cost:** $0.05/1M tokens
- **Note:** **Fastest LLM inference** (~100 tokens/second)
- **Use Case:** Speed-critical tasks, real-time applications

### 8. **Cohere** (Command R+)
- **Link:** https://dashboard.cohere.ai/
- **Steps:**
  1. Sign up
  2. Dashboard → API Keys
  3. Generate new key
- **Free Tier:** Yes
- **Cost:** $0.15/1M tokens
- **Use Case:** Enterprise-grade, retrieval-augmented generation

### 9. **Mistral AI** (Mistral Large)
- **Link:** https://console.mistral.ai/
- **Steps:**
  1. Sign up
  2. Go to "API Keys"
  3. Create key
- **Free Tier:** Yes
- **Cost:** $0.07/1M tokens
- **Use Case:** EU-based, privacy-focused, solid open-source models

### 10. **Replicate** (Image/Video Generation)
- **Link:** https://replicate.com/
- **Steps:**
  1. Sign up with GitHub
  2. Go to Account → API Tokens
  3. Create token
- **Free Tier:** Yes (limited)
- **Cost:** $0.001-0.01 per second of compute
- **Models:**
  - Flux (image generation)
  - Stable Diffusion XL
  - Runway (video)
- **Use Case:** Image/video creation, design generation

### 11. **AWS Bedrock** (Claude via AWS)
- **Link:** https://aws.amazon.com/bedrock/
- **Steps:**
  1. Set up AWS account
  2. Enable Bedrock in region (us-east-1 recommended)
  3. Create IAM user with `bedrock:InvokeModel` permissions
  4. Generate access key & secret key
- **Cost:** $0.80/1M input tokens (pay-per-use)
- **Use Case:** Enterprise, need AWS integration

### 12. **Meta Llama** (Open Source)
- **Via:** Together AI or Replicate (recommended)
- **Cost:** Cheap ($0.05-0.10/1M tokens)
- **Models:**
  - Llama-3 70B
  - Llama-2 7B-70B
- **Use Case:** Cost-effective, privacy-friendly, open weights

### 13. **Canva API**
- **Link:** https://www.canva.com/developers/
- **Steps:**
  1. Request API access (may require approval)
  2. Create app in developer dashboard
  3. Generate API token
- **Cost:** Contact sales (paid tier)
- **Use Case:** Design generation, professional graphics

### 14. **Suno API** (Music Generation)
- **Link:** https://platform.suno.ai/
- **Steps:**
  1. Sign up
  2. Create credits in your account ($10 = ~50 songs)
  3. Generate API key from dashboard
- **Free Tier:** 5 songs/day (free tier)
- **Cost:** $0.28-0.40 per song
- **Use Case:** AI music creation, soundtrack generation

### 15. **Lovable** (Web App Builder)
- **Link:** https://lovable.dev/
- **Setup:**
  1. Create project in Lovable
  2. Connect GitHub (optional)
  3. In Roundtable, add Lovable endpoint
- **Cost:** Free for MVP, paid for production
- **Use Case:** Generate full web apps from description

### 16. **Local AI (Ollama)**
- **Setup:**
  1. Download Ollama: https://ollama.ai/
  2. Install and run: `ollama serve`
  3. Pull a model: `ollama pull llama2`
  4. No API key needed!
- **Cost:** Free (just local compute)
- **Default Endpoint:** `http://localhost:11434`
- **Use Case:** Privacy, offline, no API costs

---

## Configuration in App

### Step 1: Add Agent
1. Click "Add Agent" button
2. Give it a name (e.g., "Research Bot")
3. Select platform from dropdown

### Step 2: Paste API Key
1. Get key from the platform (see guide above)
2. Expand agent card (click ▼)
3. Paste key in "API Key" field

### Step 3: Set System Prompt
1. Click "Use Default" for platform default
2. Or write custom instructions

### Step 4: Test
1. Start a conversation
2. If key is valid, agent will respond
3. If invalid, you'll see error message

---

## Cost Optimization Strategy

**Recommended Setup (Budget: $0-50/month):**

1. **Groq** (free tier) - Fastest inference
2. **Together AI** (free tier) - Cheap LLMs (Meta Llama)
3. **OpenAI** (free $5 credit) - GPT-4o-mini for quality
4. **Google Gemini** ($300 free credit) - Web search + multimodal
5. **Local Ollama** (free) - Privacy, no rate limits

**This combo covers:**
- ✅ Fast response (Groq)
- ✅ Cost-effective (Together)
- ✅ Quality reasoning (OpenAI)
- ✅ Web search (Gemini)
- ✅ Offline (Ollama)

---

## Troubleshooting

### "No API key provided"
- Paste your API key in the agent settings
- Make sure you copied the entire key (no spaces)

### "Invalid API key"
- Double-check the key hasn't expired
- Check platform dashboard to regenerate if needed

### "Rate limit exceeded"
- Wait a few minutes or upgrade to paid tier
- Spread requests across multiple APIs

### "Failed to connect to local AI"
- Make sure Ollama is running: `ollama serve`
- Check endpoint is `http://localhost:11434`

### "CORS error"
- Some APIs don't allow browser requests
- Use a backend proxy or API aggregator service

---

## Advanced: Using API Aggregators

If managing multiple keys is tedious, use aggregators:

- **OpenRouter** (https://openrouter.ai/) - Single key, 50+ models
- **AnythingLLM** - Self-hosted aggregator
- **LM Studio** - Local aggregator with web interface

---

## Security Notes

⚠️ **NEVER:**
- Commit API keys to GitHub
- Share keys in screenshots/slack
- Paste keys in public chats

✅ **DO:**
- Use environment variables (when deployed)
- Rotate keys regularly
- Use least-privilege keys when possible
- Set spending limits in platform dashboards

---

## Next Steps

1. Pick 2-3 APIs to start (suggest: Groq + OpenAI + Ollama)
2. Grab their keys using guides above
3. Paste into agents in the app
4. Test with a simple prompt
5. Build your multi-agent team!

Happy orchestrating! 🎪
