import { Metadata } from 'next';
import { ArticleEditor } from '@/components/admin/ArticleEditor';
import { AuthGuard } from '@/components/admin/AuthGuard';

interface EditArticlePageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: 'Edit Article - Admin',
  description: 'Edit blog article',
  robots: 'noindex, nofollow',
};

export default function EditArticlePage({ params }: EditArticlePageProps) {
  return (
    <AuthGuard>
      <ArticleEditor mode="edit" articleId={params.id} />
    </AuthGuard>
  );
}