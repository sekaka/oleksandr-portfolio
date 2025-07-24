export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/sekaka/',
    icon: 'github',
    color: '#333'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/oleksandr-sekretar-61999673/',
    icon: 'linkedin',
    color: '#0077b5'
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@SashaSekretar',
    icon: 'youtube',
    color: '#ff0000'
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/sekaone/',
    icon: 'instagram',
    color: '#e4405f'
  }
];