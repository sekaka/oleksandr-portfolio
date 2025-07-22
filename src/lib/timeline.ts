import type { TimelineEntry } from '@/types/timeline';

export async function getTimelineEntries(): Promise<TimelineEntry[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/timeline`, {
      cache: 'no-store' // Always get fresh data
    });

    if (!response.ok) {
      console.error('Timeline API error:', response.status);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching timeline entries:', error);
    return [];
  }
}

export async function getFeaturedSkills() {
  try {
    // Mock skills for now - will be replaced with API call when skills management is added
    return [
      { id: '1', name: 'Vue.js', category: 'Frontend', proficiency: 5, years_experience: 6, is_featured: true },
      { id: '2', name: 'React', category: 'Frontend', proficiency: 4, years_experience: 4, is_featured: true },
      { id: '3', name: 'TypeScript', category: 'Languages', proficiency: 5, years_experience: 5, is_featured: true },
      { id: '4', name: 'Node.js', category: 'Backend', proficiency: 4, years_experience: 5, is_featured: true },
    ];
  } catch (err) {
    console.error('Skills fetch error:', err);
    return [];
  }
}

export async function getAllSkillsByCategory() {
  try {
    // Mock skills grouped by category - will be replaced with API call
    return {
      'Frontend': [
        { id: '1', name: 'Vue.js', category: 'Frontend', proficiency: 5, years_experience: 6, is_featured: true },
        { id: '2', name: 'React', category: 'Frontend', proficiency: 4, years_experience: 4, is_featured: true },
        { id: '7', name: 'Angular', category: 'Frontend', proficiency: 3, years_experience: 2, is_featured: false },
      ],
      'Backend': [
        { id: '4', name: 'Node.js', category: 'Backend', proficiency: 4, years_experience: 5, is_featured: true },
        { id: '8', name: 'PHP', category: 'Backend', proficiency: 4, years_experience: 8, is_featured: false },
      ],
      'Languages': [
        { id: '3', name: 'TypeScript', category: 'Languages', proficiency: 5, years_experience: 5, is_featured: true },
        { id: '9', name: 'JavaScript', category: 'Languages', proficiency: 5, years_experience: 8, is_featured: false },
      ]
    };
  } catch (err) {
    console.error('All skills fetch error:', err);
    return {};
  }
}