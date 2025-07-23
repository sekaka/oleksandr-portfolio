'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/admin/AuthGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { TagsInput } from '@/components/ui/tags-input';
import { Project, UpdateProjectData } from '@/types/project';
import Link from 'next/link';

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState<UpdateProjectData>({
    title: '',
    description: '',
    image_url: '',
    project_url: '',
    tags: [],
    is_featured: false,
    sort_order: 0,
  });

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`);
      if (response.ok) {
        const project: Project = await response.json();
        setFormData({
          title: project.title,
          description: project.description || '',
          image_url: project.image_url || '',
          project_url: project.project_url || '',
          tags: project.tags || [],
          is_featured: project.is_featured,
          sort_order: project.sort_order || 0,
        });
      } else {
        alert('Project not found');
        router.push('/admin/projects');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      alert('Failed to fetch project');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/projects');
      } else {
        alert('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData({ ...formData, tags });
  };

  if (fetchLoading) {
    return (
      <AuthGuard>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center">Loading...</div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" asChild>
              <Link href="/admin/projects">← Back to Projects</Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Edit Project</h1>
          <p className="text-muted-foreground">Update project details</p>
        </div>

        <Card className="admin-form-card">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="admin-form-label">Title *</label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Project title"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="admin-form-label">Description</label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Project description"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="admin-form-label">Project Image</label>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  onRemove={() => setFormData({ ...formData, image_url: '' })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="project_url" className="admin-form-label">Project URL</label>
                <Input
                  id="project_url"
                  value={formData.project_url}
                  onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>

              <div className="space-y-2">
                <label className="admin-form-label">Tags</label>
                <TagsInput
                  value={formData.tags || []}
                  onChange={handleTagsChange}
                  placeholder="React, Next.js, TypeScript"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="sort_order" className="admin-form-label">Sort Order</label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order || 0}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                />
                <label htmlFor="is_featured" className="admin-form-label">Featured Project</label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="admin-primary-btn">
                  {loading ? 'Updating...' : 'Update Project'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/projects">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}