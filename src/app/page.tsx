import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Nav */}
      <header className="border-b border-slate-200 dark:border-slate-800">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
          <span className="text-xl font-bold text-brand-600">AI Chat</span>
          <Link
            href="/chat"
            className="text-sm bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
          >
            Open Chat
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main>
        <section className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
            Multi-Provider AI
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Chat with AI.
            <br />
            <span className="text-brand-600">Your keys. Your control.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A production-ready chat application with real-time streaming. Supports OpenAI, Anthropic, and
            Ollama. API keys stay on your server — never exposed to the client.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/chat"
              className="px-8 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors text-lg shadow-lg shadow-brand-600/25"
            >
              Try it now
            </Link>
            <a
              href="#features"
              className="px-8 py-3 border border-slate-300 dark:border-slate-700 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-lg"
            >
              Learn more
            </a>
          </div>
        </section>

        {/* Providers */}
        <section className="max-w-6xl mx-auto px-4 py-24 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white">
            Choose your provider
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {providers.map((p) => (
              <div
                key={p.name}
                className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg transition-all"
              >
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{p.name}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-6xl mx-auto px-4 py-24 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white">
            Everything included
          </h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="flex gap-3 p-4">
                <span className="text-brand-600 text-lg shrink-0 mt-0.5">{f.icon}</span>
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white text-sm">{f.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech */}
        <section className="max-w-6xl mx-auto px-4 py-24 border-t border-slate-200 dark:border-slate-800 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Built with</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'App Router', 'SSE Streaming', 'Dark Mode', 'Responsive'].map(
              (t) => (
                <span
                  key={t}
                  className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400"
                >
                  {t}
                </span>
              )
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-500">
        AI Chat SaaS Template · Ready to deploy
      </footer>
    </div>
  );
}

const providers = [
  {
    name: 'OpenAI',
    icon: '⚡',
    desc: 'GPT-4o, GPT-4 Turbo. Set your API key and start chatting.',
  },
  {
    name: 'Anthropic',
    icon: '🧠',
    desc: 'Claude Sonnet 4. Switch providers with one click.',
  },
  {
    name: 'Ollama',
    icon: '🏠',
    desc: 'Run models locally. No API key needed. Full privacy.',
  },
];

const features = [
  { icon: '💬', title: 'Real-time streaming', desc: 'SSE-based token streaming — responses appear as they are generated.' },
  { icon: '🔐', title: 'API key protection', desc: 'Keys stay server-side. Frontend never sees them.' },
  { icon: '🔄', title: 'Provider switching', desc: 'Toggle between OpenAI, Anthropic, and Ollama mid-conversation.' },
  { icon: '🎨', title: 'Dark mode', desc: 'Built-in dark mode with Tailwind CSS class strategy.' },
  { icon: '📱', title: 'Responsive', desc: 'Works on desktop, tablet, and mobile.' },
  { icon: '⚡', title: 'Zero config deploy', desc: 'Push to Vercel, set env vars, done.' },
  { icon: '📝', title: 'Typing indicator', desc: 'Animated dots show when AI is generating.' },
  { icon: '🛑', title: 'Stop generation', desc: 'Cancel a response mid-stream.' },
  { icon: '🧩', title: 'Clean TypeScript', desc: 'Fully typed. No `any` in sight.' },
];
