import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PROTECTED_PREFIXES = [
  '/admin',
  '/analytics',
  '/dashboard',
  '/notifications',
];

const ADMIN_ONLY_PREFIXES = ['/admin'];

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(self), microphone=(), geolocation=(self), interest-cohort=()',
  'X-DNS-Prefetch-Control': 'on',
  // HSTS only meaningful over HTTPS; safe to send though
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
};

function applySecurityHeaders(res: NextResponse) {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(k, v);
  }
  return res;
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));

  // Game Lab: editor/dashboard must be authenticated; iframe preview route stays public so
  // published games render without middleware redirect churn.
  let requireAuth = isProtected;
  if (pathname.startsWith('/game-lab/play/')) requireAuth = false;
  else if (pathname.startsWith('/game-lab')) requireAuth = true;

  const isAdminOnly = ADMIN_ONLY_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));

  if (!requireAuth && !isAdminOnly) {
    return applySecurityHeaders(NextResponse.next());
  }
  const token = req.cookies.get('token')?.value;
  const user = token ? verifyToken(token) : null;

  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return applySecurityHeaders(NextResponse.redirect(url));
  }

  if (pathname.startsWith('/game-lab') && pathname !== '/game-lab/play' && !pathname.startsWith('/game-lab/play/')) {
    const allowedRoles = ['STUDENT', 'INSTRUCTOR', 'ADMIN'] as const;
    if (!(allowedRoles as readonly string[]).includes(user.role)) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return applySecurityHeaders(NextResponse.redirect(url));
    }
  }

  if (isAdminOnly && user.role !== 'ADMIN') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return applySecurityHeaders(NextResponse.redirect(url));
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    // Apply to all routes except static / image / favicon / _next
    '/((?!_next/static|_next/image|favicon.ico|images/|patterns/|api/auth/login|api/auth/register|api/auth/forgot-password).*)',
  ],
};
