export function normalizeEmail(s: string) {
  return s.trim().toLowerCase();
}

export function normalizePassword(s: string) {
  return s.normalize('NFKC').trim();
}
