export interface TimelineEntry {
  id: string;
  company: string;
  role: string;
  description?: string;
  start_date: string;
  end_date?: string;
  technologies: string[];
  achievements?: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}