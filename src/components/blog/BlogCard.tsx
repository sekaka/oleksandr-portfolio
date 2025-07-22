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
      <Link href={`/blog/${article.slug}`} className="block group">
        <div className="flex gap-6 py-6 border-b border-border/50 hover:bg-muted/30 transition-colors -mx-4 px-4 rounded-lg">
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Categories */}
            <div className="flex gap-2 mb-3">
              {article.categories.map((category) => (
                <Badge 
                  key={category.id} 
                  variant="outline" 
                  className="text-xs bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
                >
                  {category.name}
                </Badge>
              ))}
            </div>
            
            {/* Title */}
            <h2 className="text-xl font-bold leading-snug group-hover:text-primary transition-colors mb-2 line-clamp-2">
              {article.title}
            </h2>
            
            {/* Excerpt */}
            <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-2 text-sm">
              {article.excerpt}
            </p>
            
            {/* Meta Information */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(article.published_at)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.reading_time} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {formatViews(article.view_count)} views
              </span>
            </div>
          </div>
          
          {/* Thumbnail */}
          <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
            <div className="text-2xl text-primary/40">📝</div>
          </div>
        </div>
      </Link>
    </article>
  );
}