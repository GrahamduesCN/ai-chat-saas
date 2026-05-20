'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { ProviderSelector } from '@/components/ProviderSelector';

type Provider = 'openai' | 'anthropic' | 'ollama';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<Provider>('openai');
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content };
    setMessages((prev) => [...prev, userMsg]);
    setError(null);
    setIsLoading(true);

    // Create assistant placeholder
    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '' };
    setMessages((prev) => [...prev, assistantMsg]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const allMessages = [
        { role: 'system' as const, content: 'You are a helpful AI assistant. Be concise and clear.' },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content },
      ];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages, provider }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Error ${res.status}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const json = trimmed.slice(6);
          if (json === '[DONE]') continue;

          try {
            const parsed = JSON.parse(json);
            if (parsed.content) {
              fullContent += parsed.content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: fullContent } : m
                )
              );
            }
          } catch {
            // skip
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err.message);
      // Remove empty assistant message on error
      setMessages((prev) => prev.filter((m) => m.id !== assistantId || m.content));
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 h-14 flex items-center justify-between shrink-0">
        <Link href="/" className="text-lg font-bold text-brand-600">
          AI Chat
        </Link>
        <ProviderSelector value={provider} onChange={setProvider} />
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand-600">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Start a conversation</h2>
              <p className="mt-2 text-sm text-slate-500 max-w-sm">
                Ask anything. The AI responds in real-time with streaming output.
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <ChatMessage
              key={m.id}
              role={m.role}
              content={m.content}
              isStreaming={isLoading && i === messages.length - 1 && m.role === 'assistant'}
            />
          ))}
          {error && (
            <div className="p-3 my-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0">
        {isLoading && (
          <div className="max-w-3xl mx-auto px-4 flex justify-center">
            <button
              onClick={handleStop}
              className="text-xs text-slate-500 hover:text-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full mb-2 transition-colors"
            >
              Stop generating
            </button>
          </div>
        )}
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
