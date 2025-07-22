'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { TimelineEntry as TimelineEntryType } from '@/types/timeline';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface TimelineEntryProps {
  entry: TimelineEntryType;
  isLast?: boolean;
  index: number;
}

export function TimelineEntry({ entry, isLast = false, index }: TimelineEntryProps) {
  const { ref, isVisible } = useScrollReveal({ 
    threshold: 0.3,
    delay: index * 100 // Stagger animation
  });

  const getYear = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Unknown' : date.getFullYear();
  };
  
  const startYear = getYear(entry.start_date);
  const endYear = entry.end_date ? getYear(entry.end_date) : 'Present';
  const duration = entry.end_date 
    ? `${startYear} - ${endYear}`
    : `${startYear} - Present`;

  return (
    <div 
      ref={ref}
      className="relative flex items-start space-x-6"
      style={{ 
        transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
        opacity: isVisible ? 1 : 0,
        transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 100}ms`
      }}
    >
      {/* Timeline dot (positioned to align with the continuous line) */}
      <div className="relative flex-shrink-0">
        <div 
          className="w-6 h-6 bg-gradient-to-br from-primary via-primary to-primary/90 rounded-full border-3 border-background shadow-lg relative z-10"
          style={{
            transform: isVisible ? 'scale(1)' : 'scale(0)',
            transition: `transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 100 + 200}ms`,
            boxShadow: `
              0 0 0 3px rgb(var(--background)),
              0 0 15px rgb(var(--primary) / 0.4),
              0 0 25px rgb(var(--primary) / 0.2)
            `
          }}
        />
        {index === 0 && (
          <div className="absolute inset-0 w-6 h-6 bg-primary/20 rounded-full animate-ping" />
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 pb-12">
        <Card className="modern-card bg-gradient-to-br from-card to-card/50 border-l-4 border-l-primary/20">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  {entry.role}
                </CardTitle>
                <CardDescription className="text-base font-semibold text-primary">
                  {entry.company}
                </CardDescription>
              </div>
              <Badge 
                variant="outline" 
                className="w-fit bg-primary/5 border-primary/20 text-primary font-medium"
              >
                {duration}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-5">
            {entry.description && (
              <p className="text-muted-foreground leading-relaxed text-sm">
                {entry.description}
              </p>
            )}
            
            {entry.technologies && entry.technologies.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {entry.technologies.map((tech, techIndex) => (
                    <Badge 
                      key={techIndex} 
                      variant="secondary" 
                      className="text-xs bg-secondary/80 hover:bg-secondary transition-colors"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {entry.achievements && entry.achievements.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Key Achievements
                </h4>
                <ul className="space-y-2">
                  {entry.achievements.map((achievement, achIndex) => (
                    <li key={achIndex} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 bg-primary/60 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}