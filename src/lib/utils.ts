export function cn(...inputs: (string | undefined | false | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
