import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/articles/[id] - Get single article by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = createSupabaseAdmin();

    const { data: article, error } = await supabase
      .from('articles')
      .select(`
        *,
        categories:article_categories(
          category:categories(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Transform the data
    const transformedArticle = {
      ...article,
      categories: article.categories?.map((ac: { category: unknown }) => ac.category) || []
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

// PUT /api/articles/[id] - Update article
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
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

    // Validate required fields
    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug conflicts with other articles
    const { data: existingArticle } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .single();

    if (existingArticle) {
      return NextResponse.json(
        { error: 'Another article with this slug already exists' },
        { status: 400 }
      );
    }

    // Update the article
    const updateData: Record<string, unknown> = {
      title,
      slug,
      excerpt,
      content,
      status,
      seo_title: meta_title || title,
      seo_description: meta_description || excerpt,
      featured_image,
      reading_time: reading_time || 5,
      updated_at: new Date().toISOString()
    };

    // Set published_at if publishing for the first time
    if (status === 'published') {
      const { data: currentArticle } = await supabase
        .from('articles')
        .select('published_at')
        .eq('id', id)
        .single();

      if (!currentArticle?.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    } else if (status === 'draft') {
      updateData.published_at = null;
    }

    const { data: article, error: articleError } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (articleError) {
      console.error('Article update error:', articleError);
      return NextResponse.json(
        { error: 'Failed to update article' },
        { status: 500 }
      );
    }

    // Update categories
    // First, remove existing category associations
    await supabase
      .from('article_categories')
      .delete()
      .eq('article_id', id);

    // Add new categories if provided
    if (categories.length > 0) {
      const categoryLinks = categories.map((categoryId: string) => ({
        article_id: id,
        category_id: categoryId
      }));

      const { error: categoryError } = await supabase
        .from('article_categories')
        .insert(categoryLinks);

      if (categoryError) {
        console.error('Category linking error:', categoryError);
        // Continue anyway
      }
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/[id] - Delete article
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = createSupabaseAdmin();

    // Delete category associations first (foreign key constraint)
    await supabase
      .from('article_categories')
      .delete()
      .eq('article_id', id);

    // Delete the article
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete article' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}