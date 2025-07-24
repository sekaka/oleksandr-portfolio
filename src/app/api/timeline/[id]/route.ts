import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseAdmin();
    const { data: entry, error } = await supabase
      .from('timeline_entries')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Timeline entry not found' }, { status: 404 });
      }
      console.error('Error fetching timeline entry:', error);
      return NextResponse.json({ error: 'Failed to fetch timeline entry' }, { status: 500 });
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error in timeline API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { data: entry, error } = await supabase
      .from('timeline_entries')
      .update({
        company,
        role,
        description,
        start_date: new Date(start_date).toISOString(),
        end_date: end_date ? new Date(end_date).toISOString() : null,
        technologies: technologies || [],
        achievements: achievements || []
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Timeline entry not found' }, { status: 404 });
      }
      console.error('Error updating timeline entry:', error);
      return NextResponse.json({ error: 'Failed to update timeline entry' }, { status: 500 });
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error in timeline API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseAdmin();
    const { error } = await supabase
      .from('timeline_entries')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting timeline entry:', error);
      return NextResponse.json({ error: 'Failed to delete timeline entry' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in timeline API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}