'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/project';
import Link from 'next/link';
import Image from 'next/image';

export function ProjectsShowcase() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(Array.isArray(data) ? data : []);
        } else {
          setError(`Failed to fetch projects: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="modern-card bg-gradient-to-br from-card to-card/50">
            <CardHeader className="pb-4">
              <div className="w-full h-48 bg-muted rounded-lg animate-pulse mb-4"></div>
              <div className="h-6 bg-muted rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted rounded animate-pulse mb-4"></div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-muted rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="modern-card bg-gradient-to-br from-card to-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Error Loading Projects</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Please try refreshing the page or check your connection.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card className="modern-card bg-gradient-to-br from-card to-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Coming Soon</CardTitle>
          <CardDescription className="text-primary font-medium">Projects will be loaded from CMS</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Featured projects and work I've been involved in will be displayed here once the CMS integration is complete.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <Card key={project.id} className="modern-card bg-gradient-to-br from-card to-card/50 overflow-hidden">
          {project.image_url && (
            <div className="relative w-full h-48">
              <Image
                src={project.image_url}
                alt={project.title || 'Project image'}
                fill
                className="object-cover"
              />
            </div>
          )}
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">{project.title}</CardTitle>
            {project.description && (
              <CardDescription className="text-muted-foreground">
                {project.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            {project.project_url && (
              <Button asChild variant="outline" className="w-full">
                <Link href={project.project_url} target="_blank" rel="noopener noreferrer">
                  View Project
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}