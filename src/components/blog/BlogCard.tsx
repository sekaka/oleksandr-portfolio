'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { Article } from '@/types/article';

interface BlogCardProps {
  article: Article;
  index: number;
}

export function BlogCard({ article, index }: BlogCardProps) {
  const { ref, isVisible } = useScrollReveal({ 
    threshold: 0.2,
    delay: index * 100 
  });

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'No date';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj);
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  return (
    <article
      ref={ref}
      className="scroll-reveal"
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        opacity: isVisible ? 1 : 0,
        transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 100}ms`
      }}
    >
      <Link href={`/blog/${article.slug}`}>
        <Card className="modern-card group cursor-pointer overflow-hidden bg-gradient-to-br from-card to-card/50">
          {/* Featured Image Placeholder */}
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl text-primary/30">📝</div>
            </div>
            <div className="absolute top-4 left-4">
              {article.categories.map((category) => (
                <Badge 
                  key={category.id} 
                  variant="secondary" 
                  className="bg-background/90 backdrop-blur-sm"
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
          
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground line-clamp-3">
              {article.excerpt}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.published_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.reading_time} min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {formatViews(article.view_count)} views
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </article>
  );
}