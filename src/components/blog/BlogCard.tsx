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
        <div className="py-6 md:py-8 border-b border-border/30 hover:bg-muted/20 transition-all duration-200 -mx-4 md:-mx-6 px-4 md:px-6">
          <div className="flex gap-4 md:gap-6">
            {/* Content */}
            <div className="flex-1 space-y-2 min-w-0">
              {/* Author and Date */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="hidden sm:inline">{formatDate(article.published_at)}</span>
              </div>
              
              {/* Title */}
              <h2 className="text-lg md:text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 text-foreground">
                {article.title}
              </h2>
              
              {/* Excerpt */}
              <p className="text-muted-foreground leading-relaxed line-clamp-2 text-sm md:text-base">
                {article.excerpt}
              </p>
              
              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {article.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0.5"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Meta Information */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground flex-wrap">
                  <span>{formatDate(article.published_at)}</span>
                  <span>{article.reading_time} min read</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {formatViews(article.view_count)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Thumbnail */}
            <div className="flex-shrink-0 w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-muted to-muted/50 rounded-md overflow-hidden">
              {article.featured_image ? (
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-2xl md:text-3xl text-muted-foreground/40">📄</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}