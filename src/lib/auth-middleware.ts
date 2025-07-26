import { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

export async function requireAuth(request: NextRequest): Promise<{ user: any; error?: string }> {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Get session from request
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      return { user: null, error: 'Authentication required' };
    }

    // Get user profile with role information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return { user: null, error: 'User profile not found' };
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        role: profile?.role || session.user.user_metadata?.role,
        ...profile
      }
    };
  } catch (error) {
    console.error('Auth middleware error:', error);
    return { user: null, error: 'Authentication failed' };
  }
}

export async function requireAdmin(request: NextRequest): Promise<{ user: any; error?: string }> {
  const { user, error } = await requireAuth(request);
  
  if (error || !user) {
    return { user: null, error: error || 'Authentication required' };
  }

  // Check if user is admin
  const isAdmin = user.role === 'admin' || user.email === process.env.ADMIN_EMAIL;
  
  if (!isAdmin) {
    return { user: null, error: 'Admin access required' };
  }

  return { user };
}

export function createAuthResponse(error: string, status: number = 401) {
  return Response.json(
    { error, message: 'Authentication failed' },
    { status }
  );
}

export function validateCSRF(request: NextRequest): boolean {
  // Skip CSRF for GET requests
  if (request.method === 'GET') {
    return true;
  }

  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');
  
  // In development, allow localhost origins
  if (process.env.NODE_ENV === 'development') {
    const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
    if (origin && allowedOrigins.includes(origin)) {
      return true;
    }
  }
  
  // Production CSRF validation
  if (origin && host && origin.includes(host)) {
    return true;
  }
  
  if (referer && host && referer.includes(host)) {
    return true;
  }
  
  return false;
}

export function createCSRFResponse() {
  return Response.json(
    { error: 'CSRF validation failed', message: 'Invalid request origin' },
    { status: 403 }
  );
}