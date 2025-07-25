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
      <div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse py-8 border-b border-border/30">
            <div className="flex gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-muted rounded-full"></div>
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="flex gap-4 pt-2">
                  <div className="h-3 bg-muted rounded w-20"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
              </div>
              <div className="w-28 h-28 bg-muted rounded-md flex-shrink-0"></div>
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
    <div className="divide-y-0">
      {articles.map((article, index) => (
        <BlogCard key={article.id} article={article} index={index} />
      ))}
    </div>
  );
}