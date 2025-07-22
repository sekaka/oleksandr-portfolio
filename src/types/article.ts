export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  view_count: number;
  reading_time?: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  categories?: Category[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  created_at: string;
}

export interface ArticleFilters {
  search?: string;
  category?: string;
  status?: string;
  limit?: number;
  offset?: number;
}