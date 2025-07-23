'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/admin/AuthGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TagsInput } from '@/components/ui/tags-input';
import Link from 'next/link';

interface TimelineFormData {
  company: string;
  role: string;
  description: string;
  start_date: string;
  end_date: string;
  technologies: string[];
  achievements: string[];
}

export default function NewTimelineEntryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TimelineFormData>({
    company: '',
    role: '',
    description: '',
    start_date: '',
    end_date: '',
    technologies: [],
    achievements: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/timeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          end_date: formData.end_date || null
        }),
      });

      if (response.ok) {
        router.push('/admin/timeline');
      } else {
        alert('Failed to create timeline entry');
      }
    } catch (error) {
      console.error('Error creating timeline entry:', error);
      alert('Failed to create timeline entry');
    } finally {
      setLoading(false);
    }
  };

  const handleTechnologiesChange = (technologies: string[]) => {
    setFormData({ ...formData, technologies });
  };

  const handleAchievementsChange = (value: string) => {
    const achievements = value.split('\n').map(achievement => achievement.trim()).filter(achievement => achievement);
    setFormData({ ...formData, achievements });
  };

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" asChild>
              <Link href="/admin/timeline">← Back to Timeline</Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Add New Experience</h1>
          <p className="text-muted-foreground">Add a new entry to your professional timeline</p>
        </div>

        <Card className="admin-form-card">
          <CardHeader>
            <CardTitle>Experience Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="company" className="admin-form-label">Company *</label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="admin-form-label">Role *</label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Job title/role"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="admin-form-label">Description</label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of your role and responsibilities"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="start_date" className="admin-form-label">Start Date *</label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="end_date" className="admin-form-label">End Date</label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    placeholder="Leave empty if current position"
                  />
                  <p className="text-xs text-muted-foreground">Leave empty if this is your current position</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="admin-form-label">Technologies</label>
                <TagsInput
                  value={formData.technologies}
                  onChange={handleTechnologiesChange}
                  placeholder="Vue.js, React, TypeScript, Node.js"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="achievements" className="admin-form-label">Key Achievements (one per line)</label>
                <Textarea
                  id="achievements"
                  value={formData.achievements.join('\n')}
                  onChange={(e) => handleAchievementsChange(e.target.value)}
                  placeholder="Led migration from Vue 2 to Vue 3&#10;Implemented new component library&#10;Mentored junior developers"
                  rows={5}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="admin-primary-btn">
                  {loading ? 'Creating...' : 'Create Experience Entry'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/timeline">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}