import { NextResponse } from 'next/server';

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export class SecurityError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number = 403, code: string = 'SECURITY_ERROR') {
    super(message);
    this.name = 'SecurityError';
    this.status = status;
    this.code = code;
  }
}

export class ValidationError extends Error {
  status: number;
  code: string;
  details?: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
    this.code = 'VALIDATION_ERROR';
    this.details = details;
  }
}

export class AuthenticationError extends Error {
  status: number;
  code: string;

  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
    this.status = 401;
    this.code = 'AUTH_ERROR';
  }
}

export class AuthorizationError extends Error {
  status: number;
  code: string;

  constructor(message: string = 'Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
    this.status = 403;
    this.code = 'AUTHZ_ERROR';
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  // Handle known error types
  if (error instanceof SecurityError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        // Never expose detailed security error information
        message: 'Security validation failed'
      },
      { status: error.status }
    );
  }

  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        // Only expose validation details in development
        ...(process.env.NODE_ENV === 'development' && { details: error.details })
      },
      { status: error.status }
    );
  }

  if (error instanceof AuthenticationError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code
      },
      { status: error.status }
    );
  }

  if (error instanceof AuthorizationError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code
      },
      { status: error.status }
    );
  }

  // Handle Supabase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as any;
    
    // Don't expose internal database errors in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          error: 'Internal server error',
          code: 'DATABASE_ERROR'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      {
        error: 'Database operation failed',
        code: supabaseError.code || 'DB_ERROR',
        details: supabaseError.message
      },
      { status: 500 }
    );
  }

  // Generic error handler
  const isProduction = process.env.NODE_ENV === 'production';
  
  return NextResponse.json(
    {
      error: isProduction ? 'Internal server error' : String(error),
      code: 'INTERNAL_ERROR',
      // Only include stack trace in development
      ...((!isProduction && error instanceof Error) && { stack: error.stack })
    },
    { status: 500 }
  );
}

export function sanitizeErrorForLogging(error: unknown): any {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
  }
  
  return {
    error: String(error),
    timestamp: new Date().toISOString()
  };
}

export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): void {
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missingFields.join(', ')}`,
      { missingFields }
    );
  }
}

export function validateStringLength(value: string, fieldName: string, minLength: number = 1, maxLength: number = 1000): void {
  if (value.length < minLength) {
    throw new ValidationError(`${fieldName} must be at least ${minLength} characters long`);
  }
  
  if (value.length > maxLength) {
    throw new ValidationError(`${fieldName} must be no more than ${maxLength} characters long`);
  }
}

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
}

export function validateSlug(slug: string): void {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(slug)) {
    throw new ValidationError('Slug must contain only lowercase letters, numbers, and hyphens');
  }
}