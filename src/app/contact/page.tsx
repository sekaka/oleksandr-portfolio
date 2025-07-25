import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { generateMetadata } from '@/lib/seo';
import { Github, Linkedin, Youtube, Instagram, Mail } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'Contact',
  description: 'Get in touch with Oleksandr Sekretar. Connect on social media or send an email.',
  url: '/contact'
});

const socialLinks = [
  {
    name: 'Email',
    url: 'mailto:a.sekretar@gmail.com',
    icon: Mail,
    description: 'a.sekretar@gmail.com'
  },
  {
    name: 'GitHub',
    url: 'https://github.com/sekaka/',
    icon: Github,
    description: '@sekaka'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/oleksandr-sekretar-61999673/',
    icon: Linkedin,
    description: 'Oleksandr Sekretar'
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@SashaSekretar',
    icon: Youtube,
    description: '@SashaSekretar'
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/sekaone/',
    icon: Instagram,
    description: '@sekaone'
  }
];

export default function ContactPage() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Contact Header */}
        <section className="gradient-bg py-16 lg:py-20">
          <div className="px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Let&apos;s <span className="gradient-text">Connect</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Ready to collaborate or just want to say hello? 
                Find me on these platforms or drop me an email.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Links */}
        <section className="py-16 lg:py-20">
          <div className="px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.url}
                      className="group flex items-center gap-4 p-6 bg-card/30 border border-border/50 rounded-lg hover:bg-card/50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      target={link.name === 'Email' ? undefined : '_blank'}
                      rel={link.name === 'Email' ? undefined : 'noopener noreferrer'}
                    >
                      <div className="flex-shrink-0">
                        <Icon className="h-8 w-8 text-primary group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {link.name}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {link.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}