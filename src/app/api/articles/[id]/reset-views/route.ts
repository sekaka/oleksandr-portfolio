import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';
import { requireAdmin, createAuthResponse } from '@/lib/auth-middleware';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication
  const { user, error } = await requireAdmin(request);
  if (error || !user) {
    return createAuthResponse(error || 'Admin access required', 401);
  }

  try {
    const supabase = await createSupabaseAdmin();
    
    // Reset views to 0 for the specified article
    const { data, error } = await supabase
      .from('articles')
      .update({ view_count: 0 })
      .eq('id', params.id)
      .select('id, title, view_count')
      .single();

    if (error) {
      console.error('Error resetting views:', error);
      return NextResponse.json(
        { error: 'Failed to reset views' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Views reset successfully',
      article: data
    });

  } catch (error) {
    console.error('Error resetting views:', error);
    return NextResponse.json(
      { error: 'Failed to reset views' },
      { status: 500 }
    );
  }
}