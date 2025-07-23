export interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  project_url: string | null;
  tags: string[];
  is_featured: boolean;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectData {
  title: string;
  description?: string;
  image_url?: string;
  project_url?: string;
  tags?: string[];
  is_featured?: boolean;
  sort_order?: number;
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  image_url?: string;
  project_url?: string;
  tags?: string[];
  is_featured?: boolean;
  sort_order?: number;
}