import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BlogList } from '@/components/blog/BlogList';
import { BlogFilters } from '@/components/blog/BlogFilters';
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
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <aside className="lg:col-span-1">
                  <div className="sticky top-24">
                    <BlogFilters />
                  </div>
                </aside>
                
                {/* Main Content */}
                <div className="lg:col-span-3">
                  <Suspense fallback={<BlogListSkeleton />}>
                    <BlogList />
                  </Suspense>
                </div>
              </div>
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
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-muted rounded-lg h-64 mb-4"></div>
          <div className="space-y-2">
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}