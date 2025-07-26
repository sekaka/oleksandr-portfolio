import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sensitiveEndpointRateLimit } from '@/lib/rate-limiter';

export function middleware(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = sensitiveEndpointRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const response = NextResponse.next();
  
  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Allow inline scripts for highlight.js
    "style-src 'self' 'unsafe-inline'", // Allow inline styles for Tailwind
    "img-src 'self' data: blob: https:", // Allow images from various sources
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  
  // Rate limiting headers (placeholder - would need Redis/database for production)
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
  // Add CSRF protection header
  if (request.method !== 'GET') {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    // Check if origin matches the host (CSRF protection)
    if (origin && !origin.includes(host || '')) {
      return new NextResponse('CSRF Error: Origin does not match host', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};