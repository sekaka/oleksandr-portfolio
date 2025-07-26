import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || supabaseUrl === 'your_supabase_url_here') {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
    'Please set your Supabase URL in .env.local'
  );
}

if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key_here') {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. ' +
    'Please set your Supabase anon key in .env.local'
  );
}

if (!supabaseServiceRoleKey || supabaseServiceRoleKey === 'your_service_role_key_here') {
  throw new Error(
    'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
    'Please set your Supabase service role key in .env.local'
  );
}

// Server-side Supabase client
export const createSupabaseServerClient = async () =>
  createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        async get(name: string) {
          return (await cookies()).get(name)?.value;
        },
        async set(name: string, value: string, options) {
          (await cookies()).set({ name, value, ...options });
        },
        async remove(name: string, options) {
          (await cookies()).set({ name, value: '', ...options });
        },
      },
    }
  );

// Admin client with service role key (server-side only)
export const createSupabaseAdmin = () =>
  createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );