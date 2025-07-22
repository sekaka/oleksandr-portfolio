import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Admin panel login',
  robots: 'noindex, nofollow',
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-6 glow-green">
            <span className="font-bold text-2xl text-primary-foreground">OS</span>
          </div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to manage your portfolio content
          </p>
        </div>
        
        <LoginForm />
        
        <div className="text-center mt-8">
          <Link 
            href="/" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}