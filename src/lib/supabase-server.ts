import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );