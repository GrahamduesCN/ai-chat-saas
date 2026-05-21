# AI Chat SaaS Template

A production-ready AI chat application with real-time streaming. Built with Next.js 14, Tailwind CSS, and TypeScript.

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/GrahamduesCN/ai-chat-saas)

---

## Preview

Landing page with provider selection, dark mode, and responsive design. Chat interface with streaming, typing indicator, and stop-generation.

## What You Get

- **Landing page** — Hero, features grid, provider showcase, tech stack
- **Chat interface** — Real-time SSE streaming, message bubbles, typing indicator
- **Multi-provider** — OpenAI, Anthropic, Ollama. Switch with one click.
- **API key protection** — All AI calls go through server-side API routes. Keys never reach the browser.
- **Dark mode** — Built-in with Tailwind CSS
- **Responsive** — Mobile, tablet, desktop
- **TypeScript** — Fully typed
- **Zero config** — Clone, set env vars, `npm run dev`, done.

## Quick Start

```bash
# Clone
git clone <repo-url> my-ai-chat
cd my-ai-chat

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local — add at least one API key

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → click "Open Chat" → start chatting.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|:--:|
| `OPENAI_API_KEY` | OpenAI API key | For OpenAI |
| `ANTHROPIC_API_KEY` | Anthropic API key | For Anthropic |
| `OLLAMA_BASE_URL` | Ollama server URL | For Ollama |
| `DEFAULT_PROVIDER` | Default provider: `openai`, `anthropic`, or `ollama` | |

You only need ONE provider configured.

## Deploy

Push to Vercel, set environment variables, done.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── globals.css          # Tailwind + custom scrollbar
│   ├── chat/
│   │   └── page.tsx         # Chat interface (client component)
│   └── api/
│       └── chat/
│           └── route.ts     # Server-side AI proxy (SSE)
├── components/
│   ├── ChatMessage.tsx      # Message bubble with typing indicator
│   ├── ChatInput.tsx        # Textarea with auto-resize
│   └── ProviderSelector.tsx # Provider toggle
└── lib/
    ├── provider.ts          # AI provider logic (OpenAI/Anthropic/Ollama)
    └── utils.ts             # cn(), formatTime()
```

## Customization

### Change brand color

Edit `tailwind.config.js`:

```js
colors: {
  brand: {
    600: '#YOUR_HEX', // Primary color
    700: '#YOUR_HEX', // Hover state
  },
},
```

### Add a new provider

1. Add a case to `src/lib/provider.ts`
2. Add an option to `src/components/ProviderSelector.tsx`

### Add authentication

Wrap the chat page with your auth provider (NextAuth.js, Clerk, etc.).

## Related Projects

| Project | Description |
|---------|-------------|
| [ai-agent-starter](https://github.com/GrahamduesCN/ai-agent-starter) | The AI provider framework this is built on |
| [dev-cli-kit](https://github.com/GrahamduesCN/dev-cli-kit) | CLI toolkit for project scaffolding |
| [nextjs-saas-starter](https://github.com/GrahamduesCN/nextjs-saas-starter) | The SaaS starter this template extends |

## License

MIT — use it for your SaaS, your clients, or your side project.
