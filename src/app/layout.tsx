import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Chat SaaS — Multi-Provider AI Chat App',
  description: 'A production-ready AI chat application with support for OpenAI, Anthropic, and Ollama. Built with Next.js 14 and Tailwind CSS.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
