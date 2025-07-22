import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Timeline } from '@/components/about/Timeline';
import { SkillsShowcase } from '@/components/about/SkillsShowcase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'About',
  description: 'Learn about Oleksandr Sekretar\'s journey as a framework-agnostic full-stack developer with expertise in Vue.js, React, Angular, and modern web technologies.',
  keywords: ['Oleksandr Sekretar', 'Full Stack Developer', 'Vue.js', 'React', 'Angular', 'TypeScript', 'ButterflyMX'],
});

export default function AboutPage() {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                About{" "}
                <span className="gradient-text">
                  Oleksandr Sekretar
                </span>
              </h1>
            </div>
            <div>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed font-light">
                A seasoned full-stack developer with{" "}
                <span className="text-primary font-semibold">10+ years of experience</span>{" "}
                building scalable web applications. Framework-agnostic approach with deep expertise 
                in Vue.js, React, and Angular ecosystems.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                10+ Years Experience
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                Framework Agnostic
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                Enterprise Scale
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                Team Leadership
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 lg:py-24">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Development Philosophy
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Core principles that guide my approach to building scalable, maintainable solutions
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="modern-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <CardTitle className="text-xl">Framework Agnostic</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    I believe in choosing the right tool for the job. Whether it's Vue.js for reactive UIs, 
                    React for component ecosystems, or Angular for enterprise applications - the framework serves the solution.
                  </p>
                </CardContent>
              </Card>

              <Card className="modern-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <CardTitle className="text-xl">Migration Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Specialized in large-scale framework migrations and modernization projects. 
                    Successfully led teams through complex transitions while maintaining business continuity.
                  </p>
                </CardContent>
              </Card>

              <Card className="modern-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">📚</span>
                  </div>
                  <CardTitle className="text-xl">Continuous Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    The web evolves rapidly. I stay current with emerging technologies and best practices, 
                    always evaluating how new tools can solve real business problems.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="gradient-bg py-20 lg:py-24">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Technical Expertise
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Proficiency across the full technology stack with deep expertise in modern frameworks
              </p>
            </div>
            <SkillsShowcase />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 lg:py-24">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Professional Journey
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                A decade of experience building scalable applications and leading technical teams
              </p>
            </div>
            <Timeline />
          </div>
        </div>
      </section>

      {/* Current Focus */}
      <section className="gradient-bg py-20 lg:py-24">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Current Focus
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                What I'm working on today and where I'm heading next
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="modern-card bg-gradient-to-br from-card to-card/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🏢</span>
                    </div>
                    <div>
                      <CardTitle className="text-xl">At ButterflyMX</CardTitle>
                      <CardDescription className="text-primary font-medium">Leading technical initiatives</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Currently driving technical architecture decisions and mentoring development teams 
                    in building scalable property access solutions that serve millions of users.
                  </p>
                </CardContent>
              </Card>

              <Card className="modern-card bg-gradient-to-br from-card to-card/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🌟</span>
                    </div>
                    <div>
                      <CardTitle className="text-xl">Community Building</CardTitle>
                      <CardDescription className="text-primary font-medium">Sharing knowledge and experience</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Building this platform to share insights about framework-agnostic development, 
                    architectural decisions, and lessons learned from enterprise-scale projects.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}