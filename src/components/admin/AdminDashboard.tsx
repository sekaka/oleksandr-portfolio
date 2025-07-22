'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  User, 
  BarChart3, 
  Settings,
  PlusCircle,
  Eye,
  Edit,
  LogOut,
  Calendar
} from 'lucide-react';

export function AdminDashboard() {
  // Mock data - would be replaced with real API calls
  const stats = {
    totalArticles: 12,
    publishedArticles: 8,
    draftArticles: 4,
    totalViews: 15420,
    monthlyViews: 3240
  };

  const recentArticles = [
    {
      id: '1',
      title: 'Migrating from Vue 2 to Vue 3: A Production Journey',
      status: 'published',
      views: 2847,
      publishedAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Building Scalable React Applications with TypeScript',
      status: 'published',
      views: 1923,
      publishedAt: '2024-01-08'
    },
    {
      id: '3',
      title: 'Modern State Management Patterns',
      status: 'draft',
      views: 0,
      publishedAt: null
    }
  ];

  const handleLogout = () => {
    // Mock logout - would integrate with auth system
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <span className="font-bold text-sm text-primary-foreground">OS</span>
              </div>
              <span className="font-semibold">Admin Panel</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-muted/20 border-r">
          <nav className="p-4 space-y-2">
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start bg-primary/10 text-primary">
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/articles">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Articles
              </Button>
            </Link>
            <Link href="/admin/timeline">
              <Button variant="ghost" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Timeline
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome */}
            <div>
              <h1 className="text-3xl font-bold">Welcome back!</h1>
              <p className="text-muted-foreground">
                Here&apos;s what&apos;s happening with your portfolio.
              </p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="modern-card">
                <CardHeader className="pb-2">
                  <CardDescription>Total Articles</CardDescription>
                  <CardTitle className="text-3xl">{stats.totalArticles}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {stats.publishedArticles} published, {stats.draftArticles} drafts
                  </p>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="pb-2">
                  <CardDescription>Total Views</CardDescription>
                  <CardTitle className="text-3xl">{stats.totalViews.toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {stats.monthlyViews.toLocaleString()} this month
                  </p>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="pb-2">
                  <CardDescription>Published Articles</CardDescription>
                  <CardTitle className="text-3xl">{stats.publishedArticles}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((stats.publishedArticles / stats.totalArticles) * 100)}% of total
                  </p>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="pb-2">
                  <CardDescription>Draft Articles</CardDescription>
                  <CardTitle className="text-3xl">{stats.draftArticles}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Ready to publish
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin/articles/new">
                <Button className="w-full h-auto p-4 flex-col gap-2" size="lg">
                  <PlusCircle className="h-5 w-5" />
                  New Article
                </Button>
              </Link>
              
              <Link href="/admin/timeline/new">
                <Button variant="outline" className="w-full h-auto p-4 flex-col gap-2" size="lg">
                  <Calendar className="h-5 w-5" />
                  Add Experience
                </Button>
              </Link>
              
              <Link href="/admin/articles">
                <Button variant="outline" className="w-full h-auto p-4 flex-col gap-2" size="lg">
                  <Edit className="h-5 w-5" />
                  Edit Articles
                </Button>
              </Link>
              
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full h-auto p-4 flex-col gap-2" size="lg">
                  <Settings className="h-5 w-5" />
                  Settings
                </Button>
              </Link>
            </div>

            {/* Recent Articles */}
            <Card className="modern-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Articles</CardTitle>
                  <Link href="/admin/articles">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentArticles.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{article.title}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                            {article.status}
                          </Badge>
                          {article.status === 'published' && (
                            <>
                              <span className="text-sm text-muted-foreground">
                                {article.views} views
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Published {new Date(article.publishedAt!).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {article.status === 'published' && (
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}