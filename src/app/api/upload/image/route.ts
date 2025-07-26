import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';
import { requireAdmin, createAuthResponse } from '@/lib/auth-middleware';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  // Check authentication
  const { user, error } = await requireAdmin(request);
  if (error || !user) {
    return createAuthResponse(error || 'Admin access required', 401);
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Get upload type from form data (default to 'article')
    const uploadType = formData.get('type')?.toString() || 'article';
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const filename = `${uploadType}_${timestamp}.${fileExtension}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Use project-images bucket for both types for now (until article-images bucket is created)
    const bucket = 'project-images';

    // Upload to Supabase Storage
    const supabase = await createSupabaseAdmin();
    
    // Check if bucket exists first
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    // Check available buckets
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return NextResponse.json(
        { error: 'Storage configuration error', details: listError.message },
        { status: 500 }
      );
    }
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Supabase storage error:', error);
      console.warn('Falling back to local storage...');
      
      // Fallback to local storage
      try {
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });
        
        const filePath = join(uploadDir, filename);
        await writeFile(filePath, buffer);
        
        const localUrl = `/uploads/${filename}`;
        
        return NextResponse.json({
          url: localUrl,
          filename: filename,
          size: file.size,
          type: file.type,
          storage: 'local'
        });
      } catch (localError) {
        console.error('Local storage fallback failed:', localError);
        return NextResponse.json(
          { 
            error: 'Failed to upload image',
            details: `Supabase: ${error.message}, Local: ${localError}`,
            bucket: bucket
          },
          { status: 500 }
        );
      }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    return NextResponse.json({
      url: publicUrl,
      filename: filename,
      size: file.size,
      type: file.type,
      storage: 'supabase'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}