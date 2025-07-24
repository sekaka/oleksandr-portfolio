import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';

// POST /api/test-article - Test simple article creation
export async function POST() {
  try {
    const supabase = await createSupabaseAdmin();

    console.log('Testing simple article creation...');

    // Try to insert a very simple article
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert({
        title: 'Test Article',
        slug: `test-article-${Date.now()}`,
        excerpt: 'This is a test article excerpt.',
        content: '# Test Article\n\nThis is test content.',
        status: 'draft'
      })
      .select()
      .single();

    if (articleError) {
      console.error('Test article creation error:', articleError);
      return NextResponse.json({
        error: 'Failed to create test article',
        details: articleError.message,
        code: articleError.code,
        hint: articleError.hint
      }, { status: 500 });
    }

    console.log('Test article created successfully:', article.id);
    return NextResponse.json({ 
      message: 'Test article created successfully',
      article: article
    });

  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}