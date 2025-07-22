import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';

// POST /api/seed - Seed database with sample data
export async function POST() {
  try {
    const supabase = createSupabaseAdmin();

    // Clear existing data
    await supabase.from('article_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('articles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('timeline_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .insert([
        { name: 'React', slug: 'react', description: 'React framework articles' },
        { name: 'Vue.js', slug: 'vuejs', description: 'Vue.js framework articles' },
        { name: 'TypeScript', slug: 'typescript', description: 'TypeScript language articles' },
        { name: 'Architecture', slug: 'architecture', description: 'Software architecture articles' },
        { name: 'Performance', slug: 'performance', description: 'Performance optimization articles' },
        { name: 'DevOps', slug: 'devops', description: 'DevOps and deployment articles' }
      ])
      .select();

    if (categoriesError) {
      console.error('Categories insert error:', categoriesError);
      return NextResponse.json({ error: 'Failed to insert categories' }, { status: 500 });
    }

    // Insert sample articles
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .insert([
        {
          title: 'Migrating from Vue 2 to Vue 3: A Production Journey',
          slug: 'vue-2-to-3-migration-guide',
          excerpt: 'A comprehensive guide on migrating a large-scale Vue.js application from version 2 to 3, covering composition API, breaking changes, and performance improvements.',
          content: `# Migrating from Vue 2 to Vue 3: A Production Journey

When we decided to migrate our large-scale Vue.js application from version 2 to 3, we knew it would be a significant undertaking. This article shares our experience, lessons learned, and practical strategies that helped us successfully complete the migration.

## Why Migrate to Vue 3?

Vue 3 brings several compelling improvements:

- **Composition API**: Better logic reuse and TypeScript support
- **Performance**: Smaller bundle size and faster rendering  
- **Tree-shaking**: Better dead code elimination
- **Multiple root elements**: No more wrapper divs required

## Planning the Migration

### Assessment Phase

Before touching any code, we spent two weeks auditing our existing codebase:

1. **Component inventory**: Catalogued all 247 components
2. **Dependency analysis**: Identified Vue 2 specific packages
3. **Breaking changes review**: Studied the official migration guide

### Migration Strategy

We chose a **gradual migration** approach rather than big-bang:

1. **Compatibility build**: Started with Vue 3 compatibility mode
2. **Component-by-component**: Migrated leaf components first
3. **Progressive enhancement**: Added Composition API gradually

## Implementation Challenges

### Challenge 1: Event Bus Replacement

Vue 3 removed the global event bus. We replaced it with a custom composable:

\`\`\`typescript
// composables/useEventBus.ts
import { ref } from 'vue'

type EventCallback = (...args: any[]) => void

class EventBus {
  private events: Record<string, EventCallback[]> = {}

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  off(event: string, callback: EventCallback) {
    if (!this.events[event]) return
    const index = this.events[event].indexOf(callback)
    if (index > -1) {
      this.events[event].splice(index, 1)
    }
  }

  emit(event: string, ...args: any[]) {
    if (!this.events[event]) return
    this.events[event].forEach(callback => callback(...args))
  }
}

const eventBus = new EventBus()

export function useEventBus() {
  return eventBus
}
\`\`\`

### Challenge 2: Filters to Computed Properties

Vue 3 removed filters. We converted them to computed properties:

\`\`\`vue
<!-- Vue 2 -->
<template>
  <span>{{ price | currency }}</span>
</template>

<!-- Vue 3 -->
<template>
  <span>{{ formattedPrice }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps<{ price: number }>()

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(props.price)
})
</script>
\`\`\`

## Performance Results

The migration delivered significant performance improvements:

- **Bundle size**: Reduced by 23% (from 1.2MB to 920KB)
- **First paint**: 15% faster initial render
- **Memory usage**: 20% reduction in memory footprint

## Key Takeaways

1. **Start with compatibility mode**: It eases the transition
2. **Migrate incrementally**: Don't try to do everything at once
3. **Update tooling**: Ensure all build tools support Vue 3
4. **Test thoroughly**: Unit and integration tests are crucial
5. **Team training**: Invest time in learning Composition API

## Conclusion

Migrating to Vue 3 was challenging but rewarding. The performance improvements and developer experience enhancements made it worthwhile. The key is careful planning and incremental execution.`,
          status: 'published',
          published_at: new Date('2024-01-15').toISOString(),
          reading_time: 12,
          view_count: 2847,
          seo_title: 'Vue 2 to Vue 3 Migration Guide - Production Experience',
          seo_description: 'Complete guide for migrating Vue.js applications from version 2 to 3, with real-world examples and solutions to common challenges.',
          author_id: null
        },
        {
          title: 'Building Scalable React Applications with TypeScript',
          slug: 'scalable-react-typescript-applications',
          excerpt: 'Best practices for structuring large React applications with TypeScript, including patterns for components, state management, and testing strategies.',
          content: `# Building Scalable React Applications with TypeScript

Creating maintainable React applications at scale requires careful planning and adherence to best practices. This guide covers essential patterns and strategies for building robust React applications with TypeScript.

## Project Structure

A well-organized project structure is the foundation of any scalable application:

\`\`\`
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── forms/        # Form components
│   └── layout/       # Layout components
├── hooks/            # Custom React hooks
├── services/         # API and external services
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── pages/           # Page components
\`\`\`

## Component Design Principles

### 1. Single Responsibility

Each component should have a single, well-defined purpose:

\`\`\`tsx
// Good: Focused component
interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <button onClick={() => onEdit(user.id)}>Edit</button>
    </div>
  );
}
\`\`\`

### 2. Composition over Inheritance

Use composition to create flexible, reusable components:

\`\`\`tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick: () => void;
}

function Button({ variant, size, children, onClick }: ButtonProps) {
  const classes = \`btn btn-\${variant} btn-\${size}\`;
  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
\`\`\`

## State Management Patterns

### 1. Local State with useState

For simple component state:

\`\`\`tsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (field: keyof typeof formData) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <form>
      <input 
        value={formData.name} 
        onChange={handleChange('name')} 
        placeholder="Name" 
      />
      <input 
        value={formData.email} 
        onChange={handleChange('email')} 
        placeholder="Email" 
      />
      <textarea 
        value={formData.message} 
        onChange={handleChange('message')} 
        placeholder="Message" 
      />
    </form>
  );
}
\`\`\`

### 2. Context for Shared State

For state that needs to be shared across components:

\`\`\`tsx
interface AppContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => setUser(user);
  const logout = () => setUser(null);

  return (
    <AppContext.Provider value={{ user, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
\`\`\`

## Testing Strategies

### 1. Component Testing

Test components in isolation:

\`\`\`tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button onClick={() => {}}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
\`\`\`

### 2. Hook Testing

Test custom hooks:

\`\`\`tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
\`\`\`

## Performance Optimization

### 1. Memoization

Use React.memo for expensive components:

\`\`\`tsx
const ExpensiveComponent = React.memo(({ data }: { data: any[] }) => {
  const processedData = useMemo(() => {
    return data.map(item => expensiveProcessing(item));
  }, [data]);

  return (
    <div>
      {processedData.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  );
});
\`\`\`

### 2. Code Splitting

Split your bundle for better performance:

\`\`\`tsx
const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
\`\`\`

## Conclusion

Building scalable React applications with TypeScript requires discipline and adherence to best practices. Focus on component composition, proper state management, comprehensive testing, and performance optimization to create maintainable applications that can grow with your needs.`,
          status: 'published',
          published_at: new Date('2024-01-08').toISOString(),
          reading_time: 8,
          view_count: 1923,
          seo_title: 'Scalable React TypeScript Applications',
          seo_description: 'Learn to build maintainable React applications with TypeScript',
          author_id: null
        }
      ])
      .select();

    if (articlesError) {
      console.error('Articles insert error:', articlesError);
      return NextResponse.json({ 
        error: 'Failed to insert articles', 
        details: articlesError.message,
        code: articlesError.code 
      }, { status: 500 });
    }

    // Link articles to categories
    if (categories && articles) {
      const vueCategory = categories.find(c => c.slug === 'vuejs');
      const reactCategory = categories.find(c => c.slug === 'react');
      const tsCategory = categories.find(c => c.slug === 'typescript');
      const archCategory = categories.find(c => c.slug === 'architecture');

      const categoryLinks = [];

      if (vueCategory && articles[0]) {
        categoryLinks.push({
          article_id: articles[0].id,
          category_id: vueCategory.id
        });
      }

      if (archCategory && articles[0]) {
        categoryLinks.push({
          article_id: articles[0].id,
          category_id: archCategory.id
        });
      }

      if (reactCategory && articles[1]) {
        categoryLinks.push({
          article_id: articles[1].id,
          category_id: reactCategory.id
        });
      }

      if (tsCategory && articles[1]) {
        categoryLinks.push({
          article_id: articles[1].id,
          category_id: tsCategory.id
        });
      }

      if (categoryLinks.length > 0) {
        const { error: linksError } = await supabase
          .from('article_categories')
          .insert(categoryLinks);

        if (linksError) {
          console.error('Category links error:', linksError);
        }
      }
    }

    // Insert timeline entries
    const { error: timelineError } = await supabase
      .from('timeline_entries')
      .insert([
        {
          company: 'ButterflyMX',
          role: 'Senior Full Stack Developer',
          description: 'Leading frontend development initiatives and technical migrations for a smart building technology company serving 15,000+ properties.',
          start_date: new Date('2021-03-01').toISOString(),
          end_date: null,
          technologies: ['Vue.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
          achievements: [
            'Led migration from Vue 2 to Vue 3 across multiple applications',
            'Implemented new component library reducing development time by 30%',
            'Mentored junior developers and established code review processes',
            'Optimized application performance resulting in 40% faster load times'
          ]
        },
        {
          company: 'Previous Company',
          role: 'Frontend Developer',
          description: 'Developed and maintained web applications using modern JavaScript frameworks.',
          start_date: new Date('2019-06-01').toISOString(),
          end_date: new Date('2021-02-28').toISOString(),
          technologies: ['React', 'Angular', 'JavaScript', 'CSS', 'PHP'],
          achievements: [
            'Built responsive web applications serving 50,000+ users',
            'Implemented automated testing reducing bugs by 25%',
            'Collaborated with design team to improve user experience'
          ]
        }
      ]);

    if (timelineError) {
      console.error('Timeline insert error:', timelineError);
      return NextResponse.json({ error: 'Failed to insert timeline entries' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Database seeded successfully',
      categories: categories?.length || 0,
      articles: articles?.length || 0,
      timeline_entries: 2
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}