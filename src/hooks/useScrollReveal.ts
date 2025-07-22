'use client';

import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  delay?: number;
  rootMargin?: string;
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const { threshold = 0.1, delay = 0, rootMargin = '0px' } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, delay, rootMargin]);

  return { ref, isVisible };
}

export function useIntersectionObserver(options: UseScrollRevealOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px' } = options;
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);
  const observer = useRef<IntersectionObserver>();

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (observerEntries) => {
        setEntries(observerEntries);
      },
      {
        threshold,
        rootMargin,
      }
    );

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [threshold, rootMargin]);

  const observe = (element: Element) => {
    if (observer.current) {
      observer.current.observe(element);
    }
  };

  const unobserve = (element: Element) => {
    if (observer.current) {
      observer.current.unobserve(element);
    }
  };

  return { entries, observe, unobserve };
}