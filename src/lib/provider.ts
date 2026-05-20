/**
 * Server-side AI provider — API keys stay on the server.
 * Supports OpenAI, Anthropic, Ollama.
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type ProviderType = 'openai' | 'anthropic' | 'ollama';

export async function streamChat(
  messages: ChatMessage[],
  provider?: ProviderType,
  model?: string
): Promise<Response> {
  const p = provider || (process.env.DEFAULT_PROVIDER as ProviderType) || 'openai';

  switch (p) {
    case 'anthropic':
      return streamAnthropic(messages, model);
    case 'ollama':
      return streamOllama(messages, model);
    case 'openai':
    default:
      return streamOpenAI(messages, model);
  }
}

async function streamOpenAI(messages: ChatMessage[], model?: string): Promise<Response> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not configured');

  const res = await fetch(
    `${process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'}/chat/completions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: model || process.env.OPENAI_MODEL || 'gpt-4o',
        messages,
        stream: true,
        stream_options: { include_usage: true },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${err}`);
  }

  return new Response(transformOpenAIStream(res.body!), {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

function transformOpenAIStream(body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const reader = body.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
        return;
      }
      const text = decoder.decode(value, { stream: true });
      const lines = text.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const json = trimmed.slice(6);
        if (json === '[DONE]') {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
          return;
        }
        try {
          const parsed = JSON.parse(json);
          const content = parsed.choices?.[0]?.delta?.content || '';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
        } catch {
          // skip unparseable
        }
      }
    },
  });
}

async function streamAnthropic(messages: ChatMessage[], model?: string): Promise<Response> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY not configured');

  const systemMsg = messages.filter((m) => m.role === 'system');
  const chatMsgs = messages.filter((m) => m.role !== 'system');

  const body: Record<string, unknown> = {
    model: model || process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: chatMsgs.map((m) => ({ role: m.role, content: m.content })),
    stream: true,
  };
  if (systemMsg.length > 0) {
    body.system = systemMsg.map((m) => m.content).join('\n');
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic error ${res.status}: ${err}`);
  }

  return new Response(transformAnthropicStream(res.body!), {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

function transformAnthropicStream(body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const reader = body.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
        return;
      }
      const text = decoder.decode(value, { stream: true });
      const lines = text.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        try {
          const parsed = JSON.parse(trimmed.slice(6));
          if (parsed.type === 'content_block_delta') {
            const content = parsed.delta?.text || '';
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
          }
          if (parsed.type === 'message_stop') {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
            return;
          }
        } catch {
          // skip
        }
      }
    },
  });
}

async function streamOllama(messages: ChatMessage[], model?: string): Promise<Response> {
  const baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

  const res = await fetch(`${baseURL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model || process.env.OLLAMA_MODEL || 'llama3',
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Ollama error ${res.status}: ${err}`);
  }

  return new Response(transformOllamaStream(res.body!), {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

function transformOllamaStream(body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const reader = body.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let buffer = '';

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line);
          if (parsed.done) {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
            return;
          }
          const content = parsed.message?.content || '';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
        } catch {
          // skip
        }
      }
    },
  });
}
