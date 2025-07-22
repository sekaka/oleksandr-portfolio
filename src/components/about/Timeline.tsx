'use client';

import { useEffect, useState, useRef } from 'react';
import { TimelineEntry } from './TimelineEntry';
import { getTimelineEntries } from '@/lib/timeline';
import type { TimelineEntry as TimelineEntryType } from '@/types/timeline';
import { Skeleton } from '@/components/ui/skeleton';

export function Timeline() {
  const [entries, setEntries] = useState<TimelineEntryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [lineHeight, setLineHeight] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchTimeline() {
      setLoading(true);
      const timelineData = await getTimelineEntries();
      setEntries(timelineData);
      setLoading(false);
    }

    fetchTimeline();
  }, []);

  useEffect(() => {
    if (loading || entries.length === 0) return;

    const handleScroll = () => {
      if (!timelineRef.current) return;

      const timelineRect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the timeline is visible
      const timelineTop = timelineRect.top;
      const timelineBottom = timelineRect.bottom;
      
      // Timeline starts animating when it's 20% into the viewport
      const startOffset = windowHeight * 0.8;
      
      if (timelineTop < startOffset && timelineBottom > 0) {
        // Calculate progress (0 to 1)
        const visibleHeight = Math.min(startOffset - timelineTop, timelineRect.height);
        const progress = Math.max(0, Math.min(1, visibleHeight / timelineRect.height));
        
        // Set line height based on progress
        setLineHeight(progress * 100);
      } else if (timelineTop >= startOffset) {
        setLineHeight(0);
      } else if (timelineBottom <= 0) {
        setLineHeight(100);
      }
    };

    handleScroll(); // Initial call
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [loading, entries]);

  if (loading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start space-x-4">
            <Skeleton className="w-4 h-4 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No timeline entries found.</p>
      </div>
    );
  }

  return (
    <div ref={timelineRef} className="relative">
      {/* Continuous animated timeline line */}
      <div className="absolute left-[11px] top-[12px] w-0.5" style={{ height: 'calc(100% - 24px)' }}>
        {/* Background line */}
        <div className="absolute inset-0 bg-border opacity-60"></div>
        {/* Animated progress line */}
        <div 
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-primary to-primary/80 transition-all duration-700 ease-out rounded-full"
          style={{
            height: `${lineHeight}%`,
            boxShadow: `
              0 0 10px rgb(var(--primary) / 0.6),
              0 0 20px rgb(var(--primary) / 0.3),
              0 0 30px rgb(var(--primary) / 0.2)
            `,
            transformOrigin: 'top'
          }}
        ></div>
      </div>

      {/* Timeline entries */}
      <div className="space-y-8">
        {entries.map((entry, index) => (
          <TimelineEntry
            key={entry.id}
            entry={entry}
            index={index}
            isLast={index === entries.length - 1}
          />
        ))}
      </div>
    </div>
  );
}