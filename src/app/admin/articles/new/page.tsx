import { Metadata } from 'next';
import { ArticleEditor } from '@/components/admin/ArticleEditor';
import { AuthGuard } from '@/components/admin/AuthGuard';

export const metadata: Metadata = {
  title: 'New Article - Admin',
  description: 'Create new blog article',
  robots: 'noindex, nofollow',
};

export default function NewArticlePage() {
  return (
    <AuthGuard>
      <ArticleEditor mode="create" />
    </AuthGuard>
  );
}