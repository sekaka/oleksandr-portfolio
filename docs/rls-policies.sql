-- Row Level Security (RLS) Policies
-- Run this AFTER creating the tables

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Articles policies
CREATE POLICY "Published articles are viewable by everyone" ON articles
    FOR SELECT USING (
        status = 'published' 
        OR auth.uid() = author_id
    );

CREATE POLICY "Authors can insert their own articles" ON articles
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own articles" ON articles
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own articles" ON articles
    FOR DELETE USING (auth.uid() = author_id);

-- Categories policies  
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert categories" ON categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update categories" ON categories
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete categories" ON categories
    FOR DELETE USING (auth.role() = 'authenticated');

-- Article categories junction policies
CREATE POLICY "Article categories are viewable by everyone" ON article_categories
    FOR SELECT USING (true);

CREATE POLICY "Authors can manage their article categories" ON article_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM articles 
            WHERE articles.id = article_categories.article_id 
            AND articles.author_id = auth.uid()
        )
    );

-- Timeline entries policies
CREATE POLICY "Timeline entries are viewable by everyone" ON timeline_entries
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage timeline entries" ON timeline_entries
    FOR ALL USING (auth.role() = 'authenticated');

-- Skills policies
CREATE POLICY "Skills are viewable by everyone" ON skills
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage skills" ON skills
    FOR ALL USING (auth.role() = 'authenticated');

-- Create admin check function (optional - for future admin features)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;