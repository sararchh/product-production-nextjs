import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function verifyToken(token: string): boolean {
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const publicRoutes = ['/login', '/api/login', '/api/auth/verify'];
  
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (token) {
    if (!verifyToken(token)) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      response.cookies.delete('user_data');
      return response;
    }
    
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
