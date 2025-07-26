import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';
import { requireAdmin, createAuthResponse } from '@/lib/auth-middleware';

// GET /api/timeline - Get all timeline entries
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseAdmin();

    const { data: timeline, error } = await supabase
      .from('timeline_entries')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch timeline entries' },
        { status: 500 }
      );
    }

    // Return timeline as-is, dates will be handled on frontend
    const transformedTimeline = timeline || [];

    return NextResponse.json(transformedTimeline);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/timeline - Create new timeline entry
export async function POST(request: NextRequest) {
  // Check authentication
  const { user, error } = await requireAdmin(request);
  if (error || !user) {
    return createAuthResponse(error || 'Admin access required', 401);
  }

  try {
    const supabase = await createSupabaseAdmin();
    const body = await request.json();

    const {
      company,
      role,
      description,
      start_date,
      end_date,
      technologies,
      achievements
    } = body;

    // Validate required fields
    if (!company || !role || !start_date) {
      return NextResponse.json(
        { error: 'Missing required fields: company, role, start_date' },
        { status: 400 }
      );
    }

    const { data: entry, error } = await supabase
      .from('timeline_entries')
      .insert({
        company,
        role,
        description,
        start_date: new Date(start_date).toISOString(),
        end_date: end_date ? new Date(end_date).toISOString() : null,
        technologies: technologies || [],
        achievements: achievements || []
      })
      .select()
      .single();

    if (error) {
      console.error('Timeline entry creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create timeline entry' },
        { status: 500 }
      );
    }

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}