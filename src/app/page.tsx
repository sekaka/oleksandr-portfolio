import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Timeline } from '@/components/about/Timeline';
import { ProjectsShowcase } from '@/components/home/ProjectsShowcase';
import { Button } from '@/components/ui/button';
import { generateMetadata } from '@/lib/seo';
import Link from 'next/link';
import Image from 'next/image';
import { Github, Linkedin, Youtube, Instagram } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'Home',
  description: 'Oleksandr Sekretar - Web Developer specializing in React, Next.js, Vue, and modern web technologies. Front-End Engineer at ButterflyMX.',
  keywords: ['Oleksandr Sekretar', 'Web Developer', 'React', 'Next.js', 'Vue', 'Supabase', 'Vercel', 'Electron', 'ButterflyMX'],
});

export default function Home() {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg py-4 lg:py-6">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Social Media Badge - Left Side */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
          <div className="bg-background/95 backdrop-blur-lg rounded-r-2xl shadow-2xl border border-border/60 transition-all duration-300 hover:shadow-3xl hover:scale-105 group" style={{
            boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15), 8px 0 40px rgba(0, 0, 0, 0.1), inset -1px 0 0 rgba(16, 185, 129, 0.3)'
          }}>
            <div className="flex flex-col items-center py-6 px-4 space-y-4">
              <Link
                href="https://github.com/sekaka/"
                className="text-muted-foreground hover:text-primary transition-all duration-300 p-2 rounded-lg hover:bg-primary/10 hover:scale-110 hover:shadow-lg transform"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-6 w-6 transition-transform duration-300 hover:rotate-12" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/oleksandr-sekretar-61999673/"
                className="text-muted-foreground hover:text-primary transition-all duration-300 p-2 rounded-lg hover:bg-primary/10 hover:scale-110 hover:shadow-lg transform"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-6 w-6 transition-transform duration-300 hover:-rotate-12" />
              </Link>
              <Link
                href="https://www.youtube.com/@SashaSekretar"
                className="text-muted-foreground hover:text-primary transition-all duration-300 p-2 rounded-lg hover:bg-primary/10 hover:scale-110 hover:shadow-lg transform"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="h-6 w-6 transition-transform duration-300 hover:rotate-12" />
              </Link>
              <Link
                href="https://www.instagram.com/sekaone/"
                className="text-muted-foreground hover:text-primary transition-all duration-300 p-2 rounded-lg hover:bg-primary/10 hover:scale-110 hover:shadow-lg transform"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-6 w-6 transition-transform duration-300 hover:-rotate-12" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="relative px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center">
              {/* Left Column - Text Content */}
              <div className="order-2 lg:order-1">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="gradient-text">Welcome.</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
                  I specialize in crafting intuitive user interfaces that drive business outcomes for enterprise clients.
                  Currently working as <span className="text-primary font-semibold">Software Engineer at ButterflyMX</span>, where I build scalable solutions that enhance user experience and support organizational objectives.
                </p>
              </div>
              
              {/* Right Column - Hero Image */}
              <div className="order-1 lg:order-2">
                <div className="relative aspect-square w-full max-w-xs sm:max-w-sm mx-auto lg:max-w-none">
                  <Image
                    src="/images/hero.png"
                    alt="Oleksandr Sekretar"
                    fill
                    className="object-contain rounded-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-15 lg:py-15">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Experience
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                A decade of experience building scalable applications
              </p>
            </div>
            <Timeline />
            <div className="text-center mt-12">
              <Button asChild size="lg" className="text-base px-8 py-6 enhanced-button">
                <Link href="/resume.pdf" target="_blank">View Full Resume</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="gradient-bg py-15 lg:py-15">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Projects
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Featured projects and work I've been involved in
              </p>
            </div>
            <ProjectsShowcase />
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}
