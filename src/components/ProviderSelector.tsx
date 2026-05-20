'use client';

type Provider = 'openai' | 'anthropic' | 'ollama';

interface ProviderSelectorProps {
  value: Provider;
  onChange: (p: Provider) => void;
}

const providers: { id: Provider; label: string }[] = [
  { id: 'openai', label: 'OpenAI' },
  { id: 'anthropic', label: 'Anthropic' },
  { id: 'ollama', label: 'Ollama' },
];

export function ProviderSelector({ value, onChange }: ProviderSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
      {providers.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={`px-3 py-1 text-xs rounded-md transition-colors ${
            value === p.id
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
