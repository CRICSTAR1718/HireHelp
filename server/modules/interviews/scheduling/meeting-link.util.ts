export function normalizeMeetingLink(url: string | undefined | null): string | undefined {
  if (!url?.trim()) return undefined;

  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;

  return `https://${trimmed}`;
}

export function generateGoogleMeetLink(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const segment = (length: number) =>
    Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

  return `https://meet.google.com/${segment(3)}-${segment(4)}-${segment(3)}`;
}
