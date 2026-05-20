/**
 * POST /api/chat — Server-side AI proxy.
 *
 * Request body: { messages: { role, content }[], provider?: 'openai'|'anthropic'|'ollama' }
 * Response: SSE stream
 */

import { streamChat } from '@/lib/provider';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, provider } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'messages array required' }, { status: 400 });
    }

    const response = await streamChat(messages, provider);
    return response;
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
