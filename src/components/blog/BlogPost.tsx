'use client';

import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Article } from '@/types/article';

interface BlogPostProps {
  article: Article;
}

export function BlogPost({ article }: BlogPostProps) {
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      // You might want to show a toast notification here
    }
  };

  return (
    <article className="py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-12">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {article.categories.map((category) => (
                <Badge 
                  key={category.id} 
                  variant="secondary" 
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  {category.name}
                </Badge>
              ))}
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {article.title}
            </h1>
            
            {/* Excerpt */}
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {article.excerpt}
            </p>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-t border-b border-border">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.published_at)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {article.reading_time} min read
                </span>
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {formatViews(article.view_count)} views
                </span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </header>

          {/* Featured Image Placeholder */}
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-12 flex items-center justify-center">
            <div className="text-6xl text-primary/30">📝</div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-muted prose-pre:border">
            <div dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(article.content) }} />
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Last updated: {formatDate(article.updated_at)}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share Article
              </Button>
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
}

// Simple markdown to HTML conversion - in production you'd use a proper markdown parser
function convertMarkdownToHtml(markdown: string): string {
  return markdown
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*)\*/g, '<em>$1</em>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.*)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/g, '$1')
    .replace(/<p>(<pre>.*<\/pre>)<\/p>/gs, '$1');
}