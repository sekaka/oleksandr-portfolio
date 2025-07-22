import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';

// GET /api/articles - Get all articles with optional filtering
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('articles')
      .select(`
        *,
        categories:article_categories(
          category:categories(*)
        )
      `)
      .order('published_at', { ascending: false });

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: articles, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch articles' },
        { status: 500 }
      );
    }

    // Transform the data to match our Article type
    const transformedArticles = articles?.map(article => ({
      ...article,
      categories: article.categories?.map((ac: { category: unknown }) => ac.category) || []
    })) || [];

    return NextResponse.json(transformedArticles);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/articles - Create new article
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseAdmin();
    const body = await request.json();

    const {
      title,
      slug,
      excerpt,
      content,
      status,
      meta_title,
      meta_description,
      featured_image,
      reading_time,
      categories = []
    } = body;

    // Log the incoming data for debugging
    console.log('Creating article with data:', { title, slug, excerpt: excerpt?.substring(0, 50), content: content?.substring(0, 50), status, categories });

    // Validate required fields
    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingArticle } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingArticle) {
      return NextResponse.json(
        { error: 'Article with this slug already exists' },
        { status: 400 }
      );
    }

    // Create the article
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert({
        title,
        slug,
        excerpt,
        content,
        status,
        seo_title: meta_title || title,
        seo_description: meta_description || excerpt,
        featured_image,
        reading_time: reading_time || 5,
        published_at: status === 'published' ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (articleError) {
      console.error('Article creation error:', articleError);
      return NextResponse.json(
        { 
          error: 'Failed to create article',
          details: articleError.message,
          code: articleError.code
        },
        { status: 500 }
      );
    }

    // Add categories if provided
    if (categories.length > 0) {
      const categoryLinks = categories.map((categoryId: string) => ({
        article_id: article.id,
        category_id: categoryId
      }));

      const { error: categoryError } = await supabase
        .from('article_categories')
        .insert(categoryLinks);

      if (categoryError) {
        console.error('Category linking error:', categoryError);
        // Continue anyway, don't fail the whole operation
      }
    }

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}