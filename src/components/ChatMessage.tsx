'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex gap-3 py-4 animate-slide-up', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0',
          isUser ? 'bg-brand-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
        )}
      >
        {isUser ? 'U' : 'AI'}
      </div>

      {/* Content */}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-brand-600 text-white rounded-tr-sm'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-sm'
        )}
      >
        {content || (isStreaming && <TypingIndicator />)}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <span className="flex gap-1 items-center h-5">
      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse-dot" />
      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse-dot [animation-delay:0.2s]" />
      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse-dot [animation-delay:0.4s]" />
    </span>
  );
}
