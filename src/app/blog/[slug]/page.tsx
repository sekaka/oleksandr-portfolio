import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BlogPost } from '@/components/blog/BlogPost';
import { RelatedArticles } from '@/components/blog/RelatedArticles';
import type { Article } from '@/types/article';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    // Use the environment variable, fallback to localhost for development
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/articles/slug/${slug}`, {
      cache: 'no-store' // Always get fresh data to update view count
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.published_at ? new Date(article.published_at).toISOString() : undefined,
      modifiedTime: article.updated_at ? new Date(article.updated_at).toISOString() : undefined,
      authors: ['Oleksandr Sekretar'],
      images: article.featured_image ? [article.featured_image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: article.featured_image ? [article.featured_image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-background">
        <BlogPost article={article} />
        <RelatedArticles currentArticle={article} />
      </main>
      
      <Footer />
    </>
  );
}