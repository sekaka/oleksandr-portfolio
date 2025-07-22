-- Sample data for development
-- Run this AFTER setting up tables and RLS policies
-- Make sure to create a user account first through Supabase Auth

-- Insert sample categories
INSERT INTO categories (name, slug, description, color) VALUES
('Web Development', 'web-development', 'Articles about modern web development practices', '#3b82f6'),
('Vue.js', 'vuejs', 'Vue.js tutorials and insights', '#4ade80'),
('React', 'react', 'React development and best practices', '#06b6d4'),
('Architecture', 'architecture', 'Software architecture and system design', '#8b5cf6'),
('DevOps', 'devops', 'Development operations and deployment', '#f59e0b');

-- Insert sample timeline entries (your career history)
INSERT INTO timeline_entries (company, role, description, start_date, end_date, technologies, achievements, sort_order) VALUES
(
    'ButterflyMX', 
    'Senior Full-Stack Developer', 
    'Leading technical initiatives for property access systems, working with Vue.js, Electron, and modern web technologies.',
    '2019-01-01', 
    NULL, -- Current position
    ARRAY['Vue.js', 'Electron', 'Node.js', 'PostgreSQL', 'TypeScript'],
    ARRAY[
        'Led migration from legacy systems to modern Vue.js architecture',
        'Developed desktop applications using Electron',
        'Managed team of 10-50 developers on various projects',
        'Implemented scalable backend solutions'
    ],
    1
),
(
    'Censhare', 
    'Frontend Developer / Scrum Master', 
    'Angular development and agile project management for content management solutions.',
    '2018-01-01', 
    '2019-01-01',
    ARRAY['Angular', 'TypeScript', 'Scrum', 'Agile'],
    ARRAY[
        'Successfully migrated legacy Angular applications',
        'Served as Scrum Master for development team',
        'Improved development workflow and processes'
    ],
    2
),
(
    'Daxx', 
    'Full-Stack Developer', 
    'Full-stack development with focus on testing and quality assurance.',
    '2017-01-01', 
    '2018-01-01',
    ARRAY['JavaScript', 'Node.js', 'Testing', 'Full-Stack'],
    ARRAY[
        'Developed comprehensive testing strategies',
        'Built full-stack applications from scratch',
        'Mentored junior developers'
    ],
    3
),
(
    'Quiks', 
    'Frontend Developer', 
    'AngularJS development with focus on responsive design and user experience.',
    '2015-01-01', 
    '2017-01-01',
    ARRAY['AngularJS', 'HTML5', 'CSS3', 'Responsive Design'],
    ARRAY[
        'Created responsive web applications',
        'Implemented modern UI/UX patterns',
        'Optimized applications for mobile devices'
    ],
    4
),
(
    'Energorynok', 
    'Junior Developer', 
    'Early career development with PHP and Oracle database systems.',
    '2013-01-01', 
    '2015-01-01',
    ARRAY['PHP', 'Oracle', 'MySQL', 'HTML', 'CSS'],
    ARRAY[
        'Built database-driven web applications',
        'Learned fundamental programming concepts',
        'Developed problem-solving skills'
    ],
    5
);

-- Insert sample skills
INSERT INTO skills (name, category, proficiency, years_experience, is_featured) VALUES
-- Frontend
('Vue.js', 'frontend', 5, 6, true),
('React', 'frontend', 4, 3, true),
('Angular', 'frontend', 4, 4, true),
('Next.js', 'frontend', 4, 2, true),
('TypeScript', 'frontend', 5, 5, true),
('JavaScript', 'frontend', 5, 10, true),
('HTML5', 'frontend', 5, 10, false),
('CSS3', 'frontend', 5, 10, false),
('Tailwind CSS', 'frontend', 4, 2, false),

-- Backend
('Node.js', 'backend', 4, 5, true),
('PHP', 'backend', 4, 7, false),
('PostgreSQL', 'backend', 4, 6, true),
('MySQL', 'backend', 3, 5, false),
('REST APIs', 'backend', 5, 8, true),
('GraphQL', 'backend', 3, 2, false),

-- DevOps & Tools
('Docker', 'devops', 3, 3, true),
('AWS', 'devops', 3, 2, false),
('Git', 'tools', 5, 10, true),
('Webpack', 'tools', 4, 6, false),
('Jest', 'tools', 4, 4, false),
('Cypress', 'tools', 3, 2, false);

-- Note: Sample articles will be added after you create your first user account
-- The articles require an author_id which comes from your authenticated user