'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center transition-transform group-hover:scale-105 glow-green">
              <span className="font-bold text-lg text-primary-foreground">OS</span>
            </div>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-semibold text-sm text-foreground">Oleksandr</span>
            <span className="text-xs text-muted-foreground">Sekretar</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
          <NavigationMenuList className="flex space-x-1">
            <NavigationMenuItem>
              <NavigationMenuLink 
                href="/" 
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                }`}
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink 
                href="/blog" 
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive('/blog') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                }`}
              >
                Blog
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink 
                href="/contact" 
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive('/contact') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                }`}
              >
                Contact
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        {/* Right side - matches logo width for perfect centering */}
        <div className="flex items-center justify-end w-[140px] sm:w-[180px]">
          <div className="hidden">
            <ThemeToggle />
          </div>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link 
              href="/" 
              className={`block px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`block px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/about') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/blog" 
              className={`block px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/blog') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              href="/contact" 
              className={`block px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/contact') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}