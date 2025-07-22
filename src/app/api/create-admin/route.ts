import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';

// POST /api/create-admin - Create admin user (run once)
export async function POST() {
  try {
    const supabase = createSupabaseAdmin();

    const adminEmail = 'admin@oleksandr.dev';
    const adminPassword = 'your-secure-password-123';

    // First check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(user => user.email === adminEmail);

    if (existingUser) {
      return NextResponse.json({
        message: 'Admin user already exists',
        credentials: {
          email: adminEmail,
          password: adminPassword,
          note: 'Use these credentials to log in'
        },
        user: {
          id: existingUser.id,
          email: existingUser.email,
          role: 'admin'
        }
      });
    }

    // Create the admin user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        role: 'admin',
        full_name: 'Oleksandr Sekretar'
      }
    });

    if (authError) {
      console.error('Auth user creation error:', authError);
      return NextResponse.json({
        error: 'Failed to create auth user',
        details: authError.message
      }, { status: 500 });
    }

    // Create profile entry (ignore if already exists)
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authUser.user.id,
        email: authUser.user.email,
        full_name: 'Oleksandr Sekretar',
        role: 'admin'
      });

    if (profileError && !profileError.message.includes('duplicate key')) {
      console.error('Profile creation error:', profileError);
      return NextResponse.json({
        error: 'Failed to create profile',
        details: profileError.message
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Admin user created successfully',
      credentials: {
        email: adminEmail,
        password: adminPassword,
        note: 'Use these credentials to log in'
      },
      user: {
        id: authUser.user.id,
        email: authUser.user.email,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}