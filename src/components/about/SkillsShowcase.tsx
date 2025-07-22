'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllSkillsByCategory } from '@/lib/timeline';
import { Skeleton } from '@/components/ui/skeleton';

interface Skill {
  name: string;
  proficiency: number;
  years_experience: number;
  category: string;
}

const categoryTitles: { [key: string]: string } = {
  frontend: 'Frontend Technologies',
  backend: 'Backend & Database',
  devops: 'DevOps & Infrastructure',
  tools: 'Development Tools'
};

const categoryDescriptions: { [key: string]: string } = {
  frontend: 'Modern JavaScript frameworks and UI technologies',
  backend: 'Server-side technologies and database systems',
  devops: 'Deployment, infrastructure, and development operations',
  tools: 'Development tools and build systems'
};

function SkillBadge({ skill }: { skill: Skill }) {
  const getProficiencyColor = (level: number) => {
    if (level >= 5) return 'bg-green-100 text-green-800 border-green-200';
    if (level >= 4) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (level >= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getProficiencyColor(skill.proficiency)} transition-all hover:shadow-sm`}
      title={`${skill.name} - ${skill.proficiency}/5 proficiency, ${skill.years_experience} years experience`}
    >
      {skill.name}
      <span className="ml-1 text-xs opacity-70">
        {skill.years_experience}y
      </span>
    </Badge>
  );
}

export function SkillsShowcase() {
  const [skillsByCategory, setSkillsByCategory] = useState<{ [key: string]: Skill[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      setLoading(true);
      const skills = await getAllSkillsByCategory();
      setSkillsByCategory(skills);
      setLoading(false);
    }

    fetchSkills();
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((j) => (
                  <Skeleton key={j} className="h-6 w-16" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (Object.keys(skillsByCategory).length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No skills data found.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {Object.entries(skillsByCategory).map(([category, skills]) => (
        <Card key={category} className="modern-card bg-gradient-to-br from-card to-card/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/60"></div>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-xl">
                  {category === 'frontend' && '⚡'}
                  {category === 'backend' && '🛠️'}
                  {category === 'devops' && '☁️'}
                  {category === 'tools' && '🔧'}
                </span>
              </div>
              <div>
                <CardTitle className="text-xl">
                  {categoryTitles[category] || category.charAt(0).toUpperCase() + category.slice(1)}
                </CardTitle>
                <CardDescription className="text-primary font-medium">
                  {categoryDescriptions[category] || `${category} technologies and tools`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <SkillBadge key={index} skill={skill} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}