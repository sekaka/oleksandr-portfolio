'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import type { Article } from '@/types/article';

interface RelatedArticlesProps {
  currentArticle: Article;
}

export function RelatedArticles({ currentArticle }: RelatedArticlesProps) {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  useEffect(() => {
    // Mock related articles - in production this would be an API call
    const mockRelatedArticles: Article[] = [
      {
        id: '2',
        title: 'Building Scalable React Applications with TypeScript',
        slug: 'scalable-react-typescript-applications',
        excerpt: 'Best practices for structuring large React applications with TypeScript, including patterns for components, state management, and testing strategies.',
        content: '',
        featured_image: null,
        status: 'published',
        published_at: new Date('2024-01-08'),
        created_at: new Date('2024-01-05'),
        updated_at: new Date('2024-01-08'),
        author_id: 'user-1',
        view_count: 1923,
        reading_time: 8,
        meta_title: 'Scalable React TypeScript Applications',
        meta_description: 'Learn to build maintainable React applications with TypeScript',
        categories: [
          { id: '1', name: 'React', slug: 'react', description: 'React framework articles' },
          { id: '3', name: 'TypeScript', slug: 'typescript', description: 'TypeScript language articles' }
        ]
      },
      {
        id: '3',
        title: 'Modern Frontend Architecture: Micro-Frontends vs Monoliths',
        slug: 'frontend-architecture-micro-frontends',
        excerpt: 'Exploring different approaches to frontend architecture, comparing micro-frontends with monolithic applications and when to choose each approach.',
        content: '',
        featured_image: null,
        status: 'published',
        published_at: new Date('2024-01-01'),
        created_at: new Date('2023-12-28'),
        updated_at: new Date('2024-01-01'),
        author_id: 'user-1',
        view_count: 3456,
        reading_time: 15,
        meta_title: 'Frontend Architecture: Micro-Frontends Guide',
        meta_description: 'Compare micro-frontends vs monolithic frontend architectures',
        categories: [
          { id: '4', name: 'Architecture', slug: 'architecture', description: 'Software architecture articles' }
        ]
      }
    ];

    // Filter out the current article and get related ones
    const related = mockRelatedArticles.filter(article => 
      article.id !== currentArticle.id
    ).slice(0, 2);

    setRelatedArticles(related);
  }, [currentArticle.id]);

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'No date';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(dateObj);
  };

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Articles</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {relatedArticles.map((article) => (
              <Link key={article.id} href={`/blog/${article.slug}`}>
                <Card className="modern-card group cursor-pointer h-full">
                  {/* Featured Image Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl text-primary/30">📝</div>
                    </div>
                    <div className="absolute top-3 left-3">
                      {article.categories.slice(0, 1).map((category) => (
                        <Badge 
                          key={category.id} 
                          variant="secondary" 
                          className="bg-background/90 backdrop-blur-sm text-xs"
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(article.published_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.reading_time} min
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/blog" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}