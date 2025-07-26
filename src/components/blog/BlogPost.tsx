'use client';

import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import DOMPurify from 'dompurify';
import type { Article } from '@/types/article';

interface BlogPostProps {
  article: Article;
}

export function BlogPost({ article }: BlogPostProps) {
  useEffect(() => {
    // Apply highlight.js to all code blocks
    hljs.highlightAll();
  }, [article.content]);

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
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {article.title}
            </h1>
            
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

          {/* Featured Image */}
          {article.featured_image ? (
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-12 overflow-hidden">
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-12 flex items-center justify-center">
              <div className="text-6xl text-primary/30">📝</div>
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-muted prose-pre:border">
            <div 
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(convertMarkdownToHtml(article.content), {
                ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'code', 'pre', 'img', 'div', 'span', 'button'],
                ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'data-code-id', 'style', 'onclick', 'target', 'rel'],
                ALLOW_DATA_ATTR: true
              }) }} 
            />
            <script dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(`
                function toggleCodeBlock(codeId) {
                  const codeBlock = document.querySelector('[data-code-id="' + codeId + '"]');
                  if (!codeBlock) return;
                  
                  const pre = codeBlock.querySelector('pre');
                  const button = codeBlock.querySelector('.toggle-text');
                  const gradient = codeBlock.querySelector('.bg-gradient-to-t');
                  
                  if (!pre || !button || !gradient) return;
                  
                  if (pre.style.maxHeight === 'none') {
                    pre.style.maxHeight = '300px';
                    pre.style.overflowY = 'hidden';
                    button.textContent = 'Show More';
                    gradient.style.display = 'flex';
                  } else {
                    pre.style.maxHeight = 'none';
                    pre.style.overflowY = 'visible';
                    button.textContent = 'Show Less';
                    gradient.style.display = 'none';
                  }
                }
              `, { ALLOWED_TAGS: [] })
            }} />
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Enhanced markdown to HTML conversion with highlight.js support
function convertMarkdownToHtml(markdown: string): string {
  return markdown
    // Convert images first (before paragraphs)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full max-w-2xl mx-auto my-6 rounded-lg shadow-sm" />')
    // Convert headings
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    // Convert bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Convert links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Convert code blocks with highlight.js support and show more functionality
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, language, code) => {
      const lines = code.trim().split('\n');
      const isLong = lines.length > 15;
      const codeId = `code-${Math.random().toString(36).substring(2, 11)}`;
      
      // Use language class for highlight.js, or nohighlight for plain text
      const langClass = language ? `language-${language.toLowerCase()}` : 'nohighlight';
      
      return `
        <div class="relative bg-gray-900 rounded-lg my-4 code-block" data-code-id="${codeId}">
          ${language ? `<div class="absolute top-3 left-3 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded font-mono z-10">${language}</div>` : ''}
          <pre class="overflow-x-auto text-sm font-mono p-4 transition-all duration-300" style="line-height: 1.4; ${isLong ? 'max-height: 300px; overflow-y: hidden;' : ''}"><code class="${langClass} block whitespace-pre text-gray-100">${escapeHtml(code.trim())}</code></pre>
          ${isLong ? `
            <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent flex items-end justify-center pb-2">
              <button class="text-xs text-gray-400 hover:text-gray-200 transition-colors" onclick="toggleCodeBlock('${codeId}')">
                <span class="toggle-text">Show More</span>
              </button>
            </div>
          ` : ''}
        </div>
      `;
    })
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-2 py-1 rounded text-sm">$1</code>')
    // Remove line-ending backslashes that break list formatting
    .replace(/\\\s*\n/g, '\n')
    // Convert lists - handle consecutive list items properly
    .replace(/^[\*\-]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // Group consecutive <li> elements into <ul> or <ol>
    .replace(/(<li>.*<\/li>(\s*<li>.*<\/li>)*)/g, '<ul class="list-disc pl-6 my-4">$1</ul>')
    // Convert paragraphs (split by double newlines)
    .split(/\n\s*\n/)
    .map(paragraph => {
      const trimmed = paragraph.trim();
      if (!trimmed) return '';
      
      // Don't wrap these elements in <p> tags
      if (trimmed.startsWith('<h') || 
          trimmed.startsWith('<pre') || 
          trimmed.startsWith('<ul') || 
          trimmed.startsWith('<ol') || 
          trimmed.startsWith('<div') ||
          trimmed.startsWith('<img') ||
          trimmed.includes('<li>')) {
        return trimmed;
      }
      
      // Wrap regular text in <p> tags
      return `<p>${trimmed}</p>`;
    })
    .filter(paragraph => paragraph.length > 0)
    .join('\n\n');
}