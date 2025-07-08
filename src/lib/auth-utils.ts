export function verifyToken(token: string): boolean {
  try {
    const match = token.match(/fake-jwt-token-(\d+)/);
    if (!match) return false;
    
    const timestamp = parseInt(match[1]);
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    
    return (now - timestamp) < tenMinutes;
  } catch {
    return false;
  }
}

export function extractToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
