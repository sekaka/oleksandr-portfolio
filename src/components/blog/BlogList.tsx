'use client';

import { useEffect, useState } from 'react';
import { BlogCard } from './BlogCard';
import type { Article } from '@/types/article';

export function BlogList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const response = await fetch('/api/articles?status=published');
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
        } else {
          console.error('Failed to fetch articles:', response.status);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-6 py-6 border-b border-border/50">
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 mb-3">
                  <div className="h-5 bg-muted rounded w-16"></div>
                  <div className="h-5 bg-muted rounded w-20"></div>
                </div>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full mb-1"></div>
                <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
                <div className="flex gap-4">
                  <div className="h-3 bg-muted rounded w-24"></div>
                  <div className="h-3 bg-muted rounded w-20"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
              </div>
              <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">No articles found</h3>
          <p className="text-muted-foreground">
            Check back soon for new technical articles and insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {articles.map((article, index) => (
        <BlogCard key={article.id} article={article} index={index} />
      ))}
      
      {/* Load More Button - for future pagination */}
      <div className="text-center pt-8">
        <button className="px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-colors">
          Load More Articles
        </button>
      </div>
    </div>
  );
}