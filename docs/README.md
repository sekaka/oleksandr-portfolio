# Oleksandr Sekretar Portfolio

## Project Overview

A modern developer portfolio built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui components. Features a custom CMS for blog management and showcases framework-agnostic development expertise.

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: Supabase (PostgreSQL) - *To be configured*
- **Authentication**: Supabase Auth
- **Deployment**: Vercel - *To be configured*

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── blog/              # Blog listing and articles
│   ├── contact/           # Contact page
│   ├── admin/             # CMS admin panel
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   ├── home/              # Home page components
│   ├── blog/              # Blog components
│   ├── about/             # About page components
│   └── admin/             # Admin CMS components
├── lib/                   # Utilities and configurations
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── constants/             # Constants and configuration
```

## Development

### Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Fill in your Supabase credentials when ready
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open** http://localhost:3000

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Next Steps

1. **Set up Supabase project** and database schema
2. **Configure authentication** system
3. **Build remaining pages** (About, Blog, Contact)
4. **Implement CMS admin panel**
5. **Add content management** functionality
6. **Deploy to Vercel**

## Features Implemented

✅ Next.js 14 with TypeScript  
✅ Tailwind CSS v4 with shadcn/ui  
✅ Project structure and folder organization  
✅ Basic layout components (Header, Footer)  
✅ Home page with hero and skills sections  
✅ SEO optimization setup  
✅ Environment configuration  

## Features To Implement

🔲 Supabase database integration  
🔲 Authentication system  
🔲 Blog functionality  
🔲 CMS admin panel  
🔲 About and Contact pages  
🔲 Dark/Light theme toggle  
🔲 Responsive design optimization  
🔲 Performance optimization  
🔲 Deployment configuration  

---

**Current Status**: ✅ Foundation Complete - Ready for Phase 2 Development