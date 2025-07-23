import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Timeline } from '@/components/about/Timeline';
import { ProjectsShowcase } from '@/components/home/ProjectsShowcase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateMetadata } from '@/lib/seo';
import Link from 'next/link';
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
      <section className="relative overflow-hidden gradient-bg py-15 lg:py-15">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                <span className="gradient-text">Oleksandr Sekretar</span>
                <br />
                <span className="text-muted-foreground">Web Developer</span>
              </h1>
            </div>
            <div>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed font-light text-left">
                I specialize in crafting intuitive user interfaces that drive business outcomes for enterprise clients.
                Currently working as <span className="text-primary font-semibold">Software Engineer at ButterflyMX</span>,  where I build scalable solutions that enhance user experience and support organizational objectives.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                React
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                Next.js
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                Vue
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                Supabase
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                Vercel
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                Electron
              </Badge>
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
