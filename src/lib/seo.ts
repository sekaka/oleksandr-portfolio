import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

const defaultTitle = process.env.NEXT_PUBLIC_SITE_NAME || 'Oleksandr Sekretar';
const defaultDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Framework-agnostic full-stack developer portfolio';
const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export function generateMetadata({
  title,
  description = defaultDescription,
  keywords = [],
  image = '/images/og-default.jpg',
  url = defaultUrl,
  type = 'website',
  publishedTime,
  modifiedTime,
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const fullUrl = url.startsWith('http') ? url : `${defaultUrl}${url}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      siteName: defaultTitle,
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    alternates: {
      canonical: fullUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}