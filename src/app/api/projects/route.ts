import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { CreateProjectData } from '@/types/project';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true, nullsLast: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error in projects API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await request.json();
    const projectData: CreateProjectData = body;

    const { data: project, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error in projects API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}