export function getAllowedUids(): string[] {
  const multi = (process.env.NEXT_PUBLIC_ALLOWED_UIDS ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  const single = (process.env.NEXT_PUBLIC_ALLOWED_UID ?? '').trim();
  return [...multi, ...(single ? [single] : [])];
}
