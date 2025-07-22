export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/yourusername', // Replace with actual GitHub URL
    icon: 'github',
    color: '#333'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/yourusername', // Replace with actual LinkedIn URL
    icon: 'linkedin',
    color: '#0077b5'
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/yourusername', // Replace with actual Instagram URL
    icon: 'instagram',
    color: '#e4405f'
  }
];