import { NextRequest } from 'next/server';

// Simple in-memory rate limiter for demonstration
// In production, use Redis or a database for persistent storage
interface RateLimitData {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitData>();

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
}

// Default rate limit configurations for different endpoint types
export const RATE_LIMITS = {
  general: { maxRequests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes
  auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes for auth
  upload: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 uploads per hour
  admin: { maxRequests: 200, windowMs: 15 * 60 * 1000 }, // 200 requests per 15 minutes for admin
} as const;

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (real) {
    return real;
  }
  
  return request.ip || 'unknown';
}

export function rateLimit(config: RateLimitConfig) {
  return (request: NextRequest): { success: boolean; limit: number; remaining: number; resetTime: number } => {
    const ip = getClientIP(request);
    const key = `${ip}:${request.nextUrl.pathname}`;
    const now = Date.now();
    
    // Clean up expired entries periodically
    if (Math.random() < 0.01) { // 1% chance to clean up
      cleanupExpiredEntries();
    }
    
    let rateLimitData = rateLimitStore.get(key);
    
    if (!rateLimitData || now > rateLimitData.resetTime) {
      // Create new or reset expired rate limit data
      rateLimitData = {
        count: 1,
        resetTime: now + config.windowMs
      };
      rateLimitStore.set(key, rateLimitData);
      
      return {
        success: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        resetTime: rateLimitData.resetTime
      };
    }
    
    if (rateLimitData.count >= config.maxRequests) {
      return {
        success: false,
        limit: config.maxRequests,
        remaining: 0,
        resetTime: rateLimitData.resetTime
      };
    }
    
    rateLimitData.count += 1;
    rateLimitStore.set(key, rateLimitData);
    
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - rateLimitData.count,
      resetTime: rateLimitData.resetTime
    };
  };
}

function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

export function createRateLimitResponse(resetTime: number): Response {
  const resetTimeSeconds = Math.ceil((resetTime - Date.now()) / 1000);
  
  return Response.json(
    { 
      error: 'Rate limit exceeded', 
      message: 'Too many requests. Please try again later.',
      retryAfter: resetTimeSeconds
    },
    { 
      status: 429,
      headers: {
        'Retry-After': resetTimeSeconds.toString(),
        'X-RateLimit-Reset': new Date(resetTime).toISOString()
      }
    }
  );
}

// Middleware function to apply rate limiting
export function applyRateLimit(request: NextRequest, config: RateLimitConfig): Response | null {
  const result = rateLimit(config)(request);
  
  if (!result.success) {
    return createRateLimitResponse(result.resetTime);
  }
  
  return null;
}

// Enhanced rate limiting for sensitive endpoints
export function sensitiveEndpointRateLimit(request: NextRequest): Response | null {
  const ip = getClientIP(request);
  
  // Apply stricter limits for sensitive operations
  if (request.nextUrl.pathname.includes('/admin/') || 
      request.nextUrl.pathname.includes('/api/create-admin') ||
      request.nextUrl.pathname.includes('/api/upload')) {
    return applyRateLimit(request, RATE_LIMITS.admin);
  }
  
  // Auth endpoints get special treatment
  if (request.nextUrl.pathname.includes('/auth') ||
      request.nextUrl.pathname.includes('/login')) {
    return applyRateLimit(request, RATE_LIMITS.auth);
  }
  
  // Upload endpoints
  if (request.nextUrl.pathname.includes('/upload')) {
    return applyRateLimit(request, RATE_LIMITS.upload);
  }
  
  // General API rate limiting
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return applyRateLimit(request, RATE_LIMITS.general);
  }
  
  return null;
}