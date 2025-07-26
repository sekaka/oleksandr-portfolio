# Security Documentation

This document outlines the comprehensive security measures implemented in this Next.js portfolio application.

## 🔒 Security Features Implemented

### 1. Authentication & Authorization

- **Admin-only API endpoints**: All write operations (POST/PUT/DELETE) require admin authentication
- **Server-side session validation**: Each protected API route validates user sessions
- **Role-based access control**: Admin role verification at both database and application level
- **Secure password handling**: No hardcoded credentials, environment variable based

**Files**: `src/lib/auth-middleware.ts`, `src/contexts/AuthContext.tsx`

### 2. Input Validation & XSS Protection

- **DOMPurify sanitization**: Both client-side and server-side HTML sanitization
- **Input validation**: All user inputs are validated and sanitized before processing
- **Allowlisted HTML tags**: Only safe HTML tags and attributes are permitted
- **Content Security Policy**: Strict CSP headers to prevent XSS attacks

**Files**: `src/components/blog/BlogPost.tsx`, `src/app/api/articles/route.ts`, `middleware.ts`

### 3. CSRF Protection

- **Origin validation**: Server validates request origins match expected hosts
- **Development/production awareness**: Different validation rules for different environments
- **Middleware enforcement**: CSRF checks applied at the middleware level

**Files**: `middleware.ts`, `src/lib/auth-middleware.ts`

### 4. Rate Limiting

- **IP-based rate limiting**: Requests are limited by IP address and endpoint
- **Tiered limits**: Different limits for different endpoint types:
  - General API: 100 requests/15 minutes
  - Authentication: 5 requests/15 minutes
  - File uploads: 10 requests/hour
  - Admin operations: 200 requests/15 minutes

**Files**: `src/lib/rate-limiter.ts`, `middleware.ts`

### 5. Security Headers

- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type confusion
- **X-XSS-Protection**: Browser XSS protection
- **Referrer-Policy**: Controls referrer information
- **Content-Security-Policy**: Comprehensive CSP with strict directives

**Files**: `middleware.ts`

### 6. Database Security

- **Row Level Security (RLS)**: All database tables have proper RLS policies
- **Admin-only operations**: Database operations restricted to admin users only
- **Audit logging**: Admin actions are logged for security monitoring
- **Secure database connections**: Using Supabase service role keys properly

**Files**: `docs/rls-policies-secure.sql`

### 7. File Upload Security

- **Authentication required**: Only authenticated admin users can upload files
- **File type validation**: Only image files are accepted
- **Secure storage**: Files stored in Supabase Storage with proper access controls

**Files**: `src/app/api/upload/image/route.ts`

## 🚨 Vulnerabilities Fixed

### Critical Fixes

1. **Hardcoded Admin Password** - Moved to environment variables
2. **Exposed Credentials in UI** - Removed from login form
3. **Unprotected API Endpoints** - Added authentication to all admin operations
4. **Missing CSRF Protection** - Implemented origin validation
5. **No Rate Limiting** - Added comprehensive rate limiting

### High Priority Fixes

1. **XSS Vulnerabilities** - Implemented DOMPurify sanitization
2. **SQL Injection Prevention** - Using parameterized queries with Supabase
3. **Insufficient Database Security** - Enhanced RLS policies
4. **Weak Admin Creation** - Restricted to development environment only

## 🔧 Production Deployment Checklist

### Environment Variables Required

```bash
# Required for production
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password-here
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NODE_ENV=production
```

### Database Setup

1. Run `docs/database-setup.sql` to create tables
2. Run `docs/rls-policies-secure.sql` to apply security policies
3. Verify all RLS policies are enabled: `SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE rowsecurity = true;`

### Security Verification Steps

1. **Test Authentication**:
   ```bash
   # Should return 401
   curl -X POST https://yourdomain.com/api/articles
   ```

2. **Test Rate Limiting**:
   ```bash
   # Should return 429 after exceeding limits
   for i in {1..10}; do curl https://yourdomain.com/api/articles; done
   ```

3. **Test CSRF Protection**:
   ```bash
   # Should return 403
   curl -X POST https://yourdomain.com/api/articles \
        -H "Origin: https://malicious-site.com"
   ```

4. **Test XSS Protection**:
   - Attempt to create article with `<script>` tags
   - Verify content is sanitized

## 📊 Security Monitoring

### Recommended Monitoring

1. **Failed Authentication Attempts**: Monitor auth middleware logs
2. **Rate Limit Violations**: Track 429 responses
3. **CSRF Violations**: Monitor 403 responses from CSRF middleware
4. **Admin Actions**: Review `admin_audit_log` table regularly

### Log Analysis

Key log patterns to monitor:
- `Authentication failed` - Failed login attempts
- `Rate limit exceeded` - Potential abuse
- `CSRF validation failed` - Potential attack attempts
- Admin operations in audit log

## 🛡️ Ongoing Security Practices

### Regular Updates

1. **Dependency Updates**: Use `npm audit` regularly
2. **Security Patches**: Monitor Next.js and Supabase for security updates
3. **Environment Rotation**: Rotate API keys and passwords periodically

### Code Review Checklist

- [ ] No hardcoded secrets or credentials
- [ ] All user inputs are validated and sanitized
- [ ] All admin operations require authentication
- [ ] Error messages don't expose sensitive information
- [ ] Rate limiting is applied to new endpoints
- [ ] Database queries use parameterized inputs

### Deployment Security

1. **HTTPS Only**: Ensure all traffic uses HTTPS
2. **Environment Isolation**: Separate staging and production environments
3. **Access Control**: Limit who can deploy to production
4. **Backup Security**: Encrypt database backups

## 🔍 Security Incident Response

### If Security Breach Detected

1. **Immediate Actions**:
   - Change all API keys and passwords
   - Review audit logs for unauthorized actions
   - Check for data integrity issues

2. **Investigation**:
   - Analyze server logs for attack vectors
   - Review database for unauthorized changes
   - Check for data exfiltration

3. **Recovery**:
   - Restore from clean backup if necessary
   - Apply additional security measures
   - Update incident response procedures

## 📞 Security Contact

For security issues, please:
1. Do NOT create public issues for security vulnerabilities
2. Contact the admin directly via secure channels
3. Include detailed information about the vulnerability

---

**Last Updated**: `date +%Y-%m-%d`
**Security Review Date**: `date +%Y-%m-%d`