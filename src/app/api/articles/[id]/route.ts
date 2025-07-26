import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';
import DOMPurify from 'isomorphic-dompurify';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/articles/[id] - Get single article by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseAdmin();

    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Transform the data (no transformation needed for tags)
    const transformedArticle = {
      ...article
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
    const supabase = await createSupabaseAdmin();
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
      tags = []
    } = body;

    // Validate required fields
    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Sanitize content inputs
    const sanitizedTitle = DOMPurify.sanitize(title, { ALLOWED_TAGS: [] });
    const sanitizedSlug = slug.replace(/[^a-z0-9\-]/g, '');
    const sanitizedExcerpt = DOMPurify.sanitize(excerpt, { ALLOWED_TAGS: [] });
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'code', 'pre', 'img', 'blockquote'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'target', 'rel']
    });
    const sanitizedMetaTitle = meta_title ? DOMPurify.sanitize(meta_title, { ALLOWED_TAGS: [] }) : sanitizedTitle;
    const sanitizedMetaDescription = meta_description ? DOMPurify.sanitize(meta_description, { ALLOWED_TAGS: [] }) : sanitizedExcerpt;
    const sanitizedTags = Array.isArray(tags) ? tags.map(tag => DOMPurify.sanitize(tag, { ALLOWED_TAGS: [] })) : [];

    // Check if slug conflicts with other articles
    const { data: existingArticle } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', sanitizedSlug)
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
      title: sanitizedTitle,
      slug: sanitizedSlug,
      excerpt: sanitizedExcerpt,
      content: sanitizedContent,
      status,
      seo_title: sanitizedMetaTitle,
      seo_description: sanitizedMetaDescription,
      featured_image,
      reading_time: reading_time || 5,
      tags: sanitizedTags,
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

    // Tags are now stored directly in the articles table, no additional operations needed

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
    const supabase = await createSupabaseAdmin();

    // No need to delete category associations since we're using tags column now

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