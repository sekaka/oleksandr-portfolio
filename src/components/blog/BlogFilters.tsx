'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

export function BlogFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string; count: number }>>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  const toggleCategory = (categorySlug: string) => {
    setSelectedCategories(prev => 
      prev.includes(categorySlug)
        ? prev.filter(slug => slug !== categorySlug)
        : [...prev, categorySlug]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card className="modern-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="modern-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.slug)}
              className={`flex items-center justify-between w-full p-2 rounded-md text-sm transition-colors ${
                selectedCategories.includes(category.slug)
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{category.name}</span>
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Active Filters */}
      {(selectedCategories.length > 0 || searchTerm) && (
        <Card className="modern-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Active Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {searchTerm && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/5 border-primary/20">
                  Search: &ldquo;{searchTerm}&rdquo;
                </Badge>
              </div>
            )}
            {selectedCategories.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((slug) => {
                    const category = categories.find(c => c.slug === slug);
                    return category ? (
                      <Badge 
                        key={slug} 
                        variant="outline" 
                        className="bg-primary/5 border-primary/20"
                      >
                        {category.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="w-full"
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}