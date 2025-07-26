import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';
import { requireAdmin, createAuthResponse } from '@/lib/auth-middleware';

// POST /api/seed - Seed database with sample data
export async function POST(request: NextRequest) {
  // Check authentication
  const { user, error } = await requireAdmin(request);
  if (error || !user) {
    return createAuthResponse(error || 'Admin access required', 401);
  }

  try {
    const supabase = await createSupabaseAdmin();

    // Clear existing data
    await supabase.from('article_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('articles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('timeline_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .insert([
        { name: 'React', slug: 'react', description: 'React framework articles' },
        { name: 'Vue.js', slug: 'vuejs', description: 'Vue.js framework articles' },
        { name: 'TypeScript', slug: 'typescript', description: 'TypeScript language articles' },
        { name: 'Architecture', slug: 'architecture', description: 'Software architecture articles' },
        { name: 'Performance', slug: 'performance', description: 'Performance optimization articles' },
        { name: 'DevOps', slug: 'devops', description: 'DevOps and deployment articles' }
      ])
      .select();

    if (categoriesError) {
      console.error('Categories insert error:', categoriesError);
      return NextResponse.json({ error: 'Failed to insert categories' }, { status: 500 });
    }

    // Insert starter articles - Replace these with your own content
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .insert([
        {
          title: 'Welcome to My Technical Blog',
          slug: 'welcome-to-my-blog',
          excerpt: 'An introduction to my technical blog where I share insights about web development, software architecture, and my professional journey.',
          content: `# Welcome to My Technical Blog

Welcome to my corner of the internet! I'm excited to share my thoughts, experiences, and learnings in the world of software development.

## What You'll Find Here

This blog is where I document my journey as a software developer, sharing insights on:

- **Frontend Development**: Vue.js, React, TypeScript, and modern web technologies
- **Backend Development**: Node.js, APIs, and database design
- **Software Architecture**: Best practices and lessons learned from real projects
- **Career Growth**: Professional development and industry insights

## My Background

I'm a passionate developer with experience in building scalable web applications. I enjoy tackling complex problems and sharing knowledge with the developer community.

## Let's Connect

I'd love to hear from you! Feel free to reach out through any of the social links on this site.

Happy coding! 🚀`,
          status: 'published',
          published_at: new Date().toISOString(),
          reading_time: 3,
          view_count: 0,
          seo_title: 'Welcome to My Technical Blog - Developer Insights',
          seo_description: 'Welcome to my technical blog featuring insights on web development, software architecture, and professional growth.',
          author_id: null
        }
      ])
      .select();

    if (articlesError) {
      console.error('Articles insert error:', articlesError);
      return NextResponse.json({ 
        error: 'Failed to insert articles', 
        details: articlesError.message,
        code: articlesError.code 
      }, { status: 500 });
    }

    // Link articles to categories
    if (categories && articles && articles[0]) {
      const reactCategory = categories.find(c => c.slug === 'react');
      const archCategory = categories.find(c => c.slug === 'architecture');

      const categoryLinks = [];

      // Link welcome article to React and Architecture categories
      if (reactCategory && articles[0]) {
        categoryLinks.push({
          article_id: articles[0].id,
          category_id: reactCategory.id
        });
      }

      if (archCategory && articles[0]) {
        categoryLinks.push({
          article_id: articles[0].id,
          category_id: archCategory.id
        });
      }

      if (categoryLinks.length > 0) {
        const { error: linksError } = await supabase
          .from('article_categories')
          .insert(categoryLinks);

        if (linksError) {
          console.error('Category links error:', linksError);
        }
      }
    }

    // Insert timeline entries
    const { error: timelineError } = await supabase
      .from('timeline_entries')
      .insert([
        {
          company: 'ButterflyMX',
          role: 'Senior Full Stack Developer',
          description: 'Leading frontend development initiatives and technical migrations for a smart building technology company serving 15,000+ properties.',
          start_date: new Date('2021-03-01').toISOString(),
          end_date: null,
          technologies: ['Vue.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
          achievements: [
            'Led migration from Vue 2 to Vue 3 across multiple applications',
            'Implemented new component library reducing development time by 30%',
            'Mentored junior developers and established code review processes',
            'Optimized application performance resulting in 40% faster load times'
          ]
        },
        {
          company: 'Previous Company',
          role: 'Frontend Developer',
          description: 'Developed and maintained web applications using modern JavaScript frameworks.',
          start_date: new Date('2019-06-01').toISOString(),
          end_date: new Date('2021-02-28').toISOString(),
          technologies: ['React', 'Angular', 'JavaScript', 'CSS', 'PHP'],
          achievements: [
            'Built responsive web applications serving 50,000+ users',
            'Implemented automated testing reducing bugs by 25%',
            'Collaborated with design team to improve user experience'
          ]
        }
      ]);

    if (timelineError) {
      console.error('Timeline insert error:', timelineError);
      return NextResponse.json({ error: 'Failed to insert timeline entries' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Database seeded successfully',
      categories: categories?.length || 0,
      articles: articles?.length || 0,
      timeline_entries: 2
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}