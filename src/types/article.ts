export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at?: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
  author_id?: string | null;
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
  color?: string | null;
  created_at: string | Date;
}

export interface ArticleFilters {
  search?: string;
  category?: string;
  status?: string;
  limit?: number;
  offset?: number;
}