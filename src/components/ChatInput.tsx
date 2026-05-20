'use client';

import { useState, useRef, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  };

  return (
    <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
      <div className="max-w-3xl mx-auto flex gap-3 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50 placeholder:text-slate-400"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="shrink-0 w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </button>
      </div>
      <p className="text-xs text-slate-400 text-center mt-2">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
