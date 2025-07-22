export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'tools';
  proficiency: 1 | 2 | 3 | 4 | 5;
  years_experience: number;
  is_featured: boolean;
}

export const skills: Skill[] = [
  // Frontend Frameworks
  { name: 'Vue.js', category: 'frontend', proficiency: 5, years_experience: 6, is_featured: true },
  { name: 'React', category: 'frontend', proficiency: 4, years_experience: 3, is_featured: true },
  { name: 'Angular', category: 'frontend', proficiency: 4, years_experience: 4, is_featured: true },
  { name: 'Next.js', category: 'frontend', proficiency: 4, years_experience: 2, is_featured: true },
  { name: 'TypeScript', category: 'frontend', proficiency: 5, years_experience: 5, is_featured: true },
  { name: 'JavaScript', category: 'frontend', proficiency: 5, years_experience: 10, is_featured: true },
  
  // Backend & Database
  { name: 'Node.js', category: 'backend', proficiency: 4, years_experience: 5, is_featured: true },
  { name: 'PHP', category: 'backend', proficiency: 4, years_experience: 7, is_featured: false },
  { name: 'PostgreSQL', category: 'backend', proficiency: 4, years_experience: 6, is_featured: true },
  { name: 'MySQL', category: 'backend', proficiency: 3, years_experience: 5, is_featured: false },
  
  // DevOps & Tools
  { name: 'Docker', category: 'devops', proficiency: 3, years_experience: 3, is_featured: true },
  { name: 'AWS', category: 'devops', proficiency: 3, years_experience: 2, is_featured: false },
  { name: 'Git', category: 'tools', proficiency: 5, years_experience: 10, is_featured: true },
  { name: 'Webpack', category: 'tools', proficiency: 4, years_experience: 6, is_featured: false },
];