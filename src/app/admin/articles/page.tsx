import { Metadata } from 'next';
import { ArticlesManager } from '@/components/admin/ArticlesManager';
import { AuthGuard } from '@/components/admin/AuthGuard';

export const metadata: Metadata = {
  title: 'Manage Articles - Admin',
  description: 'Manage blog articles',
  robots: 'noindex, nofollow',
};

export default function AdminArticlesPage() {
  return (
    <AuthGuard>
      <ArticlesManager />
    </AuthGuard>
  );
}