'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, CheckCircle, AlertCircle } from 'lucide-react';
import { AuthGuard } from '@/components/admin/AuthGuard';

export default function SeedPage() {
  const [seeding, setSeeding] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; data?: { categories: number; articles: number; timeline_entries: number } } | null>(null);

  const handleSeed = async () => {
    setSeeding(true);
    setResult(null);

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: 'Database seeded successfully!',
          data
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to seed database'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Error seeding database: ' + String(error)
      });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Database Seeding</h1>
            <p className="text-muted-foreground">
              Populate your database with sample articles and categories
            </p>
          </div>

          <Card className="modern-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Seed Sample Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>This will:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Clear existing articles and categories</li>
                  <li>Insert 6 categories (React, Vue.js, TypeScript, etc.)</li>
                  <li>Insert 2 sample blog articles with content</li>
                  <li>Insert 2 timeline entries</li>
                  <li>Link articles to appropriate categories</li>
                </ul>
              </div>

              <Button 
                onClick={handleSeed}
                disabled={seeding}
                className="w-full"
                size="lg"
              >
                {seeding ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                    Seeding Database...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Seed Database
                  </>
                )}
              </Button>

              {result && (
                <div className={`p-4 rounded-lg border flex items-start gap-3 ${
                  result.success 
                    ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                    : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                }`}>
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${
                      result.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                    }`}>
                      {result.message}
                    </p>
                    {result.success && result.data && (
                      <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                        <p>Categories: {result.data.categories}</p>
                        <p>Articles: {result.data.articles}</p>
                        <p>Timeline entries: {result.data.timeline_entries}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {result?.success && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Now you can:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/blog">View Blog</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/admin/articles">Manage Articles</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}