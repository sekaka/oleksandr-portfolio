import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

// GET /api/articles/slug/[slug] - Get article by slug
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const supabase = await createSupabaseAdmin();

    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published') // Only return published articles for public access
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await supabase
      .from('articles')
      .update({ 
        view_count: (article.view_count || 0) + 1 
      })
      .eq('id', article.id);

    // Transform the data
    const transformedArticle = {
      ...article,
      view_count: (article.view_count || 0) + 1
    };

    return NextResponse.json(transformedArticle);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}