import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfo } from '@/components/contact/ContactInfo';
import { generateMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'Contact - Get in Touch',
  description: 'Get in touch for collaboration opportunities, technical consultation, or to discuss your next project. Available for freelance and full-time opportunities.',
  path: '/contact'
});

export default function ContactPage() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Contact Header */}
        <section className="gradient-bg py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Let&apos;s Work <span className="gradient-text">Together</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Ready to bring your ideas to life? I&apos;m available for new projects, 
                collaborations, and technical consulting opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-12">
                {/* Contact Information */}
                <div className="lg:col-span-1">
                  <ContactInfo />
                </div>
                
                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}