import type { TimelineEntry } from '@/types/timeline';

export async function getTimelineEntries(): Promise<TimelineEntry[]> {
  try {
    // Use the environment variable, fallback to localhost for development
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/timeline`, {
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
    // Skills API will be implemented in future - for now return empty array
    // TODO: Implement skills management API
    return [];
  } catch (err) {
    console.error('Skills fetch error:', err);
    return [];
  }
}

export async function getAllSkillsByCategory() {
  try {
    // Skills API will be implemented in future - for now return empty object
    // TODO: Implement skills management API with categories
    return {};
  } catch (err) {
    console.error('All skills fetch error:', err);
    return {};
  }
}