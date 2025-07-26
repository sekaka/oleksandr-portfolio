import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';

// POST /api/create-admin - Create admin user (run once in development only)
export async function POST() {
  // Only allow in development environment
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      error: 'Admin creation is not allowed in production. Use direct database access or CLI tools.'
    }, { status: 403 });
  }

  try {
    const supabase = await createSupabaseAdmin();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@oleksandr.dev';
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({
        error: 'Admin password not configured. Set ADMIN_PASSWORD environment variable.'
      }, { status: 500 });
    }

    // First check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(user => user.email === adminEmail);

    if (existingUser) {
      return NextResponse.json({
        message: 'Admin user already exists',
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