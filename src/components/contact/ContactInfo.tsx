import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, Clock, Github, Linkedin, Calendar } from 'lucide-react';

export function ContactInfo() {
  return (
    <div className="space-y-8">
      {/* Main Contact Info */}
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Available for Work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Email</p>
              <a 
                href="mailto:hello@oleksandr.dev" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                hello@oleksandr.dev
              </a>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-muted-foreground">Remote • EST Timezone</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Response Time</p>
              <p className="text-muted-foreground">Usually within 24 hours</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="text-xl">Connect Online</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <a 
            href="https://github.com/oleksandrsekretar" 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
          >
            <Github className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            <div>
              <p className="font-medium">GitHub</p>
              <p className="text-sm text-muted-foreground">@oleksandrsekretar</p>
            </div>
          </a>
          
          <a 
            href="https://linkedin.com/in/oleksandrsekretar" 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
          >
            <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            <div>
              <p className="font-medium">LinkedIn</p>
              <p className="text-sm text-muted-foreground">@oleksandrsekretar</p>
            </div>
          </a>
          
          <a 
            href="https://cal.com/oleksandr" 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
          >
            <Calendar className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            <div>
              <p className="font-medium">Schedule a Call</p>
              <p className="text-sm text-muted-foreground">Book 30min consultation</p>
            </div>
          </a>
        </CardContent>
      </Card>

      {/* Services */}
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="text-xl">Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Badge variant="secondary" className="w-full justify-start text-sm py-2">
              Frontend Development
            </Badge>
            <Badge variant="secondary" className="w-full justify-start text-sm py-2">
              Full-Stack Applications
            </Badge>
            <Badge variant="secondary" className="w-full justify-start text-sm py-2">
              Technical Architecture
            </Badge>
            <Badge variant="secondary" className="w-full justify-start text-sm py-2">
              Code Reviews & Audits
            </Badge>
            <Badge variant="secondary" className="w-full justify-start text-sm py-2">
              Team Leadership
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}