export function normalizeExternalUrl(url: string | undefined | null): string {
  if (!url?.trim()) return '';

  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;

  return `https://${trimmed}`;
}

export function openExternalUrl(url: string | undefined | null): void {
  const normalized = normalizeExternalUrl(url);
  if (normalized) {
    window.open(normalized, '_blank', 'noopener,noreferrer');
  }
}

export function generateGoogleMeetLink(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const segment = (length: number) =>
    Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

  return `https://meet.google.com/${segment(3)}-${segment(4)}-${segment(3)}`;
}
