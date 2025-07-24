import Link from 'next/link';
import { Github, Linkedin, Youtube, Instagram } from 'lucide-react';

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/oleksandrsekretar',
    icon: Github
  },
  {
    name: 'LinkedIn', 
    url: 'https://linkedin.com/in/oleksandrsekretar',
    icon: Linkedin
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@oleksandrsekretar',
    icon: Youtube
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/oleksandrsekretar',
    icon: Instagram
  }
];

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            &copy; 2025 All rights reserved.
          </p>
          
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.name}
                  href={social.url}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}