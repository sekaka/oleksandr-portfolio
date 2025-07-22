import { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AuthGuard } from '@/components/admin/AuthGuard';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Portfolio admin dashboard',
  robots: 'noindex, nofollow',
};

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminDashboard />
    </AuthGuard>
  );
}