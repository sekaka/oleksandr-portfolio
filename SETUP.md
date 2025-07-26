# 🚀 Setup Guide

## Environment Variables Configuration

The application requires Supabase credentials to function. You need to update your `.env.local` file with actual values.

### Step 1: Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key
   - **service_role** key (keep this secret!)

### Step 2: Update .env.local

Replace the placeholder values in `.env.local` with your actual Supabase credentials:

```bash
# Replace these with your actual Supabase values
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Set a secure admin password
ADMIN_PASSWORD=YourSecurePassword123!
```

### Step 3: Database Setup

1. In your Supabase SQL Editor, run:
   ```sql
   -- Run this first
   \i docs/database-setup.sql
   
   -- Then run this for security
   \i docs/rls-policies-secure.sql
   ```

2. Or copy and paste the SQL from:
   - `docs/database-setup.sql`
   - `docs/rls-policies-secure.sql`

### Step 4: Create Admin User

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit: http://localhost:3000/api/create-admin
   - This creates the admin user (development only)

3. Login at: http://localhost:3000/admin/login
   - Email: admin@oleksandr.dev
   - Password: [your ADMIN_PASSWORD]

## 🔧 Troubleshooting

### "Failed to construct 'URL': Invalid URL"

This means your `NEXT_PUBLIC_SUPABASE_URL` is not set correctly. Make sure:
- The URL starts with `https://`
- It ends with `.supabase.co`
- No placeholder text like `your_supabase_url_here`

### "Missing SUPABASE_SERVICE_ROLE_KEY"

This means the service role key is not set. Make sure:
- You copied the **service_role** key (not the anon key)
- It's a long JWT token starting with `eyJ`
- No placeholder text

### Authentication Issues

1. Check that you've run the database setup scripts
2. Verify the admin user was created successfully
3. Make sure your password matches the `ADMIN_PASSWORD` in `.env.local`

## 🔒 Security Notes

- **Never commit** your actual `.env.local` file to git
- The `.env.local` file is in `.gitignore` to prevent accidental commits
- In production, use environment variables instead of `.env.local`
- Rotate your service role key periodically

## 📁 File Structure

```
├── .env.local          # Your local environment variables
├── .env.example        # Example file with placeholder values
├── docs/
│   ├── database-setup.sql       # Database schema
│   └── rls-policies-secure.sql  # Security policies
├── SECURITY.md         # Security documentation
└── SETUP.md           # This file
```

## 🎯 Next Steps

Once everything is configured:

1. ✅ Environment variables set
2. ✅ Database created
3. ✅ Admin user created
4. ✅ Can login to admin panel

You can now:
- Create blog articles at `/admin/articles`
- Manage projects at `/admin/projects`  
- Configure timeline at `/admin/timeline`
- Upload images securely
- All with enterprise-level security! 🛡️