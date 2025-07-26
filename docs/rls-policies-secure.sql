-- SECURE Row Level Security (RLS) Policies
-- This replaces the existing RLS policies with more secure versions

-- First, drop ALL existing policies if they exist
-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Only admins can delete profiles" ON profiles;

-- Articles policies
DROP POLICY IF EXISTS "Published articles are viewable by everyone" ON articles;
DROP POLICY IF EXISTS "Admins can view all articles" ON articles;
DROP POLICY IF EXISTS "Authors can insert their own articles" ON articles;
DROP POLICY IF EXISTS "Authors can update their own articles" ON articles;
DROP POLICY IF EXISTS "Authors can delete their own articles" ON articles;
DROP POLICY IF EXISTS "Only admins can create articles" ON articles;
DROP POLICY IF EXISTS "Only admins can update articles" ON articles;
DROP POLICY IF EXISTS "Only admins can delete articles" ON articles;

-- Projects policies
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON projects;
DROP POLICY IF EXISTS "Only admins can create projects" ON projects;
DROP POLICY IF EXISTS "Only admins can update projects" ON projects;
DROP POLICY IF EXISTS "Only admins can delete projects" ON projects;

-- Categories policies
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can delete categories" ON categories;
DROP POLICY IF EXISTS "Only admins can create categories" ON categories;
DROP POLICY IF EXISTS "Only admins can update categories" ON categories;
DROP POLICY IF EXISTS "Only admins can delete categories" ON categories;

-- Timeline policies
DROP POLICY IF EXISTS "Timeline entries are viewable by everyone" ON timeline_entries;
DROP POLICY IF EXISTS "Authenticated users can manage timeline entries" ON timeline_entries;
DROP POLICY IF EXISTS "Only admins can create timeline entries" ON timeline_entries;
DROP POLICY IF EXISTS "Only admins can update timeline entries" ON timeline_entries;
DROP POLICY IF EXISTS "Only admins can delete timeline entries" ON timeline_entries;

-- Skills policies
DROP POLICY IF EXISTS "Skills are viewable by everyone" ON skills;
DROP POLICY IF EXISTS "Authenticated users can manage skills" ON skills;
DROP POLICY IF EXISTS "Only admins can create skills" ON skills;
DROP POLICY IF EXISTS "Only admins can update skills" ON skills;
DROP POLICY IF EXISTS "Only admins can delete skills" ON skills;

-- Article categories policies
DROP POLICY IF EXISTS "Article categories are viewable by everyone" ON article_categories;
DROP POLICY IF EXISTS "Authors can manage their article categories" ON article_categories;
DROP POLICY IF EXISTS "Only admins can create article categories" ON article_categories;
DROP POLICY IF EXISTS "Only admins can update article categories" ON article_categories;
DROP POLICY IF EXISTS "Only admins can delete article categories" ON article_categories;

-- Enable RLS on all tables (including projects which was missing)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create or replace the admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- === PROFILES POLICIES ===
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Only admins can delete profiles
CREATE POLICY "Only admins can delete profiles" ON profiles
    FOR DELETE USING (public.is_admin());

-- === ARTICLES POLICIES ===
-- Public can read published articles
CREATE POLICY "Published articles are viewable by everyone" ON articles
    FOR SELECT USING (status = 'published');

-- Admins can read all articles
CREATE POLICY "Admins can view all articles" ON articles
    FOR SELECT USING (public.is_admin());

-- Only admins can create articles
CREATE POLICY "Only admins can create articles" ON articles
    FOR INSERT WITH CHECK (public.is_admin());

-- Only admins can update articles
CREATE POLICY "Only admins can update articles" ON articles
    FOR UPDATE USING (public.is_admin());

-- Only admins can delete articles
CREATE POLICY "Only admins can delete articles" ON articles
    FOR DELETE USING (public.is_admin());

-- === PROJECTS POLICIES ===
-- Public can read all projects
CREATE POLICY "Projects are viewable by everyone" ON projects
    FOR SELECT USING (true);

-- Only admins can create projects
CREATE POLICY "Only admins can create projects" ON projects
    FOR INSERT WITH CHECK (public.is_admin());

-- Only admins can update projects
CREATE POLICY "Only admins can update projects" ON projects
    FOR UPDATE USING (public.is_admin());

-- Only admins can delete projects
CREATE POLICY "Only admins can delete projects" ON projects
    FOR DELETE USING (public.is_admin());

-- === CATEGORIES POLICIES ===
-- Public can read categories
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

-- Only admins can manage categories
CREATE POLICY "Only admins can create categories" ON categories
    FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update categories" ON categories
    FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete categories" ON categories
    FOR DELETE USING (public.is_admin());

-- === TIMELINE ENTRIES POLICIES ===
-- Public can read timeline entries
CREATE POLICY "Timeline entries are viewable by everyone" ON timeline_entries
    FOR SELECT USING (true);

-- Only admins can manage timeline entries
CREATE POLICY "Only admins can create timeline entries" ON timeline_entries
    FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update timeline entries" ON timeline_entries
    FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete timeline entries" ON timeline_entries
    FOR DELETE USING (public.is_admin());

-- === SKILLS POLICIES ===
-- Public can read skills
CREATE POLICY "Skills are viewable by everyone" ON skills
    FOR SELECT USING (true);

-- Only admins can manage skills
CREATE POLICY "Only admins can create skills" ON skills
    FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update skills" ON skills
    FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete skills" ON skills
    FOR DELETE USING (public.is_admin());

-- === ARTICLE CATEGORIES JUNCTION POLICIES ===
-- Public can read article categories
CREATE POLICY "Article categories are viewable by everyone" ON article_categories
    FOR SELECT USING (true);

-- Only admins can manage article categories
CREATE POLICY "Only admins can create article categories" ON article_categories
    FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update article categories" ON article_categories
    FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete article categories" ON article_categories
    FOR DELETE USING (public.is_admin());

-- === SECURITY IMPROVEMENTS ===

-- Create index on profiles.role for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Create index on articles.status for performance  
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);

-- Create index on profiles.id for performance (without auth.uid() predicate)
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);

-- Add constraint to ensure admin role integrity (drop first if exists)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS check_valid_role;
ALTER TABLE profiles ADD CONSTRAINT check_valid_role 
    CHECK (role IN ('user', 'admin'));

-- Notification for security events (optional)
CREATE OR REPLACE FUNCTION notify_admin_action()
RETURNS TRIGGER AS $$
BEGIN
    -- Log admin actions for security monitoring
    INSERT INTO admin_audit_log (user_id, action, table_name, record_id, timestamp)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, COALESCE(NEW.id, OLD.id), NOW());
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create audit log table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Drop existing audit log policy if exists
DROP POLICY IF EXISTS "Only admins can view audit logs" ON admin_audit_log;

-- Only admins can read audit logs
CREATE POLICY "Only admins can view audit logs" ON admin_audit_log
    FOR SELECT USING (public.is_admin());