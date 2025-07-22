import { Metadata } from 'next';
import { ArticleEditor } from '@/components/admin/ArticleEditor';
import { AuthGuard } from '@/components/admin/AuthGuard';

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Edit Article - Admin',
  description: 'Edit blog article',
  robots: 'noindex, nofollow',
};

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  return (
    <AuthGuard>
      <ArticleEditor mode="edit" articleId={id} />
    </AuthGuard>
  );
}