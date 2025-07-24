'use client';

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
      <div className="flex-1 pb-8">
        <div className="bg-card/30 border border-border/50 rounded-lg p-4">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {entry.role}
                </h3>
                <p className="text-sm font-medium text-muted-foreground">
                  {entry.company}
                </p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                {duration}
              </span>
            </div>
            {entry.description && (
              <p className="text-muted-foreground leading-relaxed text-sm">
                {entry.description}
              </p>
            )}
            
            {entry.technologies && entry.technologies.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {entry.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex} 
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/60 text-secondary-foreground border border-secondary/40"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {entry.achievements && entry.achievements.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">
                  Key Achievements
                </h4>
                <ul className="space-y-1.5">
                  {entry.achievements.map((achievement, achIndex) => (
                    <li key={achIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}