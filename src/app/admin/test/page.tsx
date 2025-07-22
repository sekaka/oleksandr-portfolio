'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthGuard } from '@/components/admin/AuthGuard';

export default function TestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testArticleCreation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-article', {
        method: 'POST',
      });

      const data = await response.json();
      setResult({ success: response.ok, data });
    } catch (error) {
      setResult({ success: false, data: { error: String(error) } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>
          
          <Card className="modern-card mb-6">
            <CardHeader>
              <CardTitle>Test Article Creation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testArticleCreation}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Testing...' : 'Test Article Creation'}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className={result.success ? 'text-green-600' : 'text-red-600'}>
                  {result.success ? 'Success' : 'Error'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}