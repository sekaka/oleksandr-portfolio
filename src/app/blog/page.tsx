import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BlogList } from '@/components/blog/BlogList';
import { BlogHeader } from '@/components/blog/BlogHeader';

export default function BlogPage() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Blog Header */}
        <BlogHeader />
        
        {/* Blog Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Suspense fallback={<BlogListSkeleton />}>
                <BlogList />
              </Suspense>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}

function BlogListSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse py-6 border-b border-border/50">
          <div className="flex gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex gap-2 mb-3">
                <div className="h-5 bg-muted rounded w-16"></div>
                <div className="h-5 bg-muted rounded w-20"></div>
              </div>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-full mb-1"></div>
              <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
              <div className="flex gap-4">
                <div className="h-3 bg-muted rounded w-24"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
            </div>
            <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0"></div>
          </div>
        </div>
      ))}
    </div>
  );
}