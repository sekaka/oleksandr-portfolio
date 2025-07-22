import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg py-24 md:py-40 lg:py-48">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight">
              Framework-Agnostic
              <br />
              <span className="gradient-text">Full-Stack Developer</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Experienced senior developer with expertise in Vue.js, React, Angular, and modern backend technologies. 
              Building scalable applications and leading technical migrations at enterprise level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base px-8 py-6 glow-green">
                <Link href="/blog">Read My Articles</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-base px-8 py-6">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Skills Showcase */}
      <section className="py-24 lg:py-32">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Technical Expertise</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Proficiency across the full technology stack with deep expertise in modern frameworks
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="modern-card relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/60"></div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">Frontend Frameworks</CardTitle>
                    <CardDescription className="text-primary font-medium">Modern JavaScript frameworks and libraries</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Vue.js</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">React</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Angular</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Next.js</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">TypeScript</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="modern-card relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/60"></div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🛠️</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">Backend & Database</CardTitle>
                    <CardDescription className="text-primary font-medium">Server-side technologies and data management</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Node.js</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">PostgreSQL</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">PHP</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">MySQL</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">REST APIs</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="modern-card relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/60"></div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">☁️</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">DevOps & Tools</CardTitle>
                    <CardDescription className="text-primary font-medium">Development and deployment tools</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Docker</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">AWS</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Git</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Webpack</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">CI/CD</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Recent Activity */}
      <section className="gradient-bg py-24 lg:py-32">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Recent Activity</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              What I&apos;m currently working on and sharing with the developer community
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="modern-card bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📝</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">Latest Article</CardTitle>
                    <CardDescription className="text-primary font-medium">Coming soon - Technical insights and tutorials</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Stay tuned for in-depth articles about framework migrations, 
                  architecture decisions, and modern web development practices.
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/blog">View Blog</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="modern-card bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">Current Focus</CardTitle>
                    <CardDescription className="text-primary font-medium">What I&apos;m working on</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Leading technical initiatives at ButterflyMX, exploring new technologies, 
                  and building this portfolio to share knowledge with the community.
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/about">My Journey</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}
