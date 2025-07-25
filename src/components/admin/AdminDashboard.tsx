'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  User, 
  BarChart3, 
  PlusCircle,
  Eye,
  Edit,
  LogOut,
  Calendar,
  Briefcase
} from 'lucide-react';
import type { Article } from '@/types/article';

interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  totalProjects: number;
  totalTimelineEntries: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalViews: 0,
    totalProjects: 0,
    totalTimelineEntries: 0
  });
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch all data in parallel
        const [articlesResponse, projectsResponse, timelineResponse] = await Promise.all([
          fetch('/api/articles'),
          fetch('/api/projects'),
          fetch('/api/timeline')
        ]);

        let totalArticles = 0, publishedArticles = 0, draftArticles = 0, totalViews = 0;
        let totalProjects = 0, totalTimelineEntries = 0;
        let recentArticlesData: Article[] = [];

        // Process articles data
        if (articlesResponse.ok) {
          const articles: Article[] = await articlesResponse.json();
          const published = articles.filter(a => a.status === 'published');
          const drafts = articles.filter(a => a.status === 'draft');
          
          totalArticles = articles.length;
          publishedArticles = published.length;
          draftArticles = drafts.length;
          totalViews = published.reduce((sum, article) => sum + (article.view_count || 0), 0);
          recentArticlesData = articles.slice(0, 3);
        }

        // Process projects data
        if (projectsResponse.ok) {
          const projects = await projectsResponse.json();
          totalProjects = projects.length;
        }

        // Process timeline data
        if (timelineResponse.ok) {
          const timeline = await timelineResponse.json();
          totalTimelineEntries = timeline.length;
        }

        setStats({
          totalArticles,
          publishedArticles,
          draftArticles,
          totalViews,
          totalProjects,
          totalTimelineEntries
        });

        setRecentArticles(recentArticlesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    // TODO: Integrate with auth system
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 admin-header">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                <BarChart3 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Admin Panel</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-64px)] admin-sidebar border-r border-border/60">
          <nav className="p-4 space-y-1">
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start admin-nav-button active bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
                <BarChart3 className="h-4 w-4 mr-3" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/articles">
              <Button variant="ghost" className="w-full justify-start admin-nav-button text-muted-foreground hover:text-foreground hover:bg-accent/50">
                <FileText className="h-4 w-4 mr-3" />
                Articles
              </Button>
            </Link>
            <Link href="/admin/timeline">
              <Button variant="ghost" className="w-full justify-start admin-nav-button text-muted-foreground hover:text-foreground hover:bg-accent/50">
                <User className="h-4 w-4 mr-3" />
                Experience
              </Button>
            </Link>
            <Link href="/admin/projects">
              <Button variant="ghost" className="w-full justify-start admin-nav-button text-muted-foreground hover:text-foreground hover:bg-accent/50">
                <Briefcase className="h-4 w-4 mr-3" />
                Projects
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="stats-card">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Articles
                  </CardDescription>
                  <CardTitle className="text-3xl">
                    {loading ? '-' : stats.totalArticles}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {loading ? 'Loading...' : `${stats.publishedArticles} published, ${stats.draftArticles} drafts`}
                  </p>
                </CardContent>
              </Card>

              <Card className="stats-card">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Projects
                  </CardDescription>
                  <CardTitle className="text-3xl">
                    {loading ? '-' : stats.totalProjects}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Portfolio projects
                  </p>
                </CardContent>
              </Card>

              <Card className="stats-card">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Experience
                  </CardDescription>
                  <CardTitle className="text-3xl">
                    {loading ? '-' : stats.totalTimelineEntries}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Career timeline entries
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Article Views - Only show if there are published articles */}
            {!loading && stats.publishedArticles > 0 && (
              <Card className="stats-card">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Total Article Views
                  </CardDescription>
                  <CardTitle className="text-3xl">
                    {stats.totalViews.toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Across {stats.publishedArticles} published article{stats.publishedArticles !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/admin/articles/new">
                <Button className="w-full h-auto p-4 flex-col gap-2 admin-primary-action" size="lg">
                  <PlusCircle className="h-5 w-5" />
                  New Article
                </Button>
              </Link>
              
              <Link href="/admin/projects/new">
                <Button variant="outline" className="w-full h-auto p-4 flex-col gap-2 quick-action-btn" size="lg">
                  <Briefcase className="h-5 w-5" />
                  Add Project
                </Button>
              </Link>
              
              <Link href="/admin/timeline/new">
                <Button variant="outline" className="w-full h-auto p-4 flex-col gap-2 quick-action-btn" size="lg">
                  <Calendar className="h-5 w-5" />
                  Add Experience
                </Button>
              </Link>
            </div>

            {/* Recent Articles */}
            <Card className="modern-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Articles</CardTitle>
                  <Link href="/admin/articles">
                    <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading articles...
                    </div>
                  ) : recentArticles.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No articles yet. <Link href="/admin/articles/new" className="text-primary hover:underline">Create your first article</Link>
                    </div>
                  ) : (
                    recentArticles.map((article) => (
                      <div key={article.id} className="flex items-center justify-between p-4 border border-border/60 rounded-lg bg-card/30 hover:bg-card/60 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium">{article.title}</h4>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                              {article.status}
                            </Badge>
                            {article.status === 'published' && article.view_count !== undefined && (
                              <>
                                <span className="text-sm text-muted-foreground">
                                  {article.view_count} views
                                </span>
                                {article.published_at && (
                                  <span className="text-sm text-muted-foreground">
                                    Published {new Date(article.published_at).toLocaleDateString()}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/articles/${article.id}/edit`}>
                            <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          {article.status === 'published' && (
                            <Link href={`/blog/${article.slug}`} target="_blank">
                              <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}