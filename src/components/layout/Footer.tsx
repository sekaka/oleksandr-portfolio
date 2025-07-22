import Link from 'next/link';
import { socialLinks } from '@/constants/social';

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center glow-green">
                <span className="font-bold text-sm text-primary-foreground">OS</span>
              </div>
              <h3 className="font-bold text-lg">Oleksandr Sekretar</h3>
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Framework-agnostic full-stack developer with expertise in modern web technologies 
              and a passion for building scalable applications.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Technologies</h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>Vue.js & React</li>
              <li>Node.js & TypeScript</li>
              <li>PostgreSQL</li>
              <li>Docker & AWS</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-border/50 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Oleksandr Sekretar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}