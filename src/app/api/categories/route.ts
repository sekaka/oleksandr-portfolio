import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';

// GET /api/categories - Get all categories with article counts
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseAdmin();

    const { data: categories, error } = await supabase
      .from('categories')
      .select(`
        *,
        article_count:article_categories(count)
      `)
      .order('name');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    // Transform to include article count
    const transformedCategories = categories?.map(category => ({
      ...category,
      count: category.article_count?.length || 0
    })) || [];

    return NextResponse.json(transformedCategories);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseAdmin();
    const body = await request.json();

    const { name, description, color } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if category with this slug already exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      );
    }

    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        name,
        slug,
        description: description || null,
        color: color || null
      })
      .select()
      .single();

    if (error) {
      console.error('Category creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      );
    }

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}