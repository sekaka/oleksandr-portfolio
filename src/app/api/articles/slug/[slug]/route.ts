import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';

interface RouteParams {
  params: {
    slug: string;
  };
}

// GET /api/articles/slug/[slug] - Get article by slug
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createSupabaseAdmin();

    const { data: article, error } = await supabase
      .from('articles')
      .select(`
        *,
        categories:article_categories(
          category:categories(*)
        )
      `)
      .eq('slug', params.slug)
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
      categories: article.categories?.map((ac: any) => ac.category) || [],
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