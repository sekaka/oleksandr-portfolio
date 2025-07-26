import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { UpdateProjectData } from '@/types/project';
import { requireAdmin, createAuthResponse } from '@/lib/auth-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      console.error('Error fetching project:', error);
      return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error in project API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication
  const { user, error } = await requireAdmin(request);
  if (error || !user) {
    return createAuthResponse(error || 'Admin access required', 401);
  }

  try {
    const supabase = await createSupabaseServerClient();
    const body = await request.json();
    const updateData: UpdateProjectData = body;

    const { data: project, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      console.error('Error updating project:', error);
      return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error in project API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication
  const { user, error } = await requireAdmin(request);
  if (error || !user) {
    return createAuthResponse(error || 'Admin access required', 401);
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting project:', error);
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in project API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}